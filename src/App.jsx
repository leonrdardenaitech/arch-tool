import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Linkedin, Server, Cpu, 
  Terminal, ShieldCheck, ArrowRight, BrainCircuit, Code,
  Crosshair, Layers, Volume2, VolumeX, Github, PlayCircle, X,
  Video, Activity, Lock, Zap, Sparkles, Save, Search, AlertTriangle, Globe, Scan, CookingPot
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
  } catch (e) {}
};

const playSlideSound = (isMuted) => {
  if (isMuted) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
};

// --- DATA: CERTIFICATIONS ---
const CERTIFICATIONS = [
  {
    id: 'google-ai',
    title: 'Google AI Specialization',
    subtitle: '7-Course Professional Credential',
    image: "button3423.png",
    courses: [
      { title: "AI Fundamentals", desc: "Mapped core AI capabilities to specific logistical and enterprise workflows." },
      { title: "AI for Brainstorming & Planning", desc: "Utilized multi-modal AI to architect, prototype, and pressure-test structural systems." },
      { title: "AI for Research and Insights", desc: "Deployed intelligent workflows to extract high-fidelity intelligence from raw data." },
      { title: "AI for Writing and Communicating", desc: "Engineered prompt chains to generate scalable, on-brand corporate communications." },
      { title: "AI for Content Creation", desc: "Leveraged diffusion models to rapidly prototype and generate production assets." },
      { title: "AI for Data Analysis", desc: "Automated data pipelines to synthesize predictive models and uncover bottlenecks." },
      { title: "AI for App Building", desc: "Engineered full-stack integrations to deploy functional, AI-native applications." },
    ]
  },
  {
    id: 'prompting-essentials',
    title: 'Google Prompting Essentials',
    subtitle: 'Advanced Prompt Engineering',
    image: "button3423.png",
    courses: [
      { title: "Start Writing Prompts like a Pro", desc: "Engineered strict 5-step frameworks to extract specific, business-ready data safely." },
      { title: "Design Prompts for Everyday Work", desc: "Automated workflow logic to eliminate manual processing and accelerate deliverables." },
      { title: "Speed Up Data Analysis", desc: "Designed few-shot prompts to format raw analytics into executive-ready dashboards." },
      { title: "AI as a Expert Partner", desc: "Established conversational AI frameworks to pressure-test logic and refine architecture." },
    ]
  }
];

// --- DATA: STRATEGIC CAPABILITIES (9 Projects) ---
const CAPABILITIES = [
  { 
    id: "deep-thinking", 
    title: "Deep Thinking Node", 
    type: "AGENT_NODE",
    icon: <BrainCircuit className="text-cyan-400" size={24} />,
    image: "3d-brain.jpg",
    description: "Advanced long-form reasoning node utilizing Chain-of-Thought (CoT) prompting. Operates with explicit logic gates to ensure structural integrity.",
    metrics: ["Chain-of-Thought", "Logic Gates", "System Synthesis"],
    slides: [
      { text: "Step 1 / Decomposition: Breaking complex requests into discrete sub-tasks.", img: "3d-brain.jpg" },
      { text: "Step 2 / Iterative Refinement: Agent recursively evaluates its own logic.", img: "chart floating.jpg" },
      { text: "Step 3 / Synthesis: Recombining verified sub-tasks into a comprehensive solution.", img: "glowing crystal.png" }
    ]
  },
  { 
    id: "global-bridge", 
    title: "Global Logic Bridge", 
    type: "AGENT_NODE",
    icon: <Globe className="text-emerald-400" size={24} />,
    image: "Gemini_Generated_Image_hbwxo3hbwxo3hbwx (1).png",
    description: "Cross-border AI architecture for multilingual deployment. Ensures semantic consistency across global market vectors and regional logic gates.",
    metrics: ["Multilingual", "Global Sync", "Regional Gates"],
    slides: [
      { text: "Phase 1 / Regional Mapping: Identifying semantic variance across global datasets.", img: "Gemini_Generated_Image_hbwxo3hbwxo3hbwx (1).png" },
      { text: "Phase 2 / Translation Synthesis: High-fidelity logic translation without intent loss.", img: "Gemini_Generated_Image_z342lcz342lcz342..png" },
      { text: "Phase 3 / Synchronized Output: Unified global deployment with 0 latency.", img: "Gemini_Generated_Image_1igk5j1igk5j1igk.png" }
    ]
  },
  { 
    id: "eval-sentinel", 
    title: "Eval Sentinel", 
    type: "AGENT_NODE",
    icon: <ShieldCheck className="text-fuchsia-500" size={24} />,
    image: "seqscan1.png",
    description: "Autonomous evaluation layer governed by strict security protocols. Continuously monitors AI outputs for bias, hallucination, and prompt injection.",
    metrics: ["Output Validation", "Security", "Real-time Monitoring"],
    slides: [
      { text: "Phase 1 / Output Monitoring: Continuous analysis of LLM generations.", img: "seqscan1.png" },
      { text: "Phase 2 / Bias Detection: Identifying and neutralizing unintended bias.", img: "seqscan2.png" },
      { text: "Phase 3 / Security Lock: Automated escalation triggered by high-risk patterns.", img: "seqscan3.png" }
    ]
  },
  { 
    id: "vector-vault", 
    title: "Vector Vault", 
    type: "AGENT_NODE",
    icon: <Server className="text-cyan-400" size={24} />,
    image: "3d cloud.png",
    description: "Enterprise-grade RAG indexing system. Securely stores and retrieves proprietary intelligence with sub-millisecond latency.",
    metrics: ["Vector Indexing", "RAG Systems", "Unstructured Data"],
    slides: [
      { text: "Phase 1 / Ingestion: High-speed ingestion of unstructured data.", img: "3d cloud.png" },
      { text: "Phase 2 / Embedding: Logic-aware embeddings transform raw data.", img: "glowing crystal.png" },
      { text: "Phase 3 / Retrieval: Neural search zaps relevant data points.", img: "seqscan1.png" }
    ]
  },
  { 
    id: "watz-4-dinner", 
    title: "Watz 4 Dinner", 
    type: "APP_MODULE",
    icon: <CookingPot className="text-cyan-400" size={24} />,
    image: "whats4dinner.png",
    description: "AI-powered kitchen utility agent. Uses vision-to-logic synthesis to identify storage contents and generate high-fidelity meal plans with nutritional projections.",
    metrics: ["Computer Vision", "Meal Synthesis", "HITL Nutrition"],
    liveUrl: "watz-dinner.html",
    repoUrl: "https://github.com/leonrdardenaitech/watz-4-dinner"
  },
  { 
    id: "brand-builder", 
    title: "Brand Builder 007", 
    type: "APP_MODULE",
    icon: <Layers className="text-cyan-400" size={24} />,
    image: "Gemini_Generated_Image_2idzz52idzz52idz.png",
    description: "Multi-modal branding tool governed by a rigorous Eval Pipeline. Uses few-shot prompting to generate scalable visual assets.",
    metrics: ["Imagen 4.0", "Eval Pipelines", "Few-Shot Logic"],
    liveUrl: "brand-builder.html",
    repoUrl: "https://github.com/leonrdardenaitech/brand-builder"
  },
  { 
    id: "hydro-scan", 
    title: "Hydro Scan", 
    type: "APP_MODULE",
    icon: <Crosshair className="text-cyan-400" size={24} />,
    image: "Gemini_Generated_Image_9ycc7y9ycc7y9ycc.png",
    description: "Full-stack RAG system utilizing vector databases to process biometric telemetry into structured hydration metrics.",
    metrics: ["RAG Architecture", "Vector DB", "Tool-Calling"],
    liveUrl: "vox.html",
    repoUrl: "https://github.com/leonrdardenaitech/hydro-scan"
  },
  { 
    id: "snapback-agent", 
    title: "SnapBack AI Agent", 
    type: "AGENT_NODE",
    icon: <Terminal className="text-fuchsia-500" size={24} />,
    image: "snapback.jpg",
    description: "Sentiment-aware reputation agent utilizing advanced prompt-chaining. Automates rewards and escalates high-risk operational friction.",
    metrics: ["Prompt Chaining", "Sentiment Analysis", "Risk Automation"],
    slides: [
      { text: "Node 1 / Ingestion: Scraping customer feedback streams.", img: "sbslide1.png" },
      { text: "Node 2 / Vectoring: LLM evaluates emotional resonance.", img: "sbslide2.png" },
      { text: "Node 3 / Guardrail: Escalation protocol routes friction to human oversight.", img: "sbslide3.jpg" },
      { text: "Node 4 / Resolution: Pre-generating mitigation strategies.", img: "sbslide4.png" }
    ]
  },
  { 
    id: "chronos-agent", 
    title: "Employee Scheduler", 
    type: "AGENT_NODE",
    icon: <Cpu className="text-fuchsia-500" size={24} />,
    image: "4in1overlay.png",
    description: "Agentic workflow utilizing orchestration frameworks to automate supply-chain and personnel scheduling through recursive reasoning.",
    metrics: ["Agentic Workflows", "Recursive Reasoning", "Logic Gates"],
    slides: [
      { text: "Phase 1 / Initialization: Mapping real-time personnel availability.", img: "weekly1.jpg" },
      { text: "Phase 2 / Conflict Scan: Scanning overlapping PTO requests.", img: "weekly2.jpg" },
      { text: "Phase 3 / Optimization: Dynamically redistributing resources.", img: "weekly3.jpg" },
      { text: "Phase 4 / Matrix Finalization: Mathematically optimized monthly schedule.", img: "weekly4.jpg" }
    ] 
  },
  { 
    id: "patching-protocol", 
    title: "Patching Protocol", 
    type: "INTERACTIVE_NODE",
    icon: <Activity className="text-cyan-400" size={24} />,
    image: "cybergirl.jpg",
    description: "Sector 08: Interactive logic diagnostic and realignment protocol. Requires HITL verification to resolve audio sector friction.",
    metrics: ["HITL Protocol", "Logic Repair", "Audio Realignment"],
    isStory: true
  }
];

const SKILLS = [
  "AI Solutions Architecture", "Agentic Workflows", "Retrieval-Augmented Gen (RAG)", 
  "Prompt Injection Defense", "Eval Pipelines", "Vector Databases", 
  "Multi-Modal Integration", "Logistics Automation"
];

// --- COMPONENTS ---

const OptimizedImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-1000 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl scale-110'}`}
        loading="lazy"
      />
      {!isLoaded && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-cyan-500/20 uppercase font-mono animate-pulse">Initializing...</div>}
    </div>
  );
};

const InteractiveStoryNode = ({ isMuted, playVideoRequested }) => {
  const [step, setStep] = useState('intro'); // 'intro', 'repairA', 'repairB', 'success', 'rewardLoop'
  const [loopIdx, setLoopIdx] = useState(0);
  const [localMute, setLocalMute] = useState(isMuted);
  const audioRef = useRef(null);
  const loopImages = ['nebulagazer.jpg', 'nebulagazer1.jpg', 'nebulagazer2.jpg'];

  useEffect(() => { setLocalMute(isMuted); }, [isMuted]);

  useEffect(() => {
    if (step === 'rewardLoop') {
      const duration = loopIdx === 0 ? 20000 : 15000;
      const timer = setTimeout(() => {
        setLoopIdx(prev => (prev + 1) % loopImages.length);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [step, loopIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = localMute;
    }
  }, [localMute]);

  const handleChoice = (choice) => {
    setStep(choice === 'A' ? 'repairA' : 'repairB');
    if (audioRef.current) {
      audioRef.current.src = choice === 'A' ? '/arch-tool/Nebulabloom.mp3' : '/arch-tool/hiphopjazz.mp3';
      audioRef.current.loop = false;
      audioRef.current.play().catch(e => console.log(e));
    }

    const repairTime = playVideoRequested ? 15000 : 5000;

    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        setStep('rewardLoop');
        if (audioRef.current) {
          audioRef.current.src = '/arch-tool/Cobblestone_Reverie.mp3';
          audioRef.current.loop = true;
          audioRef.current.play().catch(e => console.log(e));
        }
      }, 5000);
    }, repairTime);
  };

  return (
    <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center relative">
      <audio ref={audioRef} />
      
      {/* Sound Toggle (Local) */}
      <button onClick={() => setLocalMute(!localMute)} className="absolute top-6 right-6 z-[100] p-4 bg-black/40 border border-cyan-500/30 rounded-full text-cyan-400 backdrop-blur-md hover:bg-cyan-900/20 transition-all">
        {localMute ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
      </button>

      {/* Intro Phase */}
      {step === 'intro' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="absolute inset-0 z-0 opacity-50">
            <img src="cybergirlheadfix.jpg" className="w-full h-full object-cover blur-[2px] scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
          </div>
          <div className="relative z-10 space-y-12 w-full flex flex-col items-center">
            <div className="w-48 h-48 rounded-full border-4 border-red-500/50 flex items-center justify-center bg-red-950/20 shadow-[0_0_40px_rgba(239,68,68,0.3)] animate-pulse">
              <AlertTriangle size={80} className="text-red-500" />
            </div>
            <div className="w-full bg-slate-900/90 border-y border-cyan-500/30 py-8 backdrop-blur-md overflow-hidden relative">
              <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] mb-4 animate-pulse">Neural Handshake Required</p>
              <p className="text-white text-xl font-bold tracking-widest px-8 uppercase italic whitespace-nowrap animate-marquee">
                "Audio sectors 07-09 report severe logic misalignment. Human-in-the-loop required for sector realignment."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full max-w-2xl">
              <button onClick={() => handleChoice('A')} className="w-full sm:w-auto px-12 py-5 bg-cyan-950 border-2 border-cyan-500 text-cyan-300 font-black uppercase text-xs tracking-widest hover:bg-cyan-500 hover:text-black transition-all shadow-2xl min-w-[240px]">Strategy A: Nebula Fix</button>
              <button onClick={() => handleChoice('B')} className="w-full sm:w-auto px-12 py-5 bg-fuchsia-950 border-2 border-fuchsia-500 text-fuchsia-300 font-black uppercase text-xs tracking-widest hover:bg-fuchsia-500 hover:text-black transition-all shadow-2xl min-w-[240px]">Strategy B: Rhythm Core</button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Phase */}
      {(step === 'repairA' || step === 'repairB') && (
        <div className="w-full h-full absolute inset-0 bg-black animate-fade-in flex items-center justify-center overflow-hidden">
          {playVideoRequested ? (
            <video src={step === 'repairA' ? "/arch-tool/patching1.mp4" : "/arch-tool/patching2.mp4"} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={step === 'repairA' ? "cybergirl.jpg" : "cybergirlheadfix.jpg"} className="w-full h-full object-cover opacity-60 scale-105" />
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center py-10 bg-black/60 backdrop-blur-lg border-y border-white/10 font-mono text-base tracking-[0.5em] text-white animate-pulse uppercase z-10 px-4">
            {step === 'repairA' ? 'Deploying Nebula Patch v1.5...' : 'Calibrating Rhythm Core Dynamics...'}
          </div>
        </div>
      )}

      {/* Success Phase */}
      {step === 'success' && (
        <div className="text-center space-y-8 animate-fade-in p-8">
          <div className="w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.6)]">
            <ShieldCheck size={64} className="text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-widest">Protocol Successful</h3>
          <p className="text-emerald-200 text-lg italic uppercase tracking-tighter">"Neural Handshake Complete. Rewriting Sector Audio Stream..."</p>
        </div>
      )}

      {/* Reward Loop Phase */}
      {step === 'rewardLoop' && (
        <div className="w-full h-full absolute inset-0 overflow-hidden bg-black animate-fade-in">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
          <img 
            key={loopIdx}
            src={loopImages[loopIdx]} 
            className={`w-full h-full object-cover ${loopIdx === 0 ? 'animate-nebula-zoom-20' : 'animate-nebula-fade-15'}`} 
          />
          <div className="absolute bottom-12 left-12 z-20 space-y-2 text-left">
            <p className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase opacity-60">Synthesis Rewards Active</p>
            <p className="text-white text-3xl font-black italic uppercase tracking-tighter shadow-black drop-shadow-2xl">Deep Space Reverie</p>
            <p className="text-slate-400 font-mono text-[10px] tracking-widest">Logic Node: Sector 08 // Cobblestone Loop Active</p>
          </div>
          <button onClick={() => { setStep('intro'); if(audioRef.current) { audioRef.current.pause(); audioRef.current.loop = false; } }} className="absolute bottom-12 right-12 z-20 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[10px] text-white uppercase tracking-widest transition-all">Restart Protocol</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
        @keyframes nebula-zoom-20 {
          0% { transform: scale(3); filter: blur(10px); opacity: 0; }
          100% { transform: scale(1); filter: blur(0); opacity: 1; }
        }
        @keyframes nebula-fade-15 {
          0% { opacity: 0; filter: blur(10px); }
          100% { opacity: 1; filter: blur(0); }
        }
        .animate-nebula-zoom-20 { animation: nebula-zoom-20 20s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-nebula-fade-15 { animation: nebula-fade-15 15s ease-in-out forwards; }
      `}} />
    </div>
  );
};

const PresentationModal = ({ agent, onClose, isMuted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [localMute, setLocalMute] = useState(isMuted);

  useEffect(() => {
    let timer;
    if (agent && agent.slides && !agent.isStory) {
        if (isPlaying && currentSlide < agent.slides.length - 1) {
        timer = setTimeout(() => setCurrentSlide(prev => prev + 1), 4000);
        } else if (currentSlide === agent.slides.length - 1) {
        setIsPlaying(false);
        }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, agent]);

  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 bg-[#0a0314]/98 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f041e] border border-fuchsia-500/50 w-full max-w-6xl rounded-none sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.2)] flex flex-col h-full sm:h-[90vh]">
        <div className="p-6 border-b border-cyan-900/50 flex justify-between items-center bg-[#150727]">
          <div className="flex items-center gap-4">
            {agent.isStory ? <Activity className="text-cyan-400" size={28} /> : <Video className="text-cyan-400" size={28} />}
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">{agent.title} // {agent.isStory ? 'HITL Protocol' : 'Synthesis Presentation'}</h3>
              <p className="text-xs text-fuchsia-400 font-mono tracking-widest opacity-70">Sector Designation: 08</p>       
            </div>
          </div>
          <div className="flex items-center gap-4">
            {agent.isStory && (
              <button onClick={() => setPlayVideo(!playVideo)} className={`p-2 rounded-lg border transition-all ${playVideo ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_#00f0ff]' : 'bg-slate-900 text-cyan-500 border-cyan-900/50'}`}>
                <Video size={20} />
              </button>
            )}
            <button onClick={() => setLocalMute(!localMute)} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors">
              {localMute ? <VolumeX size={20} /> : <Volume2 size={20} className="text-cyan-400" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-red-950/30 rounded-full transition-colors text-slate-400 hover:text-red-400 ml-2">
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#05010a]">
          {agent.isStory ? (
            <InteractiveStoryNode isMuted={localMute} playVideoRequested={playVideo} />
          ) : (
            <div className="p-8 w-full h-full flex flex-col items-center justify-center">
              <div className="absolute w-full h-full bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none"></div>    
              <div className="w-full max-w-3xl aspect-video bg-[#05010a] border border-cyan-500/30 rounded-2xl shadow-2xl relative flex items-center justify-center overflow-hidden mb-8 group">
                <OptimizedImage
                  src={agent.slides[currentSlide].img}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-full transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500/30 font-mono text-sm border-2 border-dashed border-cyan-900/50 m-4 rounded-xl z-0">
                   <span className="mb-2 uppercase tracking-widest">Scanning Node Data...</span>
                </div>
              </div>
              <div className="h-20 w-full max-w-3xl bg-[#150727] border border-fuchsia-500/30 rounded-xl p-4 flex items-center justify-center text-center shadow-inner">
                 <p className="text-lg md:text-xl text-cyan-100 font-medium tracking-wide" key={currentSlide}>
                    {agent.slides[currentSlide].text}
                 </p>
              </div>
            </div>
          )}
        </div>

        {!agent.isStory && (
          <div className="p-6 border-t border-cyan-900/50 bg-[#150727] flex justify-between items-center">
            <div className="flex gap-2">
              {agent.slides.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]' : 'w-2 bg-slate-700'}`} />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))} disabled={currentSlide === 0} className="text-slate-400 hover:text-cyan-400 disabled:opacity-30 uppercase font-bold text-[10px]">Prev</button>
              <button onClick={() => { if (currentSlide === agent.slides.length - 1) setCurrentSlide(0); setIsPlaying(!isPlaying); }} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] uppercase text-[10px]">
                {isPlaying ? 'Pause' : 'Play Presentation'}
                <PlayCircle size={16} className={isPlaying ? 'animate-pulse' : ''} />
              </button>
              <button onClick={() => setCurrentSlide(prev => Math.min(agent.slides.length - 1, prev + 1))} disabled={currentSlide === agent.slides.length - 1} className="text-slate-400 hover:text-cyan-400 disabled:opacity-30 uppercase font-bold text-[10px]">Next</button>     
            </div>
          </div>
        )}
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

  const handleProjectClick = (project) => {
    if (project.type === 'AGENT_NODE' || project.isStory) {
      setPresentationAgent(project);
    } else if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noreferrer');
    } else if (project.repoUrl) {
      window.open(project.repoUrl, '_blank', 'noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0314] text-slate-200 font-sans pb-20 relative overflow-x-hidden">
      <PresentationModal agent={presentationAgent} onClose={() => setPresentationAgent(null)} isMuted={isMuted} />
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
            <button onClick={() => setIsMuted(!isMuted)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-all">
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
          <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: "url('/arch-tool/timbackground.png')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0314]/90 via-[#0a0314]/60 to-[#0a0314] pointer-events-none"></div>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#120524] border border-cyan-400/50 text-cyan-300 text-xs font-bold uppercase tracking-widest z-10">
            <ShieldCheck size={16} className="text-fuchsia-500" />
            <span>Enterprise Automation & Security</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter z-10 uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 uppercase">DEVELOPING, BUILDING <br /> AND SECURING</span>
            <br /><span className="text-white">AI SOLUTIONS.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-4xl leading-relaxed z-10 mt-6 bg-[#0a0314]/60 backdrop-blur-sm p-8 rounded-3xl border border-cyan-900/50 shadow-3xl">
            The modern enterprise requires more than theoretical AI knowledge; it demands adaptable, secure, and rapidly deployable solutions... <strong className="text-cyan-400 font-bold">I can adapt to, architect, and resolute any AI problem.</strong>
          </p>
        </section>
        <section className="py-24 space-y-12 border-b border-cyan-900/40 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none" style={{ backgroundImage: "url('/arch-tool/ai-cert564.gif')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0314] via-[#0a0314]/60 to-[#0a0314] pointer-events-none"></div>
          <div className="text-center space-y-4 mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 uppercase">Verified Architecture Core</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.id} onClick={() => { playFlipSound(isMuted); setActiveCert(cert.id); }} className={`cursor-pointer rounded-2xl border p-6 flex items-center gap-6 ${activeCert === cert.id ? 'border-cyan-400 bg-[#17082e]/90 shadow-[0_0_30px_rgba(0,240,255,0.2)]' : 'border-slate-800 bg-[#0d041a]/80 opacity-60'}`}>
                <div className="w-24 h-24 bg-white rounded-xl p-1 border border-cyan-500/50 flex items-center justify-center shadow-inner"><OptimizedImage src={cert.image} alt={cert.title} className="w-full h-full rounded-lg" /></div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-white uppercase">{cert.title}</h3>
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
              <div key={project.id} className="group bg-[#0d041a] border border-cyan-500/40 rounded-2xl p-8 hover:border-cyan-300 transition-all flex flex-col h-full shadow-3xl relative overflow-hidden">
                {project.image && (
                  <div onClick={() => handleProjectClick(project)} className="w-full h-48 mb-6 rounded-xl overflow-hidden border border-fuchsia-500/30 relative cursor-pointer shadow-inner">
                    <OptimizedImage src={project.image} alt={project.title} className="group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                       <PlayCircle size={48} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-6">
                  <div className="p-3 bg-[#150727] rounded-lg border border-fuchsia-500/30">{project.icon}</div>
                  <div><span className="text-[9px] font-mono text-fuchsia-400 uppercase tracking-widest block mb-1">System Node // {project.type}</span><h3 className="text-2xl font-bold text-white uppercase">{project.title}</h3></div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-8">{project.description}</p>
                <div className="mt-auto">
                  {project.type === 'APP_MODULE' ? (
                    <div className="flex gap-4">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-500/50 rounded-xl text-xs font-bold text-white uppercase flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">Launch App</a>
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="px-6 py-4 bg-[#120524] border border-slate-700 rounded-xl text-xs font-bold text-slate-400 uppercase flex items-center justify-center gap-3 hover:text-white transition-colors"><Github size={16} /></a>
                    </div>
                  ) : (
                    <button onClick={() => setPresentationAgent(project)} className="w-full py-4 bg-[#120524] border border-fuchsia-500/50 rounded-xl text-xs font-bold text-fuchsia-400 uppercase flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">{project.isStory ? <Activity size={16} className="animate-pulse" /> : <Video size={16} />} Launch Protocol</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Massive Consultation CTA */}
        <section className="py-24 border-t border-cyan-900/40 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-fuchsia-900/40 to-cyan-900/40 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="relative group">
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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nebula-zoom-20 {
          0% { transform: scale(3); filter: blur(10px); opacity: 0; }
          5% { opacity: 1; }
          100% { transform: scale(1); filter: blur(0); }
        }
        @keyframes nebula-fade-15 {
          0% { opacity: 0; filter: blur(10px); }
          100% { opacity: 1; filter: blur(0); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-nebula-zoom-20 { animation: nebula-zoom-20 20s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-nebula-fade-15 { animation: nebula-fade-15 15s ease-in-out forwards; }
        .glow-cyan { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
      `}} />
    </div>
  );
}
