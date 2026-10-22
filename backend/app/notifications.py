import httpx
import logging
from typing import List, Optional
from datetime import datetime, timedelta
from app.models import Job, UserSettings, UserApplication
from app.config import settings as app_settings

logger = logging.getLogger(__name__)

def send_telegram_message(bot_token: str, chat_id: str, text: str) -> bool:
    if not bot_token or not chat_id:
        return False
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.post(url, json=payload)
            if res.status_code == 200:
                return True
            logger.warning(f"Telegram alert failed with status {res.status_code}: {res.text}")
            return False
    except Exception as e:
        logger.error(f"Telegram notification error: {e}")
        return False

def generate_morning_digest_text(
    jobs_closing_today: List[Job],
    urgent_jobs: List[Job],
    featured_jobs: List[Job],
    tracked_apps: List[UserApplication]
) -> str:
    now_str = datetime.now().strftime("%d %B %Y")
    
    msg = f"🌅 <b>GovJobPulse • Daily Morning Recruitment Digest</b>\n"
    msg += f"📅 <i>{now_str} (BCA & MCA Opportunities)</i>\n\n"

    # 1. Closing Today Section
    if jobs_closing_today:
        msg += "🚨 <b>CLOSING TODAY (Window Ends Tonight 23:59!):</b>\n"
        for j in jobs_closing_today[:3]:
            msg += f"• <b>{j.organization}</b> - {j.title}\n"
            msg += f"  💰 {j.salary_scale} | 🎓 {j.qualifications[:30]}\n"
            msg += f"  👉 <a href='{j.apply_url}'>Click Here to Directly Apply</a>\n\n"
    else:
        msg += "✅ <b>No major deadlines closing today.</b>\n\n"

    # 2. Urgent (≤ 3 Days)
    if urgent_jobs:
        msg += "⏳ <b>Closing Within 3 Days:</b>\n"
        for j in urgent_jobs[:3]:
            days_left = (j.last_date - datetime.now()).days if j.last_date else 3
            msg += f"• <b>{j.organization}</b> - {j.title} ({days_left}d left)\n"
            msg += f"  👉 <a href='{j.apply_url}'>Apply Link</a>\n"
        msg += "\n"

    # 3. Top Active Opportunities
    msg += "💼 <b>Featured BCA & MCA Postings:</b>\n"
    for j in featured_jobs[:4]:
        msg += f"• <b>{j.organization}</b>: {j.title}\n"
        msg += f"  🎓 {j.qualifications[:35]} | 💰 {j.salary_scale}\n"
        msg += f"  👉 <a href='{j.apply_url}'>Official Direct Apply</a>\n"
    msg += "\n"

    # 4. Tracked Applications Reminders
    if tracked_apps:
        msg += "📋 <b>Your Tracked Applications:</b>\n"
        for a in tracked_apps[:3]:
            msg += f"• <b>{a.job.organization}</b> [{a.recruitment_stage or a.status}]\n"
            if a.roll_number:
                msg += f"  Roll No: {a.roll_number} | "
            if a.exam_date:
                msg += f"  Exam Date: {a.exam_date.strftime('%d-%b-%Y')} | "
            msg += f"\n"
        msg += "\n"

    msg += "🔒 <i>100% verified direct official links. Zero coaching spam.</i>"
    return msg

def format_telegram_job_alert(job: Job) -> str:
    urgency = f"🚨 <b>Deadline:</b> {job.last_date.strftime('%d-%b-%Y')}" if job.last_date else "⏳ <b>Deadline:</b> Check notice"
    
    return f"""📢 <b>New Government Job Opening (BCA/MCA)</b>

🏢 <b>Organization:</b> {job.organization}
💼 <b>Role:</b> {job.title}
🎓 <b>Eligibility:</b> {job.qualifications}
💰 <b>Pay Scale:</b> {job.salary_scale}
📍 <b>Location:</b> {job.location}
{urgency}

🔗 <a href="{job.apply_url}">👉 Click Here to Directly Apply</a>
📄 <a href="{job.pdf_url or job.apply_url}">Official Notification</a>
"""

def notify_new_jobs(jobs: List[Job], user_settings: UserSettings):
    if not jobs:
        return

    if user_settings.telegram_alerts_enabled and user_settings.telegram_bot_token and user_settings.telegram_chat_id:
        for job in jobs[:5]:
            msg = format_telegram_job_alert(job)
            send_telegram_message(user_settings.telegram_bot_token, user_settings.telegram_chat_id, msg)
