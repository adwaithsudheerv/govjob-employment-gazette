import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  ExternalLink, 
  Copy, 
  Sparkles,
  Link2,
  Lock,
  ArrowRight
} from 'lucide-react';

const PRESET_CLAUSES = [
  {
    id: 'bel-bond',
    title: 'BEL Project Engineer - 3 Year Service Bond',
    source: 'Bharat Electronics Ltd (BEL) Official Advt 2024',
    category: 'Service Bond & Monetary Penalty',
    text: `Candidates selected as Project Engineer will be required to execute a Service Agreement Bond to serve the Company for a minimum period of 3 years. In the event of resigning before completion of 3 years, the candidate shall be liable to pay liquidated damages of Rs. 2,00,000/- (Rupees Two Lakhs only) along with 18% GST and 3 months notice pay in lieu thereof.`,
    tags: ['Service Bond', 'Financial Liability', '3 Years']
  },
  {
    id: 'nic-aggregate',
    title: 'NIC Scientist B - Strict 60% Aggregate (No Rounding Off)',
    source: 'National Informatics Centre (NIELIT/NIC Advt 2023)',
    category: 'Strict Cutoff & Degree Equivalence',
    text: `Candidates must possess First Class MCA or B.E/B.Tech in Computer Science/IT with minimum 60% aggregate marks. Rounding off of marks is strictly not permissible; a candidate securing 59.99% will NOT be treated as having secured 60%. CGPA conversion must follow the official University formula with authenticated certificate attached at document verification.`,
    tags: ['Aggregate Trap', 'No Rounding Off', 'MCA Eligibility']
  },
  {
    id: 'ibps-probation',
    title: 'IBPS SO IT Officer - 2-Year Probation & Assessment Test',
    source: 'IBPS Specialist Officer CRP SPL-XIII',
    category: 'Probation & Permanent Retention',
    text: `The selected candidates will be on probation for a period of 2 (Two) years from the date of joining. The confirmation in the service is subject to satisfactory performance and passing of the Internal Assessment Examination / Confirmation Test conducted by the respective Participating Bank prior to the expiry of the probation period.`,
    tags: ['2-Year Probation', 'Confirmation Exam', 'Public Sector Bank']
  },
  {
    id: 'coaching-scam',
    title: 'Suspicious Job Application Portal (Fake Railway/Postal IT Job)',
    source: 'Phishing Circular Circulating on WhatsApp',
    category: 'Domain & Application Portal Legitimacy',
    text: `Apply online for 1,450 IT Assistant posts in Ministry of Communications at http://postal-recruitment2024.org/apply. Application fee of Rs. 850 must be paid via UPI scanner on the third party portal. Admit cards will be delivered on email within 48 hours of payment.`,
    tags: ['Scam Alert', 'Fake Domain', 'UPI Fraud']
  }
];

const TRAP_RULES = [
  {
    id: 'bond',
    name: 'Service Agreement & Exit Bond Clause',
    severity: 'danger',
    patterns: [
      /service (agreement )?bond/i,
      /liquidated damages/i,
      /bond (amount|of rs|sum)/i,
      /rs\.?\s*\d+[,0-9]*\s*(lakh|lakhs|\/-)/i,
      /minimum period of \d+ years/i,
      /surety/i
    ],
    verdict: 'FINANCIAL BOND ENFORCEMENT DETECTED',
    explanation: 'This clause binds you to the organization for a mandatory tenure. Leaving before the term will force you or your guarantor to pay the bond amount in cash plus GST. Check if the experience gained matches your career growth before signing.'
  },
  {
    id: 'aggregate_trap',
    name: 'Strict Aggregate % Trap (No Rounding Off)',
    severity: 'warning',
    patterns: [
      /rounding off (of marks )?is (strictly )?not (permissible|allowed)/i,
      /59\.99%/i,
      /strict(ly)? 60%/i,
      /first class with minimum/i,
      /conversion formula/i
    ],
    verdict: 'ABSOLUTE CUTOFF RULE (NO LENIENCY)',
    explanation: 'Govt selection boards (like NIELIT, ISRO, DRDO) disqualify candidates with even 59.98% if 60% is mandated. Obtain an official University CGPA conversion certificate signed by the Registrar prior to interview stage.'
  },
  {
    id: 'scam_domain',
    name: 'Non-Government Portal / Fake Application URL',
    severity: 'critical',
    patterns: [
      /http:\/\/(?!.*\.gov\.in|.*\.nic\.in|.*\.ac\.in|.*\.res\.in)/i,
      /https?:\/\/(www\.)?[a-zA-Z0-9-]+\.(org|xyz|online|live|info|me|co\.in|club|site)/i,
      /upi scanner/i,
      /pay.*whatsapp/i
    ],
    verdict: 'HIGH RISK: SUSPICIOUS UNOFFICIAL PORTAL',
    explanation: 'Legitimate Central and State recruitment portals ONLY end in .gov.in or .nic.in (or established university/autonomous domains like .ac.in / .res.in). Never transfer application fees via direct UPI or on unofficial .org / .xyz websites.'
  },
  {
    id: 'probation_screening',
    name: 'Probation Confirmation Screening',
    severity: 'info',
    patterns: [
      /probation (for a )?period of/i,
      /confirmation test/i,
      /internal assessment/i,
      /satisfactory completion of probation/i
    ],
    verdict: 'PROBATION & PERFORMANCE EVALUATION',
    explanation: 'Entry-level Officer and Scientist roles standardly mandate 1 to 2 years probation. Ensure you clarify whether confirmation requires passing departmental aptitude/technical assessments.'
  },
  {
    id: 'degree_equivalence',
    name: 'MCA / BCA Qualification Equivalence',
    severity: 'info',
    patterns: [
      /mca.*equivalent/i,
      /b\.?sc.*computer/i,
      /bca/i,
      /doeacc.*level/i,
      /aicte approved/i
    ],
    verdict: 'DEGREE RECOGNITION & EQUIVALENCE CLAUSE',
    explanation: 'Ensure your MCA degree is from an AICTE/UGC recognized university. If applying with BCA where B.Sc CS is written, carry an Equivalence Certificate issued by your State Higher Education Council.'
  }
];

export default function ClauseTrapDetector() {
  const [inputText, setInputText] = useState('');
  const [urlToCheck, setUrlToCheck] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [urlResult, setUrlResult] = useState(null);

  const analyzeClause = (textToScan) => {
    const text = textToScan || inputText;
    if (!text.trim()) return;

    const detectedTraps = [];
    TRAP_RULES.forEach(rule => {
      const matched = rule.patterns.some(pattern => pattern.test(text));
      if (matched) {
        detectedTraps.push(rule);
      }
    });

    const hasCritical = detectedTraps.some(t => t.severity === 'critical' || t.severity === 'danger');
    const hasWarning = detectedTraps.some(t => t.severity === 'warning');

    let overallStatus = 'SAFE';
    let statusColor = 'green';
    let summary = 'No high-risk clauses or monetary penalty patterns identified in this text snippet.';

    if (hasCritical) {
      overallStatus = 'HIGH RISK / FINANCIAL BOND';
      statusColor = 'red';
      summary = 'Caution: This notification excerpt contains enforceable financial liabilities, non-standard exit terms, or suspicious payment indicators.';
    } else if (hasWarning) {
      overallStatus = 'STRICT ELIGIBILITY COMPLIANCE REQUIRED';
      statusColor = 'amber';
      summary = 'Attention: This excerpt enforces rigid academic cutoffs or equivalence requirements. Zero tolerance for CGPA approximation.';
    } else if (detectedTraps.length > 0) {
      overallStatus = 'STANDARD CONDITIONS DETECTED';
      statusColor = 'blue';
      summary = 'Contains standard public sector employment terms (probation / qualification verification).';
    }

    setAnalysisResult({
      status: overallStatus,
      statusColor,
      summary,
      detectedTraps,
      wordCount: text.trim().split(/\s+/).length,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const verifyPortalDomain = (e) => {
    e.preventDefault();
    if (!urlToCheck.trim()) return;

    let cleanUrl = urlToCheck.trim().toLowerCase();
    try {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const parsed = new URL(cleanUrl);
      const hostname = parsed.hostname;

      const isGov = hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in');
      const isEduRes = hostname.endsWith('.ac.in') || hostname.endsWith('.res.in') || hostname.endsWith('.edu.in');
      const isKnownPsu = ['bel-india.in', 'sail.co.in', 'isro.gov.in', 'drdo.gov.in', 'ibps.in', 'sbi.co.in', 'bhel.in'].some(d => hostname.endsWith(d));

      if (isGov || hostname.endsWith('.nic.in')) {
        setUrlResult({
          valid: true,
          badge: 'OFFICIAL CENTRAL/STATE GOVERNMENT DOMAIN',
          color: 'emerald',
          domain: hostname,
          message: `Verified: The domain "${hostname}" is hosted on the National Informatics Centre (NIC) / Government of India secure registry. Safe for application submission.`
        });
      } else if (isEduRes || isKnownPsu) {
        setUrlResult({
          valid: true,
          badge: 'VERIFIED AUTONOMOUS/PSU PORTAL',
          color: 'blue',
          domain: hostname,
          message: `Verified: "${hostname}" belongs to an established public research institute, central autonomous university, or Navratna PSU portal.`
        });
      } else {
        setUrlResult({
          valid: false,
          badge: 'UNOFFICIAL / THIRD-PARTY COMMERCIAL DOMAIN',
          color: 'rose',
          domain: hostname,
          message: `Caution: "${hostname}" is a private commercial or generic top-level domain (.com, .org, .xyz). Central and State job gazettes do NOT host applications on unofficial domains. Beware of fee collection scams.`
        });
      }
    } catch {
      setUrlResult({
        valid: false,
        badge: 'INVALID URL FORMAT',
        color: 'rose',
        domain: urlToCheck,
        message: 'Please enter a valid web address, e.g. "upsc.gov.in" or "nielit.gov.in".'
      });
    }
  };

  const loadPreset = (preset) => {
    setInputText(preset.text);
    analyzeClause(preset.text);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 shadow-[3px_3px_0px_0px_#1a2530] relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-10">
          <ShieldAlert className="w-32 h-32 text-[#1a2530]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7a1c1c] mb-2 font-mono">
          <span>Official Gazette Scrutiny Bureau</span>
          <span>•</span>
          <span>Section 10</span>
          <span>•</span>
          <span>Legal & Clause Trap Scanner</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1a2530] mb-2">
          The Official Clause & Trap Detector
        </h2>
        <p className="text-sm font-serif text-[#4a5568] max-w-3xl leading-relaxed">
          Public sector IT recruitment advertisements often feature concealed liability terms: liquidated damages of ₹2–3 Lakhs, strict non-rounding 60% aggregate clauses disqualifying 59.9% graduates, and third-party fee scams. Paste any clause or notification link below for immediate forensic verification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Clauses & Domain Verifier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Domain Verifier */}
          <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[2px_2px_0px_0px_#1a2530]">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-[#7a1c1c]" />
              <h3 className="font-serif font-bold text-sm text-[#1a2530] uppercase tracking-wide">
                1. Official Domain Authenticator
              </h3>
            </div>
            <p className="text-xs text-[#555] font-serif mb-3">
              Verify if an application link is a genuine Government (.gov.in / .nic.in) portal or a phishing blog.
            </p>
            <form onSubmit={verifyPortalDomain} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. nielit.gov.in or ssc.nic.in"
                  value={urlToCheck}
                  onChange={(e) => setUrlToCheck(e.target.value)}
                  className="flex-1 text-xs font-mono bg-white border border-[#1a2530] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#7a1c1c]"
                />
                <button
                  type="submit"
                  className="bg-[#1a2530] text-[#fcfaf5] px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#7a1c1c] transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>

            {urlResult && (
              <div className={`mt-3 p-3 border text-xs font-serif ${
                urlResult.valid ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-rose-50 border-rose-600 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 font-mono font-bold text-[11px] mb-1">
                  {urlResult.valid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />}
                  <span>{urlResult.badge}</span>
                </div>
                <p className="leading-snug">{urlResult.message}</p>
              </div>
            )}
          </div>

          {/* Preset Real-World Clauses */}
          <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[2px_2px_0px_0px_#1a2530]">
            <div className="flex items-center justify-between mb-3 border-b border-[#1a2530]/20 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#7a1c1c]" />
                <h3 className="font-serif font-bold text-sm text-[#1a2530] uppercase tracking-wide">
                  2. Authentic Notification Samples
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#7a1c1c] font-bold">CLICK TO TEST</span>
            </div>
            <div className="space-y-3">
              {PRESET_CLAUSES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className="p-3 bg-white border border-[#1a2530]/30 hover:border-[#1a2530] hover:shadow-[2px_2px_0px_0px_#1a2530] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-serif font-bold text-[#1a2530] group-hover:text-[#7a1c1c] transition-colors leading-tight">
                      {preset.title}
                    </h4>
                    <span className="text-[9px] font-mono font-bold text-[#555] uppercase shrink-0 bg-[#e8e4db] px-1.5 py-0.5">
                      {preset.category.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666] font-serif line-clamp-2 italic mb-2">
                    "{preset.text}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#7a1c1c]">
                    <span>Source: {preset.source}</span>
                    <span className="font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Scan <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Text Scanner & Verdict Report (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-5 shadow-[3px_3px_0px_0px_#1a2530]">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="clauseInput" className="font-serif font-bold text-sm text-[#1a2530] uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7a1c1c]" />
                Clause Text Inspector
              </label>
              {inputText && (
                <button
                  onClick={() => { setInputText(''); setAnalysisResult(null); }}
                  className="text-[10px] font-mono text-[#7a1c1c] underline hover:text-[#1a2530]"
                >
                  Clear Screen
                </button>
              )}
            </div>
            <textarea
              id="clauseInput"
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste any clause from an official PDF (e.g. Service bond, bond amount, minimum marks criteria, probation period, or application instructions)..."
              className="w-full text-xs font-serif leading-relaxed bg-white border border-[#1a2530] p-3 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c] resize-y placeholder:italic"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#666]">
                {inputText ? `${inputText.trim().split(/\s+/).length} words entered` : 'Enter text to trigger legal clause parser'}
              </span>
              <button
                onClick={() => analyzeClause()}
                disabled={!inputText.trim()}
                className="bg-[#7a1c1c] text-[#fcfaf5] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2530] transition-colors disabled:opacity-40 disabled:pointer-events-none shadow-[2px_2px_0px_0px_#1a2530]"
              >
                Inspect Gazette Terms
              </button>
            </div>
          </div>

          {/* Analysis Verdict Display */}
          {analysisResult && (
            <div className="bg-[#fcfaf5] border-2 border-[#1a2530] p-6 shadow-[3px_3px_0px_0px_#1a2530] space-y-5 animate-in fade-in duration-200">
              {/* Verdict Header Stamp */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#1a2530] pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#7a1c1c] font-bold">
                    Official Scrutiny Verdict • {analysisResult.timestamp}
                  </div>
                  <div className={`text-xl font-serif font-black tracking-tight mt-0.5 ${
                    analysisResult.statusColor === 'red' ? 'text-red-700' :
                    analysisResult.statusColor === 'amber' ? 'text-amber-800' :
                    analysisResult.statusColor === 'blue' ? 'text-blue-800' : 'text-emerald-800'
                  }`}>
                    {analysisResult.status}
                  </div>
                </div>

                <div className={`px-3 py-1.5 border-2 text-xs font-mono font-bold uppercase tracking-wider ${
                  analysisResult.statusColor === 'red' ? 'bg-red-50 border-red-700 text-red-800 shadow-[2px_2px_0px_0px_#b91c1c]' :
                  analysisResult.statusColor === 'amber' ? 'bg-amber-50 border-amber-700 text-amber-900 shadow-[2px_2px_0px_0px_#b45309]' :
                  'bg-emerald-50 border-emerald-700 text-emerald-900 shadow-[2px_2px_0px_0px_#047857]'
                }`}>
                  {analysisResult.detectedTraps.length} Trigger(s) Found
                </div>
              </div>

              {/* Summary Note */}
              <p className="text-xs font-serif text-[#1a2530] leading-relaxed bg-[#e8e4db]/50 p-3 border-l-4 border-[#1a2530] italic">
                "{analysisResult.summary}"
              </p>

              {/* Detected Triggers List */}
              {analysisResult.detectedTraps.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-[#1a2530] uppercase tracking-wider">
                    Detailed Legal Analysis & Candidate Guidance:
                  </h4>
                  {analysisResult.detectedTraps.map((trap, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 border ${
                        trap.severity === 'danger' || trap.severity === 'critical' ? 'bg-red-50/70 border-red-300' :
                        trap.severity === 'warning' ? 'bg-amber-50/70 border-amber-300' :
                        'bg-blue-50/70 border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${
                          trap.severity === 'danger' || trap.severity === 'critical' ? 'text-red-700' :
                          trap.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'
                        }`} />
                        <span className="font-serif font-bold text-xs text-[#1a2530]">
                          {trap.name}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] font-bold text-[#7a1c1c] uppercase tracking-wider mb-2">
                        {trap.verdict}
                      </div>
                      <p className="text-xs font-serif text-[#333] leading-relaxed">
                        {trap.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-serif leading-relaxed flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block font-mono text-[11px] mb-0.5">CLEAN EXCERPT DETECTED</span>
                    This clause does not contain aggressive bond penalties, liquidated damage amounts, or non-standard qualification restrictions. Standard Central/State service rules apply.
                  </div>
                </div>
              )}

              {/* Standard Cautionary Footnote */}
              <div className="text-[11px] font-serif text-[#666] pt-2 border-t border-[#1a2530]/20 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#7a1c1c]" />
                <span>
                  Notice: Automated semantic analysis based on Central Civil Services (CCS) Conduct Rules and standard PSU bond precedents. Always refer to the signed physical gazette copy before signing service agreements.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
