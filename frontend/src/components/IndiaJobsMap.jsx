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
  AlertCircle,
  Eye,
  Radio
} from 'lucide-react';

// Comprehensive registry of all Indian States and Union Territories with precise map coordinates
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
    pin: { x: 232, y: 650, labelOffset: { dx: -38, dy: 4 } }
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
    pin: { x: 242, y: 575, labelOffset: { dx: -45, dy: 0 } }
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
    pin: { x: 280, y: 635, labelOffset: { dx: 18, dy: 4 } }
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
    pin: { x: 220, y: 465, labelOffset: { dx: -48, dy: 0 } }
  },
  {
    code: 'DL',
    name: 'Delhi',
    capital: 'New Delhi',
    region: 'North',
    isCapital: true,
    portal: 'Delhi Subordinate Services Selection Board (DSSSB)',
    portalUrl: 'https://dsssbonline.nic.in',
    portalDomain: 'dsssbonline.nic.in',
    languageRule: '100% Open All-India Merit. No state language barriers (Hindi & English official).',
    domicileRule: 'Zero domicile restriction. All BCA & MCA candidates nationwide compete equally.',
    keyBodies: 'DSSSB, NIC National HQ, Delhi High Court IT Cell, MeitY HQ',
    pin: { x: 268, y: 240, labelOffset: { dx: 18, dy: -4 } }
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
    pin: { x: 335, y: 275, labelOffset: { dx: 18, dy: 0 } }
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
    pin: { x: 310, y: 565, labelOffset: { dx: 18, dy: 4 } }
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
    pin: { x: 285, y: 515, labelOffset: { dx: -45, dy: 0 } }
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
    pin: { x: 155, y: 385, labelOffset: { dx: -45, dy: 0 } }
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
    pin: { x: 205, y: 290, labelOffset: { dx: -48, dy: 0 } }
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
    pin: { x: 445, y: 360, labelOffset: { dx: 18, dy: 0 } }
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
    pin: { x: 275, y: 380, labelOffset: { dx: -48, dy: 0 } }
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
    pin: { x: 405, y: 310, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 385, y: 440, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 235, y: 195, labelOffset: { dx: -42, dy: 0 } }
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
    pin: { x: 250, y: 225, labelOffset: { dx: -45, dy: 0 } }
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
    pin: { x: 535, y: 295, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 255, y: 105, labelOffset: { dx: 18, dy: -2 } }
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
    pin: { x: 275, y: 165, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 300, y: 205, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 400, y: 365, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 330, y: 430, labelOffset: { dx: 16, dy: 0 } }
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
    pin: { x: 205, y: 535, labelOffset: { dx: -38, dy: 0 } }
  },
  {
    code: 'NE_OTHER',
    name: 'North-East Hub (Meghalaya, Tripura, Manipur, Nagaland, Sikkim, Arunachal)',
    capital: 'Shillong / Agartala',
    region: 'North-East',
    portal: 'North Eastern Regional PSCs',
    portalUrl: 'https://mpsc.nic.in',
    portalDomain: 'mpsc.nic.in',
    languageRule: 'English is official language in several NE states; regional tribal dialect proficiency for local cadres.',
    domicileRule: 'Indigenous inhabitant / ST certificate rules strictly enforced.',
    keyBodies: 'Meghalaya MPSC, Tripura TPSC, Manipur MPSC, Nagaland NPSC',
    pin: { x: 575, y: 320, labelOffset: { dx: 16, dy: 0 } }
  }
];

export default function IndiaJobsMap({ jobs = [], onSelectRegionFilter }) {
  const [selectedStateCode, setSelectedStateCode] = useState('KL');
  const [hoveredStateCode, setHoveredStateCode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Currently active state object
  const activeState = useMemo(() => {
    return ALL_INDIAN_STATES.find(s => s.code === selectedStateCode) || ALL_INDIAN_STATES[0];
  }, [selectedStateCode]);

  // Matching state-level opportunities
  const stateJobs = useMemo(() => {
    const sName = activeState.name.toLowerCase();
    return jobs.filter(j => {
      const matchState = j.state && j.state.toLowerCase().includes(sName);
      const matchLoc = j.location && j.location.toLowerCase().includes(sName);
      return matchState || matchLoc;
    });
  }, [jobs, activeState]);

  // Central / National opportunities open to graduates from this state
  const centralOpportunities = useMemo(() => {
    return jobs.filter(j => 
      j.scope === 'NATIONAL_CENTRAL' || 
      j.scope === 'DEFENSE_RESEARCH' || 
      j.scope === 'BANKING_FINANCE' ||
      j.state === 'All India'
    );
  }, [jobs]);

  // Filtered state list for quick selector
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
      
      {/* BroadSheet Gazette Header */}
      <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7a1c1c] mb-2 font-mono">
          <span>Official BroadSheet Spatial Bureau</span>
          <span>•</span>
          <span>Section 6</span>
          <span>•</span>
          <span>Graphical Interactive Map of India</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1c1f33] mb-2">
          Pan-India Public Sector IT Vacancy Map
        </h2>
        <p className="text-sm font-serif text-[#4a5568] max-w-3xl leading-relaxed">
          Explore verified government IT recruitments mapped across the authentic silhouette of India. Touch or click any state pointer to inspect direct State PSC One-Time Registration (OTR) links, local language clauses, and all opportunities available for BCA and MCA graduates.
        </p>

        {/* Region Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#1c1f33]/20">
          <span className="text-[11px] font-mono font-bold uppercase text-[#1c1f33]">Select Region:</span>
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

      {/* Main Geographical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Authentic Graphical SVG Map of India with Pointers (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1c1f33]">
            <div className="flex items-center justify-between mb-3 border-b border-[#1c1f33]/20 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7a1c1c]" />
                <h3 className="font-serif font-bold text-sm text-[#1c1f33] uppercase tracking-wide">
                  Geographical Map of India • Touch Any Pointer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#7a1c1c] font-bold">INTERACTIVE PINS</span>
            </div>

            {/* State Search Bar */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#666]" />
              <input
                type="text"
                placeholder="Search state name or code (e.g. Kerala, KL, Maharashtra, UP, Delhi, Karnataka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-serif bg-white border border-[#1c1f33] pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7a1c1c]"
              />
            </div>

            {/* Authentic SVG Map of India with Pointer Pins */}
            <div className="bg-[#eef2f5] border-2 border-[#1c1f33] p-3 sm:p-4 relative overflow-hidden flex flex-col items-center">
              
              {/* Watermark Label */}
              <div className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-widest text-[#1c1f33]/40 font-bold pointer-events-none">
                Survey of India Projection • IT Cadres
              </div>

              {/* Graphical Silhouette SVG Map of India */}
              <svg 
                viewBox="70 20 570 710" 
                className="w-full h-auto max-h-[520px] select-none"
                style={{ filter: 'drop-shadow(2px 2px 0px #1c1f33)' }}
              >
                <defs>
                  {/* Subtle Paper Fiber Hatch Pattern for Coastal Waters */}
                  <pattern id="seaGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.75" fill="#cad5e2" />
                  </pattern>

                  {/* Pin Pulse Glow Filter */}
                  <filter id="pinGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7a1c1c" floodOpacity="0.4"/>
                  </filter>
                </defs>

                {/* Ocean Background */}
                <rect x="70" y="20" width="570" height="710" fill="#eef2f5" />
                <rect x="70" y="20" width="570" height="710" fill="url(#seaGrid)" />

                {/* Arabian Sea, Indian Ocean, Bay of Bengal Labels */}
                <text x="130" y="580" fill="#8898aa" fontSize="10" fontStyle="italic" fontFamily="serif" letterSpacing="2">ARABIAN SEA</text>
                <text x="440" y="580" fill="#8898aa" fontSize="10" fontStyle="italic" fontFamily="serif" letterSpacing="2">BAY OF BENGAL</text>
                <text x="240" y="720" fill="#8898aa" fontSize="9" fontStyle="italic" fontFamily="serif" letterSpacing="2">INDIAN OCEAN</text>

                {/* Authentic Vector Silhouette of India (Subcontinent Landmass) */}
                <path
                  d="M 240,48 
                     C 250,32 280,30 295,45 
                     C 315,55 330,78 325,110 
                     C 320,132 305,142 298,162 
                     L 322,195 
                     L 348,215 
                     L 385,245 
                     L 438,265 
                     L 462,265 
                     L 476,248 
                     L 488,252 
                     L 482,275 
                     L 518,270 
                     L 552,242 
                     L 592,222 
                     L 618,238 
                     L 622,265 
                     L 602,295 
                     L 588,335 
                     L 578,375 
                     L 558,395 
                     L 542,370 
                     L 538,340 
                     L 508,335 
                     L 482,335 
                     L 476,355 
                     L 462,370 
                     L 448,405 
                     L 422,445 
                     L 382,485 
                     L 342,535 
                     L 312,580 
                     L 298,625 
                     L 272,670 
                     L 255,700 
                     L 245,695 
                     L 230,660 
                     L 215,620 
                     L 205,570 
                     L 198,525 
                     L 188,465 
                     L 180,435 
                     L 150,430 
                     L 125,410 
                     L 115,385 
                     L 135,365 
                     L 105,360 
                     L 90,345 
                     L 115,330 
                     L 155,320 
                     L 170,290 
                     L 190,250 
                     L 210,210 
                     L 230,165 
                     L 240,125 
                     Z"
                  fill="#fcfaf5"
                  stroke="#1c1f33"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Internal Geographic Demarcation Guides (Subtle Ink Hatching) */}
                <path d="M 230,165 Q 260,190 322,195" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 190,250 Q 250,260 348,215" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 170,290 Q 260,330 438,265" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 150,430 Q 275,390 448,405" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 188,465 Q 285,480 382,485" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 198,525 Q 285,550 342,535" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 205,570 Q 260,610 312,580" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 215,620 Q 255,650 272,670" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 482,275 Q 500,310 508,335" fill="none" stroke="#d5cebe" strokeWidth="1" strokeDasharray="3 3" />

                {/* Andaman & Nicobar Island Chain */}
                <g fill="#fcfaf5" stroke="#1c1f33" strokeWidth="1.5">
                  <ellipse cx="530" cy="590" rx="4" ry="10" />
                  <ellipse cx="532" cy="615" rx="3.5" ry="8" />
                  <ellipse cx="535" cy="640" rx="3" ry="7" />
                  <ellipse cx="538" cy="665" rx="3" ry="9" />
                  <text x="548" y="630" fill="#666" fontSize="7" fontFamily="sans-serif">A&N</text>
                </g>

                {/* Lakshadweep Island Chain */}
                <g fill="#fcfaf5" stroke="#1c1f33" strokeWidth="1.5">
                  <circle cx="170" cy="635" r="2.5" />
                  <circle cx="172" cy="650" r="2.5" />
                  <circle cx="174" cy="665" r="3" />
                  <text x="140" y="652" fill="#666" fontSize="7" fontFamily="sans-serif">LD</text>
                </g>

                {/* Compass Rose */}
                <g transform="translate(115, 80)">
                  <circle cx="0" cy="0" r="16" fill="white" stroke="#1c1f33" strokeWidth="1.5" />
                  <polygon points="0,-13 4,0 0,13 -4,0" fill="#7a1c1c" />
                  <polygon points="-13,0 0,-4 13,0 0,4" fill="#1c1f33" />
                  <text x="0" y="-17" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="sans-serif" fill="#1c1f33">N</text>
                </g>

                {/* Interactive State Pin Pointers Across India */}
                {ALL_INDIAN_STATES.map((st) => {
                  const isSelected = st.code === selectedStateCode;
                  const isHovered = st.code === hoveredStateCode;
                  const { x, y, labelOffset } = st.pin;
                  
                  // Count active vacancies for this state
                  const jobCount = jobs.filter(j => 
                    (j.state && j.state.toLowerCase().includes(st.name.toLowerCase())) ||
                    (j.location && j.location.toLowerCase().includes(st.name.toLowerCase()))
                  ).length;

                  return (
                    <g
                      key={st.code}
                      onClick={() => setSelectedStateCode(st.code)}
                      onMouseEnter={() => setHoveredStateCode(st.code)}
                      onMouseLeave={() => setHoveredStateCode(null)}
                      className="cursor-pointer transition-transform duration-200"
                      transform={`translate(${x}, ${y})`}
                    >
                      {/* Pulse Radar Ring for Selected or Hovered Pin */}
                      {(isSelected || isHovered) && (
                        <circle
                          cx="0"
                          cy="0"
                          r="18"
                          fill="none"
                          stroke={isSelected ? '#7a1c1c' : '#1c1f33'}
                          strokeWidth="1.5"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Drop Shadow base */}
                      <ellipse cx="0" cy="3" rx="4" ry="2" fill="#1c1f33" opacity="0.3" />

                      {/* Authentic Map Pointer Pin Shape */}
                      <path
                        d="M 0,0 C -6,-10 -9,-15 -9,-20 C -9,-26 -4,-30 0,-30 C 4,-30 9,-26 9,-20 C 9,-15 6,-10 0,0 Z"
                        fill={isSelected ? '#7a1c1c' : st.isCapital ? '#1c1f33' : '#fcfaf5'}
                        stroke="#1c1f33"
                        strokeWidth="1.8"
                        style={{ filter: isSelected ? 'url(#pinGlow)' : 'none' }}
                      />

                      {/* Pin Center Dot or Code */}
                      <circle
                        cx="0"
                        cy="-20"
                        r="4"
                        fill={isSelected ? '#ffffff' : st.isCapital ? '#f59e0b' : '#7a1c1c'}
                      />

                      {/* State Code Label Badge Beside Pointer */}
                      <g transform={`translate(${labelOffset.dx}, ${labelOffset.dy - 12})`}>
                        <rect
                          x="-3"
                          y="-9"
                          width="24"
                          height="14"
                          rx="3"
                          fill={isSelected ? '#1c1f33' : '#ffffff'}
                          stroke="#1c1f33"
                          strokeWidth="1"
                        />
                        <text
                          x="9"
                          y="1"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill={isSelected ? '#ffffff' : '#1c1f33'}
                        >
                          {st.code}
                        </text>
                      </g>

                      {/* Active Vacancy Counter Badge on Pin if jobs > 0 */}
                      {jobCount > 0 && (
                        <g transform="translate(7, -30)">
                          <circle cx="0" cy="0" r="5.5" fill="#f59e0b" stroke="#1c1f33" strokeWidth="1" />
                          <text x="0" y="2.5" textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="monospace" fill="#1c1f33">
                            {jobCount}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legend Bar */}
              <div className="mt-2 text-[10px] font-mono text-[#1c1f33] flex flex-wrap items-center justify-between w-full px-2 border-t border-[#1c1f33]/20 pt-2 gap-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#7a1c1c] border border-[#1c1f33] inline-block"></span>
                  <span>Active Pointer Pin</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-[#1c1f33] inline-block"></span>
                  <span>Active IT Openings</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1c1f33] border border-white inline-block"></span>
                  <span>National Capital</span>
                </span>
              </div>
            </div>

            {/* Quick State Picker Pills */}
            <div className="mt-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666] block mb-1.5">
                Quick Select State Pointer ({filteredStates.length} Regions):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-white border border-[#1c1f33]/30">
                {filteredStates.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => setSelectedStateCode(st.code)}
                    className={`px-2 py-1 text-xs font-serif font-bold transition-all border ${
                      selectedStateCode === st.code
                        ? 'bg-[#7a1c1c] text-white border-[#7a1c1c] shadow-[1px_1px_0px_0px_#1c1f33]'
                        : 'bg-[#fcfaf5] text-[#1c1f33] border-[#1c1f33]/30 hover:border-[#1c1f33] hover:bg-[#e8e4db]'
                    }`}
                  >
                    <span>{st.name}</span>
                    <span className="ml-1 text-[10px] font-mono">({st.code})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Selected Pointer Intelligence & Matching IT Vacancies (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active State Profile Card */}
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] space-y-4">
            
            {/* Header & Pin Location */}
            <div className="flex items-start justify-between border-b-2 border-[#1c1f33] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#7a1c1c] text-white">
                    📍 {activeState.region} India Pin
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#1c1f33]">
                    Code: {activeState.code}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-black text-[#1c1f33] mt-1">
                  {activeState.name}
                </h3>
                <p className="text-xs font-serif text-[#666]">
                  State Capital: <strong>{activeState.capital}</strong>
                </p>
              </div>

              {/* Verified OTR Button */}
              <a
                href={activeState.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1c1f33] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#7a1c1c] transition-colors shadow-[2px_2px_0px_0px_#7a1c1c] shrink-0"
                title={`Open official ${activeState.portal} portal`}
              >
                <span>OTR Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Public Service Commission Authority */}
            <div className="bg-white p-3.5 border border-[#1c1f33] space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#7a1c1c] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified State Commission Authority</span>
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

            {/* Language & Domicile Rules */}
            <div className="space-y-2 text-xs font-serif">
              <div className="p-3 bg-amber-50/80 border border-amber-300 text-amber-950">
                <strong className="block font-mono text-[10px] uppercase tracking-wider text-amber-900 mb-0.5">
                  🗣️ State Language Requirement:
                </strong>
                {activeState.languageRule}
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300 text-slate-800">
                <strong className="block font-mono text-[10px] uppercase tracking-wider text-slate-700 mb-0.5">
                  🏛️ Domicile / Reservation Clause:
                </strong>
                {activeState.domicileRule}
              </div>
            </div>

            {/* 1-Click Feed Filter */}
            <button
              onClick={() => onSelectRegionFilter(activeState.name)}
              className="w-full bg-[#7a1c1c] text-white py-2.5 px-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1c1f33] transition-colors shadow-[2px_2px_0px_0px_#1c1f33] flex items-center justify-center gap-2"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter All Gazette Dispatches for {activeState.name}</span>
            </button>
          </div>

          {/* Active Vacancies for this Pointer */}
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c1f33]/20 pb-2">
              <h4 className="font-serif font-bold text-sm text-[#1c1f33] uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#7a1c1c]" />
                Opportunities in {activeState.name} ({stateJobs.length})
              </h4>
              <span className="text-[10px] font-mono text-[#666]">
                BCA & MCA Posts
              </span>
            </div>

            {/* Specific State IT Openings */}
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
                  <span>No State-Exclusive Circular Active Today</span>
                </div>
                <p>
                  No state-exclusive circular is active for {activeState.name} in this morning edition. You can register your profile on the <strong>{activeState.portal}</strong> OTR portal above to be notified automatically when new exams open.
                </p>
              </div>
            )}

            {/* All-India Central Positions Open to Candidates of this State */}
            <div className="pt-2 border-t border-[#1c1f33]/20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666] block mb-2">
                Central & PSU IT Vacancies Open to {activeState.name} Graduates:
              </span>
              <div className="space-y-2">
                {centralOpportunities.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-2.5 bg-white border border-[#1c1f33]/20 flex items-center justify-between text-xs">
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
