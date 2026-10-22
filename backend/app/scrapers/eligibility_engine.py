import re
from typing import Tuple, List, Dict, Any

BCA_KEYWORDS = [
    r"\bbca\b",
    r"\bbachelor of computer applications?\b",
    r"\bbachelor in computer applications?\b",
    r"\bb\.?sc\.?\s*(?:in\s*)?(?:computer science|cs|it|information technology)\b",
    r"\bgraduation in computer\b",
    r"\bdegree in computer applications?\b",
    r"\bcomputer diploma\b",
    r"\bdoeacc\s+['\"]?a['\"]?\s+level\b",
    r"\bgraduate with computer\b"
]

MCA_KEYWORDS = [
    r"\bmca\b",
    r"\bmaster of computer applications?\b",
    r"\bmaster in computer applications?\b",
    r"\bm\.?sc\.?\s*(?:in\s*)?(?:computer science|cs|it|information technology)\b",
    r"\bpost graduate in computer\b",
    r"\bmaster'?s degree in computer\b",
    r"\bdoeacc\s+['\"]?b['\"]?\s+level\b"
]

GENERIC_CS_KEYWORDS = [
    r"\bcomputer science\b",
    r"\binformation technology\b",
    r"\bsoftware developer\b",
    r"\bprogrammer\b",
    r"\bsystem analyst\b",
    r"\bweb developer\b",
    r"\bdatabase administrator\b",
    r"\bit officer\b",
    r"\bdata analyst\b",
    r"\bnetwork engineer\b",
    r"\bcyber security\b"
]

def analyze_eligibility(text: str, title: str = "") -> Tuple[bool, bool, List[str]]:
    """
    Analyzes title and text to determine BCA and MCA eligibility.
    Returns (is_bca_eligible, is_mca_eligible, detected_qualifications)
    """
    combined = f"{title} {text}".lower()
    
    bca_match = any(re.search(pattern, combined, re.IGNORECASE) for pattern in BCA_KEYWORDS)
    mca_match = any(re.search(pattern, combined, re.IGNORECASE) for pattern in MCA_KEYWORDS)
    generic_match = any(re.search(pattern, combined, re.IGNORECASE) for pattern in GENERIC_CS_KEYWORDS)
    
    quals = []
    
    # If explicitly mentioned
    if bca_match:
        quals.append("BCA")
        quals.append("B.Sc CS/IT")
    if mca_match:
        quals.append("MCA")
        quals.append("M.Sc CS/IT")
        
    # If generic IT/Software role in government without restricting to B.Tech only,
    # both BCA/MCA are usually eligible (or MCA for officer grade, BCA for assistant grade)
    if not bca_match and not mca_match and generic_match:
        if "officer" in combined or "scientist" in combined or "lead" in combined or "manager" in combined:
            mca_match = True
            quals.append("MCA")
        if "assistant" in combined or "developer" in combined or "trainee" in combined or "technician" in combined or "operator" in combined:
            bca_match = True
            quals.append("BCA")
        if not bca_match and not mca_match:
            # Default to both for CS/IT jobs
            bca_match = True
            mca_match = True
            quals.extend(["BCA", "MCA"])
            
    # Default fallback
    if not quals:
        quals = ["BCA", "MCA", "B.Sc CS/IT"]
        bca_match = True
        mca_match = True
        
    return bca_match, mca_match, list(set(quals))

def extract_experience(text: str) -> Tuple[str, float]:
    """
    Extracts experience string and minimum years from text.
    """
    combined = text.lower()
    
    if any(k in combined for k in ["fresher", "no experience", "0 year", "0-1 year", "entry level", "graduate trainee"]):
        return "Freshers Eligible (0-1 yrs)", 0.0
        
    # Look for number of years
    match = re.search(r"(\d+)(?:\s*-\s*\d+)?\s*(?:year|yr)s?\s*(?:of)?\s*exp", combined)
    if match:
        years = float(match.group(1))
        return f"{int(years)}+ Years Required", years
        
    # Look for minimum X years
    match2 = re.search(r"minimum\s*(\d+)\s*years?", combined)
    if match2:
        years = float(match2.group(1))
        return f"{int(years)}+ Years Required", years

    return "Freshers Eligible (0-1 yrs)", 0.0
