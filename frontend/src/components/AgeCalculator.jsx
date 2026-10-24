import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Calendar, 
  Award,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('2002-05-15');
  const [cutoffDate, setCutoffDate] = useState('2026-10-23');
  const [category, setCategory] = useState('GEN');
  const [selectedExam, setSelectedExam] = useState('nic_scientist_b');

  const examPresets = [
    { id: 'nic_scientist_b', name: "NIC Scientist 'B' (MeitY)", minAge: 21, maxAge: 30 },
    { id: 'nic_sta_a', name: "NIC Scientific/Technical Assistant 'A'", minAge: 18, maxAge: 30 },
    { id: 'ibps_so_it', name: 'IBPS Specialist Officer IT (Scale I)', minAge: 20, maxAge: 30 },
    { id: 'isro_tech_asst', name: 'ISRO Technical Assistant (Computers)', minAge: 18, maxAge: 35 },
    { id: 'ssc_imd', name: 'SSC IMD Scientific Assistant', minAge: 18, maxAge: 30 },
    { id: 'state_psc', name: 'State PSC Technical Officers (General)', minAge: 18, maxAge: 36 },
    { id: 'custom', name: 'Custom Age Limits', minAge: 18, maxAge: 30 }
  ];

  const categories = [
    { id: 'GEN', name: 'General / Unreserved (UR)', relaxation: 0 },
    { id: 'EWS', name: 'Economically Weaker Section (EWS)', relaxation: 0 },
    { id: 'OBC', name: 'Other Backward Classes (OBC-NCL)', relaxation: 3 },
    { id: 'SC_ST', name: 'Scheduled Caste / Scheduled Tribe (SC/ST)', relaxation: 5 },
    { id: 'PWBD_GEN', name: 'PwBD (General / EWS)', relaxation: 10 },
    { id: 'PWBD_OBC', name: 'PwBD (OBC-NCL)', relaxation: 13 },
    { id: 'PWBD_SC_ST', name: 'PwBD (SC/ST)', relaxation: 15 },
    { id: 'EX_SERVICEMEN', name: 'Ex-Servicemen (ESM)', relaxation: 5 }
  ];

  const currentExam = examPresets.find(e => e.id === selectedExam) || examPresets[0];
  const currentCategory = categories.find(c => c.id === category) || categories[0];

  const calculateAge = () => {
    if (!dob || !cutoffDate) return null;

    const birth = new Date(dob);
    const cutoff = new Date(cutoffDate);

    if (isNaN(birth.getTime()) || isNaN(cutoff.getTime())) return null;

    let years = cutoff.getFullYear() - birth.getFullYear();
    let months = cutoff.getMonth() - birth.getMonth();
    let days = cutoff.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(cutoff.getFullYear(), cutoff.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const effectiveMaxAge = currentExam.maxAge + currentCategory.relaxation;
    const isUnderage = years < currentExam.minAge;
    const isOverage = years > effectiveMaxAge || (years === effectiveMaxAge && (months > 0 || days > 0));
    const isEligible = !isUnderage && !isOverage;

    return {
      years,
      months,
      days,
      effectiveMaxAge,
      minAge: currentExam.minAge,
      isEligible,
      isUnderage,
      isOverage
    };
  };

  const result = calculateAge();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border-2 border-[#1c1f33] p-6 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#fbf9f5] border-1.5 border-[#1c1f33] flex items-center justify-center text-[#1c1f33] shrink-0" style={{ border: '1.5px solid #1c1f33' }}>
            <Calculator className="w-6 h-6 text-[#065f46]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-title font-bold text-[#1c1f33] tracking-tight">
              Section 6: Government Age Cutoff & Reservation Calculator
            </h2>
            <p className="text-xs font-serif italic text-[#383e5c]">
              Verify eligibility against official recruitment cutoff dates with DoPT category age relaxations (OBC, SC/ST, PwBD).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase text-[#065f46] bg-[#ecfdf5] px-3 py-1.5 border border-[#065f46] shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>DoPT Norms Verified</span>
        </div>
      </div>

      {/* Main Calculator Form & Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input Parameters */}
        <div className="bg-white border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] space-y-4">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5 border-b border-[#1c1f33]/20 pb-2">
            <Calendar className="w-4 h-4 text-[#065f46]" />
            <span>1. Candidate Birth & Target Notice</span>
          </h3>

          <div>
            <label className="text-[11px] font-sans font-extrabold uppercase text-[#1c1f33] block mb-1">
              Date of Birth (As per 10th Class Certificate)
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-[#fbf9f5] border border-[#1c1f33] px-3 py-2 text-xs font-sans text-[#1c1f33] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-sans font-extrabold uppercase text-[#1c1f33] block mb-1">
              Notice Cutoff Reference Date (Crucial Date)
            </label>
            <input
              type="date"
              value={cutoffDate}
              onChange={(e) => setCutoffDate(e.target.value)}
              className="w-full bg-[#fbf9f5] border border-[#1c1f33] px-3 py-2 text-xs font-sans text-[#1c1f33] focus:outline-none"
            />
            <span className="text-[10px] font-serif italic text-[#686f8a] block mt-0.5">
              Usually the closing date of application or 1st Jan of the active recruitment year
            </span>
          </div>

          <div>
            <label className="text-[11px] font-sans font-extrabold uppercase text-[#1c1f33] block mb-1">
              Target Examination / Cadre
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full bg-[#fbf9f5] border border-[#1c1f33] px-3 py-2 text-xs font-sans text-[#1c1f33] focus:outline-none cursor-pointer"
            >
              {examPresets.map(ep => (
                <option key={ep.id} value={ep.id}>
                  {ep.name} (Base Limit: {ep.minAge}–{ep.maxAge} Yrs)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-sans font-extrabold uppercase text-[#1c1f33] block mb-1">
              Reservation Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#fbf9f5] border border-[#1c1f33] px-3 py-2 text-xs font-sans text-[#1c1f33] focus:outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.relaxation > 0 ? `(+${c.relaxation} Yrs Relaxation)` : ''}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Right: Calculated Verdict Box */}
        <div className="bg-white border-2 border-[#1c1f33] p-5 shadow-[4px_4px_0px_0px_#1c1f33] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-wider text-[#1c1f33] flex items-center space-x-1.5 border-b border-[#1c1f33]/20 pb-2 mb-3">
              <Award className="w-4 h-4 text-[#065f46]" />
              <span>2. Official Age Verdict & Calculations</span>
            </h3>

            {result ? (
              <div className="space-y-4">
                {/* Age Display Box */}
                <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] text-center">
                  <span className="text-[10px] font-sans font-extrabold uppercase text-[#686f8a] block mb-1">
                    Your Exact Age on Cutoff Date
                  </span>
                  <div className="text-2xl sm:text-3xl font-title font-black text-[#1c1f33]">
                    {result.years} <span className="text-sm font-sans font-normal text-[#686f8a]">Years</span> {result.months} <span className="text-sm font-sans font-normal text-[#686f8a]">Mos</span> {result.days} <span className="text-sm font-sans font-normal text-[#686f8a]">Days</span>
                  </div>
                  <div className="mt-2 text-xs font-serif italic text-[#383e5c]">
                    Permissible Upper Age for {currentCategory.name}: <strong>{result.effectiveMaxAge} Years</strong>
                  </div>
                </div>

                {/* Verdict Stamp Banner */}
                {result.isEligible ? (
                  <div className="p-4 bg-[#ecfdf5] border-2 border-[#065f46] text-center space-y-1">
                    <div className="flex items-center justify-center space-x-1.5 text-[#065f46] font-sans font-black text-sm uppercase">
                      <CheckCircle className="w-5 h-5" />
                      <span>ELIGIBLE TO APPLY</span>
                    </div>
                    <p className="text-xs font-serif italic text-[#065f46]">
                      You satisfy the age criteria for this post. You have <strong>{result.effectiveMaxAge - result.years} years</strong> margin remaining before the upper cutoff.
                    </p>
                  </div>
                ) : result.isOverage ? (
                  <div className="p-4 bg-[#fef2f2] border-2 border-[#991b1b] text-center space-y-1">
                    <div className="flex items-center justify-center space-x-1.5 text-[#991b1b] font-sans font-black text-sm uppercase">
                      <AlertTriangle className="w-5 h-5" />
                      <span>OVERAGED FOR THIS POST</span>
                    </div>
                    <p className="text-xs font-serif italic text-[#991b1b]">
                      You exceed the maximum permissible upper age limit ({result.effectiveMaxAge} Years) for {currentCategory.name}.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#fffbeb] border-2 border-[#92400e] text-center space-y-1">
                    <div className="flex items-center justify-center space-x-1.5 text-[#92400e] font-sans font-black text-sm uppercase">
                      <Clock className="w-5 h-5" />
                      <span>UNDERAGED</span>
                    </div>
                    <p className="text-xs font-serif italic text-[#92400e]">
                      You must be at least {result.minAge} years old as of the cutoff date to be admitted.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-serif italic text-[#686f8a]">
                Enter your Date of Birth and Cutoff date to view eligibility verdict.
              </p>
            )}
          </div>

          {/* Quick Regulatory Guidance */}
          <div className="p-3 bg-[#fbf9f5] border border-[#1c1f33]/30 text-[11px] font-serif italic text-[#383e5c] space-y-1">
            <span className="font-sans font-bold uppercase not-italic text-[#1c1f33] text-[10px] block">
              Important Attestation Guidance:
            </span>
            <p>
              • DOB entered on application portals MUST match your Class 10 (Secondary School Leaving Certificate).
            </p>
            <p>
              • OBC-NCL and EWS reservation benefit claims require a certificate issued within the active financial cycle.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
