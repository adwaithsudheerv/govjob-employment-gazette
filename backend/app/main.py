from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import engine, get_db
from app import models, schemas, crud
from app.config import settings
from app.scheduler import start_scheduler, run_sync_pipeline
from app.ai_matcher import evaluate_job_match
from app.notifications import send_telegram_message
from app.pdf_analyzer import extract_text_from_pdf_bytes, parse_resume, analyze_notification_text
from app.export_utils import generate_job_ics, generate_applications_csv
from app.image_resizer import resize_to_gov_spec, GOV_PRESETS
from app.notifications import generate_morning_digest_text, send_telegram_message

# Initialize database tables and seed
db_init_session = next(get_db())
try:
    crud.init_db(db_init_session)
finally:
    db_init_session.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Automated Government Job Aggregator & Direct Application Portal for BCA and MCA Students",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    start_scheduler(interval_hours=settings.SYNC_INTERVAL_HOURS)

@app.get("/api/health")
def health_check():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

# ----------------- JOBS ENDPOINTS -----------------

@app.get("/api/jobs", response_model=List[schemas.JobOut])
def list_jobs(
    q: Optional[str] = Query(None, description="Search keyword for role, org, skills"),
    scope: Optional[str] = Query("ALL", description="Job scope filter"),
    qualification: Optional[str] = Query(None, description="BCA or MCA"),
    freshers_only: bool = Query(False, description="Filter for 0-year experience"),
    state: Optional[str] = Query(None, description="State filter"),
    urgent_only: bool = Query(False, description="Deadline closing within 7 days"),
    closing_today_only: bool = Query(False, description="Deadline closing today"),
    saved_only: bool = Query(False, description="Only saved jobs"),
    applied_only: bool = Query(False, description="Only applied jobs"),
    sort_by: str = Query("newest", description="Sort by newest, deadline, or title"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    jobs = crud.get_jobs(
        db=db,
        query=q,
        scope=scope,
        qualification=qualification,
        freshers_only=freshers_only,
        state=state,
        urgent_only=urgent_only,
        closing_today_only=closing_today_only,
        saved_only=saved_only,
        applied_only=applied_only,
        sort_by=sort_by,
        skip=skip,
        limit=limit
    )
    return jobs

@app.get("/api/jobs/{job_id}", response_model=schemas.JobOut)
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return job

# ----------------- GOVDOC STUDIO: PHOTO & SIGNATURE RESIZER -----------------

@app.get("/api/tools/presets")
def get_gov_image_presets():
    return GOV_PRESETS

@app.post("/api/tools/resize-gov-image")
async def resize_gov_image(
    file: UploadFile = File(...),
    preset: str = Query("ssc_nic_photo", description="Target government specification preset")
):
    contents = await file.read()
    try:
        output_bytes, metadata = resize_to_gov_spec(contents, preset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing error: {str(e)}")

    filename = f"gov_compliant_{preset}.jpg"
    return Response(
        content=output_bytes,
        media_type="image/jpeg",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "X-GovDoc-Size-KB": str(metadata["file_size_kb"]),
            "X-GovDoc-Dimensions": metadata["dimensions"],
            "X-GovDoc-Compliant": str(metadata["is_compliant"]),
            "X-GovDoc-Preset": metadata["preset"],
            "Access-Control-Expose-Headers": "X-GovDoc-Size-KB, X-GovDoc-Dimensions, X-GovDoc-Compliant, X-GovDoc-Preset"
        }
    )

# ----------------- PUSH-FIRST DAILY MORNING DIGEST -----------------

@app.get("/api/notifications/preview-digest")
def preview_morning_digest(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    today_date = datetime.now().date()
    today_start = datetime(today_date.year, today_date.month, today_date.day, 0, 0, 0)
    tomorrow_start = today_start + timedelta(days=1)
    urgent_cutoff = today_start + timedelta(days=3)

    closing_today = db.query(models.Job).filter(
        models.Job.is_active == True,
        models.Job.last_date != None,
        models.Job.last_date >= today_start,
        models.Job.last_date < tomorrow_start
    ).all()

    urgent_jobs = db.query(models.Job).filter(
        models.Job.is_active == True,
        models.Job.last_date != None,
        models.Job.last_date >= tomorrow_start,
        models.Job.last_date <= urgent_cutoff
    ).all()

    featured_jobs = db.query(models.Job).filter(
        models.Job.is_active == True,
        models.Job.last_date >= today_start
    ).order_by(models.Job.is_featured.desc(), models.Job.posted_date.desc()).limit(4).all()

    tracked_apps = db.query(models.UserApplication).join(models.Job).all()

    digest_text = generate_morning_digest_text(closing_today, urgent_jobs, featured_jobs, tracked_apps)
    return {
        "digest_text": digest_text,
        "closing_today_count": len(closing_today),
        "urgent_count": len(urgent_jobs),
        "featured_count": len(featured_jobs)
    }

@app.post("/api/notifications/send-digest")
def send_morning_digest(db: Session = Depends(get_db)):
    user_settings = crud.get_user_settings(db)
    if not user_settings.telegram_bot_token or not user_settings.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Telegram Bot Token and Chat ID must be configured in Settings first.")

    preview = preview_morning_digest(db)
    digest_text = preview["digest_text"]

    success = send_telegram_message(user_settings.telegram_bot_token, user_settings.telegram_chat_id, digest_text)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to deliver Telegram digest. Check Bot Token & Chat ID.")
    return {"status": "success", "message": "Daily Morning Digest dispatched to your Telegram successfully!"}

# ----------------- APPLICATION TRACKER -----------------

@app.post("/api/jobs/{job_id}/apply-status", response_model=schemas.UserApplicationOut)
def update_job_application_status(
    job_id: int,
    payload: schemas.UserApplicationCreate,
    db: Session = Depends(get_db)
):
    job = crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    app_record = crud.upsert_user_application(
        db=db,
        job_id=job_id,
        status=payload.status,
        notes=payload.notes,
        application_no=payload.application_no,
        applied_date=payload.applied_date,
        reminder_date=payload.reminder_date
    )
    return app_record

@app.delete("/api/jobs/{job_id}/apply-status")
def remove_job_application_status(job_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_user_application(db, job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="No active application found for this job")
    return {"status": "success", "message": "Application status removed"}

@app.get("/api/applications")
def list_tracked_applications(db: Session = Depends(get_db)):
    tracked = db.query(models.UserApplication).join(models.Job).all()
    results = []
    for item in tracked:
        results.append({
            "application_id": item.id,
            "status": item.status,
            "notes": item.notes,
            "application_no": item.application_no,
            "applied_date": item.applied_date,
            "reminder_date": item.reminder_date,
            "job": schemas.JobOut.from_orm(item.job)
        })
    return results

# ----------------- STATS & DASHBOARD -----------------

@app.get("/api/stats", response_model=schemas.StatsSummary)
def get_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_stats_summary(db)

# ----------------- LIVE SYNC & SCHEDULER -----------------

@app.post("/api/sync")
def trigger_manual_sync(background_tasks: BackgroundTasks):
    """Triggers on-demand background sync from government feeds and scrapers."""
    background_tasks.add_task(run_sync_pipeline)
    return {
        "status": "initiated",
        "message": "Live government job sync pipeline started in background. Refresh in a few seconds."
    }

@app.get("/api/sync/logs", response_model=List[schemas.SyncLogOut])
def get_recent_sync_logs(db: Session = Depends(get_db)):
    return crud.get_sync_logs(db)

# ----------------- AI RESUME / ELIGIBILITY MATCHER -----------------

@app.post("/api/ai/parse-resume")
async def parse_resume_upload(file: UploadFile = File(...)):
    """
    Upload a BCA/MCA resume (PDF or TXT) and automatically extract degree, skills, and experience.
    """
    contents = await file.read()
    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf_bytes(contents)
    else:
        text = contents.decode("utf-8", errors="ignore")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the uploaded resume.")

    parsed = parse_resume(text)
    return parsed

@app.post("/api/ai/evaluate-eligibility", response_model=schemas.AIEligibilityResponse)
def evaluate_eligibility(payload: schemas.AIEligibilityRequest, db: Session = Depends(get_db)):
    job = crud.get_job_by_id(db, payload.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    result = evaluate_job_match(job, payload)
    return result

# ----------------- NOTIFICATION PDF ANALYZER -----------------

@app.post("/api/jobs/{job_id}/analyze-pdf")
def analyze_job_pdf(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Analyze description / notice text
    analysis = analyze_notification_text(f"{job.title}\n{job.description}\n{job.selection_mode}")
    return {
        "job_id": job.id,
        "title": job.title,
        "organization": job.organization,
        **analysis
    }

# ----------------- CALENDAR & EXPORT UTILITIES -----------------

@app.get("/api/jobs/{job_id}/calendar.ics")
def download_job_calendar_ics(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    ics_text = generate_job_ics(job)
    filename = f"deadline_{job.organization[:15].replace(' ', '_')}_{job.id}.ics"
    return Response(
        content=ics_text,
        media_type="text/calendar",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/applications/export.csv")
def export_applications_csv(db: Session = Depends(get_db)):
    apps = db.query(models.UserApplication).join(models.Job).all()
    csv_text = generate_applications_csv(apps)
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=my_gov_job_applications.csv"}
    )

# ----------------- USER SETTINGS & ALERTS -----------------

@app.get("/api/settings", response_model=schemas.UserSettingsOut)
def get_settings(db: Session = Depends(get_db)):
    return crud.get_user_settings(db)

@app.put("/api/settings", response_model=schemas.UserSettingsOut)
def update_settings(payload: schemas.UserSettingsUpdate, db: Session = Depends(get_db)):
    return crud.update_user_settings(db, payload)

@app.post("/api/settings/auto-detect-chat-id")
def auto_detect_telegram_chat_id(db: Session = Depends(get_db)):
    """
    Checks Telegram getUpdates to automatically capture the user's Chat ID
    after they press 'Start' on the bot.
    """
    user_settings = crud.get_user_settings(db)
    if not user_settings.telegram_bot_token:
        raise HTTPException(status_code=400, detail="Bot token is not configured.")

    import httpx
    url = f"https://api.telegram.org/bot{user_settings.telegram_bot_token}/getUpdates"
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(url)
            if res.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to contact Telegram API.")
            data = res.json()
            updates = data.get("result", [])
            if not updates:
                raise HTTPException(
                    status_code=404, 
                    detail="No message received yet! Please open Telegram, search for your bot, and press 'Start' (or send /start)."
                )

            # Get latest update
            latest_chat = None
            first_name = ""
            for update in reversed(updates):
                if "message" in update and "chat" in update["message"]:
                    latest_chat = update["message"]["chat"]["id"]
                    first_name = update["message"]["chat"].get("first_name", "Candidate")
                    break

            if not latest_chat:
                raise HTTPException(status_code=404, detail="Could not find chat ID in recent messages. Send /start to the bot.")

            user_settings.telegram_chat_id = str(latest_chat)
            user_settings.telegram_alerts_enabled = True
            db.commit()

            # Send welcome message
            welcome_msg = f"🎉 <b>Welcome {first_name}! GovJobPulse is now connected.</b>\n\nYou will receive:\n• 🚨 Midnight cutoff alerts for jobs closing today\n• 💼 Verified BCA & MCA central/state government recruitments\n• 🌅 Daily 8:00 AM morning digest"
            send_telegram_message(user_settings.telegram_bot_token, str(latest_chat), welcome_msg)

            return {
                "status": "success",
                "chat_id": str(latest_chat),
                "user_name": first_name,
                "message": f"Successfully connected to {first_name}'s Telegram! A welcome message has been delivered to your chat."
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting chat ID: {str(e)}")

@app.post("/api/settings/test-telegram")
def test_telegram(db: Session = Depends(get_db)):
    user_settings = crud.get_user_settings(db)
    if not user_settings.telegram_bot_token or not user_settings.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Telegram Bot Token and Chat ID must be configured first.")
    
    msg = "🚀 <b>GovJobPulse Connection Successful!</b>\nYou will receive real-time alerts whenever new National, State, or International BCA/MCA government jobs are posted."
    success = send_telegram_message(user_settings.telegram_bot_token, user_settings.telegram_chat_id, msg)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to deliver Telegram test alert. Please verify your Bot Token and Chat ID.")
    return {"status": "success", "message": "Test message sent to Telegram successfully!"}

# ----------------- STATIC FRONTEND MOUNT (PRODUCTION DEPLOYMENT) -----------------
import os
from fastapi.staticfiles import StaticFiles

dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static_frontend")
