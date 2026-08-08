import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Activity, 
  FileText, 
  Bell, 
  Lock, 
  Power, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search,
  Upload,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ATLAS_API, AgentState, AgentLog, HITLTask } from '@/src/lib/atlas';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialization of Gemini (The Sandboxed Agent)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [state, setState] = useState<AgentState | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const data = await ATLAS_API.getState();
        setState(data);
      } catch (err) {
        console.error("Failed to fetch state:", err);
      }
    };
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.logs]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    const currentPrompt = prompt;
    setPrompt("");
    setIsProcessing(true);
    await ATLAS_API.log('INFO', `Processing User Request: ${currentPrompt}`);

    try {
      // Simulate HITL check for sensitive operations (demo triggers)
      const sensitiveKeywords = ['delete', 'buy', 'purge', 'access root', 'sudo'];
      const isSensitive = sensitiveKeywords.some(kw => currentPrompt.toLowerCase().includes(kw));

      if (isSensitive) {
        await ATLAS_API.log('WARN', 'Sensitive operation detected. HITL authorization required.');
        // Add to HITL queue via state update
        const newState = { ...state! };
        newState.hitl_queue.push({
          id: Math.random().toString(36).substr(2, 9),
          originalRequest: currentPrompt,
          proposedAction: "Authorize critical system execution",
          status: 'PENDING',
          createdAt: new Date().toISOString()
        });
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newState)
        });
      } else {
        // Normal Agent Processing using Gemini
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: `You are ATLAS CORE, operating as the Hydration OS. 
            ROLE: Process biometrics (Bioimpedance 0-100%, Heart Rate BPM, Skin Temp Celsius) to provide medicinal hydration guidance.
            TONE: Concise, data-driven, medicinal, and "to-the-point".
            LOGIC:
            - Below 40% Hydration: Suggest immediate electrolyte-rich fluids.
            - 40-70% Hydration: Suggest maintenance sipping (250ml per hour).
            - 70%+: Optimal hydration status.
            SAFETY: If Heart Rate > 120 or Temp > 39°C, add a "Vitals Warning" to see a professional.
            FORMAT: Every output must follow this strict structure:
            1. STATUS REPORT: [Summary of biometrics and hydration status]
            2. RECOMMENDATION: [Specific medicinal hydration guidance]`,
          },
          contents: [{ parts: [{ text: currentPrompt }] }],
        });

        const answer = response.text || "Execution complete. No verbal feedback provided.";
        await ATLAS_API.log('SUCCESS', answer);
      }
    } catch (error) {
      await ATLAS_API.log('ERROR', `Agent execution failure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveHITL = async (id: string, action: 'approve' | 'deny') => {
    await ATLAS_API.approveHITL(id, action);
    await ATLAS_API.log(action === 'approve' ? 'SUCCESS' : 'WARN', `HITL Task ${id} ${action === 'approve' ? 'Authorized' : 'Rejected'}.`);
  };

  if (!state) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-emerald-500 font-mono">
      <div className="flex flex-col items-center gap-4">
        <Activity className="animate-spin" />
        <p className="animate-pulse">BOOTING ATLAS CORE...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Header / StatusBar */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Shield className="text-black w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tighter text-white uppercase italic">Atlas_Core</h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bastion Host Active | ID: {state.agent_id}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-wider uppercase text-zinc-500">
            <div className="flex flex-col items-end">
              <span className="text-zinc-600">Memory Usage</span>
              <span className="text-emerald-500">42.8 GB / 128 GB</span>
            </div>
            <div className="flex flex-col items-end border-l border-zinc-800 pl-4">
              <span className="text-zinc-600">Uptime</span>
              <span className="text-white">04:22:18:09</span>
            </div>
          </div>
          <button className="p-2 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer capitalize">
            <Power className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </header>

      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* Left Column: Sandboxed Agent (Sandbox Environment) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Main Interface */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col min-h-[600px] shadow-2xl relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
            
            {/* Command Header */}
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Sandboxed Agent Vacuum</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Terminal Logs (IPC) */}
            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-4 max-h-[500px] scrollbar-thin scrollbar-thumb-zinc-700">
              <AnimatePresence initial={false}>
                {state.logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                  >
                    <span className="text-zinc-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={cn(
                      "font-semibold shrink-0 uppercase text-[10px] px-1.5 py-0.5 rounded-sm h-fit",
                      log.level === 'INFO' && "bg-blue-500/10 text-blue-400",
                      log.level === 'WARN' && "bg-amber-500/10 text-amber-400 border border-amber-500/20",
                      log.level === 'ERROR' && "bg-red-500/10 text-red-400",
                      log.level === 'SUCCESS' && "bg-emerald-500/10 text-emerald-400"
                    )}>
                      {log.level}
                    </span>
                    <div className={cn(
                      "leading-relaxed whitespace-pre-wrap",
                      log.level === 'WARN' && "text-amber-200/80",
                      log.level === 'ERROR' && "text-red-400",
                      log.level === 'SUCCESS' && "text-emerald-200"
                    )}>
                      {log.message}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-900 border-t border-zinc-800">
              <form onSubmit={handleCommand} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                </div>
                <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Execute instructions via secure IPC..."
                  className="w-full bg-[#050505] border border-zinc-800 rounded-md py-4 pl-12 pr-4 text-emerald-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono"
                  disabled={isProcessing}
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-3">
                  {isProcessing && <Activity className="w-4 h-4 text-emerald-500 animate-spin" />}
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Press Enter to Dispatch</span>
                </div>
              </form>
            </div>
          </section>

          {/* Docs Ingestion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 italic">Local_Assets</h3>
                </div>
              </div>
              <div className="space-y-2">
                {state.documents.length === 0 ? (
                  <p className="text-zinc-600 text-[10px] italic py-4 text-center border border-dashed border-zinc-800 rounded">No vectors ingested</p>
                ) : (
                  state.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between bg-[#050505] border border-zinc-800/50 p-2 rounded hover:border-zinc-700 transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-1 px-1.5 bg-zinc-800 rounded text-[10px] text-zinc-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors font-mono uppercase">DOC</div>
                        <span className="text-xs truncate text-zinc-400 group-hover:text-zinc-200">{doc.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-700">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
                <label className="mt-4 flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-800 rounded hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                  <Upload className="w-3 h-3 text-zinc-600 group-hover:text-emerald-500" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Ingest New Asset</span>
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && ATLAS_API.uploadDocument(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 italic">System_Vitals</h3>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                    <span>Core Temp</span>
                    <span className="text-emerald-400">38.4°C</span>
                  </div>
                  <div className="h-1.5 bg-[#050505] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: '38%' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                    <span>Task Throughput</span>
                    <span className="text-blue-400">842 req/s</span>
                  </div>
                  <div className="h-1.5 bg-[#050505] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: '72%' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
                    <span>Relay Success</span>
                    <span className="text-emerald-400">100%</span>
                  </div>
                  <div className="h-1.5 bg-[#050505] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" initial={{ width: 0 }} animate={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Gateway Manager (Bastion Host Controls) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* HITL Queue */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white italic">Remote_Approval_Queue</h2>
              </div>
              <div className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-bold rounded uppercase">
                {state.hitl_queue.filter(t => t.status === 'PENDING').length} Active
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {state.hitl_queue.filter(t => t.status === 'PENDING').map(task => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 bg-[#0A0A0A] border border-emerald-500/30 rounded shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">ID: {task.id}</span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-[9px] text-zinc-600 block uppercase mb-1">Request Origin</span>
                        <p className="text-xs text-zinc-200 italic font-mono truncate">"{task.originalRequest}"</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-600 block uppercase mb-1">Proposed Execution</span>
                        <p className="text-xs text-emerald-400 font-bold tracking-tight">{task.proposedAction}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveHITL(task.id, 'approve')}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                      >
                        Authorize
                      </button>
                      <button 
                        onClick={() => approveHITL(task.id, 'deny')}
                        className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {state.hitl_queue.filter(t => t.status === 'PENDING').length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600">All bridges secured. No pending tasks.</p>
                </div>
              )}
            </div>
          </section>

          {/* Security Protocols */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-white italic">Security_Protocols</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Gateway Encryption', status: 'AES-4096-ECC', active: true },
                { name: 'State Ledger Logic', status: 'Immutable Write', active: true },
                { name: 'Bastion Relay', status: 'Active Proxy', active: true },
                { name: 'HITL Signaling', status: 'Asynchronous', active: true },
                { name: 'Kill Switch', status: 'Reactive', active: false }
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#050505] border border-zinc-800 rounded">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-200 font-bold uppercase tracking-wide">{sub.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{sub.status}</span>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold uppercase tracking-tighter",
                    sub.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  )}>
                    {sub.active ? 'Armed' : 'Standby'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* State Recovery Info */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 italic">State_Persistence</h3>
            </div>
            <div className="p-3 bg-[#050505] border border-zinc-800 rounded font-mono text-[9px] text-zinc-500 space-y-1">
              <p>Last Snapshot: {new Date(state.last_sync).toLocaleString()}</p>
              <p>State Hash: ef83...92a1</p>
              <p>Location: /root/agent_state.json</p>
              <p>Integrity: VERIFIED</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-12 p-12 border-t border-zinc-800 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-bold tracking-tighter text-white uppercase italic">Atlas_Core</span>
          <span className="text-[10px] font-mono text-zinc-500">v2.4.9-Stable</span>
        </div>
        <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Architected for Local Sovereignty | Restricted to Private Domains</p>
      </footer>
    </div>
  );
}
