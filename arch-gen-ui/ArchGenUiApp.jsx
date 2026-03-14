import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  Mic, Camera, Play, Pause, Save, Power, ChevronDown, ChevronUp, Fingerprint, Lock, ShieldCheck, Activity,
  Zap, Droplets, Thermometer, Wind, Gauge, Cpu
} from 'lucide-react';

// --- CONFIG & INITIALIZATION ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { 
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key", 
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-id" 
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyClApAYTE1J2zQC15jGqlyOCnOrRT9fNbc";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- AUDIO ENGINE ---
let audioCtx = null;
const playHarmonicSound = (type = 'startup') => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    
    if (type === 'startup') {
      [220, 277.18, 329.63, 440].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.5 + (i * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
        osc.start(now);
        osc.stop(now + 4);
      });
    } else if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) { console.warn("Audio Context Blocked"); }
};

// --- GENUI ALCHEMIST ---
const NEXUS_FALLBACK = [
  { type: 'ValueDisplay', props: { label: 'System Load', value: '14.2', unit: 'PZ', color: '#a2d5f2' } },
  { type: 'StatusLight', props: { label: 'Neural Link', status: 'Active', color: '#38bdf8' } },
  { type: 'MiniChart', props: { label: 'Pressure Gradient', data: [20, 45, 28, 80, 40, 90, 60], color: '#0ea5e9' } }
];

const callGenUI = async (prompt, retryCount = 0) => {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  
  const systemInstruction = `
    You are the Arch GenUI Architect, specialized in sub-aquatic bio-mechanical interfaces.
    Return ONLY a valid JSON array of UI components.
    
    COMPONENT TYPES:
    1. "ValueDisplay": { label, value, unit, color }
    2. "Waveform": { intensity (0.1-1.0), color }
    3. "ActionButton": { label, action }
    4. "TextInput": { placeholder }
    5. "MiniChart": { label, data (array of 7 numbers), color }
    6. "Toggle": { label, active (boolean), color }
    7. "Slider": { label, value (0-100), color }
    8. "StatusLight": { label, status (Active/Idle/Alert), color }
    
    THEME: Oceanic engineering, deep sea blues (#006994), cyan accents (#0ea5e9), pastel glass-morphism.
    RESPONSE: Pure JSON array ONLY. No markdown blocks.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction,
      generationConfig: { responseMimeType: "application/json" }
    });
    return JSON.parse(result.response.text());
  } catch (err) {
    if (err.status === 503 && retryCount < 2) {
      console.warn(`GenUI Busy (503). Retrying... Attempt ${retryCount + 1}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return callGenUI(prompt, retryCount + 1);
    }
    console.error("GenUI Failure:", err);
    return NEXUS_FALLBACK;
  }
};

// --- COMPONENT LIBRARY ---
const COMPONENT_MAP = {
  ValueDisplay: ({ label, value, unit, color, liveValue }) => (
    <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 mb-1 flex items-center gap-2">
        <Gauge size={10} className="text-sky-400" /> {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-light tracking-tight transition-all duration-500" style={{ color: color || '#ffffff' }}>
          {liveValue || value}
        </span>
        <span className="text-[10px] text-sky-200/40 font-bold uppercase">{unit}</span>
      </div>
    </div>
  ),
  Waveform: ({ intensity, color }) => (
    <div className="h-20 w-full flex items-center justify-between gap-1 p-5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
      {[...Array(16)].map((_, i) => (
        <motion.div 
          key={i}
          className="w-1 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.3)]" 
          style={{ backgroundColor: color || '#0ea5e9' }}
          animate={{ height: ['15%', `${(Math.random() * intensity * 85) + 15}%`, '15%'] }}
          transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  ),
  ActionButton: ({ label, action }) => (
    <button 
      onClick={() => playHarmonicSound('click')}
      className="w-full py-5 bg-sky-950/40 hover:bg-sky-800/60 border border-sky-400/20 text-sky-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all shadow-lg backdrop-blur-md relative group overflow-hidden"
    >
      <div className="absolute inset-0 bg-sky-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Zap size={12} className="text-sky-400" /> {label}
      </span>
    </button>
  ),
  TextInput: ({ placeholder }) => (
    <div className="relative w-full">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-xs outline-none focus:border-sky-400/40 transition-all backdrop-blur-md font-light placeholder:text-stone-600"
      />
      <Droplets className="absolute right-5 top-1/2 -translate-y-1/2 text-sky-900/40" size={14} />
    </div>
  ),
  MiniChart: ({ label, data, color }) => (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-full">
      <p className="text-[9px] uppercase tracking-widest text-stone-500 mb-4">{label}</p>
      <div className="h-16 w-full flex items-end gap-[2px]">
        {data.map((val, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${val}%` }}
            className="flex-1 rounded-t-sm"
            style={{ backgroundColor: color || '#0ea5e9', opacity: 0.3 + (i * 0.1) }}
          />
        ))}
      </div>
    </div>
  ),
  Toggle: ({ label, active: initialActive, color }) => {
    const [active, setActive] = useState(initialActive);
    return (
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center w-full">
        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-300">{label}</span>
        <button 
          onClick={() => { setActive(!active); playHarmonicSound('click'); }}
          className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${active ? 'bg-sky-500/40' : 'bg-stone-800'}`}
        >
          <motion.div 
            animate={{ x: active ? 26 : 4 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
          />
        </button>
      </div>
    );
  },
  Slider: ({ label, value: initialValue, color }) => {
    const [val, setVal] = useState(initialValue ?? 50);
    return (
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 w-full space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">{label}</span>
          <span className="text-[10px] font-mono text-sky-400">{val}%</span>
        </div>
        <input 
          type="range" value={val} onChange={(e) => setVal(e.target.value)}
          className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
      </div>
    );
  },
  StatusLight: ({ label, status, color }) => (
    <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-4 w-full">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-sky-400' : status === 'Alert' ? 'bg-red-500' : 'bg-stone-600'}`} />
        <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-40 ${status === 'Active' ? 'bg-sky-400' : status === 'Alert' ? 'bg-red-500' : 'hidden'}`} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-tighter text-stone-200">{label}</p>
        <p className="text-[8px] uppercase tracking-widest text-stone-500">{status}</p>
      </div>
    </div>
  )
};

// --- AESTHETIC DECOR ---
const Bubbles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 border border-white/5 backdrop-blur-[1px]"
          initial={{ 
            width: Math.random() * 20 + 5, 
            height: Math.random() * 20 + 5, 
            x: Math.random() * 100 + '%', 
            y: '110%',
            opacity: 0 
          }}
          animate={{ 
            y: '-20%', 
            opacity: [0, 0.4, 0],
            x: (Math.random() * 100) + (Math.sin(i) * 5) + '%'
          }}
          transition={{ 
            duration: 8 + Math.random() * 10, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// --- MAIN APP ---
export default function ArchGenUiApp() {
  const [authState, setAuthState] = useState('login');
  const [controlsVisible, setControlsVisible] = useState(true);
  const [inputIntent, setInputIntent] = useState("");
  const [uiSchema, setUiSchema] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [lastMicClick, setLastMicClick] = useState(0);
  
  // Live Simulation State
  const [liveData, setLiveData] = useState({});

  useEffect(() => {
    if (authState === 'main' && uiSchema.length === 0) {
      setUiSchema([
        { id: 'init1', type: 'StatusLight', props: { label: 'System Nexus', status: 'Active', color: '#0ea5e9' } },
        { id: 'init2', type: 'ValueDisplay', props: { label: 'Ambient Depth', value: '4,200', unit: 'MSW', color: '#a2d5f2' } }
      ]);
    }
  }, [authState, uiSchema.length]);

  // Live Data Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        'ValueDisplay': (Math.random() * 10 + 4000).toFixed(1)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    playHarmonicSound('startup');
    setAuthState('authenticating');
    setTimeout(() => setAuthState('main'), 2000);
  };

  const handleMicClick = () => {
    const now = Date.now();
    if (now - lastMicClick < 350) {
      setShowInput(!showInput);
      playHarmonicSound('click');
    } else {
      if (showInput && inputIntent) executeGenUI();
    }
    setLastMicClick(now);
  };

  const executeGenUI = async () => {
    if (!inputIntent) return;
    playHarmonicSound('click');
    setIsProcessing(true);
    try {
      const parsed = await callGenUI(inputIntent);
      const schemaWithIds = parsed.map((item, idx) => ({ 
        ...item, 
        id: `gen_${Date.now()}_${idx}`,
        // Inject random starting data if it's a chart
        props: item.type === 'MiniChart' ? { ...item.props, data: [...Array(7)].map(() => Math.random() * 80 + 20) } : item.props
      }));
      setUiSchema(schemaWithIds);
      setInputIntent("");
      setShowInput(false);
    } catch (e) {
      setUiSchema([{ id: 'err', type: 'ValueDisplay', props: { label: 'Nexus Error', value: 'FAIL', unit: 'SYS', color: '#ef4444' } }]);
    }
    setIsProcessing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-4 font-sans select-none overflow-hidden text-stone-200">
      
      {/* Liquid Filter */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Device Shell */}
      <div className="relative w-full max-w-[390px] aspect-[9/19.5] bg-[#030712] rounded-[4rem] border-[16px] border-[#111827] shadow-[0_0_120px_rgba(14,165,233,0.1)] overflow-hidden flex flex-col isolation-isolate">
        
        <Bubbles />

        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_#0c4a6e_0%,_transparent_70%)] animate-pulse-slow" />
        </div>

        <AnimatePresence mode="wait">
          {authState !== 'main' && (
            <motion.div 
              key="login"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 1, ease: "circOut" }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/80 backdrop-blur-2xl"
            >
              <div className="flex flex-col items-center space-y-16">
                <div className="text-center space-y-3">
                   <h1 className="text-4xl font-black tracking-[0.4em] text-white italic">ARCH</h1>
                   <p className="text-[10px] tracking-[0.5em] uppercase text-sky-500 font-black">GenUI Protocol // v2.0</p>
                </div>

                <motion.button 
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={authState === 'authenticating'}
                  className="relative w-32 h-32 rounded-full border border-sky-500/20 bg-sky-500/5 flex items-center justify-center text-sky-400 group"
                >
                  <AnimatePresence mode="wait">
                    {authState === 'authenticating' ? (
                       <motion.div key="act" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                         <Cpu className="w-12 h-12" />
                       </motion.div>
                    ) : (
                       <motion.div key="fp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <Fingerprint className="w-14 h-14 group-hover:text-white transition-colors duration-500" strokeWidth={1} />
                       </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {authState === 'authenticating' && (
                    <div className="absolute inset-[-10px] border border-sky-500/30 rounded-full animate-ping" />
                  )}
                </motion.button>
                
                <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] flex items-center gap-3">
                  <ShieldCheck size={14} /> {authState === 'authenticating' ? 'Synchronizing...' : 'Auth Required'}
                </p>
              </div>
            </motion.div>
          )}

          {authState === 'main' && (
            <motion.div 
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 flex flex-col h-full w-full"
            >
              <header className="pt-10 px-8 pb-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-sky-500 uppercase">Neural.OS</span>
                  <span className="text-[8px] text-stone-500 uppercase tracking-tighter">Deep Sea Node Alpha</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-sky-400 animate-ping' : 'bg-sky-500 shadow-[0_0_10px_#0ea5e9]'}`} />
              </header>

              <div className="flex-grow px-6 pt-2 pb-24 overflow-y-auto custom-scrollbar relative">
                <div className="liquid-container flex flex-col gap-4 relative min-h-[400px]">
                  <AnimatePresence mode="popLayout">
                    {uiSchema.map((item) => {
                      const Component = COMPONENT_MAP[item.type];
                      if (!Component) return null;
                      return (
                        <motion.div
                          key={item.id}
                          layoutId={item.id}
                          initial={{ scale: 0.9, opacity: 0, y: 30 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="liquid-item w-full"
                        >
                          <Component {...item.props} liveValue={item.type === 'ValueDisplay' ? liveData['ValueDisplay'] : null} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {showInput && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                      className="absolute inset-x-6 bottom-28 z-[100]"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-sky-500/20 rounded-3xl blur-xl" />
                        <input 
                          autoFocus
                          type="text" 
                          value={inputIntent}
                          onChange={(e) => setInputIntent(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && executeGenUI()}
                          placeholder="Command the Deep..." 
                          className="relative w-full bg-[#030712]/95 border border-sky-400/30 rounded-3xl py-6 px-8 text-white text-sm outline-none focus:border-sky-400/60 shadow-2xl backdrop-blur-3xl font-light italic"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Deck */}
              <div className="absolute bottom-0 left-0 right-0 z-30">
                <AnimatePresence>
                  {controlsVisible && (
                    <motion.div 
                      initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                      className="bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pt-16 pb-20 px-6 flex justify-center"
                    >
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-sky-500/5 bg-sky-500/[0.02] shadow-inner" />
                        <div className="relative w-36 h-36">
                          <ControllerBtn 
                            icon={isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />} 
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 bg-sky-950/40 text-sky-200 border-sky-400/20"
                            onClick={() => { playHarmonicSound('click'); setIsPlaying(!isPlaying); }}
                          />
                          <ControllerBtn 
                            icon={<Mic size={18} />} 
                            className={`absolute left-0 top-1/2 -translate-x-1/3 -translate-y-1/2 transition-all ${showInput ? 'bg-sky-500 text-black border-white shadow-[0_0_20px_white]' : 'bg-white/5 hover:bg-white/10'}`}
                            onClick={handleMicClick}
                          />
                          <ControllerBtn 
                            icon={<Camera size={18} />} 
                            className="absolute right-0 top-1/2 translate-x-1/3 -translate-y-1/2 bg-white/5 hover:bg-white/10"
                            onClick={() => playHarmonicSound('click')}
                          />
                          <ControllerBtn 
                            icon={<Save size={18} />} 
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 bg-white/5 hover:bg-white/10"
                            onClick={() => playHarmonicSound('click')}
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center">
                             <div className={`w-2 h-2 rounded-full transition-all duration-700 ${isProcessing ? 'bg-sky-400 shadow-[0_0_15px_#0ea5e9] scale-150' : 'bg-sky-900/40'}`} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button onClick={() => setControlsVisible(!controlsVisible)} className="p-2 text-stone-700 hover:text-sky-400 transition-colors">
                    {controlsVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
        .liquid-container { filter: url('#goo'); }
        .liquid-item { will-change: transform, opacity; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px #0ea5e966;
        }
      `}} />
    </div>
  );
}

function ControllerBtn({ icon, className, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-stone-300 backdrop-blur-xl active:scale-90 transition-all duration-300 shadow-2xl z-10 ${className}`}
    >
      {icon}
    </button>
  );
}
