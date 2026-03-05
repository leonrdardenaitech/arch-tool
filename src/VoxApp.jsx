import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertTriangle, Settings, Droplets, Activity, Volume2, VolumeX, Database, Zap, Power, Circle, CheckCircle2, Waves, Speaker } from 'lucide-react';

// --- DATA: DEHYDRATION VECTORS ---
const DEHYDRATION_DATA = {
  beer: { type: 'alcohol', impact: -10, tip: "Alcohol inhibits Vasopressin, forcing kidneys to release water prematurely." },
  wine: { type: 'alcohol', impact: -8, tip: "Alcohol inhibits Vasopressin, forcing kidneys to release water prematurely." },
  soda: { type: 'sugar', impact: -5, tip: "High sugar draws water out of your cells into your gut to dilute the syrup." },
  energy: { type: 'caffeine', impact: -7, tip: "High caffeine increases Glomerular Filtration Rate, accelerating water loss." },
  coffee: { type: 'caffeine', impact: -2, tip: "Mild diuretic effect. Ensure you balance this with pure water." },
  water: { type: 'pure', impact: 15, tip: "Excellent. Pure hydration directly replenishes your cellular reservoirs." },
  milk: { type: 'nutrient', impact: 12, tip: "Great choice. The electrolytes and macros in milk promote slow, sustained hydration." }
};

const PERSONAS = ['Arthur', 'Siri_us', 'Beau', 'Glitch'];

const VoxApp = () => {
  // Phase State: 'cinematic', 'pitch', 'ready', 'transition', 'app'
  const [phase, setPhase] = useState('cinematic'); 
  const [hydration, setHydration] = useState(25);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [textInput, setTextInput] = useState("");
  
  // Simulation & UI State
  const [isSyncing, setIsSyncing] = useState(false);
  const [persona, setPersona] = useState('Arthur');
  const [showMenu, setShowMenu] = useState(false);
  const [currentTip, setCurrentTip] = useState("System online. Awaiting fluid data.");
  const [warning, setWarning] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dbStatus, setDbStatus] = useState("Initializing Micro-DB...");

  // Refs
  const pressTimer = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  // --- CINEMATIC SEQUENCE ---
  useEffect(() => {
    if (phase === 'cinematic') {
      setTimeout(() => setPhase('pitch'), 2000);
    }
    if (phase === 'pitch') {
      setTimeout(() => setDbStatus("Neural Database Pre-Calculated (Temporary Session)"), 8000);
      setTimeout(() => setPhase('ready'), 15000);
    }
  }, [phase]);

  const establishNeuralLink = () => {
    playWaves();
    setPhase('transition');
    setTimeout(() => setPhase('app'), 4000);
  };

  const playWaves = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const noise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, 2 * ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.loop = true;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
      noise.connect(gain); gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  // --- PERSONA-AWARE MOCK ENGINE (fRAG) ---
  const getSimulatedResponse = (input, currentPersona) => {
    const lower = input.toLowerCase();
    let baseMsg = "";
    
    if (lower.includes('water')) baseMsg = "Hydration confirmed. I've updated the micro-DB and synced with your ring.";
    else if (lower.includes('coffee')) baseMsg = "Caffeine detected. Adjusting hydration bar for diuretic effects.";
    else if (lower.includes('pickleball')) baseMsg = "Keep your eye on the ball, partner. I'll handle the vitals.";
    else baseMsg = "I've logged the entry. Neural link stable.";

    // Persona modifiers
    if (currentPersona === 'Arthur') return `[Arthur]: Indeed. ${baseMsg}`;
    if (currentPersona === 'Glitch') return `[G-L-I-T-C-H]: SYNC... ${baseMsg.toUpperCase()}`;
    return baseMsg;
  };

  // --- CORE INPUT LOGIC ---
  const processInput = async (input) => {
    setCurrentTip("Analyzing fluid data via secure core...");
    let foundDrink = null;
    let localImpact = 0;

    Object.keys(DEHYDRATION_DATA).forEach(drink => {
      if (input.toLowerCase().includes(drink)) {
        foundDrink = drink;
        localImpact = DEHYDRATION_DATA[drink].impact;
      }
    });

    if (foundDrink) {
      setHydration(prev => Math.min(Math.max(prev + localImpact, 0), 100));
      if (localImpact < 0) setWarning({ active: true, message: DEHYDRATION_DATA[foundDrink].tip });
      else setWarning(null);
    }

    // Neural Simulation delay
    setTimeout(() => {
      const reply = getSimulatedResponse(input, persona);
      setCurrentTip(reply);
      speakText(reply);
    }, 1000);

    setTextInput("");
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setCurrentTip("Voice not supported. Use text mode."); return; }
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => processInput(event.results[0][0].transcript.toLowerCase());
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text) => {
    if (!soundEnabledRef.current || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (persona === 'Arthur') {
      const v = voices.find(v => v.lang.startsWith('en-GB'));
      if (v) utterance.voice = v;
      utterance.pitch = 0.9;
    }
    window.speechSynthesis.speak(utterance);
  };

  // --- SVG CIRCLE MATH ---
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (hydration / 100) * circumference;
  const fluidOz = ((hydration / 100) * 64).toFixed(1);

  // Hidden Menu Logic
  const handlePressStart = () => { pressTimer.current = setTimeout(() => setShowMenu(true), 3000); };
  const handlePressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  return (
    <div className="vox-container">
      {/* CINEMATIC LAYER */}
      {phase !== 'app' && (
        <div className={`vox-cinematic-overlay ${phase === 'transition' ? 'zoom-out' : ''}`}>
          <div className="phone-silhouette">
            <div className={`pitch-content ${(phase === 'pitch' || phase === 'ready') ? 'fade-in' : ''} ${phase === 'transition' ? 'fade-out' : ''}`}>
              <div className="pitch-text">
                <p>Major brands build for the average. <br/><strong>We build for the elite.</strong> <br/>Vox is the straightforward assistant filling the gap where wearables fall short.</p>
              </div>
              <div className="loading-area">
                <div className="loading-subtext"><Database size={12} className="animate-pulse" /> <span>{dbStatus}</span></div>
                {phase === 'ready' && (
                  <button className="vox-launch-btn animate-bounce-in" onClick={establishNeuralLink}>
                    <Power size={20} /> <span>Establish Neural Link</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APP INTERFACE */}
      <main className={`vox-main-content ${phase === 'app' ? 'app-ready' : 'app-hidden'}`}>
        <div className="vox-app-shell">
          <div className="w-full flex justify-between items-center px-8 mb-6 mt-6">
            <div className="flex items-center gap-2">
              <Droplets className="text-cyan-400 w-6 h-6" />
              <h1 className="text-xl font-light tracking-widest text-cyan-50">VOX<span className="font-bold text-cyan-400">HYDRO</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-gray-400 hover:text-cyan-400">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
              </button>
              <button className={`p-2 rounded-full ${isSyncing ? 'text-green-400 animate-spin' : 'text-gray-500'}`}>
                <Activity className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-8 p-4 rounded-full border border-cyan-500/20 bg-cyan-950/10"
               onMouseDown={handlePressStart} onMouseUp={handlePressEnd}>
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${isListening ? 'bg-cyan-500/20' : 'bg-transparent'}`} />
            <svg className="w-64 h-64 transform -rotate-90">
              <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" /><stop offset="100%" stopColor="#0055ff" />
                </linearGradient>
              </defs>
              <circle cx="128" cy="128" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
              <circle cx="128" cy="128" r={radius} stroke="url(#neonGradient)" strokeWidth="12" fill="none" strokeLinecap="round"
                style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, transition: 'stroke-dashoffset 1.5s' }} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-extralight text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-300">
                {Math.round(hydration)}<span className="text-2xl">%</span>
              </span>
              <span className="text-sm font-medium text-cyan-400">{fluidOz} <span className="text-xs text-cyan-600">oz</span></span>
            </div>
          </div>

          <div className="w-full px-8 mb-6 relative flex items-center justify-center min-h-[96px]">
            <button onClick={() => setIsMuted(!isMuted)} className="absolute left-8 z-10 p-3 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              {isMuted ? <MicOff className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
            {isMuted ? (
              <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && processInput(textInput)}
                placeholder="Type fluid entry..." className="w-full bg-black/40 border border-cyan-500/40 rounded-full pl-16 pr-5 py-3 text-sm text-cyan-50" />
            ) : (
              <button onClick={startListening} className={`w-24 h-24 rounded-full flex justify-center items-center border transition-all ${isListening ? 'bg-cyan-500/20 border-cyan-400' : 'bg-cyan-950/20 border-cyan-500/40'}`}>
                <Mic className={`w-8 h-8 ${isListening ? 'text-cyan-300' : 'text-cyan-500'}`} />
              </button>
            )}
          </div>

          <div className="w-full px-8 flex-grow flex flex-col justify-end pb-8">
            <div className={`relative min-h-[130px] p-5 rounded-xl border-l-4 transition-all ${warning ? 'bg-amber-950/30 border-amber-500' : 'bg-cyan-950/20 border-cyan-500'}`}>
              {warning && <div className="flex items-center gap-2 mb-3 text-amber-400 uppercase text-xs font-bold"><AlertTriangle size={16}/> Vitals Alert</div>}
              <p className="text-sm font-light leading-relaxed">{warning ? warning.message : currentTip}</p>
            </div>
          </div>
        </div>

        {showMenu && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-[3000]">
            <h2 className="text-2xl font-light text-cyan-400 mb-8">Override Protocol</h2>
            <div className="w-full space-y-3">
              {PERSONAS.map(p => (
                <button key={p} onClick={() => { setPersona(p); setShowMenu(false); }} className={`w-full py-3 rounded-xl border ${persona === p ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'border-white/10 text-gray-300'}`}>
                  {p.replace('_', '-')}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMenu(false)} className="mt-8 text-sm text-gray-500">Close Settings</button>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .vox-container { min-height: 100vh; background: #060b14; color: #fff; font-family: 'Inter', sans-serif; position: relative; overflow: hidden; }
        .vox-cinematic-overlay { position: fixed; inset: 0; z-index: 2000; background: #000; display: flex; align-items: center; justify-content: center; transition: transform 4s cubic-bezier(0.16, 1, 0.3, 1), opacity 2s; }
        .vox-cinematic-overlay.zoom-out { transform: scale(5); opacity: 0; pointer-events: none; }
        .phone-silhouette { width: 320px; height: 640px; background: #0a0a0a; border: 4px solid #1a1a1a; border-radius: 3rem; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; box-shadow: 0 0 100px rgba(59,130,246,0.1); }
        .pitch-content { text-align: center; opacity: 0; transition: opacity 2s; width: 100%; }
        .pitch-content.fade-in { opacity: 1; }
        .pitch-text p { font-size: 1rem; line-height: 1.6; color: #ccc; margin-bottom: 2rem; }
        .vox-launch-btn { background: #3b82f6; color: #fff; border: none; padding: 1rem 1.5rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
        .vox-main-content { position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; transition: opacity 2s; }
        .app-hidden { opacity: 0; }
        .app-ready { opacity: 1; }
        .vox-app-shell { position: relative; width: 100%; max-width: 400px; height: 800px; background: #0a1120; border: 1px solid rgba(0,255,255,0.2); rounded: 40px; display: flex; flex-direction: column; items-center; overflow: hidden; box-shadow: 0 0 40px rgba(0,255,255,0.1); }
        @keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .loading-subtext { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.55rem; color: #444; text-transform: uppercase; margin-bottom: 1rem; }
      ` }} />
    </div>
  );
};

export default VoxApp;
