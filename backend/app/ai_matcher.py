import re
from typing import List, Dict, Any
from app.models import Job
from app.schemas import AIEligibilityRequest, AIEligibilityResponse

def evaluate_job_match(job: Job, profile: AIEligibilityRequest) -> AIEligibilityResponse:
    user_degree = profile.user_degree.upper().strip()
    user_skills_clean = [s.strip().lower() for s in profile.user_skills if s.strip()]
    user_percentage = profile.user_percentage if profile.user_percentage is not None else 60.0
    had_maths = profile.had_maths_10_plus_2 if profile.had_maths_10_plus_2 is not None else True
    is_final_year = profile.is_final_year if profile.is_final_year is not None else False
    
    score = 0
    matched_skills = []
    missing_skills = []
    recommendations = []
    key_advantages = []
    dv_risk_warnings = []

    # 1. Degree Evaluation (35 pts)
    degree_verdict = ""
    is_eligible = True

    if "BCA" in user_degree:
        if job.is_bca_eligible:
            score += 35
            degree_verdict = "✅ Fully Eligible: Your BCA degree is explicitly accepted for this technical cadre post."
            key_advantages.append("BCA recognized as direct qualifying degree for technical assistant / programmer post.")
        else:
            score += 10
            is_eligible = False
            degree_verdict = "⚠️ Ineligible / Risk: Post explicitly mandates Master's (MCA/M.Sc) or B.Tech. BCA alone risks rejection at Document Verification."
            dv_risk_warnings.append("Document Verification Risk: Applying for this post with BCA alone will lead to cancellation unless you hold a recognized Master's or DOEACC 'B' Level.")
    elif "MCA" in user_degree:
        if job.is_mca_eligible:
            score += 35
            degree_verdict = "✅ Highly Eligible: Your MCA degree fulfills the highest gazetted / officer cadre educational requirement."
            key_advantages.append("Master's degree grants eligibility for Level 10 Gazetted / Specialist Officer Grade.")
        else:
            score += 25
            degree_verdict = "ℹ️ Overqualified / Eligible: Diploma/Assistant cadre, MCA candidates generally accepted."
    else:
        score += 30
        degree_verdict = f"✅ Eligible: {user_degree} accepted under Computer Science / IT discipline."

    # 2. 10+2 Mathematics Requirement Check (15 pts)
    maths_verdict = ""
    if job.requires_maths_10_plus_2:
        if had_maths:
            score += 15
            maths_verdict = "✅ Cleared: You meet the mandatory 10+2 Mathematics subject requirement."
        else:
            is_eligible = False
            maths_verdict = "❌ Disqualification Risk: This notification strictly requires Mathematics at 10+2 / Higher Secondary level."
            dv_risk_warnings.append("Critical DV Clause: Absence of Mathematics in 10+2 marksheet is a primary ground for cancellation during document verification for this post.")
    else:
        score += 15
        maths_verdict = "ℹ️ Not Mandated: 10+2 Mathematics is not mandatory for this notification."

    # 3. Minimum Percentage Cutoff Check (15 pts)
    pct_verdict = ""
    required_pct = job.min_aggregate_percentage or 50.0
    if user_percentage >= required_pct:
        score += 15
        pct_verdict = f"✅ Met: Your aggregate ({user_percentage}%) exceeds the required {required_pct}% cutoff."
    else:
        is_eligible = False
        gap = required_pct - user_percentage
        pct_verdict = f"❌ Below Cutoff: Requires minimum {required_pct}%, your aggregate is {user_percentage}% (Deficit of {gap:.1f}%)."
        dv_risk_warnings.append(f"Percentage Cutoff Deficit: Candidate fails the minimum academic threshold of {required_pct}%.")

    # 4. Final Year Appearing Status Check
    if is_final_year:
        if getattr(job, 'final_year_eligible', True):
            recommendations.append("Final Year Candidates: Ensure your provisional degree/marksheet is issued before the document verification date.")
        else:
            is_eligible = False
            dv_risk_warnings.append("Completed Degree Required: This post requires final marksheet in hand as of the application closing date.")

    # 5. Experience Evaluation (15 pts)
    exp_verdict = ""
    if profile.user_experience_years >= job.min_experience_years:
        score += 15
        exp_verdict = f"✅ Met: Requires {job.min_experience_years} years, you have {profile.user_experience_years} years."
        if job.min_experience_years == 0:
            key_advantages.append("Zero experience requirement: 100% fresher-friendly merit selection.")
    else:
        gap = job.min_experience_years - profile.user_experience_years
        score += max(0, int(15 - (gap * 8)))
        is_eligible = False
        exp_verdict = f"⚠️ Short on Experience: Requires {job.min_experience_years} years (Gap of {gap:.1f} years)."

    # 6. Technical Skills Overlap (20 pts)
    job_skills_text = f"{job.key_skills or ''} {job.title} {job.description or ''}".lower()
    key_gov_tech_skills = [
        "python", "java", "sql", "linux", "networking", "c++", "c#", "react", "node", 
        "cloud", "aws", "docker", "cyber security", "data structures", "algorithms", 
        "database", "rdbms", "html", "javascript", "git"
    ]
    job_tech_found = [skill for skill in key_gov_tech_skills if skill in job_skills_text]
    if not job_tech_found:
        job_tech_found = ["sql", "python", "networking", "database"]

    for skill in job_tech_found:
        if any(skill in user_s for user_s in user_skills_clean):
            matched_skills.append(skill.capitalize())
        else:
            missing_skills.append(skill.capitalize())

    if job_tech_found:
        skill_ratio = len(matched_skills) / len(job_tech_found)
        score += int(skill_ratio * 20)
    else:
        score += 15

    # Specific Recommendations
    if "Written Exam" in (job.selection_mode or "") or "CBT" in (job.selection_mode or ""):
        recommendations.append("Exam Pattern Strategy: Prepare DBMS (Normalization & SQL queries), Computer Networks (OSI layers & IP subnetting), and Data Structures.")
    
    if missing_skills:
        recommendations.append(f"Brush up on top requested topics: {', '.join(missing_skills[:3])} prior to practical test / technical interview.")

    recommendations.append(f"Document Pre-Flight: Verify caste/EWS certificate date and keep 10th marksheet ready for Date of Birth proof prior to {job.last_date.strftime('%d %b %Y') if job.last_date else 'deadline'}.")

    final_score = min(100, max(0, score))

    return AIEligibilityResponse(
        job_id=job.id,
        job_title=job.title,
        organization=job.organization,
        overall_match_score=final_score,
        is_eligible=is_eligible and final_score >= 55,
        degree_verdict=degree_verdict,
        experience_verdict=exp_verdict,
        maths_requirement_verdict=maths_verdict,
        percentage_cutoff_verdict=pct_verdict,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        dv_risk_warnings=dv_risk_warnings,
        recommendations=recommendations,
        key_advantages=key_advantages
    )
