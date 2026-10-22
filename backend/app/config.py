from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "GovJobPulse - BCA & MCA Government Job Tracker"
    DATABASE_URL: str = "sqlite:///./govjobs.db"
    SYNC_INTERVAL_HOURS: int = 12
    API_PREFIX: str = "/api"
    
    # Telegram Notifications (optional)
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHAT_ID: Optional[str] = None
    
    # Email settings (optional)
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    ALERT_EMAIL_RECIPIENT: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
