import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, getDoc, addDoc, onSnapshot, query, deleteDoc 
} from 'firebase/firestore';
import { 
  Volume2, VolumeX, Layers, Calendar, Database, Vault, 
  FolderOpen, FlaskConical, ChevronLeft, ChevronRight, 
  Cpu, Zap, Sparkles, Lightbulb, Trash2, X, Play, Activity, Download, Search, Save,
  Palette, Wind, Target, ShieldCheck
} from 'lucide-react';

// --- ROBUST ENVIRONMENT DETECTION ---
// Wiring this to your existing .env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const appId = 'engineer-els-arch-local';
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- CONSTANTS ---
const PERSONAS = ["Solutions Architect", "Staff Engineer", "UX Strategist", "Prompt Engineer", "Security Auditor", "Slime Overlord", "Brand Alchemist"];
const CATEGORIES = ["Learning", "Projects", "Sandbox", "Branding", "System Design", "Logic Gates", "Refinement", "Architecture", "Debugging", "Gems"];

const SYSTEM_MILESTONES = [
  { type: 'milestone', date: '2025-11-15', thread: 'Completed Advanced Prompt Engineering Certification' },
  { type: 'milestone', date: '2025-12-20', thread: 'Mastered Gemini Multimodal Logic Patterns' },
  { type: 'milestone', date: '2026-01-10', thread: 'First Neural Backbone Implementation' },
  { type: 'milestone', date: '2026-03-01', thread: 'Brand Synthesis Engine v1.0 Launched' },
];

const GEMS_POOL = [
  { text: "Act as a Solutions Architect. Design a stateless authentication flow for a slime-based microservice network.", reason: "Sets persona and technical constraints.", example: "Input: 'Login.' -> AI: Outputs JWT sequence diagrams." },
  { text: "Rewrite this logic to minimize O(n) complexity while maintaining a 'viscous' state management pattern.", reason: "Blends efficiency with domain metaphors.", example: "Input: [Nested loops] -> AI: Refactors to a Hash Map lookup (O(1))." },
  { text: "Generate a recursive loop that evaluates prompt quality after every iteration, stopping only at 95% clarity.", reason: "Ensures high-fidelity outputs.", example: "Input: 'Blog.' -> AI: Writes, critiques, and delivers a polished 3rd draft." },
  { text: "Perform a 'Viscosity Audit' on this codebase: Identify friction points where logic flow becomes stagnant.", reason: "Finds technical debt using system metaphors.", example: "Input: [Code] -> AI: Pinpoints hard-coded strings." },
  { text: "Synthesize a 'Neural Backbone' schema for multi-tenant isolation, ensuring zero logic-leak.", reason: "High-level database and security design.", example: "Input: '5 users.' -> AI: Creates a partitioned Firestore structure." },
  { text: "Design a 'Slime-Safe' API Gateway that implements adaptive rate-limiting based on viscosity.", reason: "Scaling and traffic management.", example: "Input: 'High traffic.' -> AI: Throttles non-essential nodes first." },
  { text: "Conduct a 'Logic Leak' analysis on this prompt chain: Find where intent is lost.", reason: "Debugging interaction between humans and LLMs.", example: "Input: [Prompt History] -> AI: Identifies ambiguous pronouns." },
  { text: "Optimize the 'Ooze Factor' (User Retention) through micro-interaction logic.", reason: "Blends UX Strategy with front-end engineering.", example: "Input: 'Boring buttons.' -> AI: Suggests pulse-glow animations." },
  { text: "Implement a Circuit Breaker pattern with 'Cohesion' triggers: Fail fast if upstream is non-viscous.", reason: "Reliability engineering for distributed systems.", example: "Input: 'Slow API.' -> AI: Writes a fallback wrapper." },
  { text: "Refactor this component for 'Gooey' reusability: Use polymorphic props.", reason: "Deep React/Component-driven architecture optimization.", example: "Input: [Fixed Button] -> AI: Converts to a HOC accepting any 'Node'." },
  { text: "Construct an 'Event-Driven Ooze' architecture for real-time logic propagation.", reason: "Real-time state synchronization.", example: "Input: 'Update clients.' -> AI: Designs a WebSocket/PubSub mesh." },
  { text: "Design 'Elastic Slime Scaling' for neural workloads: Auto-replicate nodes on load.", reason: "Cloud infrastructure and autoscaling.", example: "Input: 'Spiking load.' -> AI: Designs K8s HPA logic." },
  { text: "Apply 'Zero-Trust Viscosity' to all internal logic gates: Verify every token.", reason: "Modern security protocols.", example: "Input: 'Secure the app.' -> AI: Implements mTLS." },
  { text: "Generate 'Hydrated State Injection' for server-side slime rendering.", reason: "Performance and SSR optimization.", example: "Input: 'Slow page load.' -> AI: Implements hydration logic." },
  { text: "Utilize 'Non-Newtonian Middleware' to handle unpredictable logic shear.", reason: "Error handling for non-linear user paths.", example: "Input: 'Users skipping steps.' -> AI: Creates a state-enforcer." },
  { text: "Map a 'Slime-Graph' for complex relational logic without rigid schemas.", reason: "Graph database exploration.", example: "Input: 'Users connected.' -> AI: Designs a Neo4j traversal." },
  { text: "Deploy 'Ephemeral Logic Nodes' for short-lived synthesis tasks.", reason: "Serverless and Edge computing logic.", example: "Input: 'Process once.' -> AI: Writes an AWS Lambda worker." },
  { text: "Ensure 'Atomic Viscosity Writes' during multi-node database commits.", reason: "Data integrity.", example: "Input: 'Transfer logic.' -> AI: Implements batch transactions." },
  { text: "Scan for 'Dark-Matter Logic': Hidden dependencies that slow down the Arch.", reason: "Dependency management audit.", example: "Input: 'App is heavy.' -> AI: Scans for unused imports." },
  { text: "Architect a 'Super-Fluid UI' that adapts its viscosity to user proficiency.", reason: "Personalized UX and adaptive interfaces.", example: "Input: 'Pro users.' -> AI: Unlocks advanced 'gooey' shortcuts." }
];

// --- AUDIO UTILITY ---
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
      case 'bounce': 
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
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

export default function GadgetApp() {
  const [user, setUser] = useState(null);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) { console.error("Auth error:", err); }
    };
    initAuth();
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'prompts');
    return onSnapshot(q, (s) => setSavedPrompts(s.docs.map(d => ({id: d.id, ...d.data()}))), (e) => console.error(e));
  }, [user]);

  const triggerSound = (type) => { if (soundEnabled) playSlimeSound(type); };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-emerald-500">BOOTING ARCHREACTOR_5.3...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-400 font-mono overflow-x-hidden selection:bg-purple-900 pb-20">
      <CustomStyles />
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b-4 border-emerald-900/40 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_20px_#10b981]"><Layers className="text-black" /></div>
            <div>
              <h1 className="text-2xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-500 tracking-tighter">Engineer El's Arch</h1>
              <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase">Kernel: 5.3.0-IdentityReady</p>
            </div>
          </div>
          <button onClick={() => { setSoundEnabled(!soundEnabled); triggerSound('droplet'); }} className="p-3 bg-slate-900 border border-emerald-500/50 rounded-xl hover:shadow-[0_0_15px_#10b981]">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-red-500" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-16">
        <SlimeLine savedPrompts={savedPrompts} onInteraction={() => triggerSound('droplet')} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-12">
            <RevolvingSection user={user} onInteraction={triggerSound} />
          </div>
          <div className="lg:col-span-7">
            <PromptingEngine user={user} onInteraction={triggerSound} />
          </div>
          <div className="lg:col-span-5">
            <GemSuggester user={user} onInteraction={triggerSound} />
          </div>
        </div>

        <SpreadsheetBackbone prompts={savedPrompts} user={user} onInteraction={() => triggerSound('squish')} />
      </main>

      <footer className="fixed bottom-0 w-full z-40 bg-slate-950 border-t border-slate-900 py-3 px-6 flex justify-between items-center">
        <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">© 2026 BRAND.BUILDER.CORE</span>
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-[9px] text-emerald-800 font-bold uppercase">Backbone Status: Ready</span>
        </div>
      </footer>
    </div>
  );
}

function SlimeLine({ savedPrompts, onInteraction }) {
  const events = useMemo(() => {
    const saveEvents = savedPrompts.map(p => ({ date: p.date, thread: `${p.category}: ${p.text.slice(0, 35)}...`, type: 'node' }));
    return [...SYSTEM_MILESTONES, ...saveEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [savedPrompts]);

  const [idx, setIdx] = useState(Math.max(0, events.length - 1));
  const cur = events[idx] || { date: 'N/A', thread: 'Initializing SlimeLine...' };

  return (
    <section className="bg-slate-900/80 rounded-[3rem] p-10 border-2 border-emerald-500/10 shadow-3xl">
      <h2 className="text-3xl font-black text-emerald-300 uppercase tracking-[0.5em] text-center w-full mb-12 gooey-text">The SlimeLine</h2>
      <div className="relative py-12 px-6">
        <input type="range" min="0" max={Math.max(0, events.length - 1)} value={idx} onChange={(e) => { setIdx(parseInt(e.target.value)); onInteraction(); }} className="w-full h-4 appearance-none bg-transparent absolute z-20 opacity-0 cursor-pointer" />
        <div className="h-6 w-full bg-black border border-white/10 rounded-full relative overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
          <div className="absolute h-full bg-gradient-to-r from-emerald-600 via-green-400 to-lime-300 shadow-[0_0_30px_#10b981] transition-all duration-300" style={{ width: `${(idx / Math.max(1, events.length - 1)) * 100}%` }}></div>
        </div>
        <div className="absolute w-12 h-12 bg-emerald-500 rounded-full border-4 border-black shadow-[0_0_25px_#10b981] top-9 transition-all duration-300 pointer-events-none" style={{ left: `calc(${(idx / Math.max(1, events.length - 1)) * 100}% - 24px)` }}></div>
      </div>
      <div className="mt-8 p-8 bg-black/60 rounded-[2.5rem] border-l-8 border-purple-600 flex items-center space-x-6 animate-fade-in" key={idx}>
        <Calendar className="text-purple-500" size={32} />
        <div>
          <p className="text-[10px] text-slate-600 font-black uppercase mb-1 tracking-widest tracking-widest">Node Decryption: {cur.date}</p>
          <p className="text-2xl text-emerald-100 font-bold italic tracking-tight">"{cur.thread}"</p>
        </div>
      </div>
    </section>
  );
}

function RevolvingSection({ user, onInteraction }) {
  const [rotation, setRotation] = useState(0);
  const [activeForm, setActiveForm] = useState(null);
  const [form, setForm] = useState({ subject: '', info: '', time: '', stack: 'Python', testing: '', results: '', brandVoice: 'Technical', target: '' });

  const items = [
    { name: 'Sludge Vault', sub: 'Learning Archive', icon: Vault, color: 'text-yellow-500', btn: 'bg-yellow-600' },
    { name: 'Arch Reactor', sub: 'Professional Build', icon: FolderOpen, color: 'text-emerald-400', btn: 'bg-emerald-600', special: true },
    { name: 'Goo Box', sub: 'Gooey Playground', icon: FlaskConical, color: 'text-pink-500', btn: 'bg-pink-600' },
    { name: 'Identity Chamber', sub: 'Brand Synthesis', icon: Target, color: 'text-indigo-400', btn: 'bg-indigo-600' }
  ];

  const handleSave = async () => {
    if (!user || !form.subject) return;
    onInteraction('squish');
    const payload = activeForm.name === 'Identity Chamber' 
      ? `${form.subject}: [Voice: ${form.brandVoice}] Target: ${form.target} | Core: ${form.info}`
      : `${form.subject}: ${form.info || form.testing} [Stack: ${form.stack}]`;
      
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'prompts'), {
      text: payload,
      category: activeForm.name, timestamp: Date.now(), date: form.time || new Date().toLocaleDateString()
    });
    setForm({ subject: '', info: '', time: '', stack: 'Python', testing: '', results: '', brandVoice: 'Technical', target: '' });
    setActiveForm(null);
  };

  if (activeForm) {
    return (
      <div className="bg-slate-900 border-4 border-slate-800 rounded-[3rem] p-12 animate-fade-in relative shadow-3xl">
        <button onClick={() => { setActiveForm(null); onInteraction('droplet'); }} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-all"><X size={32} /></button>
        <div className="flex items-center space-x-6 mb-12">
          <activeForm.icon className={activeForm.color} size={48} />
          <h2 className={`text-4xl font-black uppercase tracking-widest ${activeForm.color}`}>{activeForm.name}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500">Subject Designation</label>
              <input type="text" placeholder={activeForm.name === 'Identity Chamber' ? "Brand Name..." : "Logic ID..."} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-5 text-emerald-300 font-black outline-none focus:border-emerald-500 transition-all" />
            </div>
            {activeForm.name === 'Identity Chamber' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500">Brand Viscosity (Voice)</label>
                  <select value={form.brandVoice} onChange={e => setForm({...form, brandVoice: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-5 text-emerald-300 font-black outline-none cursor-pointer">
                    <option>Technical & Rigid</option>
                    <option>Fluid & Creative</option>
                    <option>Aggressive & Oozing</option>
                    <option>Silent & Stealthy</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500">Target Resonance</label>
                  <input type="text" placeholder="Who is the target audience?" value={form.target} onChange={e => setForm({...form, target: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-5 text-emerald-300 font-black outline-none focus:border-emerald-500 transition-all" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-500">Temporal Stamp</label>
                  <input type="text" placeholder="2026-02-28..." value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-5 text-emerald-300 font-mono outline-none focus:border-emerald-500 transition-all" />
                </div>
                {activeForm.name === 'Arch Reactor' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-500">Architecture Stack</label>
                    <select value={form.stack} onChange={e => setForm({...form, stack: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-5 text-emerald-300 font-black outline-none cursor-pointer">
                      <option>Python</option><option>Flash</option><option>Tailwind</option><option>React</option><option>Go</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500">Payload Synthesis</label>
            <textarea placeholder={activeForm.name === 'Identity Chamber' ? "Describe the mission, aesthetic, and soul of the brand..." : "Paste logic, codebase snippets, or testing results..."} value={form.info || form.testing} onChange={e => setForm({...form, info: e.target.value, testing: e.target.value})} className="w-full h-80 bg-black border border-slate-800 rounded-xl p-8 text-emerald-100 text-sm font-mono outline-none focus:border-emerald-500 transition-all" />
          </div>
        </div>
        <button onClick={handleSave} className={`w-full py-6 mt-12 rounded-[2rem] font-black uppercase text-lg text-black transition-all active:scale-95 shadow-xl ${activeForm.btn}`}>Commit to Slime Backbone</button>
      </div>
    );
  }

  return (
    <div className="relative h-[550px] flex items-center justify-center perspective-2000">
      <div className="absolute inset-0 bg-emerald-500/5 rounded-[4rem] blur-3xl -z-10"></div>
      {items.map((item, i) => {
        const offset = (i + rotation) % 4;
        const normalized = offset < 0 ? offset + 4 : offset;
        
        let posStyles = "";
        if (normalized === 0) posStyles = "scale-100 z-30 translate-x-0";
        else if (normalized === 1) posStyles = "scale-75 z-10 translate-x-[350px] opacity-30 blur-sm";
        else if (normalized === 2) posStyles = "scale-50 z-0 translate-y-[100px] opacity-10 blur-md";
        else posStyles = "scale-75 z-10 -translate-x-[350px] opacity-30 blur-sm";

        return (
          <div key={i} onClick={() => { setActiveForm(item); onInteraction('droplet'); }} className={`absolute transition-all duration-700 ease-out cursor-pointer p-12 bg-slate-900 border-4 border-slate-800 rounded-[4rem] w-[380px] flex flex-col items-center hover:border-emerald-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] shadow-2xl ${posStyles}`}>
            <div className={`p-8 rounded-full bg-black/40 mb-8 ${item.color} ${item.special ? 'animate-pulse' : ''} shadow-inner`}><item.icon size={64} /></div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{item.name}</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.sub}</p>
          </div>
        );
      })}
      <button onClick={() => { setRotation(prev => prev + 1); onInteraction('droplet'); }} className="absolute left-4 md:left-20 bg-slate-800 p-5 rounded-full hover:bg-emerald-600 transition-all z-40 shadow-xl active:scale-90"><ChevronLeft size={32} /></button>
      <button onClick={() => { setRotation(prev => prev - 1); onInteraction('droplet'); }} className="absolute right-4 md:right-20 bg-slate-800 p-5 rounded-full hover:bg-emerald-600 transition-all z-40 shadow-xl active:scale-90"><ChevronRight size={32} /></button>
    </div>
  );
}

function PromptingEngine({ user, onInteraction }) {
  const [mode, setMode] = useState('simple');
  const [engineState, setEngineState] = useState('pro');
  const [input, setInput] = useState('');
  const [refining, setRefining] = useState(false);
  const [output, setOutput] = useState('');
  const [wizard, setWizard] = useState({ persona: PERSONAS[0], task: '', content: '', reference: '', evaluation: '', iterate: '' });

  const runGemini = async () => {
    setRefining(true); onInteraction('splash');
    const prompt = mode === 'simple' ? input : `Act as: ${wizard.persona}. Task: ${wizard.task}. Content: ${wizard.content}. References: ${wizard.reference}. Evaluation: ${wizard.evaluation}. Loops: ${wizard.iterate}.`;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: { parts: [{ text: engineState === 'pro' ? "PRO ARCHITECT ENGINE: Refine input into highly structural, high-fidelity master prompts with architectural rigor." : "FLASH REFINEMENT: Quickly fix typos and clarify intent for a clean prompt." }] }
        })
      });
      const data = await response.json();
      setOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || "Link Severed.");
    } catch(e) { setOutput("Nexus Link Broken."); }
    setRefining(false);
  };

  return (
    <section className="bg-slate-900 rounded-[3rem] border border-purple-900/40 h-full flex flex-col overflow-hidden shadow-3xl">
      <div className="bg-black/50 p-4 flex justify-between border-b border-slate-800 items-center">
        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Neural Interface Module</span>
        <div className="flex bg-slate-900 rounded-full border border-slate-800 overflow-hidden shadow-inner">
          <button onClick={() => { setEngineState('flash'); onInteraction('droplet'); }} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all ${engineState === 'flash' ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Flash</button>
          <button onClick={() => { setEngineState('pro'); onInteraction('droplet'); }} className={`px-5 py-1.5 text-[10px] font-black uppercase transition-all ${engineState === 'pro' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Pro</button>
        </div>
      </div>
      <div className="flex border-b border-slate-800">
        <button onClick={() => { setMode('simple'); onInteraction('droplet'); }} className={`flex-1 py-5 font-black uppercase text-sm tracking-widest transition-all ${mode === 'simple' ? 'bg-purple-900/30 text-purple-400' : 'text-slate-700 hover:text-slate-500'}`}>Simple</button>
        <button onClick={() => { setMode('wizard'); onInteraction('droplet'); }} className={`flex-1 py-5 font-black uppercase text-sm tracking-widest transition-all ${mode === 'wizard' ? 'bg-emerald-900/30 text-emerald-400' : 'text-slate-700 hover:text-slate-500'}`}>Prompt Guru Wizard</button>
      </div>
      <div className="p-10 space-y-8 flex-grow flex flex-col">
        {mode === 'simple' ? (
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Inject logic strings..." className="w-full flex-grow min-h-[300px] bg-black/40 border border-slate-800 rounded-[2rem] p-8 text-emerald-100 outline-none focus:border-emerald-500 transition-all font-sans text-base shadow-inner" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="col-span-2 space-y-2">
              <label className="text-[9px] uppercase font-black text-slate-600">Designated Persona</label>
              <select value={wizard.persona} onChange={e => setWizard({...wizard, persona: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-4 text-emerald-300 font-black outline-none cursor-pointer">{PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}</select>
            </div>
            {['Task', 'Content', 'Reference', 'Evaluation', 'Iterate'].map(f => (
              <div key={f} className="space-y-2">
                <label className="text-[9px] uppercase font-black text-slate-600">{f}</label>
                <input placeholder={`${f}...`} value={wizard[f.toLowerCase()]} onChange={e => setWizard({...wizard, [f.toLowerCase()]: e.target.value})} className="w-full bg-black border border-slate-800 rounded-xl p-4 text-emerald-200 text-xs outline-none focus:border-emerald-500 transition-all" />
              </div>
            ))}
          </div>
        )}
        <button onClick={runGemini} disabled={refining} className={`w-full py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] border-b-8 transition-all active:scale-95 shadow-2xl ${mode === 'simple' ? 'bg-purple-950/40 text-purple-400 border-purple-600' : 'bg-emerald-950/40 text-emerald-400 border-emerald-600'}`}>
          {refining ? 'Synthesizing Viscosity...' : `Trigger Neural Refinement`}
        </button>
        {output && (
          <div className="bg-black/80 p-8 rounded-[2rem] border-l-4 border-emerald-500 text-emerald-100 text-sm leading-relaxed animate-fade-in font-sans shadow-inner selection:bg-emerald-500 selection:text-black">
            {output}
            <div className="mt-6 flex justify-end">
              <button onClick={() => onInteraction('squish')} className="text-[9px] font-black uppercase flex items-center bg-emerald-900/40 px-4 py-2 rounded-full hover:bg-emerald-500 hover:text-black transition-all"><Save size={14} className="mr-2" />Save to Backbone</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GemSuggester({ user, onInteraction }) {
  const [idx, setIdx] = useState(0);
  const gem = GEMS_POOL[idx];

  const cycle = (dir) => { setIdx(prev => (prev + dir + GEMS_POOL.length) % GEMS_POOL.length); onInteraction('bounce'); };

  return (
    <section className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 rounded-[3rem] p-12 border-2 border-indigo-500/30 shadow-3xl h-full flex flex-col justify-between min-h-[650px]">
      <div>
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-sm font-black text-indigo-300 uppercase tracking-[0.3em] flex items-center"><Lightbulb size={32} className="mr-4 text-yellow-400 animate-pulse" /> Gem Vault</h3>
          <div className="flex items-center space-x-4 bg-black/40 rounded-full p-2 border border-indigo-800 backdrop-blur-md">
            <button onClick={() => cycle(-1)} className="p-2 hover:text-white transition-all"><ChevronLeft /></button>
            <span className="text-xs text-indigo-400 font-black tabular-nums tracking-widest">{idx + 1}/20</span>
            <button onClick={() => cycle(1)} className="p-2 hover:text-white transition-all"><ChevronRight /></button>
          </div>
        </div>
        <div className="animate-fade-in" key={idx}>
          <p className="text-2xl md:text-5xl text-emerald-100 italic font-black leading-tight border-l-8 border-indigo-500 pl-10 tracking-tighter mb-12">"{gem.text}"</p>
          <div className="space-y-6">
            <div className="bg-black/60 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-xl backdrop-blur-sm">
              <span className="text-[10px] text-indigo-400 font-black uppercase block mb-3 tracking-widest">Architectural Logic Structure</span>
              <p className="text-sm text-slate-400 font-sans leading-relaxed">{gem.reason}</p>
            </div>
            <div className="bg-indigo-900/20 p-6 rounded-[2.5rem] border border-indigo-500/30 shadow-inner">
              <span className="text-[10px] text-yellow-500 font-black uppercase block mb-3 tracking-widest">Real-World Applied Example</span>
              <p className="text-sm text-indigo-200 italic font-sans leading-relaxed">{gem.example}</p>
            </div>
          </div>
        </div>
      </div>
      <button onClick={async () => { onInteraction('squish'); await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'prompts'), { text: gem.text, category: 'Gems', timestamp: Date.now(), date: new Date().toLocaleDateString() }); }} className="w-full mt-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_15px_35px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 text-white">Commit Gem to Backbone</button>
    </section>
  );
}

function SpreadsheetBackbone({ prompts, user, onInteraction }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? prompts : prompts.filter(p => p.category === filter);

  return (
    <section className="bg-slate-900/40 rounded-[4rem] border border-slate-900 overflow-hidden shadow-3xl">
      <div className="p-12 flex flex-col md:flex-row justify-between items-center bg-slate-900/20 border-b border-slate-800 gap-10">
        <div>
          <h2 className="text-3xl font-black text-emerald-400 flex items-center uppercase tracking-tighter"><Database className="mr-5 text-purple-700" size={40} /> Backbone Inventory</h2>
          <p className="text-[11px] text-slate-600 uppercase font-black tracking-[0.4em] mt-2">Persistence Node Matrix - Global Layer</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-black border-2 border-slate-800 rounded-2xl px-10 py-4 text-xs text-emerald-400 font-black uppercase cursor-pointer hover:border-emerald-500 transition-all outline-none">
          <option value="All">All Backbone Nodes</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-black/60 text-slate-600 font-black uppercase border-b border-slate-950">
            <tr>
              <th className="px-12 py-8">Timestamp</th>
              <th className="px-12 py-8">Sector</th>
              <th className="px-12 py-8 w-1/2">Neural Logic Data</th>
              <th className="px-12 py-8 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-emerald-500/5 transition-all group">
                <td className="px-12 py-10 text-slate-500 font-mono text-xs tabular-nums opacity-60">{p.date}</td>
                <td className="px-12 py-10">
                  <span className={`px-4 py-2 rounded-full font-black uppercase text-[10px] border ${p.category === 'Gems' ? 'border-indigo-800 text-indigo-400 bg-indigo-950/20' : p.category === 'Identity Chamber' ? 'border-indigo-500 text-indigo-300 bg-indigo-900/40' : 'border-emerald-900 text-emerald-600 bg-emerald-950/20'}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-12 py-10 text-emerald-100/90 leading-relaxed text-base font-medium group-hover:text-emerald-300 transition-all">{p.text}</td>
                <td className="px-12 py-10 text-right">
                  <button onClick={async () => { onInteraction('droplet'); await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'prompts', p.id)); }} className="text-slate-800 hover:text-red-500 transition-all p-4 bg-black/40 rounded-2xl hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <Trash2 size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CustomStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@400;600;900&display=swap');
      body { font-family: 'JetBrains Mono', monospace; background-color: #020617; }
      .font-sans { font-family: 'Inter', sans-serif; }
      .gooey-text { text-shadow: 0 0 15px rgba(16, 185, 129, 0.4), 0 0 30px rgba(138, 43, 226, 0.3); }
      .perspective-2000 { perspective: 2000px; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      .shadow-3xl { box-shadow: 0 45px 80px -20px rgba(0, 0, 0, 0.7); }
      input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; }
      .pulse-glow { animation: pGlow 3s ease-in-out infinite alternate; }
      @keyframes pGlow { from { box-shadow: 0 0 5px rgba(16, 185, 129, 0.1); } to { box-shadow: 0 0 40px rgba(16, 185, 129, 0.3); } }
      select { appearance: none; }
    `}} />
  );
}
