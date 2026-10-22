import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  ExternalLink, 
  Building2, 
  Calendar, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  FileText,
  Download,
  MapPin
} from 'lucide-react';
import { getApplicationsCsvUrl } from '../api/client';

export default function ApplicationTracker({ 
  applications, 
  onUpdateStatus, 
  onSelectJob 
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredApps = filterStatus === 'ALL'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const stages = [
    { id: 'APPLIED', label: '1. Applied' },
    { id: 'ADMIT_CARD_OUT', label: '2. Admit Card' },
    { id: 'CBT_SCHEDULED', label: '3. CBT Exam' },
    { id: 'ANSWER_KEY', label: '4. Answer Key' },
    { id: 'DV_STAGE', label: '5. DV / Merit' }
  ];

  const handleStartEdit = (item) => {
    setEditingId(item.application_id);
    setEditForm({
      status: item.status,
      recruitment_stage: item.recruitment_stage || 'APPLIED',
      application_no: item.application_no || '',
      roll_number: item.roll_number || '',
      exam_city: item.exam_city || '',
      notes: item.notes || ''
    });
  };

  const handleSaveEdit = (jobId) => {
    onUpdateStatus(jobId, editForm.status, editForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Tracker Header Gazette Box */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33]">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <BookmarkCheck className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Recruitment Lifecycle & Application Logbook
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Track exam stages: Online Registration ➔ Admit Card ➔ CBT Test ➔ Answer Key ➔ Document Verification.
            </p>
          </div>
        </div>

        {/* Filter Pills & Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center border border-[#1c1f33] text-xs font-sans font-bold">
            {['ALL', 'SAVED', 'APPLIED', 'SHORTLISTED', 'INTERVIEW'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 uppercase transition-all ${
                  filterStatus === st
                    ? 'bg-[#1c1f33] text-white'
                    : 'bg-white text-[#1c1f33] hover:bg-[#f2eee3]'
                }`}
              >
                {st === 'ALL' ? 'All Logged' : st}
              </button>
            ))}
          </div>

          <a
            href={getApplicationsCsvUrl()}
            download
            className="gazette-btn-ink px-3.5 py-1.5 text-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* List of Applications */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-[#1c1f33] shadow-[4px_4px_0px_0px_#1c1f33] p-8 space-y-3">
          <BookmarkCheck className="w-12 h-12 text-[#686f8a] mx-auto" />
          <h3 className="text-lg font-title font-bold text-[#1c1f33]">No Applications Recorded in Logbook</h3>
          <p className="text-xs font-serif italic text-[#686f8a] max-w-md mx-auto">
            Browse the Gazette Dispatches in Section 1 and click "Direct Apply" or the Bookmark pin to log your examination milestones here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((item) => {
            const job = item.job;
            const isEditing = editingId === item.application_id;
            const currentStage = item.recruitment_stage || 'APPLIED';
            const lastDate = job.last_date ? new Date(job.last_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Check Notice';

            return (
              <div 
                key={item.application_id}
                className="bg-white border-2 border-[#1c1f33] p-5 shadow-[3px_3px_0px_0px_#1c1f33] space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="cursor-pointer flex-1" onClick={() => onSelectJob(job)}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                        {item.status}
                      </span>
                      <span className="text-[11px] font-sans font-bold text-[#686f8a] uppercase">
                        Sector: {job.scope.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-title font-bold text-[#1c1f33] hover:underline">
                      {job.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-serif italic text-[#383e5c] mt-1">
                      <span className="font-sans font-bold text-[#1c1f33] not-italic flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{job.organization}</span>
                      </span>
                      <span>•</span>
                      <span className="font-sans font-semibold text-[#065f46] not-italic">{job.salary_scale}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 font-sans not-italic text-[#991b1b]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Deadline: {lastDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gazette-btn-ink px-3 py-1.5 text-xs flex items-center space-x-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => isEditing ? handleSaveEdit(job.id) : handleStartEdit(item)}
                      className="gazette-btn-outline px-3 py-1.5 text-xs font-sans font-bold uppercase"
                    >
                      {isEditing ? 'Save Changes' : 'Edit Exam Record'}
                    </button>

                    <button
                      onClick={() => onUpdateStatus(job.id, null)}
                      title="Remove from logbook"
                      className="p-1.5 border border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b] hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Recruitment Lifecycle Progression Stepper */}
                <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33]">
                  <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#1c1f33] block mb-2">
                    Recruitment Examination Milestones:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {stages.map((st, idx) => {
                      const isReached = stages.findIndex(s => s.id === currentStage) >= idx;
                      const isCurrent = currentStage === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => onUpdateStatus(job.id, item.status, { recruitment_stage: st.id })}
                          className={`p-1.5 text-center text-xs font-sans font-bold uppercase border transition-all ${
                            isCurrent
                              ? 'bg-[#1c1f33] text-white border-[#1c1f33]'
                              : isReached
                              ? 'bg-[#ecfdf5] text-[#065f46] border-[#065f46]'
                              : 'bg-white text-[#686f8a] border-[#1c1f33]/30 hover:border-[#1c1f33]'
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Editable / Displayed Registration & Exam Info */}
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-[#fbf9f5] border border-[#1c1f33] text-xs font-sans">
                    <div>
                      <label className="text-[10px] font-bold text-[#1c1f33] uppercase block mb-1">Application / Reg No.</label>
                      <input
                        type="text"
                        value={editForm.application_no}
                        onChange={(e) => setEditForm({ ...editForm, application_no: e.target.value })}
                        placeholder="e.g. NIC-98124"
                        className="w-full bg-white border border-[#1c1f33] px-2.5 py-1 text-xs text-[#1c1f33] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1c1f33] uppercase block mb-1">Admit Card Roll No.</label>
                      <input
                        type="text"
                        value={editForm.roll_number}
                        onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })}
                        placeholder="e.g. 2401892"
                        className="w-full bg-white border border-[#1c1f33] px-2.5 py-1 text-xs text-[#1c1f33] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1c1f33] uppercase block mb-1">Exam Center City</label>
                      <input
                        type="text"
                        value={editForm.exam_city}
                        onChange={(e) => setEditForm({ ...editForm, exam_city: e.target.value })}
                        placeholder="e.g. New Delhi"
                        className="w-full bg-white border border-[#1c1f33] px-2.5 py-1 text-xs text-[#1c1f33] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#1c1f33] uppercase block mb-1">Personal Notes</label>
                      <input
                        type="text"
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="e.g. Revise OS & SQL Normalization"
                        className="w-full bg-white border border-[#1c1f33] px-2.5 py-1 text-xs text-[#1c1f33] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  (item.application_no || item.roll_number || item.exam_city || item.notes) && (
                    <div className="p-2.5 bg-[#fbf9f5] border border-[#1c1f33]/30 text-xs font-sans flex flex-wrap gap-4 text-[#1c1f33]">
                      {item.application_no && (
                        <div>
                          <span className="font-bold text-[#686f8a] uppercase text-[10px]">Reg No: </span>
                          <span className="font-mono font-bold text-[#1c1f33]">{item.application_no}</span>
                        </div>
                      )}
                      {item.roll_number && (
                        <div>
                          <span className="font-bold text-[#686f8a] uppercase text-[10px]">Roll No: </span>
                          <span className="font-mono font-bold text-[#1e3a8a]">{item.roll_number}</span>
                        </div>
                      )}
                      {item.exam_city && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#686f8a]" />
                          <span>{item.exam_city}</span>
                        </div>
                      )}
                      {item.notes && (
                        <div>
                          <span className="font-bold text-[#686f8a] uppercase text-[10px]">Notes: </span>
                          <span className="font-serif italic">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  )
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
