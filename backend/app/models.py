from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String(255), unique=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    organization = Column(String(255), nullable=False, index=True)
    department = Column(String(255), nullable=True)
    scope = Column(String(50), default="NATIONAL_CENTRAL", index=True)  # NATIONAL_CENTRAL, STATE_GOVT, INTERNATIONAL_GLOBAL, PSU_AUTONOMOUS, DEFENSE_RESEARCH, BANKING_FINANCE
    location = Column(String(255), default="Pan-India")
    state = Column(String(100), default="All India")
    
    qualifications = Column(String(255), default="BCA, MCA")
    is_bca_eligible = Column(Boolean, default=True, index=True)
    is_mca_eligible = Column(Boolean, default=True, index=True)
    
    # Eligibility Deep Criteria (Prevents DV Disqualification)
    requires_maths_10_plus_2 = Column(Boolean, default=False)
    min_aggregate_percentage = Column(Float, default=50.0)
    final_year_eligible = Column(Boolean, default=True)
    dv_risk_notes = Column(String(500), nullable=True)

    experience_required = Column(String(100), default="Freshers Eligible (0-1 yrs)")
    min_experience_years = Column(Float, default=0.0)
    
    salary_scale = Column(String(150), default="As per Govt norms")
    total_vacancies = Column(String(50), default="Multiple")
    
    apply_url = Column(String(1000), nullable=False)
    pdf_url = Column(String(1000), nullable=True)
    description = Column(Text, nullable=True)
    key_skills = Column(String(500), default="Computer Applications, Software, IT")
    selection_mode = Column(String(150), default="Written Exam + Interview")
    
    posted_date = Column(DateTime, default=datetime.utcnow)
    last_date = Column(DateTime, nullable=True, index=True)
    source = Column(String(100), default="Official Portal")
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_application = relationship("UserApplication", back_populates="job", uselist=False, cascade="all, delete-orphan")


class UserApplication(Base):
    __tablename__ = "user_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), unique=True, nullable=False)
    status = Column(String(50), default="SAVED")  # SAVED, APPLIED, SHORTLISTED, INTERVIEW, REJECTED, OFFERED
    
    # Full Recruitment Lifecycle Progression
    recruitment_stage = Column(String(50), default="APPLIED") # APPLIED, ADMIT_CARD_OUT, EXAM_SCHEDULED, ANSWER_KEY, DV_ROUND, SELECTED
    applied_date = Column(DateTime, nullable=True)
    application_no = Column(String(100), nullable=True)
    roll_number = Column(String(100), nullable=True)
    exam_date = Column(DateTime, nullable=True)
    exam_city = Column(String(100), nullable=True)
    answer_key_deadline = Column(DateTime, nullable=True)
    admit_card_url = Column(String(500), nullable=True)
    
    notes = Column(Text, nullable=True)
    reminder_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="user_application")


class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(150), nullable=False)
    jobs_found = Column(Integer, default=0)
    jobs_added = Column(Integer, default=0)
    status = Column(String(50), default="SUCCESS")
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(50), default="BOTH")
    target_scope = Column(String(50), default="ALL")
    skills = Column(Text, default="Python, SQL, Web Development, DBMS, Networking, Cloud")
    experience_years = Column(Float, default=0.0)
    
    telegram_bot_token = Column(String(255), nullable=True)
    telegram_chat_id = Column(String(100), nullable=True)
    telegram_alerts_enabled = Column(Boolean, default=False)
    
    # Daily Morning Digest Push (8 AM)
    daily_digest_enabled = Column(Boolean, default=True)
    daily_digest_time = Column(String(10), default="08:00")
    
    email_alerts_enabled = Column(Boolean, default=False)
    alert_email = Column(String(255), nullable=True)
    
    sync_interval_hours = Column(Integer, default=12)
    last_sync_time = Column(DateTime, nullable=True)
