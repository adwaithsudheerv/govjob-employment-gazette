import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Building2, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  Download,
  Info,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { getCalendarIcsUrl, analyzeJobPdf } from '../api/client';

export default function JobModal({ job, onClose, onEvaluateAI, onUpdateStatus }) {
  if (!job) return null;

  const [notes, setNotes] = useState(job.user_application?.notes || '');
  const [appNo, setAppNo] = useState(job.user_application?.application_no || '');
  const [status, setStatus] = useState(job.user_application?.status || 'NONE');
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [pdfAnalysis, setPdfAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const handleSaveAppDetails = () => {
    if (status === 'NONE') {
      onUpdateStatus(job.id, null);
    } else {
      onUpdateStatus(job.id, status, {
        notes,
        application_no: appNo,
      });
    }
    setIsSavedLocally(true);
    setTimeout(() => setIsSavedLocally(false), 2000);
  };

  const handleAnalyzePdf = async () => {
    setLoadingAnalysis(true);
    try {
      const data = await analyzeJobPdf(job.id);
      setPdfAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const lastDate = job.last_date ? new Date(job.last_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Check Notification';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white border-2 border-[#1c1f33] shadow-[6px_6px_0px_0px_#1c1f33] p-6 sm:p-8 max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gazette Extraordinary Header Banner */}
        <div className="pr-10 mb-6 border-b-2 border-[#1c1f33] pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="gazette-stamp border-[#1c1f33] text-[#1c1f33] bg-[#fbf9f5]">
              {job.scope.replace('_', ' ')}
            </span>
            {job.is_bca_eligible && (
              <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                BCA Eligible
              </span>
            )}
            {job.is_mca_eligible && (
              <span className="gazette-stamp border-[#1e3a8a] text-[#1e3a8a] bg-[#eff6ff]">
                MCA Eligible
              </span>
            )}
            <span className="text-[10px] font-mono uppercase font-bold text-[#686f8a]">
              Source: {job.source}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight mb-2">
            {job.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-serif italic text-[#383e5c]">
            <div className="flex items-center space-x-1.5 font-sans font-bold text-[#1c1f33] not-italic">
              <Building2 className="w-4 h-4" />
              <span>{job.organization}</span>
              {job.department && <span>• {job.department}</span>}
            </div>
            <div className="flex items-center space-x-1.5 font-sans not-italic">
              <MapPin className="w-4 h-4 text-[#686f8a]" />
              <span>{job.location}</span>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-6 text-xs">
          <div>
            <span className="text-[10px] text-[#686f8a] block font-bold uppercase">Pay Scale / CTC</span>
            <span className="text-sm font-bold text-[#065f46]">{job.salary_scale}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#686f8a] block font-bold uppercase">Last Date to Apply</span>
            <span className="text-sm font-bold text-[#991b1b]">{lastDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#686f8a] block font-bold uppercase">Experience</span>
            <span className="text-sm font-bold text-[#1c1f33]">{job.experience_required}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#686f8a] block font-bold uppercase">Vacancies</span>
            <span className="text-sm font-bold text-[#1e3a8a]">{job.total_vacancies}</span>
          </div>
        </div>

        {/* Calendar Reminder Shortcut & PDF In-depth Analyzer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-[#1c1f33] mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#1c1f33]" />
            <span className="text-xs font-serif italic text-[#383e5c]">Calendar synchronization & deadline defense:</span>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={getCalendarIcsUrl(job.id)}
              download
              className="gazette-btn-outline px-3 py-1.5 text-xs flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </a>

            {!pdfAnalysis && (
              <button
                onClick={handleAnalyzePdf}
                disabled={loadingAnalysis}
                className="gazette-btn-ink px-3 py-1.5 text-xs flex items-center space-x-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{loadingAnalysis ? 'Auditing...' : 'Extract Notice Details'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Extracted PDF Details */}
        {pdfAnalysis && (
          <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-6 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#065f46]" />
              <span>Extracted Official Notification Details</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-[#1c1f33]/30">
                <span className="text-[#686f8a] font-bold block text-[10px] uppercase">Application Fee:</span>
                <span className="text-[#065f46] font-bold">{pdfAnalysis.application_fee}</span>
              </div>
              <div className="p-2.5 bg-white border border-[#1c1f33]/30">
                <span className="text-[#686f8a] font-bold block text-[10px] uppercase">Age Limit:</span>
                <span className="text-[#1c1f33] font-bold">{pdfAnalysis.age_limit}</span>
              </div>
              <div className="sm:col-span-2 p-2.5 bg-white border border-[#1c1f33]/30">
                <span className="text-[#686f8a] font-bold block text-[10px] uppercase mb-1">Selection Stages:</span>
                <div className="flex flex-wrap gap-1.5">
                  {pdfAnalysis.selection_stages?.map((stage, i) => (
                    <span key={i} className="gazette-stamp border-[#1c1f33] text-[#1c1f33] bg-[#fbf9f5]">
                      {stage}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Core Description & Qualifications */}
        <div className="space-y-4 mb-6 text-xs">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1c1f33] mb-1.5 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-[#065f46]" />
              <span>Educational Qualifications</span>
            </h4>
            <p className="p-3 bg-[#fbf9f5] border border-[#1c1f33] text-[#1c1f33] font-serif leading-relaxed text-sm">
              {job.qualifications}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1c1f33] mb-1.5 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4 text-[#1e3a8a]" />
              <span>Job Responsibilities & Scope</span>
            </h4>
            <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33] text-[#383e5c] font-serif leading-relaxed text-sm">
              {job.description || 'Consult the official recruitment notification for specific job role mandates and post descriptions.'}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1c1f33] mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-[#92400e]" />
              <span>Selection Mode & Key Technical Skills</span>
            </h4>
            <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33] space-y-2">
              <div>
                <span className="text-[#686f8a] text-xs font-bold uppercase">Selection Process: </span>
                <span className="text-[#1c1f33] font-serif text-sm">{job.selection_mode}</span>
              </div>
              <div>
                <span className="text-[#686f8a] text-xs font-bold uppercase">Technical Keywords: </span>
                <span className="text-[#1e3a8a] font-mono text-xs">{job.key_skills}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Application Tracker Section */}
        <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
              <Bookmark className="w-4 h-4" />
              <span>Log Application in Personal Register</span>
            </span>
            {isSavedLocally && (
              <span className="text-xs text-[#065f46] font-bold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Recorded in Logbook!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none cursor-pointer"
              >
                <option value="NONE">Not Tracking</option>
                <option value="SAVED">Saved / Interested</option>
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted for Exam</option>
                <option value="INTERVIEW">Interview Scheduled</option>
                <option value="REJECTED">Archived / Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Application / Reg No.</label>
              <input
                type="text"
                value={appNo}
                onChange={(e) => setAppNo(e.target.value)}
                placeholder="e.g. NIC-2026-98124"
                className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Personal Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Admit card download on 15th"
                className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAppDetails}
              className="gazette-btn-ink px-4 py-1.5 text-xs"
            >
              Update Logbook
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-[#1c1f33]">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {job.pdf_url && (
              <a
                href={job.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="gazette-btn-outline px-4 py-2 text-xs flex items-center justify-center space-x-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Official Notice PDF</span>
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                onEvaluateAI(job);
              }}
              className="gazette-btn-outline px-4 py-2 text-xs flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#b45309]" />
              <span>Audit AI Eligibility</span>
            </button>
          </div>

          {/* Guaranteed Direct Apply Button */}
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (status === 'NONE' || status === 'SAVED') {
                setStatus('APPLIED');
                onUpdateStatus(job.id, 'APPLIED');
              }
            }}
            className="w-full sm:w-auto gazette-btn-ink px-6 py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <span>Proceed to Direct Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
