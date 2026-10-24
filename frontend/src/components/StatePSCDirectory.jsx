import React from 'react';
import { 
  Building2, 
  ExternalLink, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function StatePSCDirectory({ onSelectStateFilter }) {
  const states = [
    {
      state: 'Kerala',
      commission: 'Kerala Public Service Commission (KPSC)',
      portalName: 'KPSC Thulasi OTR Portal',
      portalUrl: 'https://thulasi.psc.kerala.gov.in',
      roles: 'Kerala State IT Mission (KSITM), KSEB Programmer, Polytechnic Lecturer CS',
      eligibility: 'BCA & MCA eligible with Kerala SSLC / Malayalam norm exemption for IT cadres',
      code: 'KL'
    },
    {
      state: 'Karnataka',
      commission: 'Karnataka PSC & KEONICS',
      portalName: 'KPSC e-Governance Portal',
      portalUrl: 'https://kpsc.kar.nic.in',
      roles: 'Centre for e-Governance, KEONICS, State Data Centre Programmer',
      eligibility: 'BCA / MCA / B.Sc CS with Kannada language test qualification',
      code: 'KA'
    },
    {
      state: 'Tamil Nadu',
      commission: 'Tamil Nadu PSC & ELCOT',
      portalName: 'TNPSC One Time Registration',
      portalUrl: 'https://www.tnpsc.gov.in',
      roles: 'ELCOT Assistant System Engineer, System Analyst, Dept of IT Services',
      eligibility: 'MCA & BCA recognized under State Technical Cadre Rules',
      code: 'TN'
    },
    {
      state: 'Maharashtra',
      commission: 'Maharashtra PSC & MahaIT',
      portalName: 'MPSC Online & MahaIT Services',
      portalUrl: 'https://mpsconline.gov.in',
      roles: 'MahaIT Software Engineer, Assistant Director IT, State GIS Cadre',
      eligibility: 'BCA & MCA eligible with Marathi language verification at DV',
      code: 'MH'
    },
    {
      state: 'Delhi',
      commission: 'Delhi Subordinate Services (DSSSB)',
      portalName: 'DSSSB OARS Portal',
      portalUrl: 'https://dsssbonline.nic.in',
      roles: 'Assistant Programmer (Level 7), PGT Computer Science, System Analyst',
      eligibility: '100% All-India Open Merit for Central & UT Capital positions',
      code: 'DL'
    },
    {
      state: 'Uttar Pradesh',
      commission: 'Uttar Pradesh PSC & UPPRPB',
      portalName: 'UPPSC e-Pariksha Portal',
      portalUrl: 'https://uppsc.up.nic.in',
      roles: 'Programmer Grade-2, Computer Operator Grade-A, State Data Cells',
      eligibility: 'BCA & MCA with O/A Level equivalence certification',
      code: 'UP'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <Building2 className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              State PSC & Public Sector IT Commissions Directory
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Official One Time Registration (OTR) portals and state-specific IT missions recruiting BCA and MCA graduates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-[#065f46] bg-[#ecfdf5] px-3 py-1.5 border border-[#065f46] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Official OTR Portals</span>
        </div>
      </div>

      {/* State Commission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map((st, idx) => (
          <div 
            key={idx}
            className="gazette-card p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#1c1f33]/20 pb-2 mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="gazette-stamp border-[#1c1f33] text-[#1c1f33] bg-[#fbf9f5]">
                    {st.state}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#686f8a]">
                    STATE CODE: {st.code}
                  </span>
                </div>
                <MapPin className="w-4 h-4 text-[#065f46]" />
              </div>

              <h3 className="text-base font-title font-bold text-[#1c1f33] mb-1">
                {st.commission}
              </h3>

              <div className="text-xs font-serif italic text-[#383e5c] space-y-2 mb-3">
                <p>
                  <strong>IT Cadres:</strong> {st.roles}
                </p>
                <p className="text-[11px] text-[#686f8a]">
                  <strong>Eligibility Norms:</strong> {st.eligibility}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c1f33]/20 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Filter Feed by State */}
                <button
                  onClick={() => onSelectStateFilter(st.state)}
                  className="gazette-btn-outline py-1.5 px-2 text-xs flex items-center justify-center space-x-1"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter Feed</span>
                </button>

                {/* Direct OTR Link */}
                <a
                  href={st.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gazette-btn-ink py-1.5 px-2 text-xs flex items-center justify-center space-x-1"
                >
                  <span>Official OTR</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
