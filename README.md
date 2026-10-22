# 🚀 GovJobPulse — BCA & MCA Government Job Tracker (Expanded Edition)

An automated, intelligent recruitment aggregator and personal application management portal engineered specifically for **BCA (Bachelor of Computer Applications)** and **MCA (Master of Computer Applications)** graduates.

Discover, analyze, track, and **directly apply** to verified government and public sector IT openings across **National (Central Govt, PSUs, Defense, Space, Banking)**, **State Governments**, and **Global / International Public Sector Agencies (UN, World Bank, WHO, UNDP)**.

---

## 🌟 Expanded Production Features

1. **📄 Drag-and-Drop Resume Parser & AI Matcher**:
   - Students can drop their actual **Resume (.PDF or .TXT)** directly into the AI Matcher.
   - Built-in `pypdf` parser automatically extracts your **Degree (BCA/MCA)**, **Experience Years**, and **Technical Skills** (Python, SQL, Linux, Java, Cloud, etc.) and calculates an instant compatibility score against any government notification.

2. **📅 1-Click Calendar Sync (.ICS)**:
   - Click **"Add to Calendar"** on any job modal to download an RFC-5545 `.ics` event for Google Calendar, Outlook, or Apple Calendar.
   - Automatically sets a reminder alarm **48 hours before the application deadline** so you never miss a cutoff.

3. **📊 Application CRM & CSV / Excel Export**:
   - Manage your application workflow: `Saved`, `Applied`, `Shortlisted for Exam`, `Interview Scheduled`.
   - Store registration numbers and personal notes.
   - Click **"Export CSV"** to export your complete application history into an Excel/Google Sheets compatible spreadsheet.

4. **📑 Notification PDF Deep Analyzer**:
   - Automatically extracts critical parameters from complex government notices:
     - Application Fee breakdown (e.g. General, SC/ST, Women)
     - Age limits & category relaxations
     - Selection stages (Tier-1 CBT, Skill Test, Interview, Document Verification)
     - Reservation and quota benefits

5. **📡 Multi-Source Scraper Engine (Twice Daily / 12h Sync)**:
   - Automated **APScheduler** running every 12 hours across:
     - NIC, NIELIT, C-DAC, ISRO, DRDO
     - IBPS Specialist Officer (IT Scale I) & Public Sector Banks
     - National Career Service (NCS) & State IT Corporations (MahaIT, Keltron, ELCOT, DSSSB, KPSC)
     - Global Public Sector & United Nations agencies (UN, UNDP, WHO, World Bank)
   - Real-time audit log with **"Force Sync Now"** manual override button.

6. **📲 Instant Telegram Job Alerts**:
   - Connect your personal Telegram Bot in Settings to receive real-time alerts whenever a new BCA/MCA job is posted.

7. **☁️ 24/7 Autonomous Deployment Ready**:
   - **Docker & Docker Compose**: Run locally in an isolated container.
   - **Render.com Cloud Blueprint**: Ready for 1-click cloud hosting so it runs 24/7 even when your laptop is turned off.
   - **Windows Background Task**: Automated PowerShell script (`setup_windows_service.ps1`) to run silently on startup.

---

## ⚡ Quick Start

### 1. Launch with One Click (Windows)
Double-click `start.bat` or run:
```powershell
.\start.ps1
```
- **Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Silent Windows Background Service (Optional)
To have the job aggregator run silently in the background on your PC without keeping terminal windows open:
```powershell
powershell -ExecutionPolicy Bypass -File .\setup_windows_service.ps1
```

---

### 3. Docker Deployment (24/7 Autonomous)
```bash
docker-compose up -d
```
Accessible at `http://localhost:8000`.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/jobs` | `GET` | Filterable list of government IT jobs (sector, degree, fresher, urgent) |
| `/api/jobs/{id}` | `GET` | Full details of a specific posting |
| `/api/jobs/{id}/apply-status` | `POST / DELETE` | Update personal application status (`APPLIED`, `SAVED`, etc.) |
| `/api/jobs/{id}/calendar.ics` | `GET` | Download deadline reminder for Google Calendar / Outlook |
| `/api/jobs/{id}/analyze-pdf` | `POST` | Extract fee, age limit, and exam stages from notification notice |
| `/api/applications` | `GET` | List all tracked personal applications |
| `/api/applications/export.csv` | `GET` | Export all tracked applications to CSV / Excel |
| `/api/ai/parse-resume` | `POST` | Upload Resume (.PDF/.TXT) to extract degree, skills, and experience |
| `/api/ai/evaluate-eligibility` | `POST` | Calculate qualification fit score & exam preparation roadmap |
| `/api/sync` | `POST` | Trigger immediate background multi-source ingestion sync |
| `/api/sync/logs` | `GET` | View scraper execution history and counts |
| `/api/settings` | `GET / PUT` | Configure degree preferences, Telegram bot token, and update frequency |
| `/api/settings/test-telegram` | `POST` | Test Telegram bot connectivity |
