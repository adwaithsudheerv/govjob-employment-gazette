import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Clock, 
  X,
  Mic
} from 'lucide-react';

export default function RadioBulletin({ jobs, stats }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  const closingTodayJobs = jobs.filter(j => {
    if (!j.last_date) return false;
    const ld = new Date(j.last_date);
    const now = new Date();
    return ld.toDateString() === now.toDateString() || (ld - now > 0 && ld - now <= 24 * 3600 * 1000);
  });

  const featuredJobs = jobs.slice(0, 4);

  // Generate the audio bulletin dispatch text
  const generateScript = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    let text = `Greetings candidate. This is The Employment Gazette sixty-second public sector radio bulletin for ${todayStr}. `;

    if (closingTodayJobs.length > 0) {
      text += `Priority cutoff warning: ${closingTodayJobs.length} critical recruitment closes at midnight tonight. Specifically, ${closingTodayJobs[0].title} at ${closingTodayJobs[0].organization}. Ensure your online submission and application fee is finalized immediately. `;
    } else {
      text += `All current recruitment registration portals remain open with no midnight expirations today. `;
    }

    text += `Currently, ${stats?.total_active_jobs || jobs.length || 23} verified IT postings are actively accepting applications for BCA and MCA graduates. `;

    if (featuredJobs.length > 0) {
      text += `In national central recruitments, notable dispatches include: `;
      featuredJobs.forEach((job, idx) => {
        text += `${idx + 1}: ${job.title} at ${job.organization}, offering ${job.salary_scale}. `;
      });
    }

    text += `In state commissions, verified IT openings are active across Kerala PSC, Karnataka KPSC, Tamil Nadu, and Maharashtra IT missions. Document attestation tip: verify that your passport photograph is compressed between 20 to 50 kilobytes in Section 4. `;
    text += `Thank you for listening to The Employment Gazette daily radio dispatch. Best wishes for your public service examinations.`;

    return text;
  };

  const script = generateScript();
  const words = script.split(' ');

  const startBroadcast = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.95;
    utterance.pitch = 0.98;

    // Try to pick an authoritative English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.includes('en-GB') || v.lang.includes('en-IN') || v.name.includes('Natural') || v.name.includes('Google UK')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const textBefore = script.substring(0, event.charIndex);
        const wordCount = textBefore.trim().split(/\s+/).length;
        setCurrentWordIndex(wordCount);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWordIndex(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsOpen(true);
  };

  const pauseBroadcast = () => {
    if (window.speechSynthesis.speaking) {
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      }
    }
  };

  const stopBroadcast = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentWordIndex(0);
  };

  return (
    <>
      {/* Masthead Quick Trigger Radio Pill */}
      <button
        onClick={() => {
          if (!isPlaying) {
            startBroadcast();
          } else {
            setIsOpen(true);
          }
        }}
        className={`px-3 py-1 text-[11px] font-sans font-extrabold uppercase tracking-wider flex items-center space-x-1.5 transition-all border ${
          isPlaying
            ? 'bg-[#991b1b] text-white border-[#991b1b] shadow-[2px_2px_0px_0px_#991b1b] animate-pulse'
            : 'bg-white text-[#1c1f33] border-[#1c1f33] hover:bg-[#f2eee3] shadow-[2px_2px_0px_0px_#1c1f33]'
        }`}
        title="Listen to 60-second Gazette Morning Audio Dispatch"
      >
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : 'text-[#991b1b]'}`} />
        <span>{isPlaying ? '📻 On Air: Morning Radio' : '📻 60s Gazette Audio Dispatch'}</span>
        {isPlaying && (
          <span className="w-2 h-2 rounded-full bg-white animate-ping ml-1" />
        )}
      </button>

      {/* Retro Radio Player Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border-2 border-[#1c1f33] shadow-[6px_6px_0px_0px_#1c1f33] p-5 sm:p-6 space-y-4 font-sans">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 border border-[#1c1f33] bg-white hover:bg-[#1c1f33] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Retro Radio Header */}
            <div className="flex items-center space-x-3 border-b-2 border-[#1c1f33] pb-3 pr-10">
              <div className="w-10 h-10 border border-[#1c1f33] bg-[#1c1f33] text-white flex items-center justify-center">
                <Mic className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-title font-bold text-[#1c1f33] uppercase">
                  The Gazette Radio Dispatch • 98.4 AM
                </h3>
                <p className="text-[11px] font-serif italic text-[#383e5c]">
                  All India Public Service IT Recruitment Morning Audio Broadcast
                </p>
              </div>
            </div>

            {/* Vintage Frequency Tuner Box & Equalizer */}
            <div className="p-4 bg-[#fbf9f5] border border-[#1c1f33] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1c1f33]">
                <span>BAND: MEDIUM WAVE</span>
                <span className="text-[#991b1b] flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#991b1b] animate-ping' : 'bg-slate-400'}`} />
                  <span>{isPlaying ? 'LIVE TRANSMISSION' : 'STANDBY'}</span>
                </span>
                <span>FREQ: 1080 kHz</span>
              </div>

              {/* Animated Sound Equalizer Waves */}
              <div className="h-10 bg-white border border-[#1c1f33] flex items-end justify-center space-x-1.5 p-2 overflow-hidden">
                {[12, 24, 36, 18, 28, 40, 16, 32, 22, 14, 38, 26, 18, 30, 20, 35, 15, 25].map((h, i) => (
                  <div
                    key={i}
                    className={`w-2 transition-all duration-150 ${
                      isPlaying ? 'bg-[#1c1f33]' : 'bg-[#dcd7c7]'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(15, (h * (i % 3 + 1)) % 100)}%` : '20%'
                    }}
                  />
                ))}
              </div>

              {/* Radio Controls (Play, Pause, Stop) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  {!isPlaying ? (
                    <button
                      onClick={startBroadcast}
                      className="gazette-btn-ink px-4 py-2 text-xs flex items-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Radio Broadcast</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseBroadcast}
                      className="gazette-btn-ink px-4 py-2 text-xs flex items-center space-x-1.5"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}

                  <button
                    onClick={stopBroadcast}
                    disabled={!isPlaying}
                    className="gazette-btn-outline p-2 text-xs disabled:opacity-40"
                    title="Stop Broadcast"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#686f8a]">
                  Duration: ~60 Seconds
                </div>
              </div>
            </div>

            {/* Teleprompter / Live Scrolling Transcript */}
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-extrabold uppercase text-[#686f8a]">
                Live Newsreader Transcript:
              </span>
              <div className="p-3 bg-white border border-[#1c1f33] max-h-36 overflow-y-auto text-xs font-serif leading-relaxed text-[#1c1f33]">
                {words.map((word, idx) => (
                  <span
                    key={idx}
                    className={`transition-colors duration-100 ${
                      idx === currentWordIndex
                        ? 'bg-[#1c1f33] text-white px-0.5 font-bold'
                        : idx < currentWordIndex
                        ? 'text-[#686f8a]'
                        : 'text-[#1c1f33]'
                    }`}
                  >
                    {word}{' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-[#1c1f33]/20 flex items-center justify-between text-[11px] font-serif italic text-[#383e5c]">
              <span>Powered by Web Speech Engine & Real-Time Gazette Dispatches</span>
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
