import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Building2, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Filter, 
  ArrowRight, 
  Compass, 
  Briefcase, 
  Sparkles,
  AlertCircle,
  RotateCcw,
  MapPin,
  CheckCircle2
} from 'lucide-react';

// Comprehensive registry of Indian States & UTs with precise real-world coordinates
export const ALL_INDIAN_STATES = [
  {
    code: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    region: 'South',
    lat: 10.1632,
    lng: 76.6413,
    portal: 'Kerala Public Service Commission (KPSC Thulasi)',
    portalUrl: 'https://thulasi.psc.kerala.gov.in',
    portalDomain: 'psc.kerala.gov.in',
    languageRule: 'Malayalam qualification is relaxed for specialized Computer Science & IT posts (e.g. KSITM, KSEB Programmer, C-DIT).',
    domicileRule: 'Open to all Indian citizens; priority for Kerala domicile in certain state departmental quotas.',
    keyBodies: 'Kerala State IT Mission (KSITM), KSEB IT Wing, C-DIT, KPSC'
  },
  {
    code: 'KA',
    name: 'Karnataka',
    capital: 'Bengaluru',
    region: 'South',
    lat: 14.5204,
    lng: 75.7224,
    portal: 'Karnataka PSC & KEONICS',
    portalUrl: 'https://kpsc.kar.nic.in',
    portalDomain: 'kpsc.kar.nic.in',
    languageRule: 'Kannada language test must be passed within 2 years of probation if not studied in Class 10.',
    domicileRule: 'Article 371(J) reservation applies to Kalyana-Karnataka region vacancies.',
    keyBodies: 'Centre for e-Governance, KEONICS, Karnataka State Data Centre, KPSC'
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    region: 'South',
    lat: 11.1271,
    lng: 78.6569,
    portal: 'Tamil Nadu Public Service Commission (TNPSC)',
    portalUrl: 'https://www.tnpsc.gov.in',
    portalDomain: 'tnpsc.gov.in',
    languageRule: 'Compulsory Tamil Language Qualification Test or certificate of Tamil in SSLC.',
    domicileRule: 'State reservation benefits apply to residents; open category is all-India eligible.',
    keyBodies: 'ELCOT, Tamil Nadu e-Governance Agency (TNeGA), TNPSC'
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    region: 'West',
    lat: 19.4515,
    lng: 75.7139,
    portal: 'Maharashtra PSC & MahaIT Corporation',
    portalUrl: 'https://mpsconline.gov.in',
    portalDomain: 'mpsconline.gov.in',
    languageRule: 'Knowledge of Marathi is compulsory (Class 10 Marathi or passing departmental test within probation).',
    domicileRule: 'Domicile of Maharashtra required for state quota reservation.',
    keyBodies: 'MahaIT Corporation, MPSC, State Crime Records Bureau IT Wing, CIDCO'
  },
  {
    code: 'DL',
    name: 'Delhi',
    capital: 'New Delhi',
    region: 'North',
    isCapital: true,
    lat: 28.6139,
    lng: 77.2090,
    portal: 'Delhi Subordinate Services Selection Board (DSSSB)',
    portalUrl: 'https://dsssbonline.nic.in',
    portalDomain: 'dsssbonline.nic.in',
    languageRule: '100% Open All-India Merit. No state language barriers (Hindi & English official).',
    domicileRule: 'Zero domicile restriction. All BCA & MCA candidates nationwide compete equally.',
    keyBodies: 'DSSSB, NIC National HQ, Delhi High Court IT Cell, MeitY HQ'
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    region: 'North',
    lat: 26.8467,
    lng: 80.9462,
    portal: 'Uttar Pradesh PSC (UPPSC) & UPPRPB',
    portalUrl: 'https://uppsc.up.nic.in',
    portalDomain: 'uppsc.up.nic.in',
    languageRule: 'Proficiency in Hindi in Devanagari script is mandatory.',
    domicileRule: 'General category vacancies open to all-India; reservation benefits for UP residents.',
    keyBodies: 'UPPSC, UP Police Computer Operator Wing, State Informatics Centre'
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    region: 'South',
    lat: 15.9129,
    lng: 79.7400,
    portal: 'Andhra Pradesh PSC (APPSC)',
    portalUrl: 'https://psc.ap.gov.in',
    portalDomain: 'psc.ap.gov.in',
    languageRule: 'Telugu language proficiency required for state departmental postings.',
    domicileRule: 'Local / Non-local status determined by presidential order study rules.',
    keyBodies: 'APPSC, Real Time Governance Society (RTGS), AP Technology Services'
  },
  {
    code: 'TS',
    name: 'Telangana',
    capital: 'Hyderabad',
    region: 'South',
    lat: 17.8749,
    lng: 78.9629,
    portal: 'Telangana Public Service Commission (TGPSC)',
    portalUrl: 'https://tspsc.gov.in',
    portalDomain: 'tspsc.gov.in',
    languageRule: 'Proficiency in Telugu / Urdu or English for specialized technical roles.',
    domicileRule: 'Presidential Order 2018 defines local candidate zones for 95% reservation.',
    keyBodies: 'TGPSC, Telangana IT, Electronics & Communications (ITE&C), T-SAT'
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    region: 'West',
    lat: 22.2587,
    lng: 71.1924,
    portal: 'Gujarat Public Service Commission (GPSC)',
    portalUrl: 'https://gpsc.gujarat.gov.in',
    portalDomain: 'gpsc.gujarat.gov.in',
    languageRule: 'Adequate knowledge of Gujarati and Hindi is mandated.',
    domicileRule: 'Open to all Indian citizens; domicile certificates apply to state quotas.',
    keyBodies: 'GPSC, Gujarat Informatics Ltd (GIL), SAC/ISRO Ahmedabad Campus'
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    capital: 'Jaipur',
    region: 'North',
    lat: 26.5844,
    lng: 73.8479,
    portal: 'Rajasthan Public Service Commission (RPSC)',
    portalUrl: 'https://rpsc.rajasthan.gov.in',
    portalDomain: 'rpsc.rajasthan.gov.in',
    languageRule: 'Working knowledge of Hindi written in Devanagari Script and Rajasthani culture.',
    domicileRule: 'Open for all states under Unreserved (UR) category.',
    keyBodies: 'RPSC, DoIT&C Rajasthan (Programmer & Informatics Assistant cadres)'
  },
  {
    code: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    region: 'East',
    lat: 23.9968,
    lng: 87.8550,
    portal: 'West Bengal Public Service Commission (WBPSC)',
    portalUrl: 'https://psc.wb.gov.in',
    portalDomain: 'psc.wb.gov.in',
    languageRule: 'Ability to read, write and speak in Bengali (exempted for candidates whose mother tongue is Nepali).',
    domicileRule: 'General vacancies open to all; reserved vacancies restricted to WB residents.',
    keyBodies: 'WBPSC, Webel Technology Ltd, State e-Governance Mission Team'
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    region: 'Central',
    lat: 23.4734,
    lng: 77.9479,
    portal: 'Madhya Pradesh PSC (MPPSC)',
    portalUrl: 'https://mppsc.mp.gov.in',
    portalDomain: 'mppsc.mp.gov.in',
    languageRule: 'Knowledge of Hindi in Devanagari script is compulsory.',
    domicileRule: 'Registration in MP Employment Exchange (Rojgar Portal) is often required.',
    keyBodies: 'MPPSC, MPSeDC (Madhya Pradesh State Electronics Development Corp)'
  },
  {
    code: 'BR',
    name: 'Bihar',
    capital: 'Patna',
    region: 'East',
    lat: 25.6961,
    lng: 85.3131,
    portal: 'Bihar Public Service Commission (BPSC)',
    portalUrl: 'https://bpsc.bih.nic.in',
    portalDomain: 'bpsc.bih.nic.in',
    languageRule: 'Proficiency in Hindi language.',
    domicileRule: 'BPSC open category is open to candidates from all Indian states.',
    keyBodies: 'BPSC, BELTRON (Bihar State Electronic Development Corporation)'
  },
  {
    code: 'OD',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    region: 'East',
    lat: 20.9517,
    lng: 85.0985,
    portal: 'Odisha Public Service Commission (OPSC)',
    portalUrl: 'https://opsc.gov.in',
    portalDomain: 'opsc.gov.in',
    languageRule: 'Must be able to read, write and speak Odia and have passed ME School Odia examination.',
    domicileRule: 'Odia language criterion is mandatory for permanent state cadre posts.',
    keyBodies: 'OPSC, Odisha Computer Application Centre (OCAC), OSSSC'
  },
  {
    code: 'PB',
    name: 'Punjab',
    capital: 'Chandigarh',
    region: 'North',
    lat: 31.1471,
    lng: 75.3412,
    portal: 'Punjab Public Service Commission (PPSC)',
    portalUrl: 'https://ppsc.gov.in',
    portalDomain: 'ppsc.gov.in',
    languageRule: 'Punjabi of Matriculation or its equivalent standard is strictly mandatory.',
    domicileRule: 'Strict enforcement of Matriculation Punjabi pass certificate.',
    keyBodies: 'PPSC, Punjab Information & Communication Technology Corp (Punjab Infotech)'
  },
  {
    code: 'HR',
    name: 'Haryana',
    capital: 'Chandigarh',
    region: 'North',
    lat: 29.0588,
    lng: 76.0856,
    portal: 'Haryana PSC (HPSC) & HSSC',
    portalUrl: 'https://hpsc.gov.in',
    portalDomain: 'hpsc.gov.in',
    languageRule: 'Hindi or Sanskrit as one of the subjects in Matriculation or Higher Education.',
    domicileRule: 'Socio-economic criteria and reservation reserved for Haryana domicile.',
    keyBodies: 'HPSC, HARTRON (Haryana State Electronics Dev Corp), HSSC'
  },
  {
    code: 'AS',
    name: 'Assam',
    capital: 'Dispur',
    region: 'North-East',
    lat: 26.2006,
    lng: 92.9376,
    portal: 'Assam Public Service Commission (APSC)',
    portalUrl: 'https://apsc.nic.in',
    portalDomain: 'apsc.nic.in',
    languageRule: 'Candidate must speak Assamese or other official languages of the state fluently.',
    domicileRule: 'Permanent Resident Certificate (PRC) of Assam issued for educational/employment purpose.',
    keyBodies: 'APSC, Assam Electronics Development Corporation (AMTRON)'
  },
  {
    code: 'JK',
    name: 'Jammu & Kashmir',
    capital: 'Srinagar / Jammu',
    region: 'North',
    lat: 33.7782,
    lng: 75.5762,
    portal: 'J&K Public Service Commission (JKPSC)',
    portalUrl: 'https://jkpsc.nic.in',
    portalDomain: 'jkpsc.nic.in',
    languageRule: 'Proficiency in Urdu / English / Hindi.',
    domicileRule: 'Domicile Certificate of UT of Jammu & Kashmir mandatory for all civil posts.',
    keyBodies: 'JKPSC, JKSSB, J&K e-Governance Agency (JaKeGA)'
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    capital: 'Shimla',
    region: 'North',
    lat: 31.8048,
    lng: 77.1734,
    portal: 'Himachal Pradesh PSC (HPPSC)',
    portalUrl: 'https://hppsc.hp.gov.in',
    portalDomain: 'hppsc.hp.gov.in',
    languageRule: 'Knowledge of customs, manners and dialects of Himachal Pradesh.',
    domicileRule: 'Class 10 and 12 passed from schools situated in HP or Bonafide Himachali.',
    keyBodies: 'HPPSC, HP State Electronics Development Corp (HPSEDC)'
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    capital: 'Dehradun',
    region: 'North',
    lat: 30.0668,
    lng: 79.0193,
    portal: 'Uttarakhand Public Service Commission (UKPSC)',
    portalUrl: 'https://psc.uk.gov.in',
    portalDomain: 'psc.uk.gov.in',
    languageRule: 'Proficiency in Hindi in Devanagari script.',
    domicileRule: 'Employment exchange registration in Uttarakhand or Class 10/12 from Uttarakhand.',
    keyBodies: 'UKPSC, Uttarakhand Information Technology Development Agency (ITDA)'
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    capital: 'Ranchi',
    region: 'East',
    lat: 23.6102,
    lng: 85.2799,
    portal: 'Jharkhand Public Service Commission (JPSC)',
    portalUrl: 'https://jpsc.gov.in',
    portalDomain: 'jpsc.gov.in',
    languageRule: 'Knowledge of local customs and languages of Jharkhand.',
    domicileRule: 'Local resident certificates applicable for state reservations.',
    keyBodies: 'JPSC, JAP-IT (Jharkhand Agency for Promotion of IT)'
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    capital: 'Raipur',
    region: 'Central',
    lat: 21.2787,
    lng: 81.8661,
    portal: 'Chhattisgarh PSC (CGPSC)',
    portalUrl: 'https://psc.cg.gov.in',
    portalDomain: 'psc.cg.gov.in',
    languageRule: 'Hindi and Chhattisgarhi dialect knowledge preferred.',
    domicileRule: 'Domicile of Chhattisgarh mandatory for certain reserved district cadres.',
    keyBodies: 'CGPSC, CHiPS (Chhattisgarh Infotech Promotion Society)'
  },
  {
    code: 'GA',
    name: 'Goa',
    capital: 'Panaji',
    region: 'West',
    lat: 15.2993,
    lng: 74.1240,
    portal: 'Goa Public Service Commission (GPSC)',
    portalUrl: 'https://gpsc.goa.gov.in',
    portalDomain: 'gpsc.goa.gov.in',
    languageRule: 'Essential knowledge of Konkani; Marathi is desirable.',
    domicileRule: '15 years continuous residence certificate in Goa is mandatory for state government jobs.',
    keyBodies: 'GPSC, Info Tech Corporation of Goa Ltd (ITG)'
  },
  {
    code: 'TR',
    name: 'Tripura',
    capital: 'Agartala',
    region: 'North-East',
    lat: 23.8315,
    lng: 91.2868,
    portal: 'Tripura Public Service Commission (TPSC)',
    portalUrl: 'https://tpsc.tripura.gov.in',
    portalDomain: 'tpsc.tripura.gov.in',
    languageRule: 'Bengali or Kokborok language knowledge.',
    domicileRule: 'Permanent Resident Certificate (PRTC) of Tripura required.',
    keyBodies: 'TPSC, Directorate of IT Tripura'
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    capital: 'Shillong',
    region: 'North-East',
    lat: 25.5788,
    lng: 91.8933,
    portal: 'Meghalaya PSC (MPSC)',
    portalUrl: 'https://mpsc.nic.in',
    portalDomain: 'mpsc.nic.in',
    languageRule: 'Khasi or Garo language proficiency depending on district posting.',
    domicileRule: 'Indigenous tribes & permanent resident norms apply.',
    keyBodies: 'MPSC, Meghalaya Information Technology Society (MITS)'
  },
  {
    code: 'MN',
    name: 'Manipur',
    capital: 'Imphal',
    region: 'North-East',
    lat: 24.8170,
    lng: 93.9368,
    portal: 'Manipur Public Service Commission (MPSC)',
    portalUrl: 'https://mpscmanipur.gov.in',
    portalDomain: 'mpscmanipur.gov.in',
    languageRule: 'Manipuri language knowledge in Bengali/Meitei script.',
    domicileRule: 'Domicile of Manipur certificate required.',
    keyBodies: 'MPSC, Dept of Information Technology Manipur'
  },
  {
    code: 'NL',
    name: 'Nagaland',
    capital: 'Kohima',
    region: 'North-East',
    lat: 25.6751,
    lng: 94.1086,
    portal: 'Nagaland Public Service Commission (NPSC)',
    portalUrl: 'https://npsc.nagaland.gov.in',
    portalDomain: 'npsc.nagaland.gov.in',
    languageRule: 'English is official language; knowledge of local tribal dialects.',
    domicileRule: 'Indigenous inhabitant certificate strictly required.',
    keyBodies: 'NPSC, Nagaland State e-Governance Society'
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    capital: 'Aizawl',
    region: 'North-East',
    lat: 23.7271,
    lng: 92.7176,
    portal: 'Mizoram Public Service Commission (MPSC)',
    portalUrl: 'https://mpsc.mizoram.gov.in',
    portalDomain: 'mpsc.mizoram.gov.in',
    languageRule: 'Mizo language up to Middle School standard.',
    domicileRule: 'Permanent resident / local criteria.',
    keyBodies: 'MPSC, Mizoram State e-Governance Society'
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    region: 'North-East',
    lat: 27.0844,
    lng: 93.6053,
    portal: 'Arunachal Pradesh PSC (APPSC)',
    portalUrl: 'https://appsc.gov.in',
    portalDomain: 'appsc.gov.in',
    languageRule: 'English is official language; local tribal dialects.',
    domicileRule: 'Arunachal Pradesh Scheduled Tribe (APST) quotas.',
    keyBodies: 'APPSC, Dept of IT & Communications'
  },
  {
    code: 'SK',
    name: 'Sikkim',
    capital: 'Gangtok',
    region: 'North-East',
    lat: 27.3389,
    lng: 88.6065,
    portal: 'Sikkim Public Service Commission (SPSC)',
    portalUrl: 'https://spsc.sikkim.gov.in',
    portalDomain: 'spsc.sikkim.gov.in',
    languageRule: 'Nepali, Bhutia or Lepcha language knowledge.',
    domicileRule: 'Certificate of Identification (COI) / Sikkim Subject certificate.',
    keyBodies: 'SPSC, Dept of Information Technology Sikkim'
  },
  {
    code: 'UT_LEH',
    name: 'Ladakh',
    capital: 'Leh',
    region: 'North',
    lat: 34.1526,
    lng: 77.5771,
    portal: 'Ladakh Subordinate Services (LAHDSSRB)',
    portalUrl: 'https://lahdssrb.in',
    portalDomain: 'lahdssrb.in',
    languageRule: 'Ladakhi / Balti / Urdu / English.',
    domicileRule: 'Resident Certificate of UT of Ladakh mandatory.',
    keyBodies: 'Leh & Kargil Autonomous Hill Dev Councils'
  }
];

export default function IndiaJobsMap({ jobs = [], onSelectRegionFilter }) {
  const [selectedStateCode, setSelectedStateCode] = useState('KL');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Active state record
  const activeState = useMemo(() => {
    return ALL_INDIAN_STATES.find(s => s.code === selectedStateCode) || ALL_INDIAN_STATES[0];
  }, [selectedStateCode]);

  // Matching vacancies for selected state
  const stateJobs = useMemo(() => {
    const sName = activeState.name.toLowerCase();
    return jobs.filter(j => {
      const matchState = j.state && j.state.toLowerCase().includes(sName);
      const matchLoc = j.location && j.location.toLowerCase().includes(sName);
      return matchState || matchLoc;
    });
  }, [jobs, activeState]);

  // Central / National opportunities open to graduates of that state
  const centralOpportunities = useMemo(() => {
    return jobs.filter(j => 
      j.scope === 'NATIONAL_CENTRAL' || 
      j.scope === 'DEFENSE_RESEARCH' || 
      j.scope === 'BANKING_FINANCE' ||
      j.state === 'All India'
    );
  }, [jobs]);

  // Filtered state list for quick search / buttons
  const filteredStates = useMemo(() => {
    return ALL_INDIAN_STATES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.capital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = regionFilter === 'ALL' || s.region === regionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, regionFilter]);

  // Initialize Real Leaflet Map of India
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center of India coordinates [22.0, 79.5]
    const map = L.map(mapContainerRef.current, {
      center: [22.0, 79.5],
      zoom: 4.8,
      minZoom: 4.2,
      maxZoom: 9,
      scrollWheelZoom: false, // Prevents accidental scroll interception
      zoomControl: true,
      attributionControl: false
    });

    // Completely free, public OpenStreetMap tile layer (Zero API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update State Markers whenever selectedState or jobs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    ALL_INDIAN_STATES.forEach((st) => {
      const isSelected = st.code === selectedStateCode;
      
      const jobCount = jobs.filter(j => 
        (j.state && j.state.toLowerCase().includes(st.name.toLowerCase())) ||
        (j.location && j.location.toLowerCase().includes(st.name.toLowerCase()))
      ).length;

      // Custom BroadSheet Pointer Pin
      const pinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;">
          ${isSelected ? `
            <div style="position: absolute; top: -8px; width: 44px; height: 44px; border-radius: 50%; border: 2px solid #7a1c1c; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          ` : ''}
          <div style="
            background: ${isSelected ? '#7a1c1c' : st.isCapital ? '#1c1f33' : '#ffffff'};
            color: ${isSelected || st.isCapital ? '#ffffff' : '#1c1f33'};
            border: 2px solid #1c1f33;
            box-shadow: 2px 2px 0px #1c1f33;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 10px;
            font-weight: 900;
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
          ">
            <span>${st.code}</span>
            ${jobCount > 0 ? `
              <span style="background: #f59e0b; color: #1c1f33; font-size: 9px; font-weight: bold; border-radius: 2px; padding: 0 3px;">
                ${jobCount}
              </span>
            ` : ''}
          </div>
          <div style="
            width: 0; 
            height: 0; 
            border-left: 5px solid transparent; 
            border-right: 5px solid transparent; 
            border-top: 6px solid #1c1f33;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'gazette-state-pin',
        html: pinHtml,
        iconSize: [46, 32],
        iconAnchor: [23, 28]
      });

      const marker = L.marker([st.lat, st.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedStateCode(st.code);
        map.flyTo([st.lat, st.lng], 6.2, { duration: 0.8 });
      });

      markersRef.current[st.code] = marker;
    });

  }, [selectedStateCode, jobs]);

  // Function to programmatically fly to a state
  const handleSelectState = (stateCode) => {
    setSelectedStateCode(stateCode);
    const st = ALL_INDIAN_STATES.find(s => s.code === stateCode);
    if (st && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([st.lat, st.lng], 6.2, { duration: 0.8 });
    }
  };

  // Reset to full All-India view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.0, 79.5], 4.8, { duration: 0.8 });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BroadSheet Gazette Header */}
      <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7a1c1c] mb-2 font-mono">
          <span>Official BroadSheet Spatial Intelligence</span>
          <span>•</span>
          <span>Section 6</span>
          <span>•</span>
          <span>Real-World Geographical Map of India</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1c1f33] mb-2">
          The Geographical Map of India IT Openings
        </h2>
        <p className="text-sm font-serif text-[#4a5568] max-w-3xl leading-relaxed">
          Accurate cartographic representation of the Republic of India showing all 28 states and union territories. Touch or click any state pointer on the real map to fly directly to that state and inspect official State PSC One-Time Registration (OTR) portals, local language clauses, and active BCA/MCA opportunities.
        </p>

        {/* Region Filter Bar & Map Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1c1f33]/20">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-[#1c1f33] mr-1">Zone Filter:</span>
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

          {/* Reset Zoom Button */}
          <button
            onClick={handleResetView}
            className="px-3 py-1 bg-white text-[#1c1f33] border border-[#1c1f33] hover:bg-[#e8e4db] text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1c1f33]"
            title="Reset to full India perspective"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#7a1c1c]" />
            <span>Reset India View</span>
          </button>
        </div>
      </div>

      {/* Main Geographical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Real Cartographic Leaflet Map of India (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#fcfaf5] border-2 border-[#1c1f33] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#1c1f33]">
            <div className="flex items-center justify-between mb-3 border-b border-[#1c1f33]/20 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7a1c1c]" />
                <h3 className="font-serif font-bold text-sm text-[#1c1f33] uppercase tracking-wide">
                  Geographical Map of India • Touch Any Pointer Pin
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#7a1c1c] font-bold">CLICK POINTER TO FLY</span>
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

            {/* Real Cartographic Leaflet Map Container */}
            <div className="relative border-2 border-[#1c1f33] overflow-hidden">
              <div 
                ref={mapContainerRef}
                className="w-full h-[520px] bg-[#fbf9f5]"
                style={{ 
                  filter: 'contrast(104%) brightness(99%) sepia(8%)'
                }}
              />

              {/* In-Map Guide Badge */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm border border-[#1c1f33] px-2.5 py-1 text-[10px] font-mono text-[#1c1f33] shadow-sm">
                <span>📍 Active Pointer: <strong>{activeState.name} ({activeState.code})</strong></span>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-3 text-[10px] font-mono text-[#1c1f33] flex flex-wrap items-center justify-between px-2 pt-2 border-t border-[#1c1f33]/20 gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#7a1c1c] border border-[#1c1f33] inline-block"></span>
                <span>Selected Pointer Pin</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#f59e0b] border border-[#1c1f33] inline-block"></span>
                <span>Active IT Openings Badge</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#1c1f33] border border-white inline-block"></span>
                <span>National Capital (DL)</span>
              </span>
            </div>

            {/* Quick State Picker Pills */}
            <div className="mt-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666] block mb-1.5">
                Quick Select State Pointer ({filteredStates.length} Regions):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-white border border-[#1c1f33]/30">
                {filteredStates.map((st) => (
                  <button
                    key={st.code}
                    onClick={() => handleSelectState(st.code)}
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
                    📍 {activeState.region} India Pointer
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
