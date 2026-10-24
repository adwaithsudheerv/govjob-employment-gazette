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
  Globe,
  Sparkles,
  Volume2,
  CheckCircle2,
  Languages
} from 'lucide-react';

// Supported National Languages of India with localized titles and voice codes
export const RADIO_LANGUAGES = [
  { code: 'ml', name: 'മലയാളം', englishName: 'Malayalam', flag: '🌴', voicePrefix: 'ml' },
  { code: 'en', name: 'English', englishName: 'Indian English', flag: '🇮🇳', voicePrefix: 'en' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', flag: '🏛️', voicePrefix: 'hi' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', flag: '🪔', voicePrefix: 'ta' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', flag: '🌺', voicePrefix: 'kn' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', flag: '☀️', voicePrefix: 'te' }
];

export default function RadioBulletin({ jobs = [], stats }) {
  const [selectedLang, setSelectedLang] = useState('ml'); // Default to Malayalam as requested!
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [isIntermission, setIsIntermission] = useState(false);
  
  // Voice & pacing preferences
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [speechRate, setSpeechRate] = useState(0.88); // Calm, deliberate cadence
  const [autoAdvance, setAutoAdvance] = useState(true); // 1.4s pause between dispatches

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
  const totalJobsCount = stats?.total_active_jobs || jobs.length || 23;

  // Helper to phoneticize English acronyms
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

  // Generate localized segments based on the chosen language
  const segments = useMemo(() => {
    const todayDateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // 1. MALAYALAM DISPATCH (മലയാളം)
    if (selectedLang === 'ml') {
      return [
        {
          id: 'greeting',
          title: 'പ്രഭാത ആമുഖം (Morning Intro)',
          badge: 'റേഡിയോ തുടക്കം',
          text: `നമസ്കാരം ഉദ്യോഗാർത്ഥികളെ. ദി എംപ്ലോയ്മെന്റ് ഗസറ്റിന്റെ ഔദ്യോഗിക പ്രഭാത റേഡിയോ ബുള്ളറ്റിനിലേക്ക് സ്വാഗതം. ഇന്നത്തെ തീയതി ${todayDateStr}. ഇന്നത്തെ പ്രധാന ഐ.ടി തൊഴിൽ അറിയിപ്പുകൾ ശ്രദ്ധിക്കുക.`,
          display: `നമസ്കാരം ഉദ്യോഗാർത്ഥികളെ. ദി എംപ്ലോയ്മെന്റ് ഗസറ്റ് പ്രഭാത റേഡിയോ ബുള്ളറ്റിനിലേക്ക് സ്വാഗതം (${todayDateStr}).`
        },
        {
          id: 'cutoff',
          title: 'അർദ്ധരാത്രി അടിയന്തിര തീയതി (Deadline Alert)',
          badge: closingTodayJobs.length > 0 ? 'അടിയന്തിരം' : 'സുരക്ഷിതം',
          text: closingTodayJobs.length > 0 
            ? `പ്രത്യേക ശ്രദ്ധയ്ക്ക്. ഇന്നത്തെ അർദ്ധരാത്രിയോടെ ${closingTodayJobs[0].title} പോർട്ടലിലെ അപേക്ഷാ സമർപ്പണം അവസാനിക്കുകയാണ്. നിങ്ങളുടെ ഓൺലൈൻ ഫീസ് ഉടൻ അടയ്ക്കുക.`
            : `അടിയന്തിര തീയതി റിപ്പോർട്ട്. ഇന്ന് അർദ്ധരാത്രി അവസാനിക്കുന്ന പുതിയ ഒഴിവുകൾ ഒന്നും തന്നെയില്ല. ആവശ്യമായ രേഖകൾ തയ്യാറാക്കാൻ നിങ്ങൾക്ക് സാവകാശമുണ്ട്.`,
          display: closingTodayJobs.length > 0 
            ? `⚠️ ഇന്ന് അർദ്ധരാത്രി അവസാനിക്കുന്നു: ${closingTodayJobs[0].title} (${closingTodayJobs[0].organization})`
            : `✓ ഇന്ന് അർദ്ധരാത്രി അവസാനിക്കുന്ന തീയതികൾ ഇല്ല. പോർട്ടലുകൾ തുറന്നിരിക്കുന്നു.`
        },
        {
          id: 'overview',
          title: 'സജീവ ഒഴിവുകൾ (Active Vacancies)',
          badge: 'ദേശീയ സംഗ്രഹം',
          text: `തൊഴിൽ കണക്കുകൾ. നിലവിൽ ബി.സി.എ, എം.സി.എ ബിരുദധാരികൾക്കായി ${totalJobsCount} കേന്ദ്ര-സംസ്ഥാന സർക്കാർ ഐ.ടി ജോലികൾ ഇപ്പോൾ സജീവമായി അപേക്ഷ ക്ഷണിക്കുന്നു.`,
          display: `ബി.സി.എ, എം.സി.എ ഉദ്യോഗാർത്ഥികൾക്കായി ${totalJobsCount} ഐ.ടി ജോലികൾ നിലവിൽ ലഭ്യമാണ്.`
        },
        {
          id: 'kerala_psc',
          title: 'കേരള പി.എസ്.സി & ഐ.ടി മിഷൻ (Kerala PSC Hub)',
          badge: 'കേരളം',
          text: `കേരള പി.എസ്.സി അറിയിപ്പ്. തുളസി പോർട്ടൽ വഴി കേരള സ്റ്റേറ്റ് ഐ.ടി മിഷൻ, കെ.എസ്.ഇ.ബി കമ്പ്യൂട്ടർ പ്രോഗ്രാമർ തുടങ്ങിയ തസ്തികകളിലേക്ക് വൺ ടൈം രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക. സ്പെഷ്യലൈസ്ഡ് ഐ.ടി തസ്തികകളിൽ മലയാളം ഭാഷാ നിബന്ധനകളിൽ ഇളവുണ്ട്.`,
          display: `കേരള പി.എസ്.സി തുളസി പോർട്ടലിൽ KSITM, KSEB തസ്തികകൾക്ക് വൺ ടൈം രജിസ്ട്രേഷൻ ലഭ്യമാണ്.`
        },
        {
          id: 'central_opp',
          title: 'കേന്ദ്ര സർക്കാർ ഐ.ടി അവസരങ്ങൾ (Central Opportunities)',
          badge: 'കേന്ദ്ര സർക്കാർ',
          text: `കേന്ദ്ര സർക്കാർ ഒഴിവുകൾ. എൻ.ഐ.സി സയന്റിസ്റ്റ് ബി, ഐ.എസ്.ആർ.ഒ, ബെൽ, ബാങ്ക് ഐ.ടി ഓഫീസർ തസ്തികകളിലേക്ക് അഖിലേന്ത്യാ തലത്തിൽ ബി.സി.എ, എം.സി.എ ഉദ്യോഗാർത്ഥികൾക്ക് അപേക്ഷിക്കാം.`,
          display: `NIC, ISRO, BEL, ബാങ്ക് ഐ.ടി ഓഫീസർ തസ്തികകൾക്ക് നേരിട്ട് അപേക്ഷിക്കാം.`
        },
        {
          id: 'photo_spec',
          title: 'ഫോട്ടോ അപ്‌ലോഡ് നിർദ്ദേശം (Photo Studio)',
          badge: 'അറിയിപ്പ്',
          text: `അപേക്ഷ സമർപ്പിക്കുമ്പോൾ നിങ്ങളുടെ പാസ്‌പോർട്ട് ഫോട്ടോ ഇരുപത് മുതൽ അമ്പത് കെ.ബി വരെ അളവിൽ സെക്ഷൻ നാല് വഴി റീസൈസ് ചെയ്തു സൂക്ഷിക്കുക.`,
          display: `ഫോട്ടോ 20 മുതൽ 50 KB വരെ അളവിൽ സെക്ഷൻ 4 വഴി റീസൈസ് ചെയ്യുക.`
        },
        {
          id: 'signoff',
          title: 'സമാപനം (Sign-Off)',
          badge: 'ശുഭാശംസകൾ',
          text: `ഇതോടെ ഇന്നത്തെ പ്രഭാത റേഡിയോ ബുള്ളറ്റിൻ പൂർണ്ണമാകുന്നു. നിങ്ങളുടെ പരീക്ഷകൾക്കും സർക്കാർ സർവീസ് ലക്ഷ്യങ്ങൾക്കും ഹൃദയം നിറഞ്ഞ വിജയ ആശംസകൾ. നന്ദി, നമസ്കാരം.`,
          display: `റേഡിയോ ബുള്ളറ്റിൻ സമാപിച്ചു. പരീക്ഷകളിൽ ഏവർക്കും ഉന്നത വിജയ ആശംസകൾ!`
        }
      ];
    }

    // 2. HINDI DISPATCH (हिन्दी)
    if (selectedLang === 'hi') {
      return [
        {
          id: 'greeting',
          title: 'प्रातःकालीन अभिवादन (Morning Intro)',
          badge: 'शुरुआत',
          text: `नमस्कार अभ्यर्थियों। द एम्प्लॉयमेंट गज़ट के आज के आधिकारिक प्रातःकालीन रेडियो बुलेटिन में आपका स्वागत है। आज की तारीख ${todayDateStr} है। कृपया आज की महत्वपूर्ण सरकारी आईटी भर्तियों के विवरण ध्यानपूर्वक सुनें।`,
          display: `नमस्कार अभ्यर्थियों। द एम्प्लॉयमेंट गज़ट प्रातःकालीन रेडियो बुलेटिन में आपका स्वागत है।`
        },
        {
          id: 'cutoff',
          title: 'अंतिम तिथि चेतावनी (Deadline Alert)',
          badge: closingTodayJobs.length > 0 ? 'चेतावनी' : 'सुरक्षित',
          text: closingTodayJobs.length > 0 
            ? `अंतिम तिथि सूचना। ध्यान दें, आज मध्यरात्रि को ${closingTodayJobs[0].title} की अंतिम तिथि समाप्त हो रही है। कृपया अपना ऑनलाइन आवेदन और शुल्क तुरंत जमा करें।`
            : `डेडलाइन रिपोर्ट। आज मध्यरात्रि समाप्त होने वाली कोई तात्कालिक भर्ती नहीं है। आपके पास आवेदन का पर्याप्त समय है।`,
          display: closingTodayJobs.length > 0
            ? `⚠️ आज मध्यरात्रि समाप्त: ${closingTodayJobs[0].title} (${closingTodayJobs[0].organization})`
            : `✓ आज मध्यरात्रि समाप्त होने वाली कोई भर्ती नहीं है। पोर्टल खुले हैं।`
        },
        {
          id: 'overview',
          title: 'सक्रिय रिक्तियां (Active Vacancies)',
          badge: 'राष्ट्रीय विवरण',
          text: `वर्तमान में बीसीए और एमसीए स्नातकों के लिए कुल ${totalJobsCount} सत्यापित सरकारी आईटी रिक्तियां सक्रिय रूप से आवेदन स्वीकार कर रही हैं।`,
          display: `बीसीए और एमसीए के लिए कुल ${totalJobsCount} सरकारी आईटी पद सक्रिय हैं।`
        },
        {
          id: 'featured',
          title: 'प्रमुख राष्ट्रीय भर्तियां (Key Openings)',
          badge: 'केंद्र सरकार',
          text: `प्रमुख भर्तियों में एनआईसी साइंटिस्ट बी, इसरो, डीआरडीओ, भेल और आईबीपीएस स्पेशलिस्ट आईटी ऑफिसर पद शामिल हैं। अधिकृत लिंक से तुरंत आवेदन करें।`,
          display: `NIC Scientist B, ISRO, DRDO और Bank SO IT पदों पर सीधी भर्ती।`
        },
        {
          id: 'photo_spec',
          title: 'फोटो आकार निर्देश (Photo Spec)',
          badge: 'सलाह',
          text: `आवेदन करते समय अपनी पासपोर्ट फोटो का आकार 20 से 50 केबी के बीच रखें। गज़ट के सेक्शन 4 से आप इसे तुरंत रीसाइज़ कर सकते हैं।`,
          display: `पासपोर्ट फोटो 20-50 KB के बीच सेक्शन 4 से रीसाइज़ करें।`
        },
        {
          id: 'signoff',
          title: 'समापन (Sign-Off)',
          badge: 'शुभकामनाएं',
          text: `यह आज का एम्प्लॉयमेंट गज़ट रेडियो बुलेटिन समाप्त होता है। आपकी आगामी परीक्षाओं और सरकारी सेवा करियर के लिए हार्दिक शुभकामनाएं। धन्यवाद।`,
          display: `रेडियो बुलेटिन समाप्त। आपकी परीक्षाओं के लिए हार्दिक शुभकामनाएं!`
        }
      ];
    }

    // 3. TAMIL DISPATCH (தமிழ்)
    if (selectedLang === 'ta') {
      return [
        {
          id: 'greeting',
          title: 'காலை வானொலி தொடக்கம் (Morning Intro)',
          badge: 'தொடக்க செய்தி',
          text: `வணக்கம் அரசுப் பணி தேர்வர்களே. தி எம்ப்ளாய்மென்ட் கெஜட்டின் இன்றைய அதிகாரப்பூர்வ காலை வானொலிச் செய்திக்கு வரவேற்கிறோம். இன்றைய அரசு ஐடி வேலைவாய்ப்பு விவரங்களைக் கேளுங்கள்.`,
          display: `வணக்கம் தேர்வர்களே. தி எம்ப்ளாய்மென்ட் கெஜட் காலை வானொலி செய்திக்கு வரவேற்கிறோம்.`
        },
        {
          id: 'cutoff',
          title: 'கடைசி தேதி எச்சரிக்கை (Deadline Alert)',
          badge: closingTodayJobs.length > 0 ? 'எச்சரிக்கை' : 'பாதுகாப்பானது',
          text: closingTodayJobs.length > 0 
            ? `முக்கிய அறிவிப்பு. இன்று நள்ளிரவுடன் சில முக்கிய வேலைவாய்ப்பு விண்ணப்பங்கள் முடிவடைகின்றன. உடனடியாக விண்ணப்பியுங்கள்.`
            : `இன்று நள்ளிரவு முடிவடையும் அவசர விண்ணப்பங்கள் ஏதுமில்லை. ஆவணங்களை தயார் செய்ய உங்களுக்கு போதிய நேரம் உள்ளது.`,
          display: closingTodayJobs.length > 0 
            ? `⚠️ இன்று நள்ளிரவு முடிவடையும் விண்ணப்பங்களை உடனே சமர்ப்பியுங்கள்.`
            : `✓ இன்று நள்ளிரவு முடிவடையும் விண்ணப்பங்கள் இல்லை.`
        },
        {
          id: 'overview',
          title: 'வேலைவாய்ப்பு விவரம் (Active Vacancies)',
          badge: 'மொத்த காலியிடங்கள்',
          text: `பிசிஏ மற்றும் எம்சிஏ பட்டதாரிகளுக்காக மத்திய மற்றும் மாநில அரசுகளில் ${totalJobsCount} அரசு ஐடி வேலைவாய்ப்புகள் தற்போது உள்ளன.`,
          display: `பிசிஏ & எம்சிஏ பட்டதாரிகளுக்கு ${totalJobsCount} அரசு ஐடி பணிகள் நேரடி விண்ணப்பத்தில் உள்ளன.`
        },
        {
          id: 'tnpsc',
          title: 'டிஎன்பிஎஸ்சி & எல்காட் (TNPSC & ELCOT)',
          badge: 'தமிழ்நாடு',
          text: `டிஎன்பிஎஸ்சி ஒன் டைம் ரெஜிஸ்ட்ரேஷன் மற்றும் எல்காட் நிறுவனம் மூலம் கணினி அறிவியல் பணிகளுக்கு தகுதியானவர்கள் விண்ணப்பிக்கலாம்.`,
          display: `TNPSC & ELCOT கணினி அறிவியல் பணிகளுக்கான விவரங்களை சரிபார்க்கவும்.`
        },
        {
          id: 'signoff',
          title: 'நிறைவு (Sign-Off)',
          badge: 'வாழ்த்துகள்',
          text: `இத்துடன் இன்றைய வானொலி செய்தி நிறைவடைகிறது. உங்கள் அரசுப் பணித் தேர்வுகளுக்கு எங்களது மனமார்ந்த நல்வாழ்த்துகள். நன்றி வணக்கம்.`,
          display: `வானொலி செய்தி நிறைவடைந்தது. அரசுத் தேர்வில் வெற்றிபெற நல்வாழ்த்துகள்!`
        }
      ];
    }

    // 4. KANNADA DISPATCH (ಕನ್ನಡ)
    if (selectedLang === 'kn') {
      return [
        {
          id: 'greeting',
          title: 'ಮುಂಜಾನೆಯ ರೇಡಿಯೋ ಆರಂಭ (Morning Intro)',
          badge: 'ಆರಂಭ',
          text: `ನಮಸ್ಕಾರ ಅಭ್ಯರ್ಥಿಗಳೇ. ದಿ ಎಂಪ್ಲಾಯ್ಮೆಂಟ್ ಗೆಜೆಟ್ ನ ಇಂದಿನ ಅಧಿಕೃತ ಮುಂಜಾನೆಯ ರೇಡಿಯೋ ಬುಲೆಟಿನ್ ಗೆ ಸುಸ್ವಾಗತ. ಇಂದಿನ ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಐಟಿ ಉದ್ಯೋಗ ಮಾಹಿತಿಯನ್ನು ಆಲಿಸಿ.`,
          display: `ನಮಸ್ಕಾರ ಅಭ್ಯರ್ಥಿಗಳೇ. ದಿ ಎಂಪ್ಲಾಯ್ಮೆಂಟ್ ಗೆಜೆಟ್ ರೇಡಿಯೋಗೆ ಸುಸ್ವಾಗತ.`
        },
        {
          id: 'overview',
          title: 'ಸಕ್ರಿಯ ಉದ್ಯೋಗಗಳು (Active Vacancies)',
          badge: 'ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ',
          text: `ಬಿಸಿಎ ಮತ್ತು ಎಂಸಿಎ ಪದವೀಧರರಿಗೆ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳಲ್ಲಿ ${totalJobsCount} ಕ್ಕೂ ಹೆಚ್ಚು ಐಟಿ ಹುದ್ದೆಗಳು ಲಭ್ಯವಿವೆ.`,
          display: `ಬಿಸಿಎ ಮತ್ತು ಎಂಸಿಎ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ${totalJobsCount} ಐಟಿ ಹುದ್ದೆಗಳು ಲಭ್ಯವಿವೆ.`
        },
        {
          id: 'kpsc',
          title: 'ಕರ್ನಾಟಕ ಕೆಪಿಎಸ್ಸಿ (KPSC Hub)',
          badge: 'ಕರ್ನಾಟಕ',
          text: `ಕರ್ನಾಟಕ ಕೆಪಿಎಸ್ಸಿ ಮತ್ತು ಕಿಯೋನಿಕ್ಸ್ ಪೋರ್ಟಲ್ ಮೂಲಕ ತಾಂತ್ರಿಕ ಹುದ್ದೆಗಳಿಗೆ ನೋಂದಣಿ ಮಾಡಿಕೊಳ್ಳಿ. ಅಧಿಕೃತ ಅಧಿಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`,
          display: `KPSC & KEONICS ಮೂಲಕ ಸರ್ಕಾರಿ ಐಟಿ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಲಭ್ಯವಿವೆ.`
        },
        {
          id: 'signoff',
          title: 'ಮುಕ್ತಾಯ (Sign-Off)',
          badge: 'ಶುಭಾಶಯಗಳು',
          text: `ಇಂದಿನ ರೇಡಿಯೋ ಬುಲೆಟಿನ್ ಮುಕ್ತಾಯವಾಯಿತು. ನಿಮ್ಮ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಶುಭ ಹಾರೈಕೆಗಳು. ಧನ್ಯವಾದಗಳು.`,
          display: `ರೇಡಿಯೋ ಬುಲೆಟಿನ್ ಮುಕ್ತಾಯ. ನಿಮ್ಮ ಪರೀಕ್ಷೆಗಳಿಗೆ ಶುಭವಾಗಲಿ!`
        }
      ];
    }

    // 5. TELUGU DISPATCH (తెలుగు)
    if (selectedLang === 'te') {
      return [
        {
          id: 'greeting',
          title: 'ఉదయపు ఆరంభం (Morning Intro)',
          badge: 'ప్రారంభం',
          text: `నమస్కారం అభ్యర్థులారా. ది ఎంప్లాయ్మెంట్ గెజెట్ నేటి అధికారిక ఉదయపు రేడియో బులెటిన్ కు స్వాగతం. నేటి ప్రభుత్వ ఐటి ఉద్యోగ సమాచారాన్ని వినండి.`,
          display: `నమస్కారం అభ్యర్థులారా. ది ఎంప్లాయ్మెంట్ గెజెట్ రేడియో బులెటిన్ కు స్వాగతం.`
        },
        {
          id: 'overview',
          title: 'ఉద్యోగ వివరాలు (Active Vacancies)',
          badge: 'మొత్తం ఉద్యోగాలు',
          text: `ప్రస్తుతం బిసిఎ మరియు ఎంసిఎ అభ్యర్థుల కోసం కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాలలో ${totalJobsCount} ఐటి ఉద్యోగాలు అందుబాటులో ఉన్నాయి.`,
          display: `బిసిఎ & ఎంసిఎ గ్రాడ్యుయేట్ల కోసం ${totalJobsCount} ఉద్యోగాలు అందుబాటులో ఉన్నాయి.`
        },
        {
          id: 'state',
          title: 'టిజిపిఎస్సి & ఎపిపిఎస్సి (State Hubs)',
          badge: 'తెలుగు రాష్ట్రాలు',
          text: `టిజిపిఎస్సి మరియు ఎపిపిఎస్సి ద్వారా ఐటి నియామకాలకు వన్ టైమ్ రిజిస్ట్రేషన్ పూర్తి చేసుకోండి.`,
          display: `TGPSC మరియు APPSC ద్వారా టెక్నికల్ ఉద్యోగ సమాచారం అందుబాటులో ఉంది.`
        },
        {
          id: 'signoff',
          title: 'ముగింపు (Sign-Off)',
          badge: 'శుభాకాంక్షలు',
          text: `ఇంతటితో నేటి రేడియో బులెటిన్ ముగిసింది. మీ ప్రభుత్వ ఉద్యోగ పరీక్షలలో విజయం సాధించాలని కోరుకుంటున్నాము. ధన్యవాదాలు.`,
          display: `రేడియో బులెటిన్ ముగిసింది. పోటీ పరీక్షలలో విజయం సాధించాలని ఆశిస్తున్నాము!`
        }
      ];
    }

    // 6. DEFAULT INDIAN ENGLISH DISPATCH (English)
    return [
      {
        id: 'greeting',
        title: 'Gazette Morning Introduction',
        badge: 'Opening Dispatch',
        text: `Greetings candidate. This is The Employment Gazette official public sector audio bulletin for ${todayDateStr}. Please listen to today's critical recruitment advisories.`,
        display: `Greetings candidate. This is The Employment Gazette official public sector audio bulletin for ${todayDateStr}.`
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
        text: phoneticize(`Vacancy tally. Currently, ${totalJobsCount} verified IT vacancies are actively accepting applications for B C A and M C A graduates across Central Ministries and State Commissions.`),
        display: `${totalJobsCount} verified IT recruitments currently active for BCA & MCA candidates.`
      },
      ...(featured.map((job, idx) => ({
        id: `job-${job.id || idx}`,
        title: `Featured Opening ${idx + 1}: ${job.organization}`,
        badge: job.scope?.replace('_', ' ') || 'Central Govt',
        text: phoneticize(`Vacancy number ${idx + 1}. ${job.title} at ${job.organization}. Remuneration scale is ${job.salary_scale}. Eligible qualifications include ${job.qualification}.`),
        display: `${job.title} at ${job.organization} — ${job.salary_scale} (${job.qualification})`
      }))),
      {
        id: 'state_psc',
        title: 'State PSC Language Advisory',
        badge: 'State Hubs',
        text: phoneticize(`State commission update. Verified technical recruitments are active across Kerala P S C Thulasi, Karnataka e-Governance, and Maharashtra I T Corporation. Regional language rules are relaxed for specialized software engineering posts.`),
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
  }, [selectedLang, closingTodayJobs, featured, totalJobsCount]);

  // Load available speech synthesis voices
  const populateVoices = () => {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    setAvailableVoices(voices);

    // Auto-select preferred voice based on the active language
    const currentLangObj = RADIO_LANGUAGES.find(l => l.code === selectedLang) || RADIO_LANGUAGES[0];
    const prefix = currentLangObj.voicePrefix;

    // Look for a voice matching this language prefix (e.g. 'ml', 'hi', 'ta', 'kn', 'te', 'en-IN')
    const langVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(prefix) || 
      v.name.toLowerCase().includes(currentLangObj.englishName.toLowerCase())
    );

    if (langVoice) {
      setSelectedVoiceURI(langVoice.voiceURI);
    } else {
      // Fallback: Indian English or Default
      const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('en'));
      if (indianVoice) setSelectedVoiceURI(indianVoice.voiceURI);
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
  }, [selectedLang]);

  // Switch Language
  const handleLanguageChange = (langCode) => {
    stopBroadcast();
    setSelectedLang(langCode);
    setActiveSegmentIndex(0);

    // Pick appropriate voice for this language
    const currentLangObj = RADIO_LANGUAGES.find(l => l.code === langCode);
    if (currentLangObj && availableVoices.length > 0) {
      const match = availableVoices.find(v => 
        v.lang.toLowerCase().startsWith(currentLangObj.voicePrefix) || 
        v.name.toLowerCase().includes(currentLangObj.englishName.toLowerCase())
      );
      if (match) setSelectedVoiceURI(match.voiceURI);
    }
  };

  // Speak specific segment by index with calm pauses
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

    // Set language tag on utterance so browser speech engine picks native synthesizer
    const currentLangObj = RADIO_LANGUAGES.find(l => l.code === selectedLang);
    if (currentLangObj) {
      utterance.lang = currentLangObj.code === 'en' ? 'en-IN' : `${currentLangObj.code}-IN`;
    }

    utterance.rate = speechRate; // Calm pacing
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;

      const nextIndex = index + 1;
      if (nextIndex < segments.length) {
        if (autoAdvance) {
          // Calm 1.4-second pause between dispatches for candidate comprehension
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

  const activeLangDetails = RADIO_LANGUAGES.find(l => l.code === selectedLang) || RADIO_LANGUAGES[0];

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
        title="Multilingual Gazette Morning Audio Dispatch"
      >
        <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-300' : 'text-[#7a1c1c]'}`} />
        <span>
          {isPlaying ? `📻 On Air [${activeLangDetails.name}]` : isPaused ? '⏸️ Bulletin Paused' : `📻 60s Radio [${activeLangDetails.name}]`}
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
                    The Gazette Multilingual Radio Bureau
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-[#7a1c1c] text-[#7a1c1c] font-bold bg-rose-50">
                    {activeLangDetails.flag} {activeLangDetails.name}
                  </span>
                </div>
                <p className="text-xs font-serif italic text-[#383e5c]">
                  Calm morning audio dispatch in the official national languages of India
                </p>
              </div>
            </div>

            {/* National Language Selector Bar */}
            <div className="p-3 bg-white border border-[#1c1f33] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7a1c1c] flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Choose Broadcast Language (സംപ്രേഷണ ഭാഷ തിരഞ്ഞെടുക്കുക):</span>
                </span>
                <span className="text-[10px] font-mono text-[#555]">6 Languages Available</span>
              </div>

              {/* Language Pills */}
              <div className="flex flex-wrap gap-1.5">
                {RADIO_LANGUAGES.map((lang) => {
                  const isSelected = lang.code === selectedLang;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`px-3 py-1.5 text-xs font-serif font-bold transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#1c1f33] text-white border-[#1c1f33] shadow-[2px_2px_0px_0px_#7a1c1c]'
                          : 'bg-[#fcfaf5] text-[#1c1f33] border-[#1c1f33]/30 hover:bg-[#e8e4db]'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-[10px] font-mono opacity-70">({lang.englishName})</span>
                    </button>
                  );
                })}
              </div>
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
                  {availableVoices.length === 0 && (
                    <option value="">Default System Voice</option>
                  )}
                  {availableVoices
                    .filter(v => v.lang.startsWith(activeLangDetails.voicePrefix) || v.lang.includes('IN') || v.lang.startsWith('en'))
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
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
                    {isPlaying ? `BROADCASTING IN ${activeLangDetails.englishName.toUpperCase()}` : isPaused ? 'PAUSED' : isIntermission ? 'INTERMISSION PAUSE...' : 'STANDBY'}
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
                    1.4s pause for comprehension...
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
                      <span>Start {activeLangDetails.name} Radio</span>
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
                All Broadcast Segments ({activeLangDetails.name}):
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
              <span>മലയാളം • English • हिन्दी • தமிழ் • ಕನ್ನಡ • తెలుగు</span>
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
