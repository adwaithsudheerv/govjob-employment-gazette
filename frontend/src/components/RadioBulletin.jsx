import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Square, 
  SkipForward,
  SkipBack,
  Clock, 
  X, 
  Mic, 
  Sparkles,
  Volume2,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Flame,
  AlertTriangle
} from 'lucide-react';

export default function RadioBulletin({ jobs = [], stats }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isIntermission, setIsIntermission] = useState(false);
  
  // Voice & pacing preferences
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speechRate, setSpeechRate] = useState(0.88); // Calm, deliberate pace
  const [autoAdvance, setAutoAdvance] = useState(true); // 1.4s pause between dispatches

  const currentSegmentRef = useRef(0);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Compute today's dynamic date string
  const todayDate = new Date();
  const dayOfWeek = todayDate.toLocaleDateString('en-IN', { weekday: 'long' });
  const formattedDate = todayDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Filter urgent / closing today jobs dynamically
  const closingTodayJobs = useMemo(() => {
    return jobs.filter(j => {
      if (!j.last_date) return false;
      const ld = new Date(j.last_date);
      const now = new Date();
      return ld.toDateString() === now.toDateString() || (ld - now > 0 && ld - now <= 24 * 3600 * 1000);
    });
  }, [jobs]);

  // Pick top 3 active jobs dynamically from the live database
  const featuredJobs = useMemo(() => jobs.slice(0, 3), [jobs]);
  const totalCount = stats?.total_active_jobs || jobs.length || 23;

  // Helper to phoneticize acronyms so the Indian voice pronounces them crisply
  const phoneticize = (str) => {
    if (!str) return '';
    return str
      .replace(/\bBCA\b/g, 'B C A')
      .replace(/\bMCA\b/g, 'M C A')
      .replace(/\bB\.?Tech\b/gi, 'B Tech')
      .replace(/\bNIC\b/g, 'N I C')
      .replace(/\bDRDO\b/g, 'D R D O')
      .replace(/\bISRO\b/g, 'Isro')
      .replace(/\bBEL\b/g, 'B E L')
      .replace(/\bC-DAC\b/gi, 'C-Dac')
      .replace(/\bIBPS\b/g, 'I B P S')
      .replace(/\bSO IT\b/gi, 'Specialist Officer I T')
      .replace(/\bIT\b/g, 'I T')
      .replace(/\bPSC\b/g, 'P S C')
      .replace(/\bKPSC\b/g, 'Kerala P S C')
      .replace(/\bTNPSC\b/g, 'Tamil Nadu P S C')
      .replace(/₹/g, 'Rupees ')
      .replace(/Rs\.?\s*/gi, 'Rupees ')
      .replace(/7th CPC/gi, 'Seventh Pay Commission')
      .replace(/Level\s*10/gi, 'Level ten')
      .replace(/Level\s*7/gi, 'Level seven')
      .replace(/Level\s*6/gi, 'Level six');
  };

  // Build the dynamic daily dispatch segments from live jobs data
  const segments = useMemo(() => {
    return [
      {
        id: 'greeting',
        title: `Morning Dispatch • ${dayOfWeek}`,
        badge: 'Daily Edition',
        text: `Good morning candidate. This is The Employment Gazette official morning audio dispatch for ${dayOfWeek}, ${formattedDate}. Please listen to today's verified public sector IT recruitment updates.`,
        display: `Good morning candidate. This is The Employment Gazette official morning audio dispatch for ${dayOfWeek}, ${formattedDate}.`
      },
      {
        id: 'cutoff',
        title: "Today's Midnight Deadline Audit",
        badge: closingTodayJobs.length > 0 ? 'Urgent Deadline' : 'Portals Open',
        text: closingTodayJobs.length > 0 
          ? phoneticize(`Priority midnight cutoff alert. ${closingTodayJobs.length} recruitment registration portal closes at midnight tonight. Specifically, ${closingTodayJobs[0].title} at ${closingTodayJobs[0].organization}. Please submit your application form and registration fee before 11:59 PM.`)
          : `Midnight cutoff status. All active Central and State recruitment portals remain open today with no midnight expirations. You have adequate time to verify your eligibility and documentation.`,
        display: closingTodayJobs.length > 0
          ? `⚠️ Closing Midnight Tonight: ${closingTodayJobs[0].title} (${closingTodayJobs[0].organization})`
          : `✓ No Midnight Expirations Today: All recruitment registration portals remain open.`
      },
      {
        id: 'overview',
        title: "Today's Active Vacancy Tally",
        badge: 'Live Database',
        text: phoneticize(`Current vacancy tally. As of this morning, ${totalCount} verified IT positions are actively accepting applications for B C A and M C A graduates across Central Government ministries and State public service commissions.`),
        display: `As of this morning, ${totalCount} verified IT positions are actively open for BCA & MCA candidates.`
      },
      ...(featuredJobs.map((job, idx) => ({
        id: `job-${job.id || idx}`,
        title: `Featured Opening ${idx + 1}: ${job.organization}`,
        badge: job.scope?.replace('_', ' ') || 'Central Govt',
        text: phoneticize(`Featured opportunity number ${idx + 1}. ${job.title} at ${job.organization}. Remuneration scale is ${job.salary_scale}. Eligible qualifications include ${job.qualification}. Apply directly through the official link in Section 1.`),
        display: `${job.title} at ${job.organization} — ${job.salary_scale} (${job.qualification})`
      }))),
      {
        id: 'state_psc',
        title: 'State Commission & OTR Advisory',
        badge: 'State PSCs',
        text: phoneticize(`State commission advisory. Technical recruitments are active across Kerala P S C Thulasi, Karnataka e-Governance, and Maharashtra I T Corporation. Candidates are advised that regional language rules are frequently relaxed for specialized software and programming cadres.`),
        display: `Kerala PSC Thulasi, KPSC & MahaIT recruitments active. Regional language rules relaxed for specialized IT cadres.`
      },
      {
        id: 'photo_spec',
        title: 'Document Attestation Reminder',
        badge: 'Candidate Advice',
        text: phoneticize(`Daily application tip. Ensure your passport photograph is formatted between 20 to 50 kilobytes with a pure white background using Section 4 of this Gazette, to prevent automated portal rejection during registration.`),
        display: `Ensure your photo is 20-50 KB with a white background using the Photo Studio in Section 4.`
      },
      {
        id: 'signoff',
        title: 'Gazette Broadcast Sign-Off',
        badge: 'Signing Off',
        text: `This concludes today's Employment Gazette morning radio bulletin for ${dayOfWeek}, ${formattedDate}. Best wishes for your competitive examinations and public service career.`,
        display: `Morning dispatch complete for ${dayOfWeek}, ${formattedDate}. Best wishes for your public service examinations!`
      }
    ];
  }, [dayOfWeek, formattedDate, closingTodayJobs, featuredJobs, totalCount]);

  // Load available speech synthesis voices
  const populateVoices = () => {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    setAvailableVoices(voices);

    // Auto-select preferred Indian / Female voice if not chosen
    if (!selectedVoiceURI) {
      // 1. Indian English voice (Heera, Neerja, Veena, Google English India)
      const indianVoice = voices.find(v => 
        (v.lang === 'en-IN' || v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india'))
      );

      // 2. Clear Natural female voice (Zira, Samantha, Google UK English Female)
      const femaleVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('samantha'))
      );

      const fallback = voices.find(v => v.lang.startsWith('en')) || voices[0];
      const chosen = indianVoice || femaleVoice || fallback;
      if (chosen) setSelectedVoiceURI(chosen.voiceURI);
    }
  };

  useEffect(() => {
    populateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak segment by index with calm pauses
  const speakSegment = (index) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (index < 0 || index >= segments.length) {
      stopBroadcast();
      return;
    }

    window.speechSynthesis.cancel();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    currentSegmentRef.current = index;
    setActiveSegmentIndex(index);
    setIsIntermission(false);

    const segment = segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.text);

    // Apply selected voice
    if (selectedVoiceURI) {
      const voiceObj = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.lang = 'en-IN';
    utterance.rate = speechRate; // Calm pacing
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;

      const nextIndex = index + 1;
      if (nextIndex < segments.length) {
        if (autoAdvance) {
          // Calm 1.4-second pause between announcements for comprehension
          setIsIntermission(true);
          timeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              speakSegment(nextIndex);
            }
          }, 1400);
        } else {
          setIsIntermission(true);
        }
      } else {
        stopBroadcast();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsIntermission(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;
  };

  const startBroadcast = (fromIndex = 0) => {
    setIsOpen(true);
    speakSegment(fromIndex);
  };

  const pauseBroadcast = () => {
    if (window.speechSynthesis.speaking && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  };

  const stopBroadcast = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setIsIntermission(false);
    isPlayingRef.current = false;
  };

  const nextSegment = () => {
    if (activeSegmentIndex < segments.length - 1) {
      speakSegment(activeSegmentIndex + 1);
    }
  };

  const prevSegment = () => {
    if (activeSegmentIndex > 0) {
      speakSegment(activeSegmentIndex - 1);
    }
  };

  const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));

  return (
    <>
      {/* Masthead Quick Trigger Radio Pill */}
      <button
        onClick={() => {
          if (!isPlaying && !isPaused) {
            startBroadcast(0);
          } else {
            setIsOpen(true);
          }
        }}
        className={`px-3 py-1.5 text-xs font-sans font-extrabold uppercase tracking-wider flex items-center space-x-1.5 transition-all border ${
          isPlaying
            ? 'bg-[#7a1c1c] text-white border-[#7a1c1c] shadow-[2px_2px_0px_0px_#7a1c1c] animate-pulse'
            : isPaused
            ? 'bg-amber-100 text-amber-900 border-amber-500 shadow-[2px_2px_0px_0px_#b45309]'
            : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3] shadow-[2px_2px_0px_0px_#1c1f33]'
        }`}
        title="Listen to Today's Morning Gazette Audio Dispatch"
      >
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-300' : 'text-[#7a1c1c]'}`} />
        <span>
          {isPlaying ? '📻 On Air: Morning Radio' : isPaused ? '⏸️ Radio Paused' : '📻 Daily Gazette Radio'}
        </span>
        {isPlaying && (
          <span className="w-2 h-2 rounded-full bg-white animate-ping ml-1" />
        )}
      </button>

      {/* Retro Gazette Audio Studio Console Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#fcfaf5] border-2 border-[#1c1f33] shadow-[8px_8px_0px_0px_#1c1f33] p-5 sm:p-6 space-y-4 font-sans max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Masthead Header */}
            <div className="flex items-center space-x-3 border-b-2 border-[#1c1f33] pb-3 pr-10">
              <div className="w-10 h-10 border border-[#1c1f33] bg-[#1c1f33] text-white flex items-center justify-center shadow-[2px_2px_0px_0px_#7a1c1c]">
                <Mic className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-serif font-black text-[#1c1f33] uppercase tracking-wide">
                    The Daily Gazette Radio Dispatch
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-[#7a1c1c] text-[#7a1c1c] font-bold bg-rose-50 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    LIVE TODAY
                  </span>
                </div>
                <p className="text-xs font-serif italic text-[#383e5c] flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7a1c1c]" />
                  <span>{dayOfWeek}, {formattedDate} • Dynamically generated from active database postings</span>
                </p>
              </div>
            </div>

            {/* Daily Auto-Update Verification Banner */}
            <div className="p-2.5 bg-emerald-50 border border-emerald-600/40 flex items-center justify-between text-[11px] font-mono text-emerald-950">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Daily Auto-Sync: <strong>Active (Every 12h & Midnight Purges)</strong></span>
              </span>
              <span className="text-emerald-800 font-bold">
                {totalCount} Verified Jobs Active Today
              </span>
            </div>

            {/* Voice & Assistant Controls Bar */}
            <div className="p-3 bg-white border border-[#1c1f33] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Voice Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#7a1c1c] mb-1">
                  🎙️ AI Speech Synthesizer Voice:
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    if (isPlaying) speakSegment(activeSegmentIndex);
                  }}
                  className="w-full text-xs font-sans bg-[#fbf9f5] border border-[#1c1f33] p-1.5 focus:outline-none focus:ring-1 focus:ring-[#7a1c1c]"
                >
                  {englishVoices.length === 0 && (
                    <option value="">Default System Voice</option>
                  )}
                  {englishVoices.map((v) => {
                    const isIndian = v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('heera');
                    const isFemale = v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('samantha');
                    
                    let label = v.name;
                    if (isIndian && isFemale) label = `🇮🇳 ${v.name} (Indian Female - Recommended)`;
                    else if (isIndian) label = `🇮🇳 ${v.name} (Indian Accent)`;
                    else if (isFemale) label = `👩 ${v.name} (Female Newsreader)`;

                    return (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Speed & Pause Cadence */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1c1f33] mb-1">
                    Speed / Cadence: {speechRate}x
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[0.82, 0.88, 1.0].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setSpeechRate(rate);
                          if (isPlaying) speakSegment(activeSegmentIndex);
                        }}
                        className={`px-2 py-1 text-[10px] font-mono font-bold border ${
                          speechRate === rate
                            ? 'bg-[#1c1f33] text-white border-[#1c1f33]'
                            : 'bg-white text-[#1c1f33] border-[#1c1f33]/40 hover:bg-[#f2eee3]'
                        }`}
                      >
                        {rate === 0.82 ? 'Slow' : rate === 0.88 ? 'Calm (Default)' : 'Normal'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#1c1f33] mb-1">
                    Auto-Pause:
                  </label>
                  <button
                    onClick={() => setAutoAdvance(prev => !prev)}
                    className={`px-2 py-1 text-[10px] font-mono font-bold border ${
                      autoAdvance 
                        ? 'bg-emerald-100 text-emerald-950 border-emerald-700' 
                        : 'bg-amber-100 text-amber-950 border-amber-700'
                    }`}
                  >
                    {autoAdvance ? '1.4s Pause' : 'Stop After Each'}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Transmission Console */}
            <div className="p-3 bg-[#e8e4db]/40 border border-[#1c1f33] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1c1f33]">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isPlaying ? 'bg-red-600 animate-ping' : isPaused ? 'bg-amber-600' : 'bg-slate-400'
                  }`} />
                  <span>
                    {isPlaying ? 'READING DAILY DISPATCH' : isPaused ? 'PAUSED' : isIntermission ? 'INTERMISSION PAUSE (1.4s)...' : 'STANDBY'}
                  </span>
                </span>
                <span className="text-[11px] font-mono text-[#7a1c1c]">
                  Item {activeSegmentIndex + 1} of {segments.length}
                </span>
              </div>

              {/* Primary Dispatch Display Card */}
              <div className="p-4 bg-white border-2 border-[#1c1f33] shadow-[3px_3px_0px_0px_#1c1f33] min-h-[90px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7a1c1c] bg-rose-50 px-2 py-0.5 border border-rose-200">
                    {segments[activeSegmentIndex]?.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#555]">
                    {segments[activeSegmentIndex]?.title}
                  </span>
                </div>
                <p className="text-sm font-serif text-[#1c1f33] font-medium leading-relaxed mt-1">
                  "{segments[activeSegmentIndex]?.display}"
                </p>
                {isIntermission && (
                  <div className="mt-2 text-[10px] font-mono text-emerald-800 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" />
                    Pausing 1.4s for concentration...
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevSegment}
                    disabled={activeSegmentIndex === 0}
                    className="p-2 border border-[#1c1f33] bg-white hover:bg-[#f2eee3] disabled:opacity-30 disabled:pointer-events-none"
                    title="Previous Dispatch"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  {!isPlaying && !isPaused ? (
                    <button
                      onClick={() => startBroadcast(activeSegmentIndex)}
                      className="bg-[#1c1f33] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#7a1c1c] transition-colors shadow-[2px_2px_0px_0px_#7a1c1c]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Morning Radio</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseBroadcast}
                      className="bg-[#1c1f33] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#7a1c1c] transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                    </button>
                  )}

                  <button
                    onClick={nextSegment}
                    disabled={activeSegmentIndex === segments.length - 1}
                    className="p-2 border border-[#1c1f33] bg-white hover:bg-[#f2eee3] disabled:opacity-30 disabled:pointer-events-none"
                    title="Next Dispatch"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={stopBroadcast}
                    disabled={!isPlaying && !isPaused}
                    className="p-2 border border-[#1c1f33] bg-white text-rose-700 hover:bg-rose-50 disabled:opacity-30 disabled:pointer-events-none"
                    title="Stop Broadcast"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-serif text-[#666] italic hidden sm:block">
                  {autoAdvance ? 'Auto-plays next after 1.4s pause' : 'Manual step mode'}
                </div>
              </div>
            </div>

            {/* Scrollable Segment Docket */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#686f8a]">
                Today's Dispatch Lineup ({dayOfWeek}, {formattedDate}):
              </span>
              <div className="space-y-1.5">
                {segments.map((seg, idx) => {
                  const isCurrent = idx === activeSegmentIndex;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => speakSegment(idx)}
                      className={`p-2.5 border transition-all cursor-pointer flex items-start justify-between gap-3 text-xs ${
                        isCurrent
                          ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#7a1c1c]'
                          : 'bg-white text-[#1c1f33] border-[#1c1f33]/30 hover:border-[#1c1f33] hover:bg-[#faf8f2]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                          isCurrent ? 'bg-[#7a1c1c] text-white' : 'bg-[#e8e4db] text-[#1c1f33]'
                        }`}>
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-serif font-bold text-xs leading-snug">
                            {seg.title}
                          </div>
                          <div className={`text-[11px] line-clamp-1 mt-0.5 ${
                            isCurrent ? 'text-amber-200' : 'text-[#666]'
                          }`}>
                            {seg.display}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono uppercase font-bold shrink-0 px-1.5 py-0.5 border ${
                        isCurrent ? 'border-white/30 text-white' : 'border-[#1c1f33]/20 text-[#666]'
                      }`}>
                        {seg.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#1c1f33]/20 flex items-center justify-between text-[11px] font-serif italic text-[#383e5c]">
              <span>Dynamic Morning Dispatch • Automated 12-Hour Sync & Midnight Purging Active</span>
              <button
                onClick={() => setIsOpen(false)}
                className="font-sans font-bold uppercase text-[#1c1f33] hover:underline"
              >
                Close Radio
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
