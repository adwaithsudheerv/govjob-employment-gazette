import hashlib
from datetime import datetime, timedelta
from typing import List
import feedparser
from app.schemas import JobCreate
from app.scrapers.base import BaseScraper
from app.scrapers.eligibility_engine import analyze_eligibility, extract_experience

BLACKLIST_DOMAINS = [
    "adda247", "shiksha", "pw.live", "timesofindia", "ndtv", "indiatoday", 
    "indianexpress", "collegedunia", "collegementor", "jagranjosh", "career360", "edexlive", "freejobalert"
]

class NCSAndStateGovScraper(BaseScraper):
    def __init__(self):
        super().__init__("NCSAndStateGovScraper")

    def scrape(self) -> List[JobCreate]:
        jobs = []
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        feeds = [
            {
                "url": "https://news.google.com/rss/search?q=(National+Career+Service+OR+NCS)+IT+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
                "scope": "NATIONAL_CENTRAL",
                "org": "National Career Service (NCS / MoLE)",
                "source": "NCS Official Feed"
            },
            {
                "url": "https://news.google.com/rss/search?q=(State+IT+Corporation+OR+e-Governance)+programmer+developer+recruitment+2026&hl=en-IN&gl=IN&ceid=IN:en",
                "scope": "STATE_GOVT",
                "org": "State IT Mission / Corp",
                "source": "State IT Cadre"
            }
        ]

        for feed_info in feeds:
            try:
                feed = feedparser.parse(feed_info["url"])
                for entry in feed.entries[:6]:
                    title = entry.get("title", "").strip()
                    summary = entry.get("summary", "")
                    link = entry.get("link", "")

                    if not title or len(title) < 12:
                        continue

                    # Filter out news media / blogs
                    if " - " in title:
                        parts = title.rsplit(" - ", 1)
                        if any(b in parts[1].lower() for b in BLACKLIST_DOMAINS):
                            continue
                        clean_title = parts[0].strip()
                        org = parts[1].strip()
                    else:
                        clean_title = title
                        org = feed_info["org"]

                    is_recruitment = any(w in clean_title.lower() for w in [
                        "recruitment", "vacancy", "vacancies", "hiring", "apply online", "programmer", "developer", "it officer"
                    ])
                    if not is_recruitment:
                        continue

                    pub_date = now
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        try:
                            pub_date = datetime(*entry.published_parsed[:6])
                        except Exception:
                            pub_date = now

                    last_date = pub_date + timedelta(days=21)

                    # STRICT: If expired, discard!
                    if last_date < today_start:
                        continue

                    is_bca, is_mca, quals = analyze_eligibility(summary, clean_title)
                    exp_desc, min_exp = extract_experience(summary + " " + clean_title)

                    ext_id = "gov_" + hashlib.md5((link + clean_title).encode()).hexdigest()[:16]

                    jobs.append(JobCreate(
                        external_id=ext_id,
                        title=clean_title,
                        organization=org,
                        department="Information Technology Cadre",
                        scope=feed_info["scope"],
                        location="Pan-India / State HQs",
                        state="All India" if feed_info["scope"] != "STATE_GOVT" else "State Specific",
                        qualifications=", ".join(quals),
                        is_bca_eligible=is_bca,
                        is_mca_eligible=is_mca,
                        experience_required=exp_desc,
                        min_experience_years=min_exp,
                        salary_scale="State / Central Pay Commission Scale",
                        total_vacancies="As per Notice",
                        apply_url=link,
                        pdf_url=link,
                        description=summary or clean_title,
                        key_skills="Database, Software, Web Engineering, Linux, Networking",
                        selection_mode="CBT Examination / Technical Merit",
                        posted_date=pub_date,
                        last_date=last_date,
                        source=feed_info["source"],
                        is_active=True,
                        is_featured=False
                    ))
            except Exception:
                continue

        return jobs
