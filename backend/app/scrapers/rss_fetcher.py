import feedparser
import re
import hashlib
from datetime import datetime, timedelta
from typing import List, Optional
from app.schemas import JobCreate
from app.scrapers.base import BaseScraper
from app.scrapers.eligibility_engine import analyze_eligibility, extract_experience

# Blacklist of news media and coaching portals that generate unreliable aggregator articles
BLACKLIST_ORGS_AND_DOMAINS = [
    "adda247", "shiksha", "pw.live", "physics wallah", "timesofindia", "the times of india",
    "ndtv", "india today", "indian express", "the indian express", "collegedunia", "collegementor",
    "college mentor", "jagranjosh", "jagran", "career360", "edexlive", "zeenews", "news18",
    "hindustantimes", "hindustan times", "livemint", "moneycontrol", "global south"
]

# Blacklist of keywords indicating it's NOT a job opening (admit cards, cut-offs, results, syllabus)
BLACKLIST_TITLES = [
    "admit card", "hall ticket", "answer key", "cut off", "cut-off", "cutoff",
    "result out", "results declared", "syllabus", "exam date revised", "city intimation",
    "how to become", "analysis", "scorecard", "paper leak", "merit list out"
]

RSS_FEEDS = [
    {
        "url": "https://news.google.com/rss/search?q=(NIC+OR+NIELIT+OR+CDAC)+recruitment+2026+(computer+OR+BCA+OR+MCA)&hl=en-IN&gl=IN&ceid=IN:en",
        "scope": "NATIONAL_CENTRAL",
        "default_org": "National Informatics & IT Agencies",
        "source": "NIC / NIELIT Recruitment"
    },
    {
        "url": "https://news.google.com/rss/search?q=(ISRO+OR+DRDO)+recruitment+2026+(computer+OR+programmer+OR+scientist)+vacancies&hl=en-IN&gl=IN&ceid=IN:en",
        "scope": "DEFENSE_RESEARCH",
        "default_org": "Defense & Space Research",
        "source": "ISRO / DRDO Recruitment"
    },
    {
        "url": "https://news.google.com/rss/search?q=(IBPS+SO+IT+OR+SBI+Specialist+Officer)+recruitment+2026+apply+online&hl=en-IN&gl=IN&ceid=IN:en",
        "scope": "BANKING_FINANCE",
        "default_org": "Public Sector Banking (IBPS)",
        "source": "IBPS SO IT Recruitment"
    },
    {
        "url": "https://news.google.com/rss/search?q=(UN+Careers+OR+UNDP+OR+WHO)+IT+associate+OR+developer+vacancies+2026&hl=en-US&gl=US&ceid=US:en",
        "scope": "INTERNATIONAL_GLOBAL",
        "default_org": "United Nations & Global Agencies",
        "source": "UN & Global Public Sector"
    }
]

class RSSGovJobScraper(BaseScraper):
    def __init__(self):
        super().__init__("RSSGovJobScraper")

    def scrape(self) -> List[JobCreate]:
        jobs = []
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        for feed_config in RSS_FEEDS:
            try:
                feed = feedparser.parse(feed_config["url"])
                for entry in feed.entries[:8]:
                    title = entry.get("title", "").strip()
                    summary = entry.get("summary", "")
                    link = entry.get("link", "")
                    
                    if not title or len(title) < 12:
                        continue
                        
                    title_lower = title.lower()
                    summary_lower = summary.lower()

                    # 1. Filter out articles that are NOT recruitment (e.g. admit cards, cut-offs)
                    if any(bl in title_lower for bl in BLACKLIST_TITLES):
                        continue

                    # 2. Extract org and filter out news/coaching sources
                    org = feed_config["default_org"]
                    if " - " in title:
                        parts = title.rsplit(" - ", 1)
                        if len(parts) == 2:
                            possible_source = parts[1].strip().lower()
                            if any(b in possible_source for b in BLACKLIST_ORGS_AND_DOMAINS):
                                continue  # Reject news channel / coaching institute articles
                            org = parts[1].strip()
                            clean_title = parts[0].strip()
                        else:
                            clean_title = title
                    else:
                        clean_title = title

                    # 3. Must be an active hiring notice
                    is_hiring = any(w in clean_title.lower() for w in [
                        "recruitment", "vacancy", "vacancies", "hiring", "apply online", "notification out", 
                        "posts", "officer", "developer", "engineer", "assistant"
                    ])
                    if not is_hiring:
                        continue

                    # 4. Parse publication date & calculate deadline
                    pub_date = now
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        try:
                            pub_date = datetime(*entry.published_parsed[:6])
                        except Exception:
                            pub_date = now

                    # Estimate deadline
                    last_date = pub_date + timedelta(days=21)

                    # STRICT RULE: If the last date has already passed (yesterday or older), DISCARD!
                    if last_date < today_start:
                        continue

                    # Analyze BCA/MCA eligibility
                    is_bca, is_mca, quals = analyze_eligibility(summary, clean_title)
                    exp_desc, min_exp = extract_experience(summary + " " + clean_title)

                    ext_id = "rss_" + hashlib.md5((link + clean_title).encode()).hexdigest()[:16]

                    jobs.append(JobCreate(
                        external_id=ext_id,
                        title=clean_title,
                        organization=org,
                        department="Information Technology & Computing",
                        scope=feed_config["scope"],
                        location="Pan-India" if feed_config["scope"] != "INTERNATIONAL_GLOBAL" else "Global / Multi-station",
                        state="All India" if feed_config["scope"] != "INTERNATIONAL_GLOBAL" else "International",
                        qualifications=", ".join(quals),
                        is_bca_eligible=is_bca,
                        is_mca_eligible=is_mca,
                        experience_required=exp_desc,
                        min_experience_years=min_exp,
                        salary_scale="Standard Public Sector Pay Band" if feed_config["scope"] != "INTERNATIONAL_GLOBAL" else "UN / International Pay Scale",
                        total_vacancies="Check Official Notice",
                        apply_url=link,
                        pdf_url=link,
                        description=summary or clean_title,
                        key_skills="Computing, Software, Database, Web, Information Systems",
                        selection_mode="Written Exam / Direct Interview",
                        posted_date=pub_date,
                        last_date=last_date,
                        source=feed_config["source"],
                        is_active=True,
                        is_featured=False
                    ))
            except Exception:
                continue

        return jobs
