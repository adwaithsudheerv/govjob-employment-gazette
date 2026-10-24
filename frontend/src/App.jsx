import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import JobModal from './components/JobModal';
import EligibilityCheckerModal from './components/EligibilityCheckerModal';
import ApplicationTracker from './components/ApplicationTracker';
import SyncControlModal from './components/SyncControlModal';
import SettingsModal from './components/SettingsModal';
import BeginnerAssistant from './components/BeginnerAssistant';
import GovDocStudio from './components/GovDocStudio';
import StatePSCDirectory from './components/StatePSCDirectory';
import IndiaJobsMap from './components/IndiaJobsMap';
import ClauseTrapDetector from './components/ClauseTrapDetector';
import { 
  fetchJobs, 
  fetchStats, 
  fetchApplications, 
  updateApplicationStatus, 
  removeApplicationStatus, 
  triggerSync 
} from './api/client';
import { 
  Sparkles, 
  Building2, 
  Globe, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'tracker' | 'matcher'
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);

  // Modals
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedJobForAI, setSelectedJobForAI] = useState(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    q: '',
    scope: 'ALL',
    qualification: '',
    freshers_only: false,
    closing_today_only: false,
    urgent_only: false,
    saved_only: false,
    applied_only: false,
    sort_by: 'newest',
  });

  const loadData = useCallback(async () => {
    try {
      const [jobsData, statsData, appsData] = await Promise.all([
        fetchJobs(filters),
        fetchStats(),
        fetchApplications()
      ]);
      setJobs(jobsData);
      setStats(statsData);
      setApplications(appsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Application Tracker Status Update (Saved, Applied, etc.)
  const handleUpdateStatus = async (jobId, newStatus, additionalData = {}) => {
    try {
      if (!newStatus) {
        await removeApplicationStatus(jobId);
      } else {
        await updateApplicationStatus(jobId, {
          status: newStatus,
          ...additionalData
        });
      }
      // Refresh jobs & applications & stats
      const [jobsData, statsData, appsData] = await Promise.all([
        fetchJobs(filters),
        fetchStats(),
        fetchApplications()
      ]);
      setJobs(jobsData);
      setStats(statsData);
      setApplications(appsData);
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  // Live Sync Trigger
  const handleSyncTrigger = async () => {
    setIsSyncing(true);
    try {
      await triggerSync();
      setTimeout(async () => {
        await loadData();
        setIsSyncing(false);
      }, 3500);
    } catch (e) {
      console.error('Sync failed:', e);
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1c1f33] flex flex-col font-serif selection:bg-[#1c1f33] selection:text-[#fbf9f5]">
      
      {/* Top Gazette Masthead & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSyncTrigger={handleSyncTrigger}
        isSyncing={isSyncing}
        stats={stats}
        jobs={jobs}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenSyncLogs={() => setIsSyncModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* TAB 1: JOB FEED */}
        {activeTab === 'feed' && (
          <div>
            
            {/* Beginner Quick Callout Banner: Official Gazette Memorandum */}
            {!dismissBanner && (
              <div className="mb-6 p-4 bg-white border-2 border-[#1c1f33] shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 border-1.5 border-[#1c1f33] bg-[#fbf9f5] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
                    <HelpCircle className="w-5 h-5 text-[#065f46]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-extrabold uppercase tracking-wide text-[#1c1f33] flex items-center space-x-2">
                      <span>Official Advisory for BCA & MCA Aspirants</span>
                      <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                        Candidate Guide
                      </span>
                    </h4>
                    <p className="text-xs font-serif italic text-[#383e5c] mt-0.5">
                      First time applying to public sector IT examinations? Learn direct portal mechanics, document attestation, and eligibility verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsAssistantOpen(true)}
                    className="gazette-btn-ink px-4 py-2 text-xs flex items-center space-x-1.5"
                  >
                    <span>Open Handbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDismissBanner(true)}
                    className="px-2.5 py-2 text-xs font-sans font-bold uppercase text-[#686f8a] hover:text-[#1c1f33] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Top Stats Overview Ribbon */}
            <StatsOverview
              stats={stats}
              onSelectFilter={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
            />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              totalResults={jobs.length}
            />

            {/* Jobs Grid or Empty State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="gazette-card p-6 h-64 animate-pulse bg-white border border-[#1c1f33]/30" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-[#1c1f33] shadow-[4px_4px_0px_0px_#1c1f33] p-8 space-y-4">
                <AlertCircle className="w-12 h-12 text-[#991b1b] mx-auto" />
                <h3 className="text-xl font-title font-bold text-[#1c1f33]">No Gazette Postings Match Your Search Criteria</h3>
                <p className="text-xs font-serif italic text-[#686f8a] max-w-md mx-auto">
                  Try broadening your keyword query or resetting sector filters to inspect all active BCA and MCA recruitments published in this edition.
                </p>
                <button
                  onClick={() => setFilters({
                    q: '',
                    scope: 'ALL',
                    qualification: '',
                    freshers_only: false,
                    closing_today_only: false,
                    urgent_only: false,
                    saved_only: false,
                    applied_only: false,
                    sort_by: 'newest',
                  })}
                  className="gazette-btn-ink px-4 py-2 text-xs uppercase"
                >
                  Reset All Criteria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelectJob={(j) => setSelectedJobForModal(j)}
                    onEvaluateAI={(j) => setSelectedJobForAI(j)}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onSelectJob={(j) => setSelectedJobForModal(j)}
          />
        )}

        {/* TAB 3: GOVDOC STUDIO (PHOTO & SIGNATURE RESIZER) */}
        {activeTab === 'govdoc' && (
          <GovDocStudio />
        )}

        {/* TAB 4: STATE PSC DIRECTORY */}
        {activeTab === 'state-psc' && (
          <StatePSCDirectory
            onSelectStateFilter={(stateName) => {
              setFilters(prev => ({ ...prev, scope: 'STATE_GOVT', q: stateName }));
              setActiveTab('feed');
            }}
          />
        )}

        {/* TAB 5: GRAPHICAL INTERACTIVE MAP OF INDIA IT OPENINGS */}
        {activeTab === 'india-map' && (
          <IndiaJobsMap
            jobs={jobs}
            onSelectRegionFilter={(stateName) => {
              setFilters(prev => ({ ...prev, q: stateName }));
              setActiveTab('feed');
            }}
          />
        )}

        {/* TAB 6: OFFICIAL CLAUSE & TRAP DETECTOR */}
        {activeTab === 'trap-detector' && (
          <ClauseTrapDetector />
        )}

      </main>

      {/* Floating Beginner Assistant Component */}
      <BeginnerAssistant
        onApplyFilter={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />

      {/* Modals */}
      {selectedJobForModal && (
        <JobModal
          job={selectedJobForModal}
          onClose={() => setSelectedJobForModal(null)}
          onEvaluateAI={(j) => {
            setSelectedJobForModal(null);
            setSelectedJobForAI(j);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {selectedJobForAI && (
        <EligibilityCheckerModal
          job={selectedJobForAI}
          allJobs={jobs}
          onClose={() => setSelectedJobForAI(null)}
          onSelectJob={(j) => setSelectedJobForModal(j)}
        />
      )}

      {isSyncModalOpen && (
        <SyncControlModal
          onClose={() => setIsSyncModalOpen(false)}
          onSyncComplete={loadData}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          onClose={() => setIsSettingsModalOpen(false)}
          onSaveComplete={() => loadData()}
        />
      )}

      {/* Broadsheet Gazette Colophon & Footer */}
      <footer className="mt-auto border-t-2 border-[#1c1f33] bg-[#fbf9f5] py-6 text-xs text-[#1c1f33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#065f46]" />
            <span className="font-serif italic text-[#383e5c]">
              The Employment Gazette • 100% Direct Official Application Portals • Zero Commercial Coaching Ads
            </span>
          </div>
          <div className="flex items-center space-x-4 font-sans font-bold uppercase text-[10px] tracking-wider text-[#686f8a]">
            <span className="text-[#065f46] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#065f46]"></span>
              <span>12h Auto-Prune Engine Active</span>
            </span>
            <span>•</span>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="hover:text-[#1c1f33] hover:underline transition-colors"
            >
              Inspection Logs
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
