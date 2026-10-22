import io
import re
from typing import Dict, Any, List, Optional
from pypdf import PdfReader
import httpx
import logging

logger = logging.getLogger(__name__)

COMMON_SKILLS = [
    "python", "java", "c++", "c#", "c", "javascript", "typescript", "php", "ruby", "go",
    "html", "css", "react", "angular", "vue", "django", "flask", "spring boot", "node.js",
    "sql", "mysql", "postgresql", "oracle", "mongodb", "sqlite", "rdbms", "database",
    "linux", "unix", "bash", "shell scripting", "git", "github", "docker", "kubernetes",
    "aws", "azure", "gcp", "cloud", "networking", "tcp/ip", "dns", "cyber security",
    "data structures", "algorithms", "machine learning", "data science", "excel", "power bi"
]

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ""
        # Read up to first 10 pages for efficiency
        for page in reader.pages[:10]:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        return ""

def parse_resume(text: str) -> Dict[str, Any]:
    text_lower = text.lower()

    # 1. Detect Degree
    detected_degree = "BCA"
    if "master of computer applications" in text_lower or re.search(r"\bmca\b", text_lower):
        detected_degree = "MCA"
    elif "bachelor of computer applications" in text_lower or re.search(r"\bbca\b", text_lower):
        detected_degree = "BCA"
    elif "b.sc" in text_lower and ("computer" in text_lower or "information technology" in text_lower):
        detected_degree = "B.Sc CS"
    elif "b.tech" in text_lower or "b.e" in text_lower:
        detected_degree = "B.Tech CS"

    # 2. Extract Skills
    found_skills = []
    for skill in COMMON_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found_skills.append(skill.title() if len(skill) > 3 else skill.upper())

    # 3. Detect Experience Years
    exp_years = 0.0
    exp_match = re.search(r"(\d+)(?:\.\d+)?\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of)?\s*experience", text_lower)
    if exp_match:
        try:
            exp_years = float(exp_match.group(1))
        except Exception:
            exp_years = 0.0
    elif any(f in text_lower for f in ["fresher", "entry level", "student", "graduate 202"]):
        exp_years = 0.0

    # 4. Extract Email & Phone
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    phone_match = re.search(r"(?:\+91[\-\s]?)?[6-9]\d{9}", text)

    return {
        "degree": detected_degree,
        "skills": list(dict.fromkeys(found_skills)),  # deduplicate preserving order
        "experience_years": exp_years,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "summary": f"Detected {detected_degree} graduate with {len(found_skills)} matching technical competencies."
    }

def analyze_notification_text(text: str) -> Dict[str, Any]:
    text_lower = text.lower()

    # 1. Application Fee
    fee_match = re.search(r"(?:application\s*fee|exam(?:ination)?\s*fee)[:\s]*(?:rs\.?|inr|₹)?\s*(\d{2,4})", text_lower)
    fee_desc = f"₹{fee_match.group(1)}" if fee_match else "Refer official notice (Nil for SC/ST/Women in most central posts)"

    # 2. Age Limits
    age_match = re.search(r"age\s*limit[:\s]*(\d{2})\s*(?:to|-)\s*(\d{2})\s*years?", text_lower)
    age_limit = f"{age_match.group(1)} to {age_match.group(2)} years (Relaxation applicable)" if age_match else "18 to 30/35 years (standard Govt rules)"

    # 3. Selection Process
    selection_steps = []
    if "written" in text_lower or "cbt" in text_lower:
        selection_steps.append("Computer-Based Online Test (CBT)")
    if "skill test" in text_lower or "trade test" in text_lower or "programming test" in text_lower:
        selection_steps.append("Technical Practical / Skill Test")
    if "interview" in text_lower:
        selection_steps.append("Personal Interview")
    if "document verification" in text_lower or "dv" in text_lower:
        selection_steps.append("Document Verification & Medical Fitness")

    if not selection_steps:
        selection_steps = ["Computer Based Examination (CBT)", "Document Verification"]

    return {
        "application_fee": fee_desc,
        "age_limit": age_limit,
        "selection_stages": selection_steps,
        "reservation_benefits": "Age relaxation of 5 yrs (SC/ST), 3 yrs (OBC), 10 yrs (PwD) as per Central/State norms."
    }
