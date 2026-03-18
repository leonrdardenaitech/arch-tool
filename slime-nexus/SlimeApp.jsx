import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Mic, Camera, X, Activity, Sparkles, Copy, RefreshCw } from 'lucide-react';

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key", 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-id" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- GLOBAL API CONFIG ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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
const callGemini = async (prompt, systemInstruction) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API_${response.status}: ${errorData.error?.message || 'Unknown Error'}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (err) {
    throw err;
  }
};

export default function SlimeApp() {
  const [user, setUser] = useState(null);
  const [morphState, setMorphState] = useState('idle'); // idle, processing, output, vision
  const [inputIntent, setInputIntent] = useState("");
  const [refinedOutput, setRefinedOutput] = useState("");
  const [isListening, setIsInitializing] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Generate drips ONLY on the far left and right edges
  const drips = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      left: i % 2 === 0 ? `${Math.random() * 2}%` : `${98 + Math.random() * 2}%`,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 10,
      width: Math.random() * 4 + 3,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch(e) {}
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  const triggerSound = (type) => playSlimeSound(type);

  // --- REFINER LOGIC ---
  const executeRefiner = async (overrideInput = null) => {
    const finalInput = overrideInput || inputIntent;
    if (!finalInput) return;
    setMorphState('processing');
    triggerSound('splash');
    setRefinedOutput("");
    
    try {
      const sysInstruction = "You are the Slime Tool Prompt Refiner. Take the user's raw, messy input and expand it into a highly structured, professional 'Master Prompt'. Add necessary context, define strict execution rules, and format it clearly so it can be copied directly into an LLM.";
      const result = await callGemini(`Raw Input: ${finalInput}`, sysInstruction);
      setRefinedOutput(result);
      setMorphState('output');
      triggerSound('droplet');
    } catch (e) {
      setRefinedOutput(`⚠️ Refinement Failed: ${e.message}`);
      setMorphState('output');
    }
  };

  // --- HARDWARE: MIC ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported on this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => { triggerSound('droplet'); setMorphState('processing'); };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputIntent(transcript);
      executeRefiner(transcript);
    };
    recognition.onerror = () => { setMorphState('idle'); };
    recognition.start();
  };

  // --- HARDWARE: CAMERA ---
  const startCamera = async () => {
    setMorphState('vision');
    triggerSound('splash');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setMorphState('idle');
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setMorphState('idle');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refinedOutput);
    triggerSound('squish');
  };

  const resetArch = () => {
    stopCamera();
    setMorphState('idle');
    setRefinedOutput("");
    setInputIntent("");
    triggerSound('droplet');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020105] p-0 sm:p-4 font-mono select-none overflow-hidden text-emerald-400">
      <CustomStyles />
      
      <div className="relative w-full h-screen sm:h-auto sm:max-w-[380px] sm:aspect-[9/19] bg-zinc-900 sm:rounded-[3.5rem] border-0 sm:border-[12px] border-zinc-900 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        
        {/* SIDE OOZE PHYSICS */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {drips.map((d) => (
            <div 
              key={d.id}
              className="absolute top-0 bg-gradient-to-b from-green-500/60 via-green-500/20 to-transparent rounded-full animate-viscous-slide"
              style={{
                left: d.left,
                width: `${d.width}px`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
                opacity: d.opacity,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[#070311] z-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-950/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-green-950/10 rounded-full blur-[100px]" />
        </div>

        {/* MAIN INTERACTION ZONE */}
        <div className="relative flex-grow z-20 w-full">
          
          {/* SLIDE-UP INPUT BOX */}
          <div className={`absolute w-full px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center ${
              morphState === 'idle' ? 'top-1/2 -translate-y-1/2' : 'top-12'
            }`}>
            <input 
              type="text" 
              value={inputIntent}
              onChange={(e) => setInputIntent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeRefiner()}
              placeholder="INPUT RAW THOUGHT..." 
              className="relative w-full bg-black/80 border border-green-500/30 rounded-2xl p-5 text-emerald-100 text-[11px] outline-none focus:border-green-400 transition-all text-center placeholder:text-green-900/50 font-bold tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(34,197,94,0.1)] backdrop-blur-md"
            />
          </div>

          {/* VISUAL WINDOW (Fades in when active) */}
          <div className={`absolute w-full px-6 transition-all duration-700 delay-100 ease-out flex flex-col ${
              morphState !== 'idle' ? 'top-32 bottom-40 opacity-100' : 'top-40 bottom-40 opacity-0 pointer-events-none'
            }`}>
            <div className="w-full h-full bg-black/80 border border-green-500/20 rounded-3xl p-5 relative shadow-2xl backdrop-blur-xl flex flex-col">
              
              <div className="flex justify-between items-center border-b border-green-500/20 pb-3 mb-3">
                <span className="text-[9px] text-green-500 font-black uppercase tracking-widest flex items-center gap-2">
                  {morphState === 'processing' ? <Activity className="animate-spin" size={12}/> : <Sparkles size={12}/>}
                  {morphState === 'processing' ? 'Synthesizing...' : morphState === 'vision' ? 'Lens Active' : 'Refined Output'}
                </span>
                <button onClick={resetArch} className="text-slate-600 hover:text-red-400 transition-colors"><X size={16} /></button>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 text-[10px] text-emerald-100/90 leading-relaxed whitespace-pre-wrap">
                {morphState === 'vision' && (
                  <div className="h-full w-full relative bg-black rounded-xl overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-green-500/20 pointer-events-none" />
                  </div>
                )}
                {morphState === 'output' && refinedOutput}
              </div>

              {morphState === 'output' && (
                <div className="pt-4 border-t border-green-500/20 mt-2 flex gap-2">
                  <button onClick={() => executeRefiner()} className="flex-1 py-3 bg-zinc-900 border border-green-500/20 rounded-xl flex justify-center items-center text-green-500 active:scale-95 transition-all"><RefreshCw size={14} /></button>
                  <button onClick={copyToClipboard} className="flex-[3] py-3 bg-green-500 text-black font-black text-[9px] uppercase tracking-widest rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"><Copy size={12}/> Copy Master Prompt</button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM WAVES & CONTROLS */}
        <div className="relative z-30 min-h-[160px] flex flex-col justify-end">
          
          <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${morphState !== 'idle' ? 'opacity-30' : 'opacity-100'}`}>
            <svg className="absolute bottom-0 w-[200%] h-full animate-wave translate-y-2" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,30 C150,80 350,-20 500,30 C650,80 850,-20 1000,30 L1000,100 L0,100 Z" fill="#052e16" />
            </svg>
            <svg className="absolute bottom-0 w-[200%] h-[90%] opacity-60 animate-wave-reverse" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path d="M0,30 C150,-20 350,80 500,30 C650,-20 850,80 1000,30 L1000,100 L0,100 Z" fill="#22c55e" />
            </svg>
          </div>

          <div className="relative z-10 pb-12 pt-4 flex justify-around items-center px-16">
            <button onClick={startListening} className="group relative p-2 transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full transition-all" />
              <div className="relative w-16 h-16 rounded-full bg-black/80 border-2 border-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Mic className="text-green-400 w-6 h-6" />
              </div>
            </button>

            <button onClick={startCamera} className="group relative p-2 transition-all hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-green-400/10 blur-xl rounded-full transition-all" />
              <div className="relative w-14 h-14 rounded-full bg-black/60 border border-green-500/40 flex items-center justify-center">
                <Camera className="text-green-500/60 w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;900&display=swap');
      @keyframes waveMove { 0% { transform: translateX(0); } 50% { transform: translateX(-25%); } 100% { transform: translateX(0); } }
      @keyframes viscous-slide {
        0% { height: 0; transform: translateY(-50px); opacity: 0; }
        10% { opacity: 1; }
        50% { height: 100px; transform: translateY(300px); }
        90% { height: 40px; transform: translateY(600px); opacity: 0.5; }
        100% { height: 0; transform: translateY(650px); opacity: 0; }
      }
      .animate-viscous-slide { animation: viscous-slide linear infinite; will-change: transform, height, opacity; }
      .animate-wave { animation: waveMove 12s infinite ease-in-out; }
      .animate-wave-reverse { animation: waveMove 16s infinite ease-in-out reverse; }
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #14532d; border-radius: 10px; }
    `}} />
  );
}
