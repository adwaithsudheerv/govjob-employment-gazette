import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Building2, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Filter, 
  ArrowRight, 
  Compass, 
  Briefcase, 
  Globe, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Comprehensive registry of all Indian States and Union Territories with official PSC portals & language rules
export const ALL_INDIAN_STATES = [
  {
    code: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    region: 'South',
    portal: 'Kerala Public Service Commission (KPSC Thulasi)',
    portalUrl: 'https://thulasi.psc.kerala.gov.in',
    portalDomain: 'psc.kerala.gov.in',
    languageRule: 'Malayalam qualification is relaxed for specialized Computer Science & IT posts (e.g. KSITM, KSEB Programmer, C-DIT).',
    domicileRule: 'Open to all Indian citizens; priority for Kerala domicile in certain state departmental quotas.',
    keyBodies: 'Kerala State IT Mission (KSITM), KSEB IT Wing, C-DIT, KPSC',
    svgPos: { x: 260, y: 720, w: 45, h: 65, cx: 275, cy: 750 }
  },
  {
    code: 'KA',
    name: 'Karnataka',
    capital: 'Bengaluru',
    region: 'South',
    portal: 'Karnataka PSC & KEONICS',
    portalUrl: 'https://kpsc.kar.nic.in',
    portalDomain: 'kpsc.kar.nic.in',
    languageRule: 'Kannada language test must be passed within 2 years of probation if not studied in Class 10.',
    domicileRule: 'Article 371(J) reservation applies to Kalyana-Karnataka region vacancies.',
    keyBodies: 'Centre for e-Governance, KEONICS, Karnataka State Data Centre, KPSC',
    svgPos: { x: 250, y: 590, w: 60, h: 90, cx: 280, cy: 635 }
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    region: 'South',
    portal: 'Tamil Nadu Public Service Commission (TNPSC)',
    portalUrl: 'https://www.tnpsc.gov.in',
    portalDomain: 'tnpsc.gov.in',
    languageRule: 'Compulsory Tamil Language Qualification Test or certificate of Tamil in SSLC.',
    domicileRule: 'State reservation benefits apply to residents; open category is all-India eligible.',
    keyBodies: 'ELCOT, Tamil Nadu e-Governance Agency (TNeGA), TNPSC',
    svgPos: { x: 310, y: 680, w: 55, h: 80, cx: 335, cy: 720 }
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    region: 'West',
    portal: 'Maharashtra PSC & MahaIT Corporation',
    portalUrl: 'https://mpsconline.gov.in',
    portalDomain: 'mpsconline.gov.in',
    languageRule: 'Knowledge of Marathi is compulsory (Class 10 Marathi or passing departmental test within probation).',
    domicileRule: 'Domicile of Maharashtra required for state quota reservation.',
    keyBodies: 'MahaIT Corporation, MPSC, State Crime Records Bureau IT Wing, CIDCO',
    svgPos: { x: 220, y: 450, w: 90, h: 85, cx: 265, cy: 490 }
  },
  {
    code: 'DL',
    name: 'Delhi',
    capital: 'New Delhi',
    region: 'North',
    portal: 'Delhi Subordinate Services Selection Board (DSSSB)',
    portalUrl: 'https://dsssbonline.nic.in',
    portalDomain: 'dsssbonline.nic.in',
    languageRule: '100% Open All-India Merit. No state language barriers (Hindi & English official).',
    domicileRule: 'Zero domicile restriction. All BCA & MCA candidates nationwide compete equally.',
    keyBodies: 'DSSSB, NIC National HQ, Delhi High Court IT Cell, MeitY HQ',
    svgPos: { x: 285, y: 260, w: 30, h: 30, cx: 300, cy: 275 }
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    region: 'North',
    portal: 'Uttar Pradesh PSC (UPPSC) & UPPRPB',
    portalUrl: 'https://uppsc.up.nic.in',
    portalDomain: 'uppsc.up.nic.in',
    languageRule: 'Proficiency in Hindi in Devanagari script is mandatory.',
    domicileRule: 'General category vacancies open to all-India; reservation benefits for UP residents.',
    keyBodies: 'UPPSC, UP Police Computer Operator Wing, State Informatics Centre',
    svgPos: { x: 340, y: 280, w: 95, h: 75, cx: 390, cy: 315 }
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    region: 'South',
    portal: 'Andhra Pradesh PSC (APPSC)',
    portalUrl: 'https://psc.ap.gov.in',
    portalDomain: 'psc.ap.gov.in',
    languageRule: 'Telugu language proficiency required for state departmental postings.',
    domicileRule: 'Local / Non-local status determined by presidential order study rules.',
    keyBodies: 'APPSC, Real Time Governance Society (RTGS), AP Technology Services',
    svgPos: { x: 320, y: 580, w: 70, h: 85, cx: 355, cy: 625 }
  },
  {
    code: 'TS',
    name: 'Telangana',
    capital: 'Hyderabad',
    region: 'South',
    portal: 'Telangana Public Service Commission (TGPSC)',
    portalUrl: 'https://tspsc.gov.in',
    portalDomain: 'tspsc.gov.in',
    languageRule: 'Proficiency in Telugu / Urdu or English for specialized technical roles.',
    domicileRule: 'Presidential Order 2018 defines local candidate zones for 95% reservation.',
    keyBodies: 'TGPSC, Telangana IT, Electronics & Communications (ITE&C), T-SAT',
    svgPos: { x: 300, y: 510, w: 60, h: 65, cx: 330, cy: 540 }
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    region: 'West',
    portal: 'Gujarat Public Service Commission (GPSC)',
    portalUrl: 'https://gpsc.gujarat.gov.in',
    portalDomain: 'gpsc.gujarat.gov.in',
    languageRule: 'Adequate knowledge of Gujarati and Hindi is mandated.',
    domicileRule: 'Open to all Indian citizens; domicile certificates apply to state quotas.',
    keyBodies: 'GPSC, Gujarat Informatics Ltd (GIL), SAC/ISRO Ahmedabad Campus',
    svgPos: { x: 160, y: 380, w: 85, h: 75, cx: 200, cy: 420 }
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    capital: 'Jaipur',
    region: 'North',
    portal: 'Rajasthan Public Service Commission (RPSC)',
    portalUrl: 'https://rpsc.rajasthan.gov.in',
    portalDomain: 'rpsc.rajasthan.gov.in',
    languageRule: 'Working knowledge of Hindi written in Devanagari Script and Rajasthani culture.',
    domicileRule: 'Open for all states under Unreserved (UR) category.',
    keyBodies: 'RPSC, DoIT&C Rajasthan (Programmer & Informatics Assistant cadres)',
    svgPos: { x: 200, y: 280, w: 90, h: 90, cx: 245, cy: 325 }
  },
  {
    code: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    region: 'East',
    portal: 'West Bengal Public Service Commission (WBPSC)',
    portalUrl: 'https://psc.wb.gov.in',
    portalDomain: 'psc.wb.gov.in',
    languageRule: 'Ability to read, write and speak in Bengali (exempted for candidates whose mother tongue is Nepali).',
    domicileRule: 'General vacancies open to all; reserved vacancies restricted to WB residents.',
    keyBodies: 'WBPSC, Webel Technology Ltd, State e-Governance Mission Team',
    svgPos: { x: 470, y: 370, w: 55, h: 80, cx: 495, cy: 410 }
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    region: 'Central',
    portal: 'Madhya Pradesh PSC (MPPSC)',
    portalUrl: 'https://mppsc.mp.gov.in',
    portalDomain: 'mppsc.mp.gov.in',
    languageRule: 'Knowledge of Hindi in Devanagari script is compulsory.',
    domicileRule: 'Registration in MP Employment Exchange (Rojgar Portal) is often required.',
    keyBodies: 'MPPSC, MPSeDC (Madhya Pradesh State Electronics Development Corp)',
    svgPos: { x: 260, y: 380, w: 100, h: 75, cx: 310, cy: 415 }
  },
  {
    code: 'BR',
    name: 'Bihar',
    capital: 'Patna',
    region: 'East',
    portal: 'Bihar Public Service Commission (BPSC)',
    portalUrl: 'https://bpsc.bih.nic.in',
    portalDomain: 'bpsc.bih.nic.in',
    languageRule: 'Proficiency in Hindi language.',
    domicileRule: 'BPSC open category is open to candidates from all Indian states.',
    keyBodies: 'BPSC, BELTRON (Bihar State Electronic Development Corporation)',
    svgPos: { x: 420, y: 320, w: 75, h: 60, cx: 455, cy: 350 }
  },
  {
    code: 'OD',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    region: 'East',
    portal: 'Odisha Public Service Commission (OPSC)',
    portalUrl: 'https://opsc.gov.in',
    portalDomain: 'opsc.gov.in',
    languageRule: 'Must be able to read, write and speak Odia and have passed ME School Odia examination.',
    domicileRule: 'Odia language criterion is mandatory for permanent state cadre posts.',
    keyBodies: 'OPSC, Odisha Computer Application Centre (OCAC), OSSSC',
    svgPos: { x: 400, y: 440, w: 75, h: 75, cx: 435, cy: 475 }
  },
  {
    code: 'PB',
    name: 'Punjab',
    capital: 'Chandigarh',
    region: 'North',
    portal: 'Punjab Public Service Commission (PPSC)',
    portalUrl: 'https://ppsc.gov.in',
    portalDomain: 'ppsc.gov.in',
    languageRule: 'Punjabi of Matriculation or its equivalent standard is strictly mandatory.',
    domicileRule: 'Strict enforcement of Matriculation Punjabi pass certificate.',
    keyBodies: 'PPSC, Punjab Information & Communication Technology Corp (Punjab Infotech)',
    svgPos: { x: 240, y: 200, w: 50, h: 50, cx: 265, cy: 225 }
  },
  {
    code: 'HR',
    name: 'Haryana',
    capital: 'Chandigarh',
    region: 'North',
    portal: 'Haryana PSC (HPSC) & HSSC',
    portalUrl: 'https://hpsc.gov.in',
    portalDomain: 'hpsc.gov.in',
    languageRule: 'Hindi or Sanskrit as one of the subjects in Matriculation or Higher Education.',
    domicileRule: 'Socio-economic criteria and reservation reserved for Haryana domicile.',
    keyBodies: 'HPSC, HARTRON (Haryana State Electronics Dev Corp), HSSC',
    svgPos: { x: 270, y: 230, w: 40, h: 45, cx: 290, cy: 250 }
  },
  {
    code: 'AS',
    name: 'Assam',
    capital: 'Dispur',
    region: 'North-East',
    portal: 'Assam Public Service Commission (APSC)',
    portalUrl: 'https://apsc.nic.in',
    portalDomain: 'apsc.nic.in',
    languageRule: 'Candidate must speak Assamese or other official languages of the state fluently.',
    domicileRule: 'Permanent Resident Certificate (PRC) of Assam issued for educational/employment purpose.',
    keyBodies: 'APSC, Assam Electronics Development Corporation (AMTRON)',
    svgPos: { x: 550, y: 310, w: 75, h: 50, cx: 585, cy: 335 }
  },
  {
    code: 'JK',
    name: 'Jammu & Kashmir',
    capital: 'Srinagar / Jammu',
    region: 'North',
    portal: 'J&K Public Service Commission (JKPSC)',
    portalUrl: 'https://jkpsc.nic.in',
    portalDomain: 'jkpsc.nic.in',
    languageRule: 'Proficiency in Urdu / English / Hindi.',
    domicileRule: 'Domicile Certificate of UT of Jammu & Kashmir mandatory for all civil posts.',
    keyBodies: 'JKPSC, JKSSB, J&K e-Governance Agency (JaKeGA)',
    svgPos: { x: 240, y: 110, w: 70, h: 65, cx: 275, cy: 140 }
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    capital: 'Shimla',
    region: 'North',
    portal: 'Himachal Pradesh PSC (HPPSC)',
    portalUrl: 'https://hppsc.hp.gov.in',
    portalDomain: 'hppsc.hp.gov.in',
    languageRule: 'Knowledge of customs, manners and dialects of Himachal Pradesh.',
    domicileRule: 'Class 10 and 12 passed from schools situated in HP or Bonafide Himachali.',
    keyBodies: 'HPPSC, HP State Electronics Development Corp (HPSEDC)',
    svgPos: { x: 280, y: 175, w: 50, h: 45, cx: 305, cy: 195 }
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    capital: 'Dehradun',
    region: 'North',
    portal: 'Uttarakhand Public Service Commission (UKPSC)',
    portalUrl: 'https://psc.uk.gov.in',
    portalDomain: 'psc.uk.gov.in',
    languageRule: 'Proficiency in Hindi in Devanagari script.',
    domicileRule: 'Employment exchange registration in Uttarakhand or Class 10/12 from Uttarakhand.',
    keyBodies: 'UKPSC, Uttarakhand Information Technology Development Agency (ITDA)',
    svgPos: { x: 320, y: 215, w: 45, h: 45, cx: 340, cy: 235 }
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    capital: 'Ranchi',
    region: 'East',
    portal: 'Jharkhand Public Service Commission (JPSC)',
    portalUrl: 'https://jpsc.gov.in',
    portalDomain: 'jpsc.gov.in',
    languageRule: 'Knowledge of local customs and languages of Jharkhand.',
    domicileRule: 'Local resident certificates applicable for state reservations.',
    keyBodies: 'JPSC, JAP-IT (Jharkhand Agency for Promotion of IT)',
    svgPos: { x: 420, y: 380, w: 60, h: 55, cx: 450, cy: 405 }
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    capital: 'Raipur',
    region: 'Central',
    portal: 'Chhattisgarh PSC (CGPSC)',
    portalUrl: 'https://psc.cg.gov.in',
    portalDomain: 'psc.cg.gov.in',
    languageRule: 'Hindi and Chhattisgarhi dialect knowledge preferred.',
    domicileRule: 'Domicile of Chhattisgarh mandatory for certain reserved district cadres.',
    keyBodies: 'CGPSC, CHiPS (Chhattisgarh Infotech Promotion Society)',
    svgPos: { x: 340, y: 420, w: 60, h: 80, cx: 370, cy: 460 }
  },
  {
    code: 'GA',
    name: 'Goa',
    capital: 'Panaji',
    region: 'West',
    portal: 'Goa Public Service Commission (GPSC)',
    portalUrl: 'https://gpsc.goa.gov.in',
    portalDomain: 'gpsc.goa.gov.in',
    languageRule: 'Essential knowledge of Konkani; Marathi is desirable.',
    domicileRule: '15 years continuous residence certificate in Goa is mandatory for state government jobs.',
    keyBodies: 'GPSC, Info Tech Corporation of Goa Ltd (ITG)',
    svgPos: { x: 220, y: 560, w: 25, h: 25, cx: 232, cy: 572 }
  },
  {
    code: 'NE_OTHER',
    name: 'North-East States (Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal, Sikkim)',
    capital: 'Regional Capitals',
    region: 'North-East',
    portal: 'North Eastern Regional PSCs',
    portalUrl: 'https://mpsc.nic.in',
    portalDomain: 'mpsc.nic.in',
    languageRule: 'English is official language in several NE states; regional tribal dialect proficiency for local cadres.',
    domicileRule: 'Indigenous inhabitant / ST certificate rules strictly enforced.',
    keyBodies: 'Meghalaya MPSC, Tripura TPSC, Manipur MPSC, Nagaland NPSC',
    svgPos: { x: 570, y: 270, w: 90, h: 100, cx: 615, cy: 320 }
  }
];

export default function IndiaJobsMap({ jobs = [], onSelectRegionFilter }) {
  const [selectedStateCode, setSelectedStateCode] = useState('KL');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Currently selected state object
  const activeState = useMemo(() => {
    return ALL_INDIAN_STATES.find(s => s.code === selectedStateCode) || ALL_INDIAN_STATES[0];
  }, [selectedStateCode]);

  // Filter jobs relevant to the selected state
  const stateJobs = useMemo(() => {
    const sName = activeState.name.toLowerCase();
    return jobs.filter(j => {
      const matchState = j.state && j.state.toLowerCase().includes(sName);
      const matchLoc = j.location && j.location.toLowerCase().includes(sName);
      return matchState || matchLoc;
    });
  }, [jobs, activeState]);

  // Central / Pan-India jobs available to candidates from this state
  const centralOpportunities = useMemo(() => {
    return jobs.filter(j => 
      j.scope === 'NATIONAL_CENTRAL' || 
      j.scope === 'DEFENSE_RESEARCH' || 
      j.scope === 'BANKING_FINANCE' ||
      j.state === 'All India'
    );
  }, [jobs]);

  // Filtered state list for search & selector
  const filteredStates = useMemo(() => {
    return ALL_INDIAN_STATES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = regionFilter === 'ALL' || s.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, regionFilter]);

  return (
    <div className="space-y-6">
      
      {/* BroadSheet Header */}
      <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7a1c1c] mb-2 font-mono">
          <span>Pan-India Spatial Intelligence Desk</span>
          <span>•</span>
          <span>Section 6</span>
          <span>•</span>
          <span>Interactive State Opportunities Map</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1c1f33] mb-2">
          The Official Geographical Map of India IT Openings
        </h2>
        <p className="text-sm font-serif text-[#4a5568] max-w-3xl leading-relaxed">
          Select any of the 28 Indian States or Union Territories below to instantly view all state-specific IT vacancies, direct One-Time Registration (OTR) links, local language eligibility clauses, and Central Government posts accessible to candidates from that state.
        </p>

        {/* Quick Region Selector Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#1c1f33]/20">
          <span className="text-[11px] font-mono font-bold uppercase text-[#1c1f33]">Filter Region:</span>
          {['ALL', 'South', 'North', 'West', 'East', 'Central', 'North-East'].map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-2.5 py-1 text-xs font-mono font-bold uppercase border transition-all ${
                regionFilter === r
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#7a1c1c]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:bg-[#e8e4db]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + State Intelligence & Vacancy Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Graphical Vector India Map & State Matrix (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-4 sm:p-5 shadow-[3px_3px_0px_0px_#1c1f33]">
            <div className="flex items-center justify-between mb-3 border-b border-[#1c1f33]/20 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7a1c1c]" />
                <h3 className="font-serif font-bold text-sm text-[#1c1f33] uppercase tracking-wide">
                  Interactive Spatial Map of India
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#7a1c1c] font-bold">CLICK ANY STATE</span>
            </div>

            {/* Quick State Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#666]" />
              <input
                type="text"
                placeholder="Search state name or code (e.g. Kerala, KL, Maharashtra, UP, Delhi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-serif bg-white border border-[#1c1f33] pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7a1c1c]"
              />
            </div>

            {/* Graphical Map Canvas (India Spatial Projection) */}
            <div className="bg-white border-2 border-[#1c1f33] p-3 relative overflow-hidden flex flex-col items-center">
              <div className="text-[10px] font-mono text-[#666] uppercase mb-1 tracking-wider text-center">
                Select a state region below to inspect active IT vacancies
              </div>

              {/* Graphical Interactive SVG Map */}
              <svg 
                viewBox="120 80 540 730" 
                className="w-full h-auto max-h-[460px] select-none"
                style={{ filter: 'drop-shadow(1px 1px 0px #1c1f33)' }}
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="gazetteGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e4db" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect x="120" y="80" width="540" height="730" fill="url(#gazetteGrid)" />

                {/* State Interactive Geo-Zones */}
                {ALL_INDIAN_STATES.map((state) => {
                  const isSelected = state.code === selectedStateCode;
                  const { x, y, w, h, cx, cy } = state.svgPos;
                  
                  // Count matching jobs for badge
                  const jobCount = jobs.filter(j => 
                    (j.state && j.state.toLowerCase().includes(state.name.toLowerCase())) ||
                    (j.location && j.location.toLowerCase().includes(state.name.toLowerCase()))
                  ).length;

                  return (
                    <g 
                      key={state.code}
                      onClick={() => setSelectedStateCode(state.code)}
                      className="cursor-pointer transition-all duration-150 group"
                    >
                      {/* State Interactive Polygon / Bubble */}
                      <rect
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx="6"
                        ry="6"
                        fill={isSelected ? '#7a1c1c' : '#fcfaf5'}
                        stroke="#1c1f33"
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        className="transition-colors group-hover:fill-[#e8e4db]"
                      />

                      {/* State Abbreviation Code */}
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fontSize={w < 35 ? "10" : "12"}
                        fill={isSelected ? '#fcfaf5' : '#1c1f33'}
                        className="pointer-events-none select-none"
                      >
                        {state.code}
                      </text>

                      {/* Job Count Indicator Dot if jobs exist */}
                      {jobCount > 0 && (
                        <circle
                          cx={x + w - 4}
                          cy={y + 4}
                          r="4"
                          fill={isSelected ? '#f59e0b' : '#7a1c1c'}
                          stroke="#1c1f33"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Compass Rose */}
                <g transform="translate(150, 130)">
                  <circle cx="0" cy="0" r="16" fill="white" stroke="#1c1f33" strokeWidth="1.5" />
                  <path d="M 0 -12 L 4 0 L 0 12 L -4 0 Z" fill="#7a1c1c" />
                  <text x="0" y="-17" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="sans-serif">N</text>
                </g>
              </svg>

              <div className="mt-2 text-[10px] font-mono text-[#666] flex items-center justify-between w-full px-2 border-t border-[#1c1f33]/10 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#7a1c1c] border border-[#1c1f33] inline-block"></span>
                  <span>Selected State</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7a1c1c] inline-block"></span>
                  <span>Active IT Openings</span>
                </span>
              </div>
            </div>

            {/* Quick State Grid Buttons for Mobile & Instant Selection */}
            <div className="mt-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666] block mb-1.5">
                All 28 States & UTs (Alphabetical Roster):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-white border border-[#1c1f33]/30">
                {filteredStates.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => setSelectedStateCode(st.code)}
                    className={`px-2 py-1 text-xs font-serif font-bold transition-all border ${
                      selectedStateCode === st.code
                        ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[1px_1px_0px_0px_#7a1c1c]'
                        : 'bg-[#fcfaf5] text-[#1c1f33] border-[#1c1f33]/30 hover:border-[#1c1f33] hover:bg-[#e8e4db]'
                    }`}
                  >
                    <span>{st.name}</span>
                    <span className="ml-1 text-[10px] font-mono text-[#7a1c1c]">({st.code})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected State Profile & Opportunities List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Active State Profile Card */}
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-5 shadow-[3px_3px_0px_0px_#1c1f33] space-y-4">
            
            {/* Header / State Seal */}
            <div className="flex items-start justify-between border-b-2 border-[#1c1f33] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#1c1f33] text-white">
                    {activeState.region} India Zone
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#7a1c1c]">
                    State Code: {activeState.code}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-[#1c1f33] mt-1">
                  {activeState.name}
                </h3>
                <p className="text-xs font-serif text-[#666]">
                  State Capital: <strong>{activeState.capital}</strong>
                </p>
              </div>

              {/* Direct Portal Link Button */}
              <a
                href={activeState.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7a1c1c] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#1c1f33] transition-colors shadow-[2px_2px_0px_0px_#1c1f33] shrink-0"
              >
                <span>OTR Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Official State PSC Authority Box */}
            <div className="bg-white p-3.5 border border-[#1c1f33] space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-[#7a1c1c] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Public Recruitment Body</span>
              </div>
              <div className="font-serif font-bold text-sm text-[#1c1f33]">
                {activeState.portal}
              </div>
              <div className="text-xs font-mono text-[#555]">
                Official Registry: <span className="text-[#065f46] font-bold">{activeState.portalDomain}</span>
              </div>
              <div className="text-xs font-serif text-[#444] pt-1 border-t border-[#1c1f33]/15">
                Key IT Recruiters: <em>{activeState.keyBodies}</em>
              </div>
            </div>

            {/* Language & Domicile Regulations */}
            <div className="grid grid-cols-1 gap-2.5 text-xs font-serif">
              <div className="p-3 bg-amber-50/80 border border-amber-300 text-amber-950">
                <strong className="block font-mono text-[10px] uppercase tracking-wider text-amber-900 mb-0.5">
                  🗣️ Official State Language Clause:
                </strong>
                {activeState.languageRule}
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300 text-slate-800">
                <strong className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-0.5">
                  🏛️ Domicile & Reservation Norms:
                </strong>
                {activeState.domicileRule}
              </div>
            </div>

            {/* 1-Click Feed Action */}
            <button
              onClick={() => onSelectRegionFilter(activeState.name)}
              className="w-full bg-[#1c1f33] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-widest hover:bg-[#7a1c1c] transition-colors shadow-[2px_2px_0px_0px_#1c1f33] flex items-center justify-center gap-2"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter All Gazette Dispatches for {activeState.name}</span>
            </button>
          </div>

          {/* Active Opportunities Section for this State */}
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-5 shadow-[3px_3px_0px_0px_#1c1f33] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c1f33]/20 pb-2">
              <h4 className="font-serif font-bold text-sm text-[#1c1f33] uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#7a1c1c]" />
                Opportunities in {activeState.name} ({stateJobs.length})
              </h4>
              <span className="text-[10px] font-mono text-[#666]">
                BCA & MCA Cadres
              </span>
            </div>

            {/* State Job Listings */}
            {stateJobs.length > 0 ? (
              <div className="space-y-3">
                {stateJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-3.5 bg-white border border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-serif font-bold text-sm text-[#1c1f33] leading-snug">
                          {job.title}
                        </h5>
                        <p className="text-xs font-serif text-[#666]">
                          {job.organization} • {job.department || activeState.name}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#e8e4db] px-2 py-0.5 border border-[#1c1f33]/30 shrink-0">
                        {job.qualification}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-1 border-t border-[#1c1f33]/15">
                      <span className="font-bold text-emerald-800">
                        {job.salary_scale}
                      </span>
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7a1c1c] font-bold hover:underline flex items-center gap-1"
                      >
                        Direct Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#1c1f33]/30 text-xs font-serif text-[#555] space-y-2">
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#7a1c1c]">
                  <AlertCircle className="w-4 h-4" />
                  <span>No Direct State-Exclusive Notification Today</span>
                </div>
                <p>
                  No state-exclusive circular is active for {activeState.name} in this morning edition. You can register your profile on the <strong>{activeState.portal}</strong> OTR portal above to receive direct SMS/email notifications for upcoming state exams.
                </p>
              </div>
            )}

            {/* Central Government Positions Open to this State */}
            <div className="pt-2 border-t border-[#1c1f33]/20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666] block mb-2">
                National Central IT Vacancies Open to {activeState.name} Graduates:
              </span>
              <div className="space-y-2">
                {centralOpportunities.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-2.5 bg-white/70 border border-[#1c1f33]/20 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-serif font-bold text-[#1c1f33]">{job.title}</div>
                      <div className="text-[11px] text-[#666]">{job.organization} ({job.salary_scale})</div>
                    </div>
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono font-bold text-[#7a1c1c] hover:underline shrink-0 ml-2"
                    >
                      Apply →
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
