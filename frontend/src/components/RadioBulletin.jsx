import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Square, 
  SkipForward,
  SkipBack,
  Volume2, 
  Clock, 
  X, 
  Mic, 
  CheckCircle2, 
  Settings2,
  Sparkles,
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
  const [speechRate, setSpeechRate] = useState(0.88); // Relaxed, clear pace
  const [autoAdvance, setAutoAdvance] = useState(true); // Auto-advance with 1.2s pause

  const currentSegmentRef = useRef(0);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Filter urgent / closing today jobs
  const closingTodayJobs = jobs.filter(j => {
    if (!j.last_date) return false;
    const ld = new Date(j.last_date);
    const now = new Date();
    return ld.toDateString() === now.toDateString() || (ld - now > 0 && ld - now <= 24 * 3600 * 1000);
  });

  const featured = jobs.slice(0, 3);

  // Helper to phoneticize acronyms for crystal clear Indian & English AI pronunciation
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

  // Build discrete bulletin segments with proper pauses
  const segments = [
    {
      id: 'greeting',
      title: 'Gazette Morning Introduction',
      badge: 'Opening Dispatch',
      text: `Greetings candidate. This is The Employment Gazette official public sector audio bulletin for ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Please listen to today's critical recruitment advisories.`,
      display: `Greetings candidate. This is The Employment Gazette official public sector audio bulletin for ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.`
    },
    {
      id: 'cutoff',
      title: 'Midnight Deadline Audit',
      badge: closingTodayJobs.length > 0 ? 'Urgent Warning' : 'Safe Window',
      text: closingTodayJobs.length > 0 
        ? phoneticize(`Important deadline notice. ${closingTodayJobs.length} recruitment portal is scheduled to close at midnight today. Specifically, ${closingTodayJobs[0].title} at ${closingTodayJobs[0].organization}. Please submit your online form before 11:59 PM.`)
        : `Deadline status report. All active Central and State recruitment portals remain open with no midnight expirations today. You have sufficient time to prepare your documentation.`,
      display: closingTodayJobs.length > 0
        ? `⚠️ Closing Midnight: ${closingTodayJobs[0].title} at ${closingTodayJobs[0].organization}. Submit before 11:59 PM.`
        : `✓ No Midnight Expirations Today: All recruitment portals remain open.`
    },
    {
      id: 'overview',
      title: 'Active Recruitment Count',
      badge: 'National Summary',
      text: phoneticize(`Vacancy tally. Currently, ${stats?.total_active_jobs || jobs.length || 23} verified IT vacancies are actively accepting applications for B C A and M C A graduates across Central Ministries and State Commissions.`),
      display: `${stats?.total_active_jobs || jobs.length || 23} verified IT recruitments currently active for BCA & MCA candidates.`
    },
    ...(featured.map((job, idx) => ({
      id: `job-${job.id || idx}`,
      title: `Featured Opening ${idx + 1}: ${job.organization}`,
      badge: job.scope?.replace('_', ' ') || 'Central Govt',
      text: phoneticize(`Vacancy number ${idx + 1}. ${job.title} at ${job.organization}. Remuneration scale is ${job.salary_scale}. Eligible qualifications include ${job.qualification}. Minimum academic cutoff is ${job.min_cgpa_percentage || 'sixty percent aggregate'}.`),
      display: `${job.title} at ${job.organization} — ${job.salary_scale} (${job.qualification})`
    }))),
    {
      id: 'state_psc',
      title: 'State PSC Language Advisory',
      badge: 'State Hubs',
      text: phoneticize(`State commission update. Verified technical recruitments are active across Kerala P S C Thulasi, Karnataka e-Governance, and Maharashtra I T Corporation. Candidates are advised that regional language rules are frequently relaxed for specialized software engineering posts.`),
      display: `Kerala PSC, Karnataka e-Gov & MahaIT openings active. Local language rules relaxed for specialized IT roles.`
    },
    {
      id: 'photo_spec',
      title: 'Photo Attestation Tip',
      badge: 'Official Advice',
      text: phoneticize(`Application submission guidance. Ensure your passport photograph is formatted between 20 to 50 kilobytes with a pure white background using Section 4 of this Gazette, to prevent automated portal rejection.`),
      display: `Remember to compress your photograph to 20-50 KB with a white background in Section 4.`
    },
    {
      id: 'signoff',
      title: 'Gazette Broadcast Sign-Off',
      badge: 'Broadcast End',
      text: phoneticize(`This concludes today's Employment Gazette audio bulletin. We wish you success in your examinations and public service career.`),
      display: `Gazette dispatch complete. Best wishes for your upcoming competitive examinations.`
    }
  ];

  // Load available speech synthesis voices
  const populateVoices = () => {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    setAvailableVoices(voices);

    // Auto-select preferred Indian / Female voice if not chosen
    if (!selectedVoiceURI) {
      // 1. First priority: Indian English Female voice (e.g. Heera, Neerja, Veena, Google हिन्दी / en-IN female)
      const indianFemale = voices.find(v => 
        (v.lang === 'en-IN' || v.lang.startsWith('en-IN') || v.lang.includes('hi')) && 
        (v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('veena') || v.name.toLowerCase().includes('aditi') || v.name.toLowerCase().includes('google'))
      );

      // 2. Second priority: Any Indian English voice
      const indianVoice = voices.find(v => 
        v.lang === 'en-IN' || v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india')
      );

      // 3. Third priority: Natural clear female voice (e.g. Zira, Samantha, Google UK English Female, Karen)
      const femaleVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen') || v.name.toLowerCase().includes('victoria'))
      );

      // 4. Fourth priority: Any standard English voice
      const fallbackVoice = voices.find(v => v.lang.startsWith('en'));

      const chosen = indianFemale || indianVoice || femaleVoice || fallbackVoice || voices[0];
      if (chosen) {
        setSelectedVoiceURI(chosen.voiceURI);
      }
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

  // Play a specific segment by index with proper pronunciation
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

    // Apply voice
    if (selectedVoiceURI) {
      const voiceObj = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.rate = speechRate; // Calm, clear pacing (default 0.88)
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;

      const nextIndex = index + 1;
      if (nextIndex < segments.length) {
        if (autoAdvance) {
          // Add deliberate 1.4 second calm pause between segments so user can digest!
          setIsIntermission(true);
          timeoutRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              speakSegment(nextIndex);
            }
          }, 1400);
        } else {
          // Pauses and waits for user to click Next
          setIsIntermission(true);
        }
      } else {
        // Finished entire bulletin
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

  // Group voices for the selector
  const categorizedVoices = availableVoices.filter(v => v.lang.startsWith('en') || v.lang.includes('hi'));

  return (
    <>
      {/* Masthead Trigger Pill */}
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
        title="60-Second Audio Gazette Dispatch"
      >
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-300' : 'text-[#7a1c1c]'}`} />
        <span>{isPlaying ? '📻 On Air (Dispatch)' : isPaused ? '⏸️ Bulletin Paused' : '📻 Gazette Radio'}</span>
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
                    The Gazette Audio Dispatch Bureau
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-[#7a1c1c] text-[#7a1c1c] font-bold bg-rose-50">
                    AIR BROADCAST
                  </span>
                </div>
                <p className="text-xs font-serif italic text-[#383e5c]">
                  Calm, step-by-step oral dispatch of verified Central & State IT vacancies
                </p>
              </div>
            </div>

            {/* Voice & Assistant Controls Bar */}
            <div className="p-3 bg-white border border-[#1c1f33] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Voice Selector */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#7a1c1c] mb-1">
                  🎙️ AI Voice / Assistant:
                </label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => {
                    setSelectedVoiceURI(e.target.value);
                    if (isPlaying) {
                      speakSegment(activeSegmentIndex);
                    }
                  }}
                  className="w-full text-xs font-sans bg-[#fbf9f5] border border-[#1c1f33] p-1.5 focus:outline-none focus:ring-1 focus:ring-[#7a1c1c]"
                >
                  {categorizedVoices.length === 0 && (
                    <option value="">Default System Voice</option>
                  )}
                  {categorizedVoices.map((v) => {
                    const isIndian = v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('ravi');
                    const isFemale = v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('veena');
                    
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
                    Cadence / Speed: {speechRate}x
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
                        {rate === 0.82 ? 'Slow & Deliberate' : rate === 0.88 ? 'Calm (Default)' : 'Normal'}
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
                    {autoAdvance ? '1.4s Pause Between' : 'Stop After Each'}
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
                  <span>{isPlaying ? 'READING DISPATCH ITEM' : isPaused ? 'PAUSED' : isIntermission ? 'INTERMISSION PAUSE...' : 'STANDBY'}</span>
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
                      <span>Start Listening</span>
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
                  {autoAdvance ? 'Auto-plays next after brief pause' : 'Manual step mode'}
                </div>
              </div>
            </div>

            {/* Scrollable Segment Docket */}
            <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#686f8a]">
                All Dispatch Segments (Click Any to Read Out Loud):
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
              <span>Phonetic acronym pronunciation & calm pause cadence active</span>
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
