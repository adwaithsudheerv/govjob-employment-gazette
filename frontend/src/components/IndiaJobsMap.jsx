import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  ExternalLink, 
  Filter, 
  Layers, 
  ShieldCheck, 
  Compass,
  ArrowRight
} from 'lucide-react';

export default function IndiaJobsMap({ jobs, onSelectRegionFilter }) {
  const [selectedRegionId, setSelectedRegionId] = useState('central');

  const regions = [
    {
      id: 'central',
      name: 'All-India Central & PSUs',
      color: '#1c1f33',
      badge: 'National Mandate',
      states: 'Delhi, Bengaluru, Hyderabad, Pune, Kolkata, Mumbai',
      keyAgencies: 'NIC, ISRO, DRDO, BEL, C-DAC, IBPS SO IT',
      languageRule: 'English & Hindi (Zero state language restrictions)',
      postingsEstimate: jobs.filter(j => j.scope === 'NATIONAL_CENTRAL' || j.scope === 'DEFENSE_RESEARCH').length || 14,
      avgCtc: '₹56,100 – ₹1,77,500 (Level 10 Gazetted)'
    },
    {
      id: 'kerala',
      name: 'Kerala State IT Mission & KPSC',
      color: '#065f46',
      badge: 'Southern Hub',
      states: 'Thiruvananthapuram, Kochi, Kozhikode',
      keyAgencies: 'Kerala State IT Mission (KSITM), KPSC, KSEB IT, C-DIT',
      languageRule: 'Malayalam knowledge is relaxed for Specialized Computer Science posts',
      postingsEstimate: jobs.filter(j => j.state === 'Kerala').length || 4,
      avgCtc: '₹35,600 – ₹89,000 (State Scale)'
    },
    {
      id: 'karnataka',
      name: 'Karnataka e-Governance & KEONICS',
      color: '#1e3a8a',
      badge: 'Silicon Capital',
      states: 'Bengaluru, Mysuru, Hubballi',
      keyAgencies: 'Centre for e-Governance, KEONICS, State Data Centre, KPSC',
      languageRule: 'Kannada language test required within 2 years of probation if not studied in Class 10',
      postingsEstimate: jobs.filter(j => j.state === 'Karnataka').length || 5,
      avgCtc: '₹43,100 – ₹1,10,000 (Level 7+)'
    },
    {
      id: 'tamilnadu',
      name: 'Tamil Nadu ELCOT & TNeGA',
      color: '#92400e',
      badge: 'Hardware & SaaS Corridor',
      states: 'Chennai, Coimbatore, Madurai',
      keyAgencies: 'ELCOT, TNeGA, TNPSC, Anna University IT Cells',
      languageRule: 'Tamil eligibility examination or exemption under technical cadres',
      postingsEstimate: jobs.filter(j => j.state === 'Tamil Nadu').length || 3,
      avgCtc: '₹36,700 – ₹1,16,200 (Level 6/7)'
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra MahaIT & MPSC',
      color: '#b45309',
      badge: 'Financial Capital',
      states: 'Mumbai, Pune, Nagpur',
      keyAgencies: 'MahaIT, MPSC, State Police Computer Wing, CIDCO IT',
      languageRule: 'Class 10 Marathi certificate or departmental verification during probation',
      postingsEstimate: jobs.filter(j => j.state === 'Maharashtra').length || 3,
      avgCtc: '₹41,800 – ₹1,32,300 (State S-15/S-20)'
    },
    {
      id: 'delhi_ut',
      name: 'National Capital Territory (DSSSB & NIC HQ)',
      color: '#6b21a8',
      badge: 'Ministry Headquarters',
      states: 'New Delhi, NCR',
      keyAgencies: 'DSSSB, NIC Head Office, Delhi State High Court, MeitY',
      languageRule: '100% Open All-India Merit (No regional domicile quotas)',
      postingsEstimate: jobs.filter(j => j.state === 'Delhi' || j.location?.includes('Delhi')).length || 6,
      avgCtc: '₹44,900 – ₹1,42,400 (Central Level 7/8)'
    }
  ];

  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <Compass className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Section 9: Pan-India Public Sector IT Map & Regional Clusters
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Explore government IT vacancies by geographic territory, state language compliance rules, and regional agency headquarters.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-[#065f46] bg-[#ecfdf5] px-3 py-1.5 border border-[#065f46] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Regional Domicile Guide</span>
        </div>
      </div>

      {/* Interactive Map & Regional Index Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Regional Selectors */}
        <div className="space-y-3">
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#686f8a] block mb-2 border-b border-[#1c1f33]/20 pb-1">
            Select State or National Territory:
          </span>

          <div className="space-y-2">
            {regions.map(reg => {
              const isSelected = selectedRegionId === reg.id;
              return (
                <div
                  key={reg.id}
                  onClick={() => setSelectedRegionId(reg.id)}
                  className={`p-3.5 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[3px_3px_0px_0px_#1c1f33]'
                      : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33] hover:bg-[#fbf9f5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-title font-bold leading-tight line-clamp-1">
                      {reg.name}
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      isSelected ? 'border-white text-white' : 'border-[#1c1f33] text-[#1c1f33]'
                    }`}>
                      {reg.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-serif italic">
                    <span className={isSelected ? 'text-slate-300' : 'text-[#686f8a]'}>{reg.states}</span>
                    <span className={`font-bold font-sans not-italic ${isSelected ? 'text-emerald-300' : 'text-[#065f46]'}`}>
                      {reg.postingsEstimate} Notices
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Visual Map & Region Breakdown */}
        <div className="lg:col-span-2 bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col justify-between space-y-5">
          
          <div>
            {/* Region Title Banner */}
            <div className="border-b-2 border-[#1c1f33] pb-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                    {currentRegion.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#686f8a] uppercase">
                    Hub Cities: {currentRegion.states}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33]">
                  {currentRegion.name}
                </h3>
              </div>

              <button
                onClick={() => onSelectRegionFilter(currentRegion.id === 'central' ? 'ALL' : currentRegion.name.split(' ')[0])}
                className="gazette-btn-ink px-4 py-2 text-xs flex items-center space-x-1.5 shrink-0"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Gazette for this Region</span>
              </button>
            </div>

            {/* Stylized Visual India Map Grid */}
            <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] mb-4">
              <span className="text-[10px] font-sans font-extrabold uppercase text-[#686f8a] block mb-2">
                Pan-India Spatial IT Footprint:
              </span>

              {/* Graphical schematic map layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center font-sans text-xs">
                <div className="p-3 bg-white border border-[#1c1f33]">
                  <span className="text-[10px] text-[#686f8a] uppercase block">Northern Zone</span>
                  <span className="font-bold text-[#1c1f33]">Delhi NCR, Chandigarh, UP</span>
                  <span className="text-[10px] text-[#065f46] font-mono block mt-1">High Ministry Density</span>
                </div>
                <div className="p-3 bg-white border border-[#1c1f33]">
                  <span className="text-[10px] text-[#686f8a] uppercase block">Southern Technology Arc</span>
                  <span className="font-bold text-[#1c1f33]">Bengaluru, Kerala, Chennai</span>
                  <span className="text-[10px] text-[#065f46] font-mono block mt-1">ISRO & Space Telemetry</span>
                </div>
                <div className="p-3 bg-white border border-[#1c1f33]">
                  <span className="text-[10px] text-[#686f8a] uppercase block">Western Financial Grid</span>
                  <span className="font-bold text-[#1c1f33]">Mumbai, Pune, Gandhinagar</span>
                  <span className="text-[10px] text-[#065f46] font-mono block mt-1">Banking SO & C-DAC Supercomputing</span>
                </div>
              </div>
            </div>

            {/* Regulatory & Language Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33]">
                <span className="font-sans font-bold uppercase text-[#1c1f33] text-[10px] block mb-1">
                  Primary Government Recruiter Bodies:
                </span>
                <p className="font-serif italic text-[#383e5c] leading-relaxed">
                  {currentRegion.keyAgencies}
                </p>
              </div>

              <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33]">
                <span className="font-sans font-bold uppercase text-[#1c1f33] text-[10px] block mb-1">
                  Official Language Eligibility Clause:
                </span>
                <p className="font-serif italic text-[#383e5c] leading-relaxed">
                  {currentRegion.languageRule}
                </p>
              </div>
            </div>

          </div>

          {/* Average Salary Range */}
          <div className="p-3 bg-[#ecfdf5] border border-[#065f46] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="font-sans font-bold text-[#065f46]">
              Pay Matrix Level: <strong>{currentRegion.avgCtc}</strong>
            </span>
            <span className="font-serif italic text-[#065f46]">
              Central 7th CPC rates applicable with regional HRA index (27% X-Class, 18% Y-Class)
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
