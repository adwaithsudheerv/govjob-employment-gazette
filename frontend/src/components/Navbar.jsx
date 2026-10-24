import React from 'react';
import { 
  Building2, 
  RefreshCw, 
  Sparkles, 
  BookmarkCheck, 
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  HelpCircle,
  Briefcase,
  FileCheck,
  Compass,
  FileText,
  GitBranch,
  Map,
  ShieldAlert,
  Flame,
  Radio
} from 'lucide-react';
import RadioBulletin from './RadioBulletin';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onSyncTrigger, 
  isSyncing, 
  stats,
  jobs = [],
  onOpenSettings,
  onOpenSyncLogs,
  onOpenAssistant
}) {
  return (
    <header className="w-full bg-[#fbf9f5] border-b-2 border-[#1c1f33] pt-3 pb-2 text-[#1c1f33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Gazette Editorial Banner Bar (Classic Newspaper Aside) */}
        <aside className="gazette-aside mb-3 text-[10px] sm:text-xs font-sans font-bold">
          <div className="py-1 px-2 flex justify-between items-center text-[#1c1f33]">
            <div className="hidden sm:block tracking-widest text-left font-serif">
              ★ VOL. IV — NO. 24 ★
            </div>
            <div className="flex-1 text-center font-bold tracking-wider uppercase font-sans">
              THE OFFICIAL PUBLIC SECTOR IT RECRUITMENT DISPATCH • NATIONAL & STATE EDITIONS
            </div>
            <div className="hidden sm:block tracking-widest text-right font-serif">
              NEW DELHI • OCTOBER 24, 2026
            </div>
          </div>
        </aside>

        {/* Grand Masthead Title */}
        <div className="text-center py-2 sm:py-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sc tracking-tight text-[#1c1f33] leading-none uppercase">
            The Employment Gazette
          </h1>
          <div className="flex items-center justify-center space-x-3 my-2 text-xs sm:text-sm font-serif italic text-[#383e5c]">
            <span className="hidden md:inline">━━━━━━━━</span>
            <span>Verified Central, State & Public Sector IT Vacancies for BCA & MCA Graduates</span>
            <span className="hidden md:inline">━━━━━━━━</span>
          </div>
          <p className="text-[10px] sm:text-xs font-sans uppercase font-bold tracking-widest text-[#686f8a]">
            100% Direct Official Links • Real-Time Deadline Audits • Zero Commercial Coaching Ads
          </p>
        </div>

        {/* Double Rule Hairline Divider */}
        <div className="gazette-double-rule my-2.5"></div>

        {/* Broadsheet Section Navigation Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-1 pb-1">
          
          {/* Main Section Navigation Pills */}
          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'feed'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 1.</span>
              <span>Feed</span>
              {stats?.total_active_jobs > 0 && (
                <span className={`ml-1.5 px-1 py-0.2 text-[9px] font-black ${
                  activeTab === 'feed' ? 'bg-white text-[#1c1f33]' : 'bg-[#1c1f33] text-white'
                }`}>
                  {stats.total_active_jobs}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'tracker'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 2.</span>
              <span>Logbook</span>
              {(stats?.saved_count > 0 || stats?.applied_count > 0) && (
                <span className={`ml-1.5 px-1 py-0.2 text-[9px] font-black ${
                  activeTab === 'tracker' ? 'bg-white text-[#1c1f33]' : 'bg-[#1c1f33] text-white'
                }`}>
                  {(stats.saved_count || 0) + (stats.applied_count || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matcher')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'matcher'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 3.</span>
              <span>Resume Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('govdoc')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'govdoc'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 4.</span>
              <span>Photo Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('state-psc')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'state-psc'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 5.</span>
              <span>State PSCs</span>
            </button>

            <button
              onClick={() => setActiveTab('india-map')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'india-map'
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3]'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 6.</span>
              <span>India Map</span>
            </button>

            <button
              onClick={() => setActiveTab('trap-detector')}
              className={`px-2.5 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === 'trap-detector'
                  ? 'bg-[#7a1c1c] text-white border-[#7a1c1c] shadow-[2px_2px_0px_0px_#7a1c1c]'
                  : 'bg-white text-[#7a1c1c] border-[#7a1c1c] hover:bg-rose-50'
              }`}
            >
              <span className="mr-1 font-serif font-normal text-[11px]">§ 7.</span>
              <span>Trap Detector</span>
            </button>

          </nav>

          {/* Auxiliary Broadsheet Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Feature 1: The 60-Second Radio Bulletin Player */}
            <RadioBulletin jobs={jobs} stats={stats} />

            {/* Beginner Handbook Trigger */}
            <button
              onClick={onOpenAssistant}
              className="px-2.5 py-1 text-xs font-sans font-bold uppercase tracking-wider bg-white text-[#1c1f33] border border-[#1c1f33] hover:bg-[#f2eee3] transition-all flex items-center space-x-1 shadow-[2px_2px_0px_0px_#1c1f33]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#065f46]" />
              <span className="hidden sm:inline">Handbook</span>
            </button>

            {/* Sync Feed Button */}
            <button
              onClick={onSyncTrigger}
              disabled={isSyncing}
              title="Force sync live government recruitment feeds"
              className={`px-2.5 py-1 text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 border border-[#1c1f33] ${
                isSyncing
                  ? 'bg-[#f2eee3] text-[#686f8a] cursor-not-allowed'
                  : 'bg-[#1c1f33] text-white hover:bg-white hover:text-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Sync Log button */}
            <button
              onClick={onOpenSyncLogs}
              title="Inspect Raw Feed Ingestion Logs"
              className="p-1 bg-white text-[#1c1f33] border border-[#1c1f33] hover:bg-[#f2eee3] shadow-[2px_2px_0px_0px_#1c1f33]"
            >
              <Clock className="w-3.5 h-3.5" />
            </button>

            {/* Settings Modal */}
            <button
              onClick={onOpenSettings}
              title="Alert Preferences & Telegram Bot"
              className="p-1 bg-white text-[#1c1f33] border border-[#1c1f33] hover:bg-[#f2eee3] shadow-[2px_2px_0px_0px_#1c1f33]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}
