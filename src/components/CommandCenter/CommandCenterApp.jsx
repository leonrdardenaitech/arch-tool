import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Activity, 
  Zap, 
  Shield, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Play,
  Settings,
  Database,
  Eye,
  MessageSquare
} from 'lucide-react';

const StatusCard = ({ title, status, icon: Icon, color }) => (
  <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg flex items-center justify-between group hover:border-zinc-700 transition-all">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-md bg-${color}-500/10 text-${color}-500`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">{title}</h4>
        <p className="text-xs font-mono text-zinc-200">{status}</p>
      </div>
    </div>
    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500 ${status === 'LOCKED' || status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
  </div>
);

export default function CommandCenterApp() {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState({ city: "LITHONIA", state: "GEORGIA" });
  const [terminalLogs, setTerminalLogs] = useState([
    "INITIALIZING_BOARDROOM_PROTOCOL...",
    "GEO_LOCATOR: SUCCESS [IP-API]",
    "PIPELINE_AUDIT: 1 BLOCKER DETECTED [FFMPEG]",
    "CREATIVE_FUEL: PRIME [FRIED_BRAINS_SCENE_01]"
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {/* Background Grid Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Top Briefing Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/20 backdrop-blur-xl px-8 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield size={20} className="text-black" />
            </div>
            <span className="font-black italic tracking-tighter text-lg uppercase">COMMAND_CENTER</span>
          </div>
          
          <div className="h-4 w-[1px] bg-zinc-800" />
          
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-emerald-500" />
              <span>{location.city}, {location.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-emerald-500" />
              <span>{time.toLocaleTimeString([], { hour12: false })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            DIRECTOR_SESSION_ACTIVE
          </div>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded transition-colors text-zinc-500">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Tactical Grid */}
      <main className="flex-1 p-8 grid grid-cols-12 gap-8 relative z-10 overflow-hidden">
        
        {/* Left Column: System Vitals & Status */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Activity size={18} className="text-emerald-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">System_Vitals //</h2>
            </div>
            
            <div className="space-y-4">
              <StatusCard title="Knowledge Brain" status="AUTH_EXPIRED" icon={Database} color="amber" />
              <StatusCard title="Video Assembly" status="FFMPEG_MISSING" icon={Play} color="red" />
              <StatusCard title="MCP Gateway" status="LIVE [V2.0]" icon={Zap} color="emerald" />
              <StatusCard title="Action Arm" status="STANDBY" icon={Eye} color="zinc" />
            </div>

            <div className="mt-auto pt-8 border-t border-zinc-800/50">
              <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase mb-2">
                <span>Swarm Optimization</span>
                <span className="text-emerald-500">95.4%</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '95.4%' }} 
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Live Intelligence Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tactical_Intelligence_Feed</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
              </div>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-2 scrollbar-hide">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-zinc-700">[{time.toLocaleTimeString([], { hour12: false })}]</span>
                  <span className="text-emerald-500/80">&gt; {log}</span>
                </div>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-emerald-500"
              >
                &gt; AWAITING_DIRECTOR_INPUT_
              </motion.div>
            </div>

            {/* Creative Queue Summary */}
            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800">
               <div className="flex items-center gap-2 mb-4">
                  <Play size={14} className="text-emerald-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Creative_Queue // Next_UP</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg group hover:border-emerald-500/30 transition-all">
                     <span className="text-[9px] text-zinc-600 block mb-1">PROJECT: FRIED BRAINS</span>
                     <p className="text-xs font-black text-zinc-300">SCENE_01: THE PROMPT LOOP</p>
                  </div>
                  <div className="p-4 bg-black border border-zinc-800 rounded-lg group hover:border-emerald-500/30 transition-all">
                     <span className="text-[9px] text-zinc-600 block mb-1">PROJECT: BURN-1</span>
                     <p className="text-xs font-black text-zinc-300">SCENE_01: KICKED OUT [STORYBOARDED]</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <button className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <MessageSquare size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Speak_Briefing</span>
             </button>
             <button className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                <Activity size={18} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest">Run_System_Audit</span>
             </button>
             <button className="p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95">
                <RefreshCw size={18} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest">Sync_Darden_Array</span>
             </button>
          </div>
        </div>
      </main>

      {/* Footer Identity */}
      <footer className="h-12 border-t border-zinc-800 bg-zinc-900/20 px-8 flex items-center justify-center">
         <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">
           Darden Architecture // Executive Command Layer // Secured By Atlas
         </p>
      </footer>
    </div>
  );
}
