from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from app import models, schemas
from app.seed_data import get_seed_jobs

def init_db(db: Session):
    models.Base.metadata.create_all(bind=db.get_bind())
    
    # Check if settings exist
    settings = db.query(models.UserSettings).first()
    if not settings:
        default_settings = models.UserSettings(
            degree="BOTH",
            target_scope="ALL",
            skills="Python, SQL, Web Development, Java, Operating Systems, Networking, Cloud",
            experience_years=0.0,
            sync_interval_hours=12,
            last_sync_time=datetime.utcnow()
        )
        db.add(default_settings)
        db.commit()

    # Seed initial jobs if table is empty
    count = db.query(models.Job).count()
    if count == 0:
        seed_jobs = get_seed_jobs()
        for j_data in seed_jobs:
            job = models.Job(**j_data)
            db.add(job)
        db.commit()

        # Record seed sync log
        sync_log = models.SyncLog(
            source_name="System Seed Registry",
            jobs_found=len(seed_jobs),
            jobs_added=len(seed_jobs),
            status="SUCCESS",
            details="Successfully initialized verified database with National, State, and Global public sector openings for BCA/MCA graduates."
        )
        db.add(sync_log)
        db.commit()

def get_jobs(
    db: Session,
    query: Optional[str] = None,
    scope: Optional[str] = None,
    qualification: Optional[str] = None,
    freshers_only: bool = False,
    state: Optional[str] = None,
    urgent_only: bool = False,
    closing_today_only: bool = False,
    saved_only: bool = False,
    applied_only: bool = False,
    sort_by: str = "newest",  # newest, deadline, salary
    skip: int = 0,
    limit: int = 50
) -> List[models.Job]:
    # Start of today in local date (00:00:00)
    today_date = datetime.now().date()
    today_start = datetime(today_date.year, today_date.month, today_date.day, 0, 0, 0)
    
    # Strictly filter active jobs where deadline has NOT passed before today
    q = db.query(models.Job).filter(
        models.Job.is_active == True,
        or_(models.Job.last_date == None, models.Job.last_date >= today_start)
    )

    if closing_today_only:
        tomorrow_start = today_start + timedelta(days=1)
        q = q.filter(and_(models.Job.last_date != None, models.Job.last_date >= today_start, models.Job.last_date < tomorrow_start))

    if query:
        search_filter = or_(
            models.Job.title.ilike(f"%{query}%"),
            models.Job.organization.ilike(f"%{query}%"),
            models.Job.department.ilike(f"%{query}%"),
            models.Job.description.ilike(f"%{query}%"),
            models.Job.key_skills.ilike(f"%{query}%"),
            models.Job.location.ilike(f"%{query}%")
        )
        q = q.filter(search_filter)

    if scope and scope != "ALL":
        q = q.filter(models.Job.scope == scope)

    if qualification:
        if qualification.upper() == "BCA":
            q = q.filter(models.Job.is_bca_eligible == True)
        elif qualification.upper() == "MCA":
            q = q.filter(models.Job.is_mca_eligible == True)

    if freshers_only:
        q = q.filter(models.Job.min_experience_years <= 0.5)

    if state and state != "ALL":
        q = q.filter(models.Job.state.ilike(f"%{state}%"))

    now = datetime.utcnow()
    if urgent_only:
        urgent_date = now + timedelta(days=7)
        q = q.filter(and_(models.Job.last_date != None, models.Job.last_date <= urgent_date, models.Job.last_date >= now))

    if saved_only:
        q = q.join(models.UserApplication).filter(models.UserApplication.status == "SAVED")

    if applied_only:
        q = q.join(models.UserApplication).filter(models.UserApplication.status.in_(["APPLIED", "SHORTLISTED", "INTERVIEW"]))

    # Sorting
    if sort_by == "deadline":
        q = q.order_by(asc(models.Job.last_date))
    elif sort_by == "title":
        q = q.order_by(asc(models.Job.title))
    else:  # newest
        q = q.order_by(desc(models.Job.is_featured), desc(models.Job.posted_date))

    return q.offset(skip).limit(limit).all()

def get_job_by_id(db: Session, job_id: int) -> Optional[models.Job]:
    return db.query(models.Job).filter(models.Job.id == job_id).first()

def save_or_update_job(db: Session, job_data: schemas.JobCreate) -> bool:
    """Returns True if a new job was created, False if updated or skipped."""
    existing = db.query(models.Job).filter(models.Job.external_id == job_data.external_id).first()
    if existing:
        # Update existing
        for key, val in job_data.dict(exclude_unset=True).items():
            setattr(existing, key, val)
        existing.updated_at = datetime.utcnow()
        db.commit()
        return False
    else:
        new_job = models.Job(**job_data.dict())
        db.add(new_job)
        db.commit()
        return True

def upsert_user_application(
    db: Session,
    job_id: int,
    status: str,
    notes: Optional[str] = None,
    application_no: Optional[str] = None,
    roll_number: Optional[str] = None,
    recruitment_stage: Optional[str] = "APPLIED",
    exam_date: Optional[datetime] = None,
    exam_city: Optional[str] = None,
    answer_key_deadline: Optional[datetime] = None,
    admit_card_url: Optional[str] = None,
    applied_date: Optional[datetime] = None,
    reminder_date: Optional[datetime] = None
) -> models.UserApplication:
    app_record = db.query(models.UserApplication).filter(models.UserApplication.job_id == job_id).first()
    if not app_record:
        app_record = models.UserApplication(
            job_id=job_id,
            status=status,
            notes=notes,
            application_no=application_no,
            roll_number=roll_number,
            recruitment_stage=recruitment_stage or "APPLIED",
            exam_date=exam_date,
            exam_city=exam_city,
            answer_key_deadline=answer_key_deadline,
            admit_card_url=admit_card_url,
            applied_date=applied_date or (datetime.utcnow() if status == "APPLIED" else None),
            reminder_date=reminder_date
        )
        db.add(app_record)
    else:
        app_record.status = status
        if recruitment_stage is not None:
            app_record.recruitment_stage = recruitment_stage
        if notes is not None:
            app_record.notes = notes
        if application_no is not None:
            app_record.application_no = application_no
        if roll_number is not None:
            app_record.roll_number = roll_number
        if exam_date is not None:
            app_record.exam_date = exam_date
        if exam_city is not None:
            app_record.exam_city = exam_city
        if answer_key_deadline is not None:
            app_record.answer_key_deadline = answer_key_deadline
        if admit_card_url is not None:
            app_record.admit_card_url = admit_card_url
        if applied_date is not None:
            app_record.applied_date = applied_date
        elif status == "APPLIED" and not app_record.applied_date:
            app_record.applied_date = datetime.utcnow()
        if reminder_date is not None:
            app_record.reminder_date = reminder_date
        app_record.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(app_record)
    return app_record

def delete_user_application(db: Session, job_id: int) -> bool:
    app_record = db.query(models.UserApplication).filter(models.UserApplication.job_id == job_id).first()
    if app_record:
        db.delete(app_record)
        db.commit()
        return True
    return False

def purge_expired_jobs(db: Session) -> int:
    """Marks all jobs whose deadline was yesterday or earlier as inactive."""
    today_date = datetime.now().date()
    today_start = datetime(today_date.year, today_date.month, today_date.day, 0, 0, 0)
    count = db.query(models.Job).filter(
        models.Job.is_active == True,
        models.Job.last_date != None,
        models.Job.last_date < today_start
    ).update({"is_active": False})
    if count > 0:
        db.commit()
    return count

def get_stats_summary(db: Session) -> schemas.StatsSummary:
    now = datetime.now()
    today_date = now.date()
    today_start = datetime(today_date.year, today_date.month, today_date.day, 0, 0, 0)
    urgent_cutoff = today_start + timedelta(days=7)

    # Active filter: unexpired only
    active_filter = and_(
        models.Job.is_active == True,
        or_(models.Job.last_date == None, models.Job.last_date >= today_start)
    )

    total_active = db.query(models.Job).filter(active_filter).count()
    bca_count = db.query(models.Job).filter(and_(active_filter, models.Job.is_bca_eligible == True)).count()
    mca_count = db.query(models.Job).filter(and_(active_filter, models.Job.is_mca_eligible == True)).count()
    national = db.query(models.Job).filter(and_(active_filter, models.Job.scope.in_(["NATIONAL_CENTRAL", "PSU_AUTONOMOUS", "DEFENSE_RESEARCH", "BANKING_FINANCE"]))).count()
    state = db.query(models.Job).filter(and_(active_filter, models.Job.scope == "STATE_GOVT")).count()
    international = db.query(models.Job).filter(and_(active_filter, models.Job.scope == "INTERNATIONAL_GLOBAL")).count()
    fresher = db.query(models.Job).filter(and_(active_filter, models.Job.min_experience_years <= 0.5)).count()
    
    urgent = db.query(models.Job).filter(
        and_(active_filter, models.Job.last_date != None, models.Job.last_date <= urgent_cutoff, models.Job.last_date >= today_start)
    ).count()

    saved = db.query(models.UserApplication).filter(models.UserApplication.status == "SAVED").count()
    applied = db.query(models.UserApplication).filter(models.UserApplication.status.in_(["APPLIED", "SHORTLISTED", "INTERVIEW"])).count()

    last_sync_log = db.query(models.SyncLog).order_by(desc(models.SyncLog.created_at)).first()
    last_sync = last_sync_log.created_at if last_sync_log else None

    return schemas.StatsSummary(
        total_active_jobs=total_active,
        bca_eligible_count=bca_count,
        mca_eligible_count=mca_count,
        national_count=national,
        state_count=state,
        international_count=international,
        fresher_count=fresher,
        urgent_closing_soon=urgent,
        saved_count=saved,
        applied_count=applied,
        last_sync=last_sync
    )

def get_user_settings(db: Session) -> models.UserSettings:
    settings = db.query(models.UserSettings).first()
    if not settings:
        settings = models.UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_user_settings(db: Session, update_data: schemas.UserSettingsUpdate) -> models.UserSettings:
    settings = get_user_settings(db)
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings

def record_sync_log(
    db: Session,
    source_name: str,
    jobs_found: int,
    jobs_added: int,
    status: str,
    details: Optional[str] = None
) -> models.SyncLog:
    log_item = models.SyncLog(
        source_name=source_name,
        jobs_found=jobs_found,
        jobs_added=jobs_added,
        status=status,
        details=details
    )
    db.add(log_item)
    
    # Also update settings last sync time
    settings = db.query(models.UserSettings).first()
    if settings:
        settings.last_sync_time = datetime.utcnow()
        
    db.commit()
    db.refresh(log_item)
    return log_item

def get_sync_logs(db: Session, limit: int = 15) -> List[models.SyncLog]:
    return db.query(models.SyncLog).order_by(desc(models.SyncLog.created_at)).limit(limit).all()
