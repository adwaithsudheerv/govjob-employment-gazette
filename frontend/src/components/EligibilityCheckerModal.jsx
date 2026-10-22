import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  GraduationCap, 
  Lightbulb, 
  Check, 
  ExternalLink, 
  TrendingUp, 
  UploadCloud, 
  FileCheck 
} from 'lucide-react';
import { evaluateEligibility, uploadResume } from '../api/client';

export default function EligibilityCheckerModal({ 
  job, 
  allJobs, 
  onClose, 
  onSelectJob 
}) {
  const [selectedJobId, setSelectedJobId] = useState(job ? job.id : (allJobs[0]?.id || null));
  const [degree, setDegree] = useState('BCA');
  const [experience, setExperience] = useState(0);
  const [skillsInput, setSkillsInput] = useState('Python, SQL, Linux, Networking, Web Development');
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeParsedSummary, setResumeParsedSummary] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const currentJob = allJobs.find(j => j.id === Number(selectedJobId)) || job;

  const handleEvaluate = async (deg = degree, exp = experience, skills = skillsInput) => {
    if (!selectedJobId) return;
    setLoading(true);
    setError(null);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await evaluateEligibility({
        job_id: Number(selectedJobId),
        user_degree: deg,
        user_skills: skillsArray,
        user_experience_years: parseFloat(exp) || 0.0,
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to evaluate match.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setDegree(data.degree || 'BCA');
      setExperience(data.experience_years || 0);
      const joinedSkills = (data.skills || []).join(', ');
      setSkillsInput(joinedSkills || skillsInput);
      setResumeParsedSummary(data.summary || `Parsed ${data.degree} with ${data.skills?.length || 0} skills`);
      
      // Auto-trigger evaluation with extracted resume parameters
      await handleEvaluate(data.degree, data.experience_years, joinedSkills);
    } catch (err) {
      setError('Resume parsing failed: ' + err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      handleEvaluate();
    }
  }, [selectedJobId, degree]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white border-2 border-[#1c1f33] shadow-[6px_6px_0px_0px_#1c1f33] p-6 sm:p-8 max-h-[92vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3 mb-5 pr-10 border-b-2 border-[#1c1f33] pb-4">
          <div className="p-2.5 border border-[#1c1f33] bg-[#fbf9f5] text-[#1c1f33]">
            <Sparkles className="w-5 h-5 text-[#b45309]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Candidate AI Resume Audit & Eligibility Attestation
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Drop your BCA/MCA resume to audit strict government qualifications, experience norms, and exam syllabus match.
            </p>
          </div>
        </div>

        {/* Target Job Selector */}
        <div className="mb-5">
          <label className="text-[11px] font-extrabold text-[#1c1f33] block mb-1.5 uppercase tracking-wider">
            Target Gazette Recruitment Notice:
          </label>
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(Number(e.target.value))}
            className="w-full bg-[#fbf9f5] border border-[#1c1f33] px-3.5 py-2 text-xs sm:text-sm text-[#1c1f33] focus:outline-none cursor-pointer"
          >
            {allJobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} • {j.organization} ({j.scope.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Resume PDF Upload Dropzone */}
        <div className="mb-5 p-4 border-2 border-dashed border-[#1c1f33] bg-[#fbf9f5] text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.docx"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 border border-[#1c1f33] bg-white text-[#1c1f33] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-[#1c1f33]">
                {uploadingResume ? 'Extracting Resume Data...' : 'Drop your BCA / MCA Resume (PDF) here to auto-fill'}
              </p>
              <p className="text-[11px] font-serif italic text-[#686f8a]">
                Automatically extracts your degree, years of experience, and programming skills
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingResume}
              className="gazette-btn-ink px-3 py-1.5 text-xs"
            >
              {uploadingResume ? 'Processing PDF...' : 'Browse Resume PDF'}
            </button>
          </div>

          {resumeParsedSummary && (
            <div className="mt-3 p-2 bg-[#ecfdf5] border border-[#065f46] text-xs text-[#065f46] flex items-center justify-center space-x-1.5 font-bold">
              <FileCheck className="w-4 h-4" />
              <span>{resumeParsedSummary}</span>
            </div>
          )}
        </div>

        {/* Candidate Profile Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-6 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Your Degree</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none cursor-pointer"
            >
              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
              <option value="MCA">MCA (Master of Computer Applications)</option>
              <option value="B.Sc CS">B.Sc Computer Science / IT</option>
              <option value="B.Tech CS">B.Tech / B.E (CS / IT)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Total Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none cursor-pointer"
            >
              <option value={0}>0 Years (Fresher)</option>
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3+ Years</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-[#686f8a] block mb-1">Key Technical Skills</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Python, SQL, Linux, React"
              className="w-full bg-white border border-[#1c1f33] px-3 py-1.5 text-xs text-[#1c1f33] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              onClick={() => handleEvaluate()}
              disabled={loading}
              className="gazette-btn-ink px-5 py-2 text-xs flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Auditing Terms...' : 'Re-Audit Eligibility'}</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        {result && (
          <div className="space-y-4">
            {/* Top Score Box */}
            <div className="p-4 bg-white border-2 border-[#1c1f33] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border-2 border-[#1c1f33] bg-[#fbf9f5] flex flex-col items-center justify-center shrink-0">
                  <span className={`text-2xl font-black font-title ${
                    result.overall_match_score >= 70 ? 'text-[#065f46]' : result.overall_match_score >= 50 ? 'text-[#b45309]' : 'text-[#991b1b]'
                  }`}>
                    {result.overall_match_score}%
                  </span>
                  <span className="text-[8px] uppercase font-bold text-[#686f8a]">Match</span>
                </div>
                <div>
                  <h4 className="text-base font-title font-bold text-[#1c1f33] flex items-center space-x-2">
                    <span>{result.is_eligible ? 'Eligible to Apply (Notice Compliant)' : 'Review Criteria Before Registering'}</span>
                    {result.is_eligible ? (
                      <CheckCircle className="w-4 h-4 text-[#065f46]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#b45309]" />
                    )}
                  </h4>
                  <p className="text-xs font-serif italic text-[#383e5c]">
                    Target: {result.job_title} ({result.organization})
                  </p>
                </div>
              </div>

              {currentJob?.apply_url && (
                <a
                  href={currentJob.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gazette-btn-ink px-5 py-2 text-xs flex items-center space-x-1.5 shrink-0"
                >
                  <span>Direct Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Verdicts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33]">
                <span className="font-bold text-[#686f8a] block mb-1 uppercase tracking-wider text-[10px]">Degree Evaluation</span>
                <p className="text-[#1c1f33] font-serif text-sm">{result.degree_verdict}</p>
              </div>
              <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33]">
                <span className="font-bold text-[#686f8a] block mb-1 uppercase tracking-wider text-[10px]">Experience Requirement</span>
                <p className="text-[#1c1f33] font-serif text-sm">{result.experience_verdict}</p>
              </div>
            </div>

            {/* Skills Matched vs Missing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#ecfdf5] border border-[#065f46]">
                <span className="font-bold text-[#065f46] block mb-2 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Matched Qualifications ({result.matched_skills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched_skills.map((s, idx) => (
                    <span key={idx} className="gazette-stamp border-[#065f46] text-[#065f46] bg-white">
                      {s}
                    </span>
                  ))}
                  {result.matched_skills.length === 0 && (
                    <span className="text-[#383e5c] italic">No specific technical overlap detected.</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#fffbeb] border border-[#92400e]">
                <span className="font-bold text-[#92400e] block mb-2 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                  <Lightbulb className="w-3 h-3" />
                  <span>Recommended Exam Syllabus Topics ({result.missing_skills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.missing_skills.map((s, idx) => (
                    <span key={idx} className="gazette-stamp border-[#92400e] text-[#92400e] bg-white">
                      {s}
                    </span>
                  ))}
                  {result.missing_skills.length === 0 && (
                    <span className="text-[#383e5c] italic">Great match! All key technical topics covered.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preparation Strategy */}
            <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-[#065f46]" />
                <span>Actionable Preparation Strategy</span>
              </h5>
              <ul className="space-y-1.5 text-xs font-serif text-[#383e5c]">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#1c1f33] font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
