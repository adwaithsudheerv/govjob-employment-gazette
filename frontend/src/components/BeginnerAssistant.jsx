import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  Sparkles, 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function BeginnerAssistant({ 
  onApplyFilter, 
  onSwitchTab 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState('welcome');

  const topics = [
    { id: 'welcome', label: '👋 Gazette Orientation', icon: BookOpen },
    { id: 'bca_path', label: '🎓 Guide for BCA Students', icon: GraduationCap },
    { id: 'mca_path', label: '💼 Guide for MCA Students', icon: GraduationCap },
    { id: 'how_to_apply', label: '🔗 Direct Application Rules', icon: ExternalLink },
    { id: 'deadlines', label: '⏰ Deadlines & Auto-Purging', icon: Clock },
    { id: 'ai_tool', label: '🧠 AI Eligibility Audit', icon: Sparkles },
  ];

  const handleAction = (type) => {
    if (type === 'bca_freshers') {
      onApplyFilter({ qualification: 'BCA', freshers_only: true, closing_today_only: false, scope: 'ALL' });
      onSwitchTab('feed');
      setIsOpen(false);
    } else if (type === 'mca_officer') {
      onApplyFilter({ qualification: 'MCA', freshers_only: false, closing_today_only: false, scope: 'ALL' });
      onSwitchTab('feed');
      setIsOpen(false);
    } else if (type === 'closing_today') {
      onApplyFilter({ closing_today_only: true, qualification: '', freshers_only: false, scope: 'ALL' });
      onSwitchTab('feed');
      setIsOpen(false);
    } else if (type === 'open_matcher') {
      onSwitchTab('feed');
      setIsOpen(false);
    } else if (type === 'open_tracker') {
      onSwitchTab('tracker');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill in Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#1c1f33] hover:bg-white text-white hover:text-[#1c1f33] font-sans font-extrabold text-xs py-3 px-4 shadow-[4px_4px_0px_0px_#1c1f33] flex items-center space-x-2.5 transition-all duration-200 border-2 border-[#1c1f33] group"
        >
          <div className="w-5 h-5 bg-white text-[#1c1f33] group-hover:bg-[#1c1f33] group-hover:text-white flex items-center justify-center border border-[#1c1f33]">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <span className="uppercase tracking-wider">Candidate Handbook & Guide</span>
        </button>
      )}

      {/* Assistant Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border-2 border-[#1c1f33] shadow-[6px_6px_0px_0px_#1c1f33] max-h-[88vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-4 bg-[#fbf9f5] border-b-2 border-[#1c1f33] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-[#1c1f33] bg-white flex items-center justify-center text-[#1c1f33]">
                  <BookOpen className="w-5 h-5 text-[#065f46]" />
                </div>
                <div>
                  <h3 className="text-base font-title font-bold text-[#1c1f33] flex items-center space-x-2">
                    <span>Candidate Advisory & Handbook</span>
                    <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                      Official Edition
                    </span>
                  </h3>
                  <p className="text-xs font-serif italic text-[#383e5c]">Official guidance for BCA & MCA examination candidates</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white text-[#1c1f33] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body: Sidebar Navigation + Main Explanation */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              
              {/* Topics Menu */}
              <div className="w-full sm:w-56 p-3 bg-[#fbf9f5] border-b sm:border-b-0 sm:border-r border-[#1c1f33] space-y-1 shrink-0 overflow-y-auto">
                <div className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#686f8a] px-2 py-1">
                  Table of Contents
                </div>
                {topics.map(t => {
                  const Icon = t.icon;
                  const isSelected = activeTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTopic(t.id)}
                      className={`w-full text-left px-2.5 py-2 text-xs font-sans font-bold flex items-center space-x-2 transition-all border ${
                        isSelected 
                          ? 'bg-[#1c1f33] text-white border-[#1c1f33]' 
                          : 'bg-white text-[#1c1f33] border-transparent hover:border-[#1c1f33]/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Topic Detail View */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-serif text-[#1c1f33] leading-relaxed">
                
                {activeTopic === 'welcome' && (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33]">
                      <h4 className="text-sm font-sans font-bold text-[#1c1f33] mb-1 uppercase">
                        Welcome to The Employment Gazette!
                      </h4>
                      <p className="text-xs text-[#383e5c]">
                        Public recruitment portals are frequently obscured by coaching spam, coaching institutes, and outdated cutoffs. This broadsheet aggregates <strong>exclusively official government portals</strong> matching <strong>BCA and MCA degree holders</strong>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-sans font-extrabold text-[#1c1f33] text-[11px] uppercase tracking-wider">Direct Candidate Action Shortcuts:</h5>
                      <div className="grid grid-cols-1 gap-2 font-sans">
                        <button
                          onClick={() => handleAction('closing_today')}
                          className="p-3 bg-white hover:bg-[#fff5f5] border-2 border-[#991b1b] text-left flex items-center justify-between group transition-all"
                        >
                          <div>
                            <span className="font-extrabold text-[#991b1b] block text-xs">🚨 Inspect Notices Expiring Today</span>
                            <span className="text-[11px] font-serif italic text-[#383e5c]">Complete applications before midnight server cutoffs</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#991b1b] group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => handleAction('bca_freshers')}
                          className="p-3 bg-white hover:bg-[#fbf9f5] border-2 border-[#1c1f33] text-left flex items-center justify-between group transition-all"
                        >
                          <div>
                            <span className="font-extrabold text-[#065f46] block text-xs">🎓 BCA Graduate Entry (0 Exp)</span>
                            <span className="text-[11px] font-serif italic text-[#383e5c]">Technical Assistant, IMD Scientific Assistant, State IT</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#1c1f33] group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => handleAction('mca_officer')}
                          className="p-3 bg-white hover:bg-[#fbf9f5] border-2 border-[#1c1f33] text-left flex items-center justify-between group transition-all"
                        >
                          <div>
                            <span className="font-extrabold text-[#1e3a8a] block text-xs">💼 MCA Gazetted & Officer Cadres</span>
                            <span className="text-[11px] font-serif italic text-[#383e5c]">NIC Scientist 'B', IBPS SO IT, CDAC & Global UN Posts</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#1c1f33] group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTopic === 'bca_path' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-title font-bold text-[#1c1f33]">Government IT Trajectory for BCA Graduates</h4>
                    <p className="text-xs text-[#383e5c]">
                      As a BCA graduate, you hold qualifications for <strong>Group 'B' and Group 'C' technical cadres</strong> across Central ministries, Defense research laboratories, and State IT corporations.
                    </p>
                    
                    <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1.5 font-sans">
                      <div className="font-bold text-[#065f46] uppercase text-xs">Primary BCA Recruitment Cadres:</div>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#1c1f33]">
                        <li><strong>NIC Scientific/Technical Assistant 'A':</strong> Level 6 (₹35,400+ basic)</li>
                        <li><strong>ISRO Technical Assistant (Computers):</strong> Level 7 (Ground telemetry operations)</li>
                        <li><strong>DRDO CEPTAM STA-B:</strong> Pure computer science merit selection</li>
                        <li><strong>SSC IMD Scientific Assistant:</strong> Meteorological high-compute systems</li>
                        <li><strong>State IT Missions (MahaIT, ELCOT, KSITM):</strong> Software and web developer posts</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleAction('bca_freshers')}
                      className="gazette-btn-ink w-full py-2 text-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>Filter Gazette for BCA Dispatches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {activeTopic === 'mca_path' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-title font-bold text-[#1c1f33]">Government IT Trajectory for MCA Graduates</h4>
                    <p className="text-xs text-[#383e5c]">
                      MCA is legally recognized as a post-graduate technical qualification on par with B.Tech/M.Sc (Computer Science). You qualify for <strong>Group 'A' Gazetted Officer</strong> designations and senior public sector scales.
                    </p>

                    <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] space-y-1.5 font-sans">
                      <div className="font-bold text-[#1e3a8a] uppercase text-xs">Primary MCA Officer Cadres:</div>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#1c1f33]">
                        <li><strong>NIC Scientist 'B' (MeitY):</strong> Level 10 (₹56,100 - ₹1,77,500 Gazetted Officer)</li>
                        <li><strong>IBPS Specialist Officer IT (Scale I):</strong> Core Banking database administrator</li>
                        <li><strong>C-DAC Project Engineer:</strong> High Performance Computing & Machine Learning</li>
                        <li><strong>Global UN Bodies (UN Secretariat, WHO, UNDP):</strong> P-2 / P-3 IT Officer cadres</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleAction('mca_officer')}
                      className="gazette-btn-ink w-full py-2 text-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>Filter Gazette for MCA Dispatches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {activeTopic === 'how_to_apply' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-title font-bold text-[#1c1f33]">Official Direct Application Mechanics</h4>
                    <ol className="space-y-2 list-decimal pl-4 text-xs">
                      <li>
                        <strong>Engage "Direct Apply":</strong> Transports you directly to the official ministry/agency registration portal (e.g. NIC, ISRO, IBPS) with zero intermediary hops.
                      </li>
                      <li>
                        <strong>Document Compliance:</strong> Ensure your passport photo and signature strictly fit the 20–50 KB limit using our <em>GovDoc Studio</em> tool in Section 4.
                      </li>
                      <li>
                        <strong>One Time Registration (OTR):</strong> Create your verified identity on bodies requiring OTR (SSC, UPSC, State PSCs) with Aadhaar and educational certificates.
                      </li>
                      <li>
                        <strong>Log Registration Number:</strong> Mark the job as "Applied" in Section 2 (Application Logbook) and enter your Roll/Registration number for instant retrieval.
                      </li>
                    </ol>

                    <button
                      onClick={() => handleAction('open_tracker')}
                      className="gazette-btn-ink w-full py-2 text-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>Open Application Logbook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {activeTopic === 'deadlines' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-title font-bold text-[#1c1f33]">Deadline Enforcement & Elimination of Expired Records</h4>
                    <p className="text-xs text-[#383e5c]">
                      To respect candidate time, <strong>The Employment Gazette automatically purges any posting whose closing date was yesterday or earlier</strong>.
                    </p>
                    <div className="p-3 bg-[#fff5f5] border-2 border-[#991b1b] space-y-1 text-xs">
                      <div className="text-[#991b1b] font-bold font-sans uppercase">
                        🚨 CLOSING TODAY NOTICE
                      </div>
                      <p className="text-[#383e5c] italic">
                        Denotes that registration portals lock at midnight (23:59 hrs) tonight. Submit your fee and application immediately.
                      </p>
                    </div>

                    <button
                      onClick={() => handleAction('closing_today')}
                      className="gazette-btn-ink w-full py-2 text-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>View Urgent Postings Closing Today</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {activeTopic === 'ai_tool' && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-title font-bold text-[#1c1f33]">Automated Resume & Gazette Notification Audit</h4>
                    <p className="text-xs text-[#383e5c]">
                      Avoid reading 50-page complex PDF notifications manually. The AI Matcher audits your resume against recruitment terms:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-[#383e5c]">
                      <li>Upload your <strong>Resume PDF</strong> in Section 3.</li>
                      <li>Verifies BCA vs MCA technical eligibility and 10+2 Mathematics requirements.</li>
                      <li>Calculates syllabus alignment across Operating Systems, DBMS, Networking, and Programming.</li>
                    </ul>

                    <button
                      onClick={() => handleAction('open_matcher')}
                      className="gazette-btn-ink w-full py-2 text-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>Launch AI Resume Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-[#fbf9f5] border-t-2 border-[#1c1f33] flex items-center justify-between text-xs font-sans">
              <span className="flex items-center space-x-1.5 text-[#065f46] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Direct Official Sources</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="gazette-btn-ink px-4 py-1.5 text-xs"
              >
                Dismiss Handbook
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
