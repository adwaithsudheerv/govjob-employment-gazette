import React, { useState } from 'react';
import { 
  GitBranch, 
  Award, 
  Home, 
  HeartHandshake, 
  Plane, 
  GraduationCap, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp,
  Building2,
  Landmark,
  Rocket
} from 'lucide-react';

export default function CareerRoadmapTree() {
  const [activeTrack, setActiveTrack] = useState('scientific');
  const [selectedNode, setSelectedNode] = useState(0);

  const tracks = [
    {
      id: 'scientific',
      title: 'Scientific & Gazetted Cadre (NIC / MeitY / DRDO)',
      icon: Rocket,
      description: 'The premier central government technical hierarchy from Graduate Trainee to Outstanding Scientist.',
      nodes: [
        {
          stage: 'Entry Grade (BCA / Diploma)',
          title: "Scientific / Technical Assistant 'A'",
          level: 'Level 6 (7th CPC)',
          basicPay: '₹35,400',
          inHand: '₹54,000 – ₹58,000 / month',
          promotionYears: '3–4 Years service',
          quarters: 'Type III Quarter (2-BHK Central Pool Residential Allotment)',
          responsibilities: 'Software development, database maintenance, network administration for central government e-portals.',
          perks: ['CGHS Cashless Healthcare (Self + Parents + Spouse)', 'Children Education Allowance (₹27,000/yr)', 'DA + HRA (27% in Tier-1 Delhi/Bangalore)']
        },
        {
          stage: 'Promotion Grade 1',
          title: "Technical Officer / Scientific Assistant 'B'",
          level: 'Level 7 (7th CPC)',
          basicPay: '₹44,900',
          inHand: '₹68,000 – ₹74,000 / month',
          promotionYears: '4 Years service',
          quarters: 'Type IV Quarter (3-BHK Government Colony)',
          responsibilities: 'Team lead for state data centers, cloud infrastructure telemetry, and security auditing.',
          perks: ['LTC (Free Air Travel across India every 2 years)', 'Official Laptop & Briefcase Allowance', 'Annual Performance Bonus']
        },
        {
          stage: 'Gazetted Officer Cadre (MCA / B.Tech Direct Entry)',
          title: "Scientist 'B' (Class-1 Gazetted Officer)",
          level: 'Level 10 (7th CPC)',
          basicPay: '₹56,100',
          inHand: '₹88,000 – ₹98,000 / month',
          promotionYears: '4 Years under Flexible Complementing Scheme (FCS)',
          quarters: 'Type IV / Type IV Special Quarters',
          responsibilities: 'Project Director for national digital missions (UPI, DigiLocker, Aadhaar backend, e-Courts). Class-1 Attestation authority.',
          perks: ['Official Red Letterhead & Attestation Powers', 'Govt-sponsored M.Tech/Ph.D. at IIT/IISc with full salary', 'Executive Medical Checkups']
        },
        {
          stage: 'Senior Officer Grade',
          title: "Scientist 'C' (Senior Systems Architect)",
          level: 'Level 11 (7th CPC)',
          basicPay: '₹67,700',
          inHand: '₹1,08,000 – ₹1,20,000 / month',
          promotionYears: '4–5 Years under FCS',
          quarters: 'Type V Apartment (Central Delhi / State Capitals)',
          responsibilities: 'Cybersecurity defense, AI/ML government initiatives, national data center orchestration.',
          perks: ['International Conference Travel Grants', 'Telephone & High-speed Broadband Reimbursement', 'Priority VIP Quota']
        },
        {
          stage: 'Director Cadre',
          title: "Scientist 'E' / Joint Director",
          level: 'Level 13 (7th CPC)',
          basicPay: '₹1,23,100',
          inHand: '₹1,95,000 – ₹2,20,000 / month',
          promotionYears: '5 Years service',
          quarters: 'Type V / VI Independent Bungalow',
          responsibilities: 'Directing whole state NIC units, formulating national IT policies, commanding 100+ engineers.',
          perks: ['Dedicated Official Staff Vehicle with Chauffeur', 'Direct reporting to Joint Secretary / Ministry Secretary', 'Maximum Retirement Gratuity ₹20 Lakhs']
        }
      ]
    },
    {
      id: 'banking',
      title: 'Public Sector Banking IT Cadre (IBPS SO / SBI)',
      icon: Landmark,
      description: 'Accelerated promotion track in Public Sector Banks managing core banking architectures.',
      nodes: [
        {
          stage: 'Scale I (Direct Entry)',
          title: 'Assistant Manager (IT Specialist)',
          level: 'Scale I Officer',
          basicPay: '₹48,480',
          inHand: '₹72,000 – ₹78,000 / month',
          promotionYears: '2–3 Years',
          quarters: 'Bank Leased Accommodation (₹25,000/month rent paid by Bank)',
          responsibilities: 'CBS (Finacle/BaNCS) database maintenance, ATM switch routing, branch networking.',
          perks: ['100% Medical Reimbursement for family', 'Subsidized Home Loans (Concessional 4.5% interest)', 'Monthly Fuel Allowance (45 Litres)']
        },
        {
          stage: 'Scale II',
          title: 'Manager (IT Infrastructure & Security)',
          level: 'Scale II Officer',
          basicPay: '₹64,820',
          inHand: '₹95,000 – ₹1,05,000 / month',
          promotionYears: '3 Years',
          quarters: 'Leased Luxury Flat (₹35,000/mo allowance)',
          responsibilities: 'Managing cloud disaster recovery, fraud analytics, and payment gateway security.',
          perks: ['Car Loan at staff rates', '60 Litres monthly petrol', 'Annual health and wellness perks']
        },
        {
          stage: 'Scale III',
          title: 'Senior Manager (IT Core Systems)',
          level: 'Scale III Officer',
          basicPay: '₹85,920',
          inHand: '₹1,25,000 – ₹1,40,000 / month',
          promotionYears: '3 Years',
          quarters: 'Executive Leased House',
          responsibilities: 'Leading IT auditing, cloud migration, and fintech integration across 5,000+ branches.',
          perks: ['80 Litres petrol allowance', 'Overseas training programs', 'Club membership subsidies']
        },
        {
          stage: 'Executive Management',
          title: 'Chief General Manager / Chief Technology Officer (CTO)',
          level: 'Top Management Grade (TEGS)',
          basicPay: '₹1,50,000+',
          inHand: '₹2,50,000+ / month',
          promotionYears: 'Senior Selection',
          quarters: 'Bank-owned Executive Penthouse/Bungalow',
          responsibilities: 'Head of Technology for the entire national banking network.',
          perks: ['Executive Car + Driver', 'Board Meeting representation', 'Substantial stock and performance incentives']
        }
      ]
    },
    {
      id: 'psu',
      title: 'Navratna PSU Engineering Cadre (BEL / C-DAC / IOCL)',
      icon: Building2,
      description: 'Defence and high-performance computing industrial IT hierarchy with extensive allowances.',
      nodes: [
        {
          stage: 'Entry Grade (E-1 / E-2)',
          title: 'Project Engineer / Systems Officer',
          level: 'Grade E-1 (Navratna)',
          basicPay: '₹40,000 – ₹1,40,000',
          inHand: '₹65,000 – ₹75,000 / month',
          promotionYears: '3 Years',
          quarters: 'PSU Township Housing (Electricity, water & maintenance subsidized)',
          responsibilities: 'Defence radar software, C4I tactical systems, high performance computing codebases.',
          perks: ['35% Cafeteria Perks on Basic Pay', 'PRP (Performance Related Pay) up to ₹2.5 Lakhs annually', 'Township sports complexes, schools, and hospitals']
        },
        {
          stage: 'Mid-Management (E-3 / E-4)',
          title: 'Deputy Manager / Senior Systems Architect',
          level: 'Grade E-3 / E-4',
          basicPay: '₹70,000 – ₹2,00,000',
          inHand: '₹1,15,000 – ₹1,35,000 / month',
          promotionYears: '4 Years',
          quarters: 'Senior Officers Township Enclave',
          responsibilities: 'Heading defence software production lines, avionics computing units, and AI defense systems.',
          perks: ['Quarterly performance bonuses', 'Children education in prestigious DPS/KV within township', 'Comprehensive group medical']
        },
        {
          stage: 'Executive Grade (E-7 / E-8)',
          title: 'General Manager (Technology & IT Systems)',
          level: 'Grade E-7 / E-8',
          basicPay: '₹1,20,000 – ₹2,80,000',
          inHand: '₹2,20,000 – ₹2,70,000 / month',
          promotionYears: 'Executive Merit',
          quarters: 'General Manager Villa',
          responsibilities: 'Directing aerospace, naval, and missile computing defense contracts.',
          perks: ['Executive Sedan', 'Company guest houses across India', 'High-value superannuation benefit funds']
        }
      ]
    }
  ];

  const currentTrack = tracks.find(t => t.id === activeTrack) || tracks[0];
  const currentNode = currentTrack.nodes[selectedNode] || currentTrack.nodes[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <GitBranch className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Section 8: The 20-Year Career & Promotion Tree
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              What happens after you get selected: promotion timelines, in-hand 7th CPC salary growth, government quarters, and lifelong perks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-[#065f46] bg-[#ecfdf5] px-3 py-1.5 border border-[#065f46] shrink-0">
          <Award className="w-4 h-4" />
          <span>7th CPC Pay Matrices</span>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tracks.map(track => {
          const Icon = track.icon;
          const isSelected = activeTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrack(track.id);
                setSelectedNode(0);
              }}
              className={`p-3.5 border-2 text-left transition-all flex items-start space-x-3 ${
                isSelected
                  ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[3px_3px_0px_0px_#1c1f33]'
                  : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:border-[#1c1f33] hover:bg-[#fbf9f5]'
              }`}
            >
              <div className={`p-2 border shrink-0 ${isSelected ? 'bg-white text-[#1c1f33] border-white' : 'bg-[#fbf9f5] text-[#1c1f33] border-[#1c1f33]'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-sans font-extrabold uppercase tracking-wider mb-1 line-clamp-1">
                  {track.title}
                </h4>
                <p className={`text-[11px] font-serif italic line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-[#686f8a]'}`}>
                  {track.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Career Tree Stepper & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Stepper Timeline */}
        <div className="bg-white border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] space-y-3">
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#686f8a] block mb-2 border-b border-[#1c1f33]/20 pb-1">
            Hierarchy Progression:
          </span>

          <div className="space-y-2">
            {currentTrack.nodes.map((node, idx) => {
              const isSelected = selectedNode === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedNode(idx)}
                  className={`p-3 border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#1c1f33]'
                      : 'bg-white text-[#1c1f33] border-[#1c1f33]/30 hover:border-[#1c1f33] hover:bg-[#fbf9f5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[9px] font-mono font-bold uppercase ${isSelected ? 'text-emerald-300' : 'text-[#065f46]'}`}>
                      {node.stage}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-300' : 'text-[#686f8a]'}`}>
                      {node.level}
                    </span>
                  </div>
                  <h4 className="text-xs font-title font-bold leading-snug">
                    {node.title}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className={`font-semibold ${isSelected ? 'text-white' : 'text-[#1c1f33]'}`}>
                      {node.inHand}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-[#686f8a]'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Detailed Node Perks & Responsibilities */}
        <div className="lg:col-span-2 bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col justify-between space-y-5">
          <div>
            {/* Stage Badge & Title */}
            <div className="border-b-2 border-[#1c1f33] pb-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="gazette-stamp border-[#065f46] text-[#065f46] bg-[#ecfdf5]">
                  {currentNode.stage}
                </span>
                <span className="gazette-stamp border-[#1e3a8a] text-[#1e3a8a] bg-[#eff6ff]">
                  {currentNode.level}
                </span>
                <span className="text-[10px] font-mono text-[#686f8a] uppercase">
                  Service Needed: {currentNode.promotionYears}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33]">
                {currentNode.title}
              </h3>
            </div>

            {/* Financials & Housing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33]">
                <div className="flex items-center space-x-1.5 text-xs font-sans font-bold uppercase text-[#686f8a] mb-1">
                  <DollarSign className="w-4 h-4 text-[#065f46]" />
                  <span>Estimated Net Take-Home Pay</span>
                </div>
                <div className="text-xl font-title font-black text-[#065f46]">
                  {currentNode.inHand}
                </div>
                <span className="text-[10px] font-mono text-[#686f8a]">Basic Pay: {currentNode.basicPay} + DA + HRA + TA</span>
              </div>

              <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33]">
                <div className="flex items-center space-x-1.5 text-xs font-sans font-bold uppercase text-[#686f8a] mb-1">
                  <Home className="w-4 h-4 text-[#1e3a8a]" />
                  <span>Residential Quarters Entitlement</span>
                </div>
                <div className="text-xs font-title font-bold text-[#1c1f33] leading-snug">
                  {currentNode.quarters}
                </div>
                <span className="text-[10px] font-serif italic text-[#686f8a]">Subsidized rent and maintenance</span>
              </div>
            </div>

            {/* Mandate & Responsibilities */}
            <div className="p-3.5 bg-[#fbf9f5] border border-[#1c1f33] mb-4 space-y-1">
              <span className="text-[10px] font-sans font-extrabold uppercase text-[#1c1f33] block">
                Primary Official Mandate:
              </span>
              <p className="text-xs font-serif italic text-[#383e5c] leading-relaxed">
                {currentNode.responsibilities}
              </p>
            </div>

            {/* Associated Government Perks */}
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-extrabold uppercase text-[#1c1f33] block">
                Lifelong Benefits & Entitlements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {currentNode.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="p-2.5 bg-white border border-[#1c1f33] flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#065f46] shrink-0 mt-0.5" />
                    <span className="text-[11px] font-serif leading-snug text-[#1c1f33]">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Motivation Colophon */}
          <div className="p-3 bg-[#ecfdf5] border border-[#065f46] flex items-center justify-between text-xs font-serif italic text-[#065f46]">
            <span>Full job security with zero private layoff risks under Article 311 of the Constitution of India.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
