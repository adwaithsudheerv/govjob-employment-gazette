import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Bookmark, 
  Clock, 
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function JobCard({ 
  job, 
  onSelectJob, 
  onEvaluateAI, 
  onUpdateStatus 
}) {
  const now = new Date();
  const lastDate = job.last_date ? new Date(job.last_date) : null;
  
  let daysLeft = null;
  let isClosingToday = false;
  let isUrgent = false;
  let isExpired = false;

  if (lastDate) {
    const diffTime = lastDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if deadline is today
    const isSameDay = lastDate.toDateString() === now.toDateString();
    
    if (isSameDay || (diffTime > 0 && diffTime <= 24 * 60 * 60 * 1000)) {
      isClosingToday = true;
      daysLeft = 0;
    } else if (diffTime <= 0) {
      isExpired = true;
      daysLeft = -1;
    } else {
      daysLeft = diffDays;
      if (daysLeft <= 7) {
        isUrgent = true;
      }
    }
  }

  // Do not render if expired before today
  if (isExpired) {
    return null;
  }

  // Scope stamp configuration
  const getScopeBadge = (scope) => {
    switch(scope) {
      case 'NATIONAL_CENTRAL':
        return { text: 'Central Govt / PSU', border: 'border-[#1e3a8a] text-[#1e3a8a] bg-[#eff6ff]' };
      case 'DEFENSE_RESEARCH':
        return { text: 'Defense & ISRO', border: 'border-[#92400e] text-[#92400e] bg-[#fffbeb]' };
      case 'BANKING_FINANCE':
        return { text: 'Banking IT Officer', border: 'border-[#065f46] text-[#065f46] bg-[#ecfdf5]' };
      case 'STATE_GOVT':
        return { text: `State: ${job.state || 'PSC'}`, border: 'border-[#0f766e] text-[#0f766e] bg-[#f0fdfa]' };
      case 'INTERNATIONAL_GLOBAL':
        return { text: 'Global / UN Body', border: 'border-[#6b21a8] text-[#6b21a8] bg-[#faf5ff]' };
      default:
        return { text: 'Public Sector IT', border: 'border-[#1c1f33] text-[#1c1f33] bg-[#fbf9f5]' };
    }
  };

  const scopeBadge = getScopeBadge(job.scope);
  const userApp = job.user_application;
  const isSaved = userApp?.status === 'SAVED';
  const isApplied = userApp?.status === 'APPLIED';

  return (
    <div className={`p-4 flex flex-col justify-between relative transition-all ${
      isClosingToday ? 'gazette-card-urgent' : 'gazette-card'
    }`}>
      
      {/* Top Header: Gazette Notice Ref & Stamp */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#1c1f33]/20">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {isClosingToday ? (
              <span className="gazette-stamp border-[#991b1b] text-[#991b1b] bg-[#fef2f2] stamp-pulse">
                🚨 CLOSING TODAY — MIDNIGHT CUTOFF
              </span>
            ) : (
              <span className={`gazette-stamp ${scopeBadge.border}`}>
                {scopeBadge.text}
              </span>
            )}
            <span className="text-[10px] font-sans font-bold text-[#686f8a] uppercase">
              DISPATCH #{job.id.toString().padStart(4, '0')}
            </span>
          </div>

          {/* Bookmark Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(job.id, isSaved ? null : 'SAVED');
            }}
            title={isSaved ? "Remove from saved log" : "Save for review"}
            className={`p-1.5 border transition-all ${
              isSaved
                ? 'bg-[#1c1f33] text-white border-[#1c1f33]'
                : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Organization Name */}
        <div className="mb-1 text-xs font-sans font-extrabold text-[#1c1f33] uppercase tracking-wider flex items-center space-x-1">
          <Building2 className="w-3.5 h-3.5 text-[#1c1f33] shrink-0" />
          <span className="line-clamp-1">{job.organization}</span>
        </div>

        {/* Job Title in Editorial Serif */}
        <div className="cursor-pointer mb-3" onClick={() => onSelectJob(job)}>
          <h3 className="text-base sm:text-lg font-title font-bold text-[#1c1f33] hover:underline leading-snug line-clamp-2">
            {job.title}
          </h3>
        </div>

        {/* Qualification & Eligibility Stamps */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {job.is_bca_eligible && (
            <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
              BCA
            </span>
          )}
          {job.is_mca_eligible && (
            <span className="gazette-stamp border-[#1e3a8a] text-[#1e3a8a] bg-[#eff6ff]">
              MCA
            </span>
          )}
          {job.min_experience_years === 0 && (
            <span className="gazette-stamp border-[#1c1f33] text-[#1c1f33] bg-[#fbf9f5]">
              0 Exp Entry
            </span>
          )}
          {job.requires_maths_10_plus_2 && (
            <span className="gazette-stamp border-[#92400e] text-[#92400e] bg-[#fffbeb]">
              10+2 Maths Req.
            </span>
          )}
          {job.final_year_eligible && (
            <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
              Final Year OK
            </span>
          )}
        </div>

        {/* Key Gazette Attributes: Remuneration & Location */}
        <div className="text-xs font-serif italic text-[#383e5c] space-y-1 mb-3 bg-[#fbf9f5] p-2 border border-[#1c1f33]/15">
          <div className="flex items-center space-x-1.5">
            <span className="font-sans font-bold text-[#1c1f33] not-italic">Remuneration:</span>
            <span className="text-[#1c1f33] font-sans font-semibold not-italic line-clamp-1">
              {job.salary_scale}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-sans font-bold text-[#1c1f33] not-italic">Station:</span>
            <span className="text-[#383e5c] line-clamp-1">{job.location}</span>
          </div>
        </div>

      </div>

      {/* Bottom Area: Deadline & Actions */}
      <div className="pt-2 border-t border-[#1c1f33]/20 space-y-2.5">
        
        {/* Deadline Indicator */}
        <div className="flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-1.5">
            <Clock className={`w-3.5 h-3.5 ${isClosingToday ? 'text-[#991b1b] animate-spin' : isUrgent ? 'text-[#92400e]' : 'text-[#1c1f33]'}`} />
            <span className="text-[#686f8a] text-[11px] font-bold uppercase">Deadline:</span>
            <span className={`font-extrabold ${isClosingToday ? 'text-[#991b1b]' : isUrgent ? 'text-[#92400e]' : 'text-[#1c1f33]'}`}>
              {isClosingToday ? 'Today (Midnight)' : lastDate ? lastDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check Notice'}
            </span>
          </div>

          {daysLeft !== null && (
            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border ${
              isClosingToday
                ? 'bg-[#991b1b] text-white border-[#991b1b]'
                : isUrgent
                ? 'bg-[#fffbeb] text-[#92400e] border-[#92400e]'
                : 'bg-[#fbf9f5] text-[#1c1f33] border-[#1c1f33]'
            }`}>
              {isClosingToday ? 'Expires Today' : `${daysLeft} Days`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* AI Resume Audit */}
          <button
            onClick={() => onEvaluateAI(job)}
            className="gazette-btn-outline py-1.5 px-2 text-xs flex items-center justify-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audit Match</span>
          </button>

          {/* Direct Apply Button */}
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (!isApplied) {
                onUpdateStatus(job.id, 'APPLIED');
              }
            }}
            className={`py-1.5 px-2 text-xs font-sans font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1 transition-all border ${
              isClosingToday
                ? 'bg-[#991b1b] text-white border-[#991b1b] hover:bg-white hover:text-[#991b1b]'
                : 'gazette-btn-ink'
            }`}
          >
            <span>Direct Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Footer Sub-links */}
        <div className="flex items-center justify-between text-[11px] font-sans pt-1 text-[#686f8a]">
          {job.pdf_url ? (
            <a
              href={job.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1c1f33] hover:underline flex items-center space-x-1"
            >
              <FileText className="w-3 h-3" />
              <span>Official Notice PDF</span>
            </a>
          ) : (
            <span className="text-[#686f8a]">Official Gazette Verified</span>
          )}
          <button
            onClick={() => onSelectJob(job)}
            className="hover:text-[#1c1f33] font-bold flex items-center space-x-0.5"
          >
            <span>Full Notice</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
