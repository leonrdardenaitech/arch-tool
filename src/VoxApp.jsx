import React, { useState, useEffect, useRef } from 'react';
import { Mic, Keyboard, Activity, Volume2, VolumeX, Info, AlertTriangle, ChevronLeft } from 'lucide-react';

const PERSONAS = [
  { id: 'Agua-7', name: 'Agua-7', desc: 'British Male (Arthur)' },
  { id: 'Hydra-x', name: 'Hydra-x', desc: 'US Female (Billie Jean)' },
  { id: 'Nebula', name: 'Nebula', desc: 'Robotic' }
];

const VoxApp = () => {
  // Phase State: 'cinematic', 'pitch', 'app'
  const [phase, setPhase] = useState('cinematic');
  
  // App State
  const [hydration, setHydration] = useState(65);
  const [dailyGoal, setDailyGoal] = useState(132); // default max for demo
  const [isMuted, setIsMuted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [persona, setPersona] = useState('Agua-7');
  
  // Interaction State
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [warningActive, setWarningActive] = useState(false);
  
  // Tips State
  const [currentTip, setCurrentTip] = useState("Stay hydrated. Drink water every 2 hours.");
  
  // Refs
  const audioCtxRef = useRef(null);
  const pressTimer = useRef(null);
  const hoverTimer = useRef(null);
  const soundEnabledRef = useRef(!isMuted);

  useEffect(() => { soundEnabledRef.current = !isMuted; }, [isMuted]);

  // --- AUDIO SYNTHESIS ENGINE ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playWaves = () => {
    if (!soundEnabledRef.current) return;
    initAudio();
    try {
      const ctx = audioCtxRef.current;
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      noise.start();
      setTimeout(() => noise.stop(), 8000);
    } catch (e) {}
  };

  const playSparkle = () => {
    if (!soundEnabledRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  };

  const playPouring = () => {
    if (!soundEnabledRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    noise.start();
  };

  // --- SPEECH SYNTHESIS ---
  const speakText = (text, personaOverride = persona) => {
    if (!soundEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    if (personaOverride === 'Agua-7') {
      const v = voices.find(v => v.lang.includes('en-GB') || v.name.includes('British'));
      if (v) utterance.voice = v;
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
    } else if (personaOverride === 'Hydra-x') {
      const v = voices.find(v => (v.lang.includes('en-US') && v.name.includes('Female')) || v.name.includes('Samantha') || v.name.includes('Zira'));
      if (v) utterance.voice = v;
      utterance.pitch = 1.2;
      utterance.rate = 0.9;
    } else if (personaOverride === 'Nebula') {
      utterance.pitch = 0.1;
      utterance.rate = 0.8;
    }
    window.speechSynthesis.speak(utterance);
  };

  // --- LOGIC ENGINE ---
  const processInput = (input) => {
    const lower = input.toLowerCase();
    let isDehydrating = false;
    let warningMsg = "";
    let impact = 0;

    if (lower.match(/beer|alcohol|wine|liquor/)) {
      isDehydrating = true;
      warningMsg = "Warning: Alcohol inhibits Vasopressin, forcing kidneys to release water prematurely.";
      impact = -10;
    } else if (lower.match(/energy|monster|red bull/)) {
      isDehydrating = true;
      warningMsg = "Warning: High caffeine and sugar increase Glomerular Filtration Rate, accelerating water loss.";
      impact = -8;
    } else if (lower.match(/soda|coke|pepsi/)) {
      isDehydrating = true;
      warningMsg = "Warning: High sugar draws water out of your cells into your gut to dilute the syrup.";
      impact = -5;
    } else if (lower.match(/coffee/)) {
      impact = -2;
      setCurrentTip("Coffee logged. Mild diuretic effect noted. Balance with pure water.");
    } else if (lower.match(/water|bottle|milk/)) {
      impact = 15;
    } else if (input.trim() !== '') {
      impact = 5; // generic hydrating
    }

    if (input.trim() !== '') {
      speakText("Thank you for the update. Processing vectors.");
      setHydration(prev => Math.min(Math.max(prev + impact, 0), 100));
      
      if (isDehydrating) {
        setWarningActive(true);
        setCurrentTip(warningMsg);
      } else {
        setWarningActive(false);
        if (impact > 0) playPouring();
        setCurrentTip("Hydration confirmed. Micro-DB updated.");
      }

      setIsLockedOut(true);
      setTimeout(() => setIsLockedOut(false), 15000);
    }
    
    setTextInput('');
    setShowKeyboardInput(false);
  };

  const startVoiceInput = () => {
    if (isLockedOut) {
      setCurrentTip("System in Demo Mode. Please wait 15 seconds between entries.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setShowKeyboardInput(true);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => processInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleMicHover = () => {
    if (isLockedOut) return;
    hoverTimer.current = setTimeout(() => {
      speakText("Greeting, partner. What fluid have you consumed?");
    }, 3000);
  };
  
  const handleMicLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleRingPress = () => {
    pressTimer.current = setTimeout(() => {
      playSparkle();
      setShowPersonaMenu(true);
    }, 3000);
  };
  
  const handleRingRelease = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  // --- CINEMATIC SEQUENCE ---
  useEffect(() => {
    if (phase === 'cinematic') {
      setTimeout(() => setPhase('pitch'), 1000);
    }
  }, [phase]);

  const establishLink = () => {
    playWaves();
    setPhase('app');
  };

  // --- MATH FOR SVG ---
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (hydration / 100) * circumference;
  const fluidOz = Math.round((hydration / 100) * dailyGoal);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans relative overflow-hidden text-slate-200">
      {/* Return Home Link */}
      <a href="/arch-tool/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-cyan-500 hover:text-cyan-300 transition-colors uppercase tracking-widest text-xs font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] bg-slate-900/50 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-sm">
        <ChevronLeft size={16} /> Return to Command Center
      </a>

      {phase !== 'app' && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
          <div className="w-full max-w-2xl px-6 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 tracking-widest drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              HYDRO-SCAN
            </h1>
            <div className="bg-slate-900/50 border border-cyan-800/50 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.1)]">
              <p className="text-lg md:text-xl leading-relaxed text-cyan-50 mb-8 font-light">
                Major brands build for the average. <strong className="text-cyan-400 font-bold">We build for the elite.</strong><br/><br/>
                Vox is the straightforward, highly-responsive assistant filling the critical gap where standard wearables fall short. From the pickleball court to the nursery, we secure the hydration vectors that drive peak performance.
              </p>
              <button onClick={establishLink} className="relative inline-flex items-center justify-center px-8 py-4 bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold uppercase tracking-widest rounded-full hover:bg-cyan-900 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] group overflow-hidden">
                <span className="absolute inset-0 bg-cyan-400/20 w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="relative flex items-center gap-3">
                  <Activity size={20} className="animate-pulse" />
                  Establish Neural Link
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SHELL */}
      <div className={`w-full max-w-[400px] h-[820px] bg-slate-950 rounded-[3rem] border-[6px] border-slate-800 shadow-[0_0_50px_rgba(34,211,238,0.15)] relative overflow-hidden flex flex-col px-6 py-8 transition-opacity duration-1000 ${phase === 'app' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           style={{ boxShadow: '0 0 50px rgba(34,211,238,0.15), inset 0 0 20px rgba(0,0,0,1)' }}>
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34,211,238,0.15) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>

        {/* 2. HEADER ROW */}
        <div className="w-full flex justify-between items-start relative z-10">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full border border-cyan-800/50 bg-slate-900/50 text-cyan-400 hover:bg-slate-800 transition-colors">
            {isMuted ? <VolumeX size={18} className="text-red-400"/> : <Volume2 size={18} />}
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-t from-cyan-600 via-cyan-300 to-white/90 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] m-0 leading-none"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
              VOX
            </h2>
            <div className="px-4 py-[3px] rounded-full border border-cyan-500/50 bg-cyan-950/40 backdrop-blur-sm mt-1 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]">
              <span className="text-[9px] font-black tracking-[0.5em] text-cyan-300">D E M O</span>
            </div>
          </div>

          <button onClick={() => { setIsSyncing(!isSyncing); setDailyGoal(isSyncing ? 64 : 132); }} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${isSyncing ? 'border-cyan-400 bg-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-cyan-800/50 bg-slate-900/50 text-cyan-600'}`}>
            <Activity size={24} className={isSyncing ? 'text-cyan-300 animate-pulse' : ''} />
          </button>
        </div>

        {/* 3. APP TITLE ROW */}
        <div className="w-full text-center mt-6 relative z-10">
          <h3 className="text-xl font-black tracking-[0.4em] scale-x-110 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">HYDRO-SCAN</h3>
        </div>

        {/* 4. MAIN STATUS RING */}
        <div className="relative w-72 h-72 mx-auto mt-8 mb-10 flex items-center justify-center z-10 select-none"
             onMouseDown={handleRingPress} onMouseUp={handleRingRelease} onMouseLeave={handleRingRelease}
             onTouchStart={handleRingPress} onTouchEnd={handleRingRelease}>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300">
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background SVG elements */}
            <circle cx="150" cy="150" r="140" stroke="#083344" strokeWidth="1" fill="none" />
            <circle cx="150" cy="150" r="132" stroke="#164e63" strokeWidth="2" fill="none" strokeDasharray="4 8" className="animate-[spin_20s_linear_infinite] origin-center" />
            <circle cx="150" cy="150" r="88" stroke="#164e63" strokeWidth="2" fill="none" opacity="0.5" />

            {/* Main Progress SVG elements */}
            <circle cx="150" cy="150" r={radius} stroke="#0f172a" strokeWidth="16" fill="none" />
            <circle cx="150" cy="150" r={radius} stroke="url(#progressGrad)" strokeWidth="16" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                    filter="url(#glow)" transform="rotate(-90 150 150)" />
          </svg>

          {/* Inside the Ring */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-600 uppercase mb-2">{persona}</span>
            <span className="text-6xl font-bold tracking-tighter text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              {hydration}%
            </span>
            <div className="mt-3 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/50 text-cyan-500 text-sm tracking-widest shadow-[inset_0_0_5px_rgba(34,211,238,0.2)]">
              {fluidOz} / {dailyGoal} oz
            </div>
          </div>
        </div>

        {/* 5. CONTROLS PANEL */}
        <div className="w-full flex flex-col items-center justify-center gap-4 mb-6 relative z-10">
          
          <div className="relative flex flex-col items-center group">
            {/* Faux 3D light base */}
            <div className="absolute -bottom-4 w-32 h-8 bg-cyan-950 rounded-[100%] border-t border-cyan-500/40 shadow-[0_-10px_20px_rgba(34,211,238,0.2)]"></div>
            
            {/* Floating outline rings */}
            <div className="absolute inset-[-10px] rounded-full border-t-2 border-cyan-400 animate-[spin_4s_linear_infinite] opacity-50"></div>
            <div className="absolute inset-[-4px] rounded-full border border-cyan-800/50"></div>
            
            {/* Mic Button */}
            <button 
              onMouseEnter={handleMicHover} onMouseLeave={handleMicLeave}
              onClick={startVoiceInput}
              className={`relative z-10 w-24 h-24 rounded-full bg-slate-900 border-2 flex items-center justify-center transition-all duration-300
                ${isLockedOut ? 'border-slate-700 text-slate-600 grayscale' : 'border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95'}
                ${isListening ? 'bg-cyan-900 shadow-[0_0_50px_rgba(34,211,238,0.8)]' : ''}
              `}>
              <Mic size={40} className={isListening ? 'animate-pulse' : ''} />
            </button>
          </div>

          {/* Keyboard Button */}
          <button 
            onClick={() => { if(!isLockedOut) setShowKeyboardInput(!showKeyboardInput); }}
            className={`w-10 h-10 rounded-full border-2 bg-slate-900 flex items-center justify-center z-10 transition-all mt-4
              ${isLockedOut ? 'border-slate-700 text-slate-600' : 'border-cyan-700 text-cyan-500 shadow-lg hover:border-cyan-400 hover:text-cyan-300 active:scale-95'}`}>
            <Keyboard size={18} />
          </button>
        </div>

        {/* 6. TIPS SECTION */}
        <div className={`mt-auto w-full max-w-sm min-h-[120px] rounded-xl border p-6 flex items-center gap-4 transition-all duration-500 z-10
            ${warningActive 
              ? 'bg-red-950/40 border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] text-red-200' 
              : 'bg-slate-900/50 border-cyan-800/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] text-cyan-200'}`}>
          <div className="shrink-0">
            {warningActive ? <AlertTriangle size={32} className="text-red-500 animate-pulse" /> : <Info size={32} className="text-cyan-600 opacity-70" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-light leading-relaxed animate-fade-in">{currentTip}</p>
          </div>
        </div>

        {/* 7. OVERLAYS */}
        {showKeyboardInput && !isLockedOut && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <h4 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-4">Manual Entry Log</h4>
              <input type="text" autoFocus
                value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && processInput(textInput)}
                placeholder="E.g., 16oz water, 1 coffee..."
                className="w-full bg-black/50 border border-cyan-800/50 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-800 focus:outline-none focus:border-cyan-400" />
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowKeyboardInput(false)} className="px-4 py-2 text-sm text-cyan-600 uppercase tracking-widest">Cancel</button>
                <button onClick={() => processInput(textInput)} className="px-6 py-2 bg-cyan-900 text-cyan-300 text-sm font-bold uppercase tracking-widest rounded-lg border border-cyan-500/50 hover:bg-cyan-800">Log Data</button>
              </div>
            </div>
          </div>
        )}

        {showPersonaMenu && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
             <div className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
               <h4 className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-6 text-center">Neural Matrix Selection</h4>
               <div className="space-y-3">
                 {PERSONAS.map(p => (
                   <button key={p.id} onClick={() => { setPersona(p.id); speakText(`Matrix assigned to ${p.name}.`, p.id); setShowPersonaMenu(false); }}
                           className={`w-full p-4 rounded-xl border flex flex-col items-center transition-all ${persona === p.id ? 'bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-cyan-800/30 hover:border-cyan-600 bg-black/30'}`}>
                     <span className={`font-bold tracking-widest uppercase ${persona === p.id ? 'text-cyan-300' : 'text-cyan-600'}`}>{p.name}</span>
                     <span className="text-[10px] text-slate-500 mt-1 uppercase">{p.desc}</span>
                   </button>
                 ))}
               </div>
               <button onClick={() => setShowPersonaMenu(false)} className="w-full mt-6 py-3 text-xs text-cyan-600 uppercase tracking-widest hover:text-cyan-400">Close Interface</button>
             </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default VoxApp;