import csv
import io
from datetime import datetime, timedelta
from typing import List
from app.models import Job, UserApplication

def generate_job_ics(job: Job) -> str:
    """
    Generates standard RFC 5545 iCalendar (.ics) content for job application deadline.
    """
    if not job.last_date:
        event_date = datetime.utcnow() + timedelta(days=14)
    else:
        event_date = job.last_date

    dt_str = event_date.strftime("%Y%m%dT180000Z")
    dt_start = event_date.strftime("%Y%m%dT090000Z")
    created_str = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    
    summary = f"Deadline: {job.organization} - {job.title}"
    description = f"Last date to submit application for {job.title} at {job.organization}.\\n\\nDirect Apply Portal: {job.apply_url}\\nQualifications: {job.qualifications}"

    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GovJobPulse//BCA MCA Job Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:govjob-{job.id}-{job.external_id}@govjobpulse
DTSTAMP:{created_str}
DTSTART:{dt_start}
DTEND:{dt_str}
SUMMARY:{summary}
DESCRIPTION:{description}
URL:{job.apply_url}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P2D
ACTION:DISPLAY
DESCRIPTION:Reminder: Application closes in 48 hours for {job.organization}
END:VALARM
END:VEVENT
END:VCALENDAR"""
    return ics_content

def generate_applications_csv(applications: List[UserApplication]) -> str:
    """
    Generates CSV string of tracked applications.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "ID",
        "Organization",
        "Job Title",
        "Scope / Sector",
        "Status",
        "Application / Reg No",
        "Last Date to Apply",
        "Salary Scale",
        "Personal Notes",
        "Direct Apply URL",
        "Official PDF Link"
    ])

    for item in applications:
        job = item.job
        last_date_str = job.last_date.strftime("%Y-%m-%d") if job.last_date else "Check notice"
        writer.writerow([
            item.id,
            job.organization,
            job.title,
            job.scope,
            item.status,
            item.application_no or "",
            last_date_str,
            job.salary_scale,
            item.notes or "",
            job.apply_url,
            job.pdf_url or ""
        ])

    return output.getvalue()
