from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.scrapers.rss_fetcher import RSSGovJobScraper
from app.scrapers.ncs_gov_fetcher import NCSAndStateGovScraper
from app import crud, models
from app.notifications import notify_new_jobs

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def run_sync_pipeline():
    """
    Executes the multi-source scraper pipeline, parses BCA/MCA government postings,
    purges expired postings, updates database, and triggers alerts.
    """
    db: Session = SessionLocal()
    try:
        logger.info("Starting automated government job sync cycle...")
        
        # 1. Purge expired jobs (yesterday or older)
        purged = crud.purge_expired_jobs(db)
        if purged > 0:
            logger.info(f"Purged {purged} expired job postings whose deadline has passed.")

        # 2. Ingest live verified sources
        scrapers = [
            RSSGovJobScraper(),
            NCSAndStateGovScraper()
        ]

        total_found = 0
        total_added = 0
        newly_added_jobs = []

        for scraper in scrapers:
            try:
                scraped_jobs = scraper.scrape()
                total_found += len(scraped_jobs)
                
                scraper_added = 0
                for job_data in scraped_jobs:
                    is_new = crud.save_or_update_job(db, job_data)
                    if is_new:
                        scraper_added += 1
                        total_added += 1
                        # retrieve job model
                        created_job = db.query(models.Job).filter(models.Job.external_id == job_data.external_id).first()
                        if created_job:
                            newly_added_jobs.append(created_job)

                crud.record_sync_log(
                    db=db,
                    source_name=scraper.name,
                    jobs_found=len(scraped_jobs),
                    jobs_added=scraper_added,
                    status="SUCCESS",
                    details=f"Scraped {len(scraped_jobs)} raw postings, added {scraper_added} new BCA/MCA eligible postings."
                )
            except Exception as e:
                logger.error(f"Error executing scraper {scraper.name}: {e}")
                crud.record_sync_log(
                    db=db,
                    source_name=scraper.name,
                    jobs_found=0,
                    jobs_added=0,
                    status="ERROR",
                    details=f"Scraper error: {str(e)}"
                )

        # Notify if alerts enabled
        user_settings = crud.get_user_settings(db)
        if newly_added_jobs:
            notify_new_jobs(newly_added_jobs, user_settings)

        logger.info(f"Sync cycle complete: Found {total_found}, Added {total_added} new postings.")
        return {
            "status": "success",
            "jobs_found": total_found,
            "jobs_added": total_added,
            "timestamp": datetime.utcnow().isoformat()
        }
    finally:
        db.close()

def start_scheduler(interval_hours: int = 12):
    if not scheduler.running:
        scheduler.add_job(
            func=run_sync_pipeline,
            trigger=IntervalTrigger(hours=interval_hours),
            id="govjob_sync_job",
            name="Periodic Government BCA/MCA Job Sync",
            replace_existing=True
        )
        scheduler.start()
        logger.info(f"Background job sync scheduler started with interval: every {interval_hours} hours.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Background job sync scheduler stopped.")
