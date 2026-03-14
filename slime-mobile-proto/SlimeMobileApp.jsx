import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, onSnapshot, query, deleteDoc, doc 
} from 'firebase/firestore';
import { 
  Mic, Camera, X, Sparkles, Activity, Settings2, Construction, 
  AlertCircle, Save, Volume2, VolumeX, Layers, Zap, ChevronLeft, ChevronRight, Calendar, Trash2
} from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
// Safe check for environment variables to prevent crash
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "demo-key", projectId: "demo-id" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'engineer-els-arch-mobile';

// --- GLOBAL API CONFIG ---
// The environment provides the key at runtime via this specific variable name
const apiKey = "AIzaSyClApAYTE1J2zQC15jGqlyOCnOrRT9fNbc"; 

// --- AUDIO ENGINE ---
const playSlimeSound = (type = 'squish') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    switch(type) {
      case 'droplet': 
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        break;
      case 'splash': 
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        break;
      default: // squish
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    }
    osc.start(now);
    osc.stop(now + 0.5);
  } catch (e) {}
};

// --- API UTILITY ---
const callGemini = async (prompt, systemInstruction, structuredResponse = false) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  if (structuredResponse) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          toolName: { type: "STRING" },
          fields: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                label: { type: "STRING" },
                type: { type: "STRING", enum: ["input", "slider", "textarea"] },
                placeholder: { type: "STRING" },
              },
              required: ["id", "label", "type"]
            }
          },
          logic: { type: "STRING" }
        },
        required: ["toolName", "fields", "logic"]
      }
    };
  }

  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.status === 401) throw new Error("UNAUTHORIZED");
      if (!response.ok) throw new Error(`API_ERROR_${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
      if (err.message === "UNAUTHORIZED") throw err;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

// --- CONSTANTS ---
const SYSTEM_MILESTONES = [
  { type: 'milestone', date: '2025-11-15', thread: 'Completed Advanced Prompt Engineering Certification' },
  { type: 'milestone', date: '2026-01-10', thread: 'First Neural Backbone Implementation' },
  { type: 'milestone', date: '2026-03-01', thread: 'Brand Synthesis Engine v1.0 Launched' },
  { type: 'milestone', date: '2026-03-11', thread: 'Liquid UI Genesis: Morph Window Active' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [morphState, setMorphState] = useState('idle'); // idle, vision, genesis
  const [loading, setLoading] = useState(false);
  const [genesisUI, setGenesisUI] = useState(null);
  const [inputIntent, setInputIntent] = useState("");
  const [apiError, setApiError] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth", err); }
    };
    initAuth();
    onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user || !firebaseConfig.apiKey.includes("-")) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'prompts');
    const unsubscribe = onSnapshot(q, (s) => {
      setSavedPrompts(s.docs.map(d => ({id: d.id, ...d.data()})));
    }, (e) => console.error("Firestore", e));
    return () => unsubscribe();
  }, [user]);

  const triggerSound = (type) => { if (soundEnabled) playSlimeSound(type); };

  const forgeGenesis = async () => {
    if (!inputIntent) return;
    setLoading(true);
    setApiError(null);
    setMorphState('genesis');
    triggerSound('splash');
    
    try {
      const result = await callGemini(inputIntent, "Liquid UI Architect. Design mobile tool JSON.", true);
      const cleanJson = (result || "").replace(/```json|```/gi, "").trim();
      setGenesisUI(JSON.parse(cleanJson));
    } catch (e) {
      setApiError(e.message === "UNAUTHORIZED" ? "Neural Link Key Missing (401)" : "Synthesis Interrupted.");
    }
    setLoading(false);
  };

  const resetArch = () => {
    setMorphState('idle');
    setGenesisUI(null);
    setApiError(null);
    setInputIntent("");
    triggerSound('droplet');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020105] p-4 font-mono select-none overflow-hidden text-emerald-400">
      <CustomStyles />
      
      {/* Phone Shell */}
      <div className="relative w-full max-w-[380px] aspect-[9/19] bg-zinc-900 rounded-[3.5rem] border-[10px] border-zinc-800 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Top Header Label */}
        <div className="absolute top-0 left-0 right-0 bg-green-400 text-black py-2 px-6 text-[10px] font-black z-30 flex justify-between items-center shadow-lg">
          <span className="tracking-[0.3em]">SLIME CENTRAL</span>
          <div className="flex gap-3">
             <Activity size={10} className="animate-pulse" />
             <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
          </div>
        </div>

        {/* Neural Sludge Background */}
        <div className="absolute inset-0 bg-[#0a0514] overflow-hidden z-0">
          {/* Dripping Layer: Right to Left Stagger */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute top-0 w-[2px] bg-green-500/30 rounded-full animate-slime-drip"
                style={{
                  right: `${8 + (i * 16)}%`, // Distribute across the top
                  animationDelay: `${i * 0.6}s`, // Stagger starting from the right
                }}
              />
            ))}
          </div>

          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-950/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-green-950/10 rounded-full blur-[100px]" />
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 800">
            <g className="float-slime">
              <path d="M-50,-50 Q120,60 220,20 T450,-50 V200 Q320,300 180,220 T-50,260 Z" fill="#3b0764" />
            </g>
          </svg>
        </div>

        {/* --- MORPH WINDOW (Main Content) --- */}
        <div className="relative flex-grow mt-12 mb-40 px-6 z-10 flex flex-col items-center justify-center">
          
          {morphState === 'idle' && (
            <div className="text-center space-y-8 animate-fade-in w-full">
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                 <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
                 <Layers className="text-green-500 w-10 h-10 animate-float" />
              </div>
              <div className="space-y-1">
                <h2 className="text-green-400 text-[10px] font-black tracking-[0.4em] uppercase">Reactor Ready</h2>
                <p className="text-slate-600 text-[8px] uppercase tracking-widest italic">Awaiting Intent Synthesis</p>
              </div>
              <div className="w-full relative group">
                <div className="absolute -inset-1 bg-green-500/10 blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                <input 
                  type="text" 
                  value={inputIntent}
                  onChange={(e) => setInputIntent(e.target.value)}
                  placeholder="COMMAND INTENT..." 
                  className="relative w-full bg-black/60 border border-green-500/20 rounded-2xl p-4 text-emerald-100 text-[10px] outline-none focus:border-green-400 transition-all text-center placeholder:text-slate-700 font-bold tracking-widest uppercase"
                />
              </div>
              <SlimeLine savedPrompts={savedPrompts} onInteraction={() => triggerSound('droplet')} />
            </div>
          )}

          {morphState === 'vision' && (
            <div className="w-full h-full rounded-[3rem] bg-black border-2 border-green-500/20 overflow-hidden relative animate-fade-in shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none" />
               <div className="absolute top-6 left-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Vision_Feed.active</span>
               </div>
               <div className="w-full h-full flex flex-col items-center justify-center text-green-500/10">
                  <Camera size={80} className="animate-pulse" />
                  <p className="mt-4 text-[9px] uppercase font-black tracking-widest">Parsing Physical Logic...</p>
               </div>
               <button onClick={resetArch} className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-all active:scale-90 border border-white/10">
                 <X size={24} />
               </button>
            </div>
          )}

          {morphState === 'genesis' && (
            <div className="w-full h-full flex flex-col animate-fade-in">
              {loading ? (
                <div className="flex-grow flex flex-col items-center justify-center gap-6">
                  <Zap className="text-green-500 animate-bounce" size={48} />
                  <span className="text-[10px] text-green-400 font-black tracking-[0.5em] animate-pulse uppercase">Forging Interface</span>
                </div>
              ) : apiError ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-6 p-8 bg-red-950/20 rounded-[3rem] border border-red-500/30">
                  <AlertCircle className="text-red-500" size={40} />
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest leading-relaxed">{apiError}</p>
                  <button onClick={resetArch} className="px-8 py-3 bg-slate-800 rounded-full text-[9px] text-white font-black uppercase tracking-widest active:scale-95 transition-all">Dissolve Loop</button>
                </div>
              ) : (
                <div className="flex-grow bg-black/80 rounded-[3rem] border-2 border-green-500/30 p-8 flex flex-col shadow-2xl relative backdrop-blur-xl">
                  <button onClick={resetArch} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                  <div className="border-b border-green-500/20 pb-4 mb-8">
                    <h3 className="text-emerald-400 font-black uppercase text-[11px] tracking-[0.2em]">{genesisUI?.toolName}</h3>
                    <p className="text-[8px] text-slate-500 italic mt-2 leading-relaxed">{genesisUI?.logic}</p>
                  </div>
                  <div className="space-y-8 overflow-y-auto custom-scrollbar pr-2 flex-grow">
                    {genesisUI?.fields.map(f => (
                      <div key={f.id} className="space-y-3">
                        <label className="text-[9px] uppercase font-black text-slate-500 tracking-widest">{f.label}</label>
                        {f.type === 'slider' ? (
                          <input type="range" className="w-full accent-green-500 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer" />
                        ) : f.type === 'textarea' ? (
                          <textarea placeholder={f.placeholder} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-[11px] text-emerald-100 outline-none focus:border-green-500 h-24 font-mono shadow-inner" />
                        ) : (
                          <input type="text" placeholder={f.placeholder} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-[11px] text-emerald-100 outline-none focus:border-green-500 font-mono shadow-inner" />
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { triggerSound('squish'); resetArch(); }} className="mt-8 py-5 bg-green-500 text-black font-black uppercase text-[10px] rounded-2xl active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-[0.2em]">Commit Synthesis</button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* --- BOTTOM SECTION: Slime Wave Control Deck --- */}
        <div className="relative z-20 mt-auto min-h-[170px] flex flex-col justify-end">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <svg className="absolute bottom-0 w-[200%] h-full opacity-95 animate-wave translate-y-2" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,30 C150,80 350,-20 500,30 C650,80 850,-20 1000,30 L1000,100 L0,100 Z" fill="#052e16" />
            </svg>
            <svg className="absolute bottom-0 w-[200%] h-[90%] opacity-40 animate-wave-reverse" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,30 C150,-20 350,80 500,30 C650,-20 850,80 1000,30 L1000,100 L0,100 Z" fill="#22c55e" />
            </svg>
          </div>

          <div className="relative z-10 pb-12 pt-4 flex justify-around items-center px-12">
            <button 
              onClick={forgeGenesis}
              disabled={loading}
              className="group relative p-2 transition-all hover:scale-110 active:scale-90 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-green-400/10 blur-2xl group-hover:bg-green-400/30 rounded-full transition-all" />
              <div className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${morphState === 'genesis' ? 'bg-green-500 border-white shadow-[0_0_40px_#10b981]' : 'bg-black/60 border-green-500/40 shadow-[0_0_25px_rgba(74,222,128,0.2)]'}`}>
                {loading ? <Activity className="animate-spin text-black" size={28} /> : <Mic className={`${morphState === 'genesis' ? 'text-black' : 'text-green-400'} w-8 h-8`} />}
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-green-500/50 font-black uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-green-400 transition-colors">Speak</span>
            </button>

            <button 
              onClick={() => { setMorphState('vision'); triggerSound('droplet'); }}
              disabled={loading}
              className="group relative p-2 transition-all hover:scale-110 active:scale-90 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-green-400/10 blur-2xl group-hover:bg-green-400/30 rounded-full transition-all" />
              <div className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${morphState === 'vision' ? 'bg-green-500 border-white shadow-[0_0_40px_#10b981]' : 'bg-black/60 border-green-500/40 shadow-[0_0_25px_rgba(74,222,128,0.2)]'}`}>
                <Camera className={`${morphState === 'vision' ? 'text-black' : 'text-green-400'} w-8 h-8`} />
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-green-500/50 font-black uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-green-400 transition-colors">Vision</span>
            </button>
          </div>
        </div>

        {/* Glare Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-black/30 opacity-40 z-40" />
      </div>

      {/* Ambient Outer Glow */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_50%,#1a0b2e_0%,#000_100%)]" />
    </div>
  );
}

function SlimeLine({ savedPrompts, onInteraction }) {
  const events = useMemo(() => {
    const saveEvents = (savedPrompts || []).map(p => ({ 
      date: p.date || new Date().toISOString().split('T')[0], 
      thread: `${p.category || 'Node'}: ${(p.text || '').slice(0, 30)}...`,
    }));
    return [...SYSTEM_MILESTONES, ...saveEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [savedPrompts]);

  const [idx, setIdx] = useState(0);
  useEffect(() => { if (events.length > 0) setIdx(events.length - 1); }, [events.length]);

  const cur = events[idx] || { date: 'N/A', thread: 'Initial Load' };

  return (
    <div className="w-full mt-10 space-y-6">
      <div className="relative px-2">
         <input 
            type="range" min="0" max={Math.max(0, events.length - 1)} step="1"
            value={idx}
            onChange={(e) => { setIdx(parseInt(e.target.value)); onInteraction(); }}
            className="w-full h-1 appearance-none bg-zinc-800 rounded-full accent-green-500 cursor-pointer"
         />
      </div>
      <div className="bg-black/60 border border-green-500/20 p-5 rounded-[2rem] flex items-center gap-4 relative group/item shadow-inner">
         <Calendar size={18} className="text-green-500/40" />
         <div className="text-left flex-grow overflow-hidden">
            <span className="text-[8px] text-slate-700 uppercase font-black tracking-widest">{cur.date}</span>
            <p className="text-[10px] text-emerald-100 italic truncate w-full">"{cur.thread}"</p>
         </div>
      </div>
    </div>
  );
}

function CustomStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
      
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes slowFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-15px) scale(1.02); } }
      @keyframes waveMove { 0% { transform: translateX(0); } 50% { transform: translateX(-25%); } 100% { transform: translateX(0); } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

      @keyframes slime-drip {
        0% { height: 0; transform: translateY(0); opacity: 0; }
        10% { opacity: 0.6; }
        30% { height: 60px; transform: translateY(0); }
        60% { height: 120px; transform: translateY(100px); opacity: 0.4; }
        100% { height: 10px; transform: translateY(400px); opacity: 0; }
      }

      .animate-slime-drip {
        animation: slime-drip 4s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
      }

      .float-slime { animation: slowFloat 15s infinite ease-in-out; }
      .animate-wave { animation: waveMove 10s infinite ease-in-out; }
      .animate-wave-reverse { animation: waveMove 14s infinite ease-in-out reverse; }
      .animate-float { animation: float 4s infinite ease-in-out; }
      .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      .gooey-text { text-shadow: 0 0 15px rgba(74, 222, 128, 0.5); }
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #14532d; border-radius: 10px; }

      input[type=range] { -webkit-appearance: none; background: transparent; }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #22c55e;
        cursor: pointer;
        box-shadow: 0 0 15px #22c55e;
        border: 3px solid #000;
        margin-top: -7.5px;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 2px;
        background: #27272a;
        border-radius: 1px;
      }
    `}} />
  );
}