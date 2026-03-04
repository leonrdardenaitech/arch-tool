import React, { useState, useEffect } from 'react';
import { 
  Mail, Linkedin, Server, Cpu, 
  Terminal, ShieldCheck, ArrowRight, BrainCircuit, Code,
  Crosshair, Layers, Volume2, VolumeX, Github, PlayCircle, X,
  Video
} from 'lucide-react';

// --- SOUND UTILITY ---
const playFlipSound = (isMuted) => {
  if (isMuted) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

// --- DATA: CERTIFICATIONS & COURSES ---
const CERTIFICATIONS = [
  {
    id: 'google-ai',
    title: 'Google AI Specialization',
    subtitle: '7-Course Professional Credential',
    image: "button3423.png",
    courses: [
      { title: "AI Fundamentals", desc: "Mapped core AI capabilities to specific logistical and enterprise workflows to guarantee operational ROI." },
      { title: "AI for Brainstorming & Planning", desc: "Utilized multi-modal AI to architect, prototype, and pressure-test structural system designs." },
      { title: "AI for Research and Insights", desc: "Deployed intelligent workflows to extract high-fidelity intelligence from unstructured data sets." },
      { title: "AI for Writing and Communicating", desc: "Engineered prompt chains to generate scalable, on-brand corporate communications and reports." },
      { title: "AI for Content Creation", desc: "Leveraged diffusion models to rapidly prototype and generate production assets at scale." },
      { title: "AI for Data Analysis", desc: "Automated data pipelines to synthesize predictive models and uncover systemic bottlenecks instantly." },
      { title: "AI for App Building", desc: "Engineered full-stack integrations to deploy functional, AI-native applications for end-users." },
    ]
  },
  {
    id: 'prompting-essentials',
    title: 'Google Prompting Essentials',
    subtitle: 'Advanced Prompt Engineering',
    image: "button3423.png",
    courses: [
      { title: "Start Writing Prompts like a Pro", desc: "Engineered strict 5-step prompt frameworks to extract highly specific, business-ready data safely." },
      { title: "Design Prompts for Everyday Work", desc: "Automated workflow logic to eliminate manual data processing and accelerate deliverables." },
      { title: "Speed Up Data Analysis", desc: "Designed few-shot prompts to instantly format raw analytics into executive-ready dashboards." },
      { title: "AI as a Creative/Expert Partner", desc: "Established conversational AI frameworks to pressure-test logic and refine system architecture." },
    ]
  }
];

// --- DATA: STRATEGIC CAPABILITIES (Dashboard) ---
const CAPABILITIES = [
  { 
    id: "brand-builder", 
    title: "Brand Builder", 
    type: "APP_MODULE",
    icon: <Layers className="text-cyan-400" size={24} />,
    image: "Gemini_Generated_Image_2idzz52idzz52idz.png",
    description: "Multi-modal branding tool governed by a rigorous Eval Pipeline. Uses few-shot prompting and automated sanitization to safely generate scalable visual assets without prompt injection risks.",
    metrics: ["Imagen 4.0", "Eval Pipelines", "Few-Shot Logic"],
    repoUrl: "https://github.com/leonrdardenaitech/brand-builder"
  },
  { 
    id: "hydro-scan", 
    title: "Hydro Scan", 
    type: "APP_MODULE",
    icon: <Crosshair className="text-cyan-400" size={24} />,
    image: "Gemini_Generated_Image_9ycc7y9ycc7y9ycc.png",
    description: "Full-stack RAG system utilizing vector databases to process biometric telemetry. Transforms irregular voice inputs into structured hydration metrics with real-time neural context syncing.",
    metrics: ["RAG Architecture", "Vector DB", "Tool-Calling"],
    repoUrl: "https://github.com/leonrdardenaitech/hydro-scan"
  },
  { 
    id: "snapback-agent", 
    title: "SnapBack AI Agent", 
    type: "AGENT_NODE",
    icon: <Terminal className="text-fuchsia-500" size={24} />,
    image: "snapback.jpg",
    description: "Sentiment-aware reputation agent utilizing advanced prompt-chaining. Automates rewards for positive inputs and instantly escalates high-risk operational friction to human management.",
    metrics: ["Prompt Chaining", "Sentiment Analysis", "Risk Automation"],
    slides: [
      { 
        text: "Node 1 / Ingestion: Continuously scraping and parsing multi-channel customer feedback streams via API endpoints.", 
        img: "sbslide1.png" 
      },
      { 
        text: "Node 2 / Sentiment Vectoring: LLM evaluates emotional resonance. Trigger activated: Negative friction detected above 0.85 threshold.", 
        img: "sbslide2.png" 
      },
      { 
        text: "Node 3 / Guardrail Engaged: Standard automation bypassed. Escalation protocol routes high-risk friction to human oversight.", 
        img: "sbslide3.jpg" 
      },
      { 
        text: "Node 4 / Resolution: Agent pre-generates a personalized mitigation strategy for manager approval. Churn prevented. Latency: 0.", 
        img: "sbslide4.png" 
      }
    ]

  },
  { 
    id: "chronos-agent", 
    title: "Employee Scheduler", 
    type: "AGENT_NODE",
    icon: <Cpu className="text-fuchsia-500" size={24} />,
    image: "Gemini_Generated_Image_4v4ckj4v4ckj4v4c.png",
    description: "Agentic workflow utilizing orchestration frameworks to automate supply-chain and personnel scheduling. Handles autonomous decision-making through recursive reasoning loops.",
    metrics: ["Agentic Workflows", "Recursive Reasoning", "Logic Gates"],
  slides: [
      { 
        text: "Phase 1 / State Initialization: Agent interfaces with HR databases to map real-time personnel availability and constraints.", 
        img: "weekly1.jpg" 
      },
      { 
        text: "Phase 2 / Conflict Identification: Scanning overlapping PTO requests and mandatory training modules to isolate shift vulnerabilities.", 
        img: "weekly2.jpg" 
      },
      { 
        text: "Phase 3 / Recursive Reasoning Loop: Agent executes multi-step logic to dynamically redistribute resources and maintain operational coverage.", 
        img: "weekly3.jpg" 
      },
{ 
        text: "Phase 4 / Matrix Finalization: A mathematically optimized, conflict-free monthly schedule is deployed automatically.", 
        img: "weekly4.jpg" 
      }
    ] // This closes the slides array
  } // This curly brace closes the "Employee Scheduler" object
]; // This square bracket and semicolon closes the entire CAPABILITIES array

const SKILLS = [
  "AI Solutions Architecture", "Agentic Workflows", "Retrieval-Augmented Gen (RAG)", 
  "Prompt Injection Defense", "Eval Pipelines", "Vector Databases", 
  "Multi-Modal Integration", "Logistics Automation"
];

// --- COMPONENTS ---

const PresentationModal = ({ agent, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (agent && agent.slides) {
        if (isPlaying && currentSlide < agent.slides.length - 1) {
        timer = setTimeout(() => setCurrentSlide(prev => prev + 1), 3000);
        } else if (currentSlide === agent.slides.length - 1) {
        setIsPlaying(false);
        }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, agent]);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#0a0314]/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f041e] border border-fuchsia-500/50 w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.2)] flex flex-col h-[85vh]">
        <div className="p-6 border-b border-cyan-900/50 flex justify-between items-center bg-[#150727]">
          <div className="flex items-center gap-4">
            <Video className="text-cyan-400" size={28} />
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">{agent.title} // Synthesis Presentation</h3>
              <p className="text-xs text-fuchsia-400 font-mono tracking-widest">Agentic Workflow Demonstration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-fuchsia-900/30 rounded-full transition-colors text-slate-400 hover:text-fuchsia-400">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute w-full h-full bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="w-full max-w-3xl aspect-video bg-[#05010a] border border-cyan-500/30 rounded-2xl shadow-2xl relative flex items-center justify-center overflow-hidden mb-8 group">
            <img 
              src={agent.slides[currentSlide].img} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-contain relative z-10 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500/30 font-mono text-sm border-2 border-dashed border-cyan-900/50 m-4 rounded-xl z-0">
               <span className="mb-2">Loading Node Data:</span>
               <strong className="text-fuchsia-500">{agent.slides[currentSlide].img}</strong>
            </div>
          </div>
          <div className="h-20 w-full max-w-3xl bg-[#150727] border border-fuchsia-500/30 rounded-xl p-4 flex items-center justify-center text-center shadow-inner">
             <p className="text-lg md:text-xl text-cyan-100 font-medium tracking-wide" key={currentSlide}>
                {agent.slides[currentSlide].text}
             </p>
          </div>
        </div>

        <div className="p-6 border-t border-cyan-900/50 bg-[#150727] flex justify-between items-center">
          <div className="flex gap-2">
            {agent.slides.map((_, idx) => (
              <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className="text-slate-400 hover:text-cyan-400 disabled:opacity-30">Previous</button>
            <button onClick={() => { if (currentSlide === agent.slides.length - 1) setCurrentSlide(0); setIsPlaying(!isPlaying); }} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              {isPlaying ? 'Pause' : 'Play Presentation'}
              <PlayCircle size={20} className={isPlaying ? 'animate-pulse' : ''} />
            </button>
            <button onClick={() => setCurrentSlide(prev => Math.min(agent.slides.length - 1, prev + 1))} disabled={currentSlide === agent.slides.length - 1} className="text-slate-400 hover:text-cyan-400 disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Flashcard = ({ course, isMuted }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => { playFlipSound(isMuted); setIsFlipped(!isFlipped); };
  return (
    <div className="group h-48 w-full [perspective:1000px] cursor-pointer" onClick={handleFlip}>
      <div className={`relative h-full w-full rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 h-full w-full rounded-xl bg-[#150727] border border-cyan-500/50 p-6 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
          <BrainCircuit size={28} className="text-fuchsia-500 mb-3" />
          <h3 className="text-sm font-bold text-white leading-snug tracking-wide">{course.title}</h3>
        </div>
        <div className="absolute inset-0 h-full w-full rounded-xl bg-gradient-to-br from-[#1d0b38] to-[#0a0314] border border-fuchsia-500/80 p-5 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_25px_rgba(217,70,239,0.3)]">
          <p className="text-xs text-slate-200 leading-relaxed font-medium">{course.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeCert, setActiveCert] = useState(CERTIFICATIONS[0].id);
  const [isMuted, setIsMuted] = useState(true);
  const [presentationAgent, setPresentationAgent] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0314] text-slate-200 font-sans pb-20 relative">
      <PresentationModal agent={presentationAgent} onClose={() => setPresentationAgent(null)} />
      <header className="sticky top-0 z-50 bg-[#0a0314]/90 backdrop-blur-md border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-600 to-violet-800 flex items-center justify-center text-white font-black text-xl border border-fuchsia-400">LD</div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg tracking-tight text-white uppercase">Leon R. Darden</h1>
              <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">AI Solutions Architect</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMuted(!isMuted)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-mono text-slate-400 hover:text-cyan-400">
              {isMuted ? <VolumeX size={14} className="text-red-400"/> : <Volume2 size={14} className="text-cyan-400"/>}
              <span className="hidden sm:inline">{isMuted ? 'Audio Off' : 'Audio On'}</span>
            </button>
            <div className="hidden md:flex gap-5 text-cyan-400">
              <a href="mailto:Leonrdarden@gmail.com"><Mail size={20} /></a>
              <a href="https://www.linkedin.com/in/leon-darden-686899a5" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6">
        <section className="py-24 md:py-32 flex flex-col items-center text-center gap-8 border-b border-cyan-900/40 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: "url('timbackground.png')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0314]/90 via-[#0a0314]/60 to-[#0a0314] pointer-events-none"></div>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#120524] border border-cyan-400/50 text-cyan-300 text-xs font-bold uppercase tracking-widest z-10">
            <ShieldCheck size={16} className="text-fuchsia-500" />
            <span>Enterprise Automation & Security</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter z-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500">DEVELOPING, BUILDING <br /> AND SECURING</span>
            <br /><span className="text-white">AI SOLUTIONS.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl leading-relaxed z-10 mt-6 bg-[#0a0314]/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-900/50 shadow-3xl">
            The modern enterprise requires more than theoretical AI knowledge; it demands adaptable, secure, and rapidly deployable solutions... <strong className="text-cyan-400 font-bold">I can adapt to, architect, and resolute any AI problem.</strong>
          </p>
        </section>
        <section className="py-24 space-y-12 border-b border-cyan-900/40 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: "url('ai-cert564.gif')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0314] via-[#0a0314]/60 to-[#0a0314] pointer-events-none"></div>
          <div className="text-center space-y-4 mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 uppercase">Verified Architecture Core</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.id} onClick={() => { playFlipSound(isMuted); setActiveCert(cert.id); }} className={`cursor-pointer rounded-2xl border p-6 flex items-center gap-6 ${activeCert === cert.id ? 'border-cyan-400 bg-[#17082e]/90 shadow-[0_0_30px_rgba(0,240,255,0.2)]' : 'border-slate-800 bg-[#0d041a]/80 opacity-60'}`}>
                <div className="w-24 h-24 bg-white rounded-xl p-1 border border-cyan-500/50"><img src={cert.image} alt={cert.title} className="w-full h-full object-cover rounded-lg" /></div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                  <p className="text-xs text-fuchsia-400 font-mono uppercase tracking-widest">{cert.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[#0f041e]/80 border border-cyan-900/50 rounded-3xl p-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CERTIFICATIONS.find(c => c.id === activeCert)?.courses.map((course, idx) => (
                <Flashcard key={idx} course={course} isMuted={isMuted} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 space-y-16">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 uppercase">Strategic Capabilities</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {CAPABILITIES.map(project => (
              <div key={project.id} className="group bg-[#0d041a] border border-cyan-500/40 rounded-2xl p-8 hover:border-cyan-300 transition-all flex flex-col h-full shadow-3xl">
                {project.image && (
                  <div onClick={() => project.type === 'AGENT_NODE' ? setPresentationAgent(project) : null} className={`w-full h-48 mb-6 rounded-xl overflow-hidden border border-fuchsia-500/30 relative ${project.type === 'AGENT_NODE' ? 'cursor-pointer' : ''}`}>
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    {project.type === 'AGENT_NODE' && (
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                          <PlayCircle size={48} className="text-cyan-400" />
                       </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-6">
                  <div className="p-3 bg-[#150727] rounded-lg border border-fuchsia-500/30">{project.icon}</div>
                  <div><span className="text-[9px] font-mono text-fuchsia-400 uppercase tracking-widest block mb-1">System Node // {project.type}</span><h3 className="text-2xl font-bold text-white uppercase">{project.title}</h3></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">{project.description}</p>
                <div className="mt-auto">
                  {project.type === 'APP_MODULE' ? (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#120524] border border-cyan-500/50 rounded-xl text-xs font-bold text-cyan-400 uppercase flex items-center justify-center gap-3"><Github size={16} /> GitHub Repo</a>
                  ) : (
                    <button onClick={() => setPresentationAgent(project)} className="w-full py-4 bg-[#120524] border border-fuchsia-500/50 rounded-xl text-xs font-bold text-fuchsia-400 uppercase flex items-center justify-center gap-3"><Video size={16} /> Launch Presentation</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Massive Consultation CTA */}
        <section className="py-24 border-t border-cyan-900/40 text-center relative overflow-hidden">
          {/* Intense pulsing background glow for the CTA area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-fuchsia-900/40 to-cyan-900/40 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative group">
               {/* Bright pulsing ring radiating from behind the button */}
               <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
               
               <a 
                 href="mailto:Leonrdarden@gmail.com?subject=AI Consultation Inquiry" 
                 className="relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white text-xl font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,240,255,0.6)] border border-white/40"
               >
                 Book a Consultation <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
               </a>
             </div>
             
             <p className="text-sm text-cyan-400 mt-10 font-mono uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Connect directly to discuss architecture & deployments</p>
          </div>
        </section>

        {/* Skills Tag Section */}
        <section className="py-20 border-t border-cyan-900/40">
          <div className="flex flex-wrap justify-center gap-4">
            {SKILLS.map(skill => (
              <div key={skill} className="flex items-center gap-2 px-5 py-2.5 bg-[#0d041a] border border-fuchsia-500/40 rounded-full hover:bg-[#1a0b2e] hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(217,70,239,0.1)] cursor-default">
                <Code size={14} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-200">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#05010a] text-center border-t border-cyan-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-600 to-cyan-600 flex items-center justify-center text-white text-xl font-black shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            LD
          </div>
          <div className="flex justify-center gap-8">
             <a href="mailto:Leonrdarden@gmail.com" className="text-xs font-bold uppercase tracking-widest text-cyan-500 hover:text-fuchsia-400 transition-colors">Contact Log</a>
             <a href="https://www.linkedin.com/in/leon-darden-686899a5" target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest text-cyan-500 hover:text-fuchsia-400 transition-colors">LinkedIn Network</a>
          </div>
          <p className="text-[9px] text-slate-600 uppercase font-mono tracking-[0.3em] pt-4">
            © 2026 LEON R DARDEN / SECURE AI SYSTEMS
          </p>
        </div>
      </footer>
    </div>
  );
}
