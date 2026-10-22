from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime

class JobBase(BaseModel):
    title: str
    organization: str
    department: Optional[str] = None
    scope: str = "NATIONAL_CENTRAL"
    location: str = "Pan-India"
    state: Optional[str] = "All India"
    qualifications: str = "BCA, MCA"
    is_bca_eligible: bool = True
    is_mca_eligible: bool = True
    
    # Eligibility Deep Criteria
    requires_maths_10_plus_2: bool = False
    min_aggregate_percentage: float = 50.0
    final_year_eligible: bool = True
    dv_risk_notes: Optional[str] = None

    experience_required: str = "Freshers Eligible (0-1 yrs)"
    min_experience_years: float = 0.0
    salary_scale: str = "As per Govt norms"
    total_vacancies: str = "Multiple"
    apply_url: str
    pdf_url: Optional[str] = None
    description: Optional[str] = None
    key_skills: Optional[str] = "Computer Applications, Software, IT"
    selection_mode: Optional[str] = "Written Exam + Interview"
    posted_date: Optional[datetime] = None
    last_date: Optional[datetime] = None
    source: str = "Official Portal"
    is_active: bool = True
    is_featured: bool = False

class JobCreate(JobBase):
    external_id: str

class UserApplicationOut(BaseModel):
    id: int
    job_id: int
    status: str
    recruitment_stage: Optional[str] = "APPLIED"
    applied_date: Optional[datetime] = None
    application_no: Optional[str] = None
    roll_number: Optional[str] = None
    exam_date: Optional[datetime] = None
    exam_city: Optional[str] = None
    answer_key_deadline: Optional[datetime] = None
    admit_card_url: Optional[str] = None
    notes: Optional[str] = None
    reminder_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobOut(JobBase):
    id: int
    external_id: str
    created_at: datetime
    updated_at: datetime
    user_application: Optional[UserApplicationOut] = None

    class Config:
        from_attributes = True

class UserApplicationCreate(BaseModel):
    job_id: int
    status: str = "SAVED"
    recruitment_stage: Optional[str] = "APPLIED"
    applied_date: Optional[datetime] = None
    application_no: Optional[str] = None
    roll_number: Optional[str] = None
    exam_date: Optional[datetime] = None
    exam_city: Optional[str] = None
    answer_key_deadline: Optional[datetime] = None
    admit_card_url: Optional[str] = None
    notes: Optional[str] = None
    reminder_date: Optional[datetime] = None

class UserApplicationUpdate(BaseModel):
    status: Optional[str] = None
    recruitment_stage: Optional[str] = None
    applied_date: Optional[datetime] = None
    application_no: Optional[str] = None
    roll_number: Optional[str] = None
    exam_date: Optional[datetime] = None
    exam_city: Optional[str] = None
    answer_key_deadline: Optional[datetime] = None
    admit_card_url: Optional[str] = None
    notes: Optional[str] = None
    reminder_date: Optional[datetime] = None

class SyncLogOut(BaseModel):
    id: int
    source_name: str
    jobs_found: int
    jobs_added: int
    status: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserSettingsBase(BaseModel):
    degree: str = "BOTH"
    target_scope: str = "ALL"
    skills: str = "Python, SQL, Web Development, DBMS, Networking, Cloud"
    experience_years: float = 0.0
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    telegram_alerts_enabled: bool = False
    daily_digest_enabled: bool = True
    daily_digest_time: str = "08:00"
    email_alerts_enabled: bool = False
    alert_email: Optional[str] = None
    sync_interval_hours: int = 12

class UserSettingsOut(UserSettingsBase):
    id: int
    last_sync_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserSettingsUpdate(BaseModel):
    degree: Optional[str] = None
    target_scope: Optional[str] = None
    skills: Optional[str] = None
    experience_years: Optional[float] = None
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    telegram_alerts_enabled: Optional[bool] = None
    daily_digest_enabled: Optional[bool] = None
    daily_digest_time: Optional[str] = None
    email_alerts_enabled: Optional[bool] = None
    alert_email: Optional[str] = None
    sync_interval_hours: Optional[int] = None

class AIEligibilityRequest(BaseModel):
    job_id: int
    user_degree: str  # BCA, MCA, B.Sc CS, B.Tech
    user_skills: List[str]
    user_experience_years: float = 0.0
    user_percentage: Optional[float] = 60.0
    had_maths_10_plus_2: Optional[bool] = True
    is_final_year: Optional[bool] = False
    additional_notes: Optional[str] = None

class AIEligibilityResponse(BaseModel):
    job_id: int
    job_title: str
    organization: str
    overall_match_score: int
    is_eligible: bool
    degree_verdict: str
    experience_verdict: str
    maths_requirement_verdict: str
    percentage_cutoff_verdict: str
    matched_skills: List[str]
    missing_skills: List[str]
    dv_risk_warnings: List[str]
    recommendations: List[str]
    key_advantages: List[str]

class StatsSummary(BaseModel):
    total_active_jobs: int
    bca_eligible_count: int
    mca_eligible_count: int
    national_count: int
    state_count: int
    international_count: int
    fresher_count: int
    urgent_closing_soon: int
    saved_count: int
    applied_count: int
    last_sync: Optional[datetime] = None
