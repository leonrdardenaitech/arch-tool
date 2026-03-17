import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Palette, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Code, 
  Sparkles,
  Layers,
  Terminal,
  Cpu,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Download,
  Activity
} from 'lucide-react';

// --- CUSTOM STYLES & ANIMATIONS ---
const styles = `
  @keyframes clockwiseRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes counterClockwiseRotate { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes twinkle { 
    0%, 100% { opacity: 0.3; transform: scale(1); } 
    50% { opacity: 1; transform: scale(1.2); } 
  }
  @keyframes pulse-subtle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
  
  .orbit-ring-0 { animation: clockwiseRotate 40s linear infinite; }
  .orbit-ring-1 { animation: counterClockwiseRotate 30s linear infinite; }
  .orbit-ring-2 { animation: clockwiseRotate 20s linear infinite; }
  .orbit-item { animation: inherit; animation-direction: reverse; }

  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0.3;
    animation: twinkle var(--duration) infinite ease-in-out;
  }

  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .my-rotate-y-180 { transform: rotateY(180deg); }

  /* Ensure the flip works on hover */
  .group:hover .preserve-3d {
    transform: rotateY(180deg);
  }
  
  .typewriter {
    overflow: hidden;
    border-right: .15em solid orange;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .15em;
    animation: 
      typing 3.5s steps(40, end),
      blink-caret .75s step-end infinite;
  }

  @keyframes typing { from { width: 0 } to { width: 100% } }
  @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: orange; } }
`;

export default function ResumeApp() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState('experience');
  const [stars, setStars] = useState([]);
  const audioRef = useRef(null);

  // Generate stars and handle audio on entry
  useEffect(() => {
    const starCount = 150;
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        size: Math.random() * 2 + 1 + 'px',
        duration: Math.random() * 3 + 2 + 's',
        delay: Math.random() * 5 + 's'
      });
    }
    setStars(newStars);

    // Audio Logic
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const playEntryTone = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, audioCtx.currentTime); // Low frequency
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 8);
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 2);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 8);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 8);
    } catch (e) {
      console.log("Audio failed:", e);
    }
  };

  useEffect(() => {
    playEntryTone();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-cyan-400 font-mono tracking-[0.5em] uppercase">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin mb-8"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs animate-pulse">LD</div>
        </div>
        <span>Neural Sequence Initializing...</span>
        <div className="mt-4 text-[10px] opacity-50 tracking-normal">Syncing Bio-Metrics // Calibrating Frequency</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      <style>{styles}</style>
      
      {/* BACKGROUND: TWINKLING STARS */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(star => (
          <div 
            key={star.id} 
            className="star" 
            style={{ 
              top: star.top, 
              left: star.left, 
              width: star.size, 
              height: star.size, 
              '--duration': star.duration,
              animationDelay: star.delay
            }} 
          />
        ))}
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <a href="/portfolio" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
          <ArrowLeft size={14} /> Back to Portfolio
        </a>
        <div className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase">Neural Resume v2.0</div>
        <a href="/LEON R. DARDEN RESUME.pdf" download className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <Download size={14} /> Download PDF
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-32 flex flex-col gap-24 relative z-10">
        
        {/* --- SECTION 1: INTERACTIVE PROFILE CARD --- */}
        <section className="flex justify-center">
          <div className="group relative w-full max-w-sm h-80 perspective-1000">
            <div className="relative w-full h-full duration-700 preserve-3d group-hover:my-rotate-y-180 cursor-pointer">
              {/* Front Side */}
              <div className="absolute backface-hidden w-full h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 group-hover:border-blue-500/50">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
                    <img src="/my-picture.png" alt="Leon R. Darden" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] uppercase tracking-widest text-zinc-400 border border-zinc-700">
                    Active Architect
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Leon R. Darden</h1>
                  <p className="text-blue-400 font-medium text-sm mt-1 uppercase tracking-widest">AI Solutions Architect</p>
                </div>
                <div className="flex justify-between items-center text-zinc-500 text-xs font-mono">
                  <div className="flex items-center gap-2"><MapPin size={14} /> Stonecrest, GA</div>
                  <div className="text-zinc-600 uppercase tracking-tighter">Tap to Expand</div>
                </div>
              </div>

              {/* Back Side (Expansion) */}
              <div className="absolute my-rotate-y-180 backface-hidden w-full h-full bg-blue-600 rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/40 border-2 border-blue-400 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                   <img src="/my-picture.png" className="w-full h-full object-cover grayscale blur-[2px]" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-white/60 text-[10px] uppercase font-black tracking-widest">
                    <Activity size={12} /> Summary Init
                  </div>
                  <h2 className="text-xl font-bold text-white">The Visionary Architect</h2>
                  <p className="text-sm text-blue-50 leading-relaxed font-medium">
                    High-output AI Architect bridging complex LLM logic with human-centric design. I build visionary systems that turn raw data into strategic assets.
                  </p>
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-blue-100 bg-black/20 p-3 rounded-xl border border-white/10">
                    <Mail size={16} /> leonrdarden@gmail.com
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-100 bg-black/20 p-3 rounded-xl border border-white/10">
                    <Phone size={16} /> 678-763-0580
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: CELESTIAL ORBIT (COMPETENCIES) --- */}
        <section className="flex flex-col items-center gap-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs uppercase tracking-[0.4em] text-blue-500 font-black">Orchestration Ecosystem</h2>
            <p className="text-zinc-500 font-mono text-xs uppercase">Strategic Node Network // Systems Thinking</p>
          </div>

          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Center Core */}
            <div className="z-10 w-24 h-24 bg-zinc-900 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.4)] animate-pulse">
              <Brain className="text-blue-400" size={40} />
            </div>

            {/* Ring 0 - High Logic */}
            <div className="absolute w-full h-full border border-zinc-800/30 rounded-full orbit-ring-0">
               <OrbitIcon icon={<Cpu size={14}/>} label="LLM" pos="top" color="cyan" />
               <OrbitIcon icon={<Terminal size={14}/>} label="NLP" pos="right" color="cyan" />
               <OrbitIcon icon={<Layers size={14}/>} label="GCP" pos="bottom" color="cyan" />
            </div>

            {/* Ring 1 - Creative Tech */}
            <div className="absolute w-[75%] h-[75%] border border-zinc-800/30 rounded-full orbit-ring-1">
               <OrbitIcon icon={<Palette size={14}/>} label="UI/UX" pos="left" color="fuchsia" />
               <OrbitIcon icon={<Sparkles size={14}/>} label="GEN" pos="top" color="fuchsia" />
               <OrbitIcon icon={<Settings size={14}/>} label="Ops" pos="bottom" color="fuchsia" />
            </div>

            {/* Ring 2 - Core Skillset */}
            <div className="absolute w-[45%] h-[45%] border border-blue-500/10 rounded-full orbit-ring-2">
               <OrbitIcon icon={<Code size={12}/>} label="JS" pos="top" color="blue" />
               <OrbitIcon icon={<Zap size={12}/>} label="Prompt" pos="bottom" color="blue" />
            </div>
          </div>
        </section>

        {/* --- SECTION 3: EXPERIENCE & LOGISTICS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-blue-400 font-black tracking-widest text-xs uppercase">
                <Zap size={14} /> AI Engagements
              </h3>
              <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>
            
            <ExperienceCard 
              title="Founder & AI Solutions Architect"
              org="leonrdarden.com"
              date="2025 – Present"
              points={[
                "Architected an augmented digital ecosystem for high-fidelity AI integration.",
                "Engineered Brand Builder: Automated visual/textual identity engine using Gemini Pro.",
                "Developed Hydro-Scan: Voice-activated health telemetry with NLP synthesis."
              ]}
            />
            
            <ExperienceCard 
              title="Creative Leadership"
              org="Dell and Pat’s Place"
              date="Entrepreneurship"
              points={[
                "Managed intersection of art instruction and complex business operations.",
                "Designed holistic brand identities utilizing creative direction and visual art.",
                "Optimized community engagement through intuitive user-centric experiences."
              ]}
            />
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-zinc-500 font-black tracking-widest text-xs uppercase">
                <Settings size={14} /> Strategic Logistics
              </h3>
              <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-zinc-500/50 to-transparent"></div>
            </div>

            <ExperienceCard 
              title="Independent Contractor"
              org="Systems & Logistics"
              date="2020 – 2025"
              points={[
                "Managed high-volume delivery streams maintaining 99%+ efficiency (Amazon Flex).",
                "Translated logistical data into actionable zero-failure delivery protocols.",
                "Navigated high-pressure real-time data environments with absolute precision."
              ]}
              accent="zinc"
            />

            <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-[2rem] backdrop-blur-sm">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Certifications</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-xs text-zinc-400 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                    <CheckCircle2 size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-zinc-100 font-bold">Google AI Professional</p>
                    <p className="text-[10px] uppercase font-mono tracking-tighter">Verified 2026</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 text-xs text-zinc-400 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                    <CheckCircle2 size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-zinc-100 font-bold">Prompting Essentials</p>
                    <p className="text-[10px] uppercase font-mono tracking-tighter">Verified 2026</p>
                  </div>
                </li>
                <li className="flex items-center gap-4 text-xs text-zinc-400 group opacity-60">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Code size={16} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-zinc-300 font-bold">DeVry Institute</p>
                    <p className="text-[10px] uppercase font-mono tracking-tighter">Technical Education</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: AI CHAT NARRATIVE --- */}
        <section>
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Chat Header */}
            <div className="bg-zinc-900/50 px-8 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">System Protocol: Narrative_Analysis</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-10 space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-sm font-black border border-white/10 shadow-lg">LD</div>
                <div className="space-y-6">
                  <p className="text-2xl font-black text-white leading-tight uppercase italic tracking-tighter">
                    "Code is my medium. Creativity is my fuel." 🎨🤖
                  </p>
                  <div className="text-zinc-400 text-sm leading-relaxed max-w-2xl space-y-6 font-medium">
                    <p>
                      I spent years mastering the art of the "draw"—whether that was building a successful sip-and-paint business or creating visual brand identities. Today, I use that same creative intuition to architect the future of AI.
                    </p>
                    <p>
                      As an AI Solutions Architect, I don't just "plug in" LLMs. I design cohesive, secure, and visually intelligent systems. Why work with a Creative Architect? Because AI is only as good as the prompt that drives it and the interface that delivers it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex gap-3">
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] rounded-full border border-blue-500/30 font-black tracking-widest uppercase">Vision</span>
                  <span className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] rounded-full border border-fuchsia-500/30 font-black tracking-widest uppercase">Logic</span>
                  <span className="px-4 py-1.5 bg-zinc-800 text-zinc-500 text-[10px] rounded-full border border-zinc-700 font-black tracking-widest uppercase">Logistics</span>
                </div>
                <a href="mailto:leonrdarden@gmail.com" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  Initiate Collaboration
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-20 border-t border-white/5">
           <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.5em] mb-4">
             Architect: Leon R. Darden // Stonecrest GA
           </p>
           <p className="text-zinc-800 text-[8px] uppercase tracking-widest">
             Sourced via Gemini 1.5 Pro // Neural Resume Protocol v2.0.26
           </p>
        </footer>
      </main>
    </div>
  );
}

// --- Helper Components ---

function OrbitIcon({ icon, label, pos, color }) {
  const positions = {
    top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const colors = {
    cyan: 'border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    fuchsia: 'border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]',
    blue: 'border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  };

  return (
    <div className={`absolute ${positions[pos]} orbit-item flex flex-col items-center group`}>
      <div className={`w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border-2 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>
        {icon}
      </div>
      <span className="mt-2 text-[8px] md:text-[10px] font-black font-mono text-zinc-500 uppercase tracking-tighter bg-zinc-950/80 px-2 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </div>
  );
}

function ExperienceCard({ title, org, date, points, accent = "blue" }) {
  const borderClass = accent === "blue" ? "border-blue-600/50" : "border-zinc-700/50";
  const glowClass = accent === "blue" ? "group-hover:border-blue-400" : "group-hover:border-zinc-500";
  
  return (
    <div className={`bg-zinc-900/20 border-l-4 ${borderClass} p-8 rounded-r-3xl hover:bg-zinc-900/40 transition-all duration-500 group ${glowClass}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-white font-black text-base uppercase tracking-tight group-hover:text-blue-400 transition-colors">{title}</h4>
          <p className="text-xs text-zinc-500 mt-1 font-bold uppercase tracking-widest">{org}</p>
        </div>
        <span className="text-[9px] font-mono text-zinc-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{date}</span>
      </div>
      <ul className="space-y-4">
        {points.map((p, i) => (
          <li key={i} className="text-xs text-zinc-400 leading-relaxed flex gap-3 font-medium">
            <span className="text-blue-500 font-bold">/</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
