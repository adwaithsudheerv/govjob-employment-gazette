import React from 'react';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Clock, 
  Bookmark, 
  Flame,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function FilterBar({ filters, setFilters, totalResults }) {
  const scopes = [
    { id: 'ALL', label: 'All Gazette Notices' },
    { id: 'NATIONAL_CENTRAL', label: 'Central PSUs / Ministries' },
    { id: 'DEFENSE_RESEARCH', label: 'Defense & ISRO' },
    { id: 'BANKING_FINANCE', label: 'Banking IT Officers' },
    { id: 'STATE_GOVT', label: 'State IT Depts' },
    { id: 'INTERNATIONAL_GLOBAL', label: 'Global / UN Bodies' },
  ];

  const qualifications = [
    { id: '', label: 'All Qualifications' },
    { id: 'BCA', label: 'BCA Eligible' },
    { id: 'MCA', label: 'MCA Eligible' },
  ];

  const hasActiveFilters = filters.q || filters.scope !== 'ALL' || filters.qualification || filters.freshers_only || filters.closing_today_only || filters.urgent_only || filters.saved_only || filters.applied_only;

  const resetFilters = () => {
    setFilters({
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
  };

  return (
    <div className="mb-6 bg-white border-2 border-[#1c1f33] p-4 shadow-[4px_4px_0px_0px_#1c1f33] space-y-4">
      
      {/* Top Search Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Field */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1c1f33]" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
            placeholder="Search by Post, Ministry (NIC, ISRO, BEL), Skills (Python, SQL), or State..."
            className="w-full bg-[#fbf9f5] border-1.5 border-[#1c1f33] pl-10 pr-10 py-2 text-xs sm:text-sm font-serif placeholder:font-serif placeholder:italic text-[#1c1f33] placeholder-[#686f8a] focus:outline-none focus:ring-1 focus:ring-[#1c1f33] transition-all"
            style={{ border: '1.5px solid #1c1f33' }}
          />
          {filters.q && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, q: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-[#1c1f33] hover:text-white text-[#1c1f33]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Degree Selector & Sort Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Degree Filter Group */}
          <div className="flex border-1.5 border-[#1c1f33] text-xs font-sans font-bold" style={{ border: '1.5px solid #1c1f33' }}>
            {qualifications.map(q => (
              <button
                key={q.id}
                onClick={() => setFilters(prev => ({ ...prev, qualification: q.id }))}
                className={`px-3 py-1.5 uppercase transition-all ${
                  filters.qualification === q.id
                    ? 'bg-[#1c1f33] text-white'
                    : 'bg-white text-[#1c1f33] hover:bg-[#f2eee3]'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sort_by}
            onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value }))}
            className="bg-white px-3 py-1.5 text-xs font-sans font-bold uppercase text-[#1c1f33] focus:outline-none cursor-pointer"
            style={{ border: '1.5px solid #1c1f33' }}
          >
            <option value="newest">Latest Issue Date</option>
            <option value="deadline">Expiring Soonest</option>
            <option value="title">Alphabetical Order</option>
          </select>
        </div>

      </div>

      {/* Scope Classification Chips (Newspaper Index tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1c1f33]/20">
        <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#686f8a] mr-1">
          Sector Index:
        </span>
        {scopes.map(s => (
          <button
            key={s.id}
            onClick={() => setFilters(prev => ({ ...prev, scope: s.id }))}
            className={`px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider transition-all border ${
              filters.scope === s.id
                ? 'bg-[#1c1f33] text-white border-[#1c1f33]'
                : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33] hover:bg-[#f9f7f1]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Quick Filter Stamp Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1c1f33]/20 text-xs font-sans">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Closing Today Stamp Toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, closing_today_only: !prev.closing_today_only }))}
            className={`px-2.5 py-1 text-[11px] font-sans font-black uppercase tracking-wider transition-all flex items-center space-x-1 border ${
              filters.closing_today_only
                ? 'bg-[#991b1b] text-white border-[#991b1b] shadow-[2px_2px_0px_0px_#991b1b]'
                : 'bg-white text-[#991b1b] border-[#991b1b] hover:bg-[#fff5f5]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Closing Today (Midnight)</span>
          </button>

          {/* Freshers Only Toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, freshers_only: !prev.freshers_only }))}
            className={`px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center space-x-1 border ${
              filters.freshers_only
                ? 'bg-[#065f46] text-white border-[#065f46] shadow-[2px_2px_0px_0px_#065f46]'
                : 'bg-white text-[#065f46] border-[#065f46] hover:bg-[#f0fdf4]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>0 Exp Freshers Only</span>
          </button>

          {/* Saved Only Toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, saved_only: !prev.saved_only }))}
            className={`px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider transition-all flex items-center space-x-1 border ${
              filters.saved_only
                ? 'bg-[#1c1f33] text-white border-[#1c1f33]'
                : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33]'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Saved ({filters.saved_only ? 'Active' : 'Show'})</span>
          </button>

        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-serif italic text-[#383e5c]">
            Showing <strong>{totalResults}</strong> published notices
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[11px] font-sans font-bold uppercase underline text-[#991b1b] hover:text-[#1c1f33] flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
