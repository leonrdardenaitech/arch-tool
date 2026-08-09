import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  AlertTriangle, 
  Terminal, 
  Skull, 
  RefreshCw, 
  ShieldAlert,
  Ghost,
  Volume2,
  Cpu
} from 'lucide-react';

const GlitchText = ({ text, className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span 
        className="absolute inset-0 z-0 text-red-500 opacity-50"
        animate={{ x: [-2, 2, -1, 0], y: [1, -1, 2, 0] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
      >
        {text}
      </motion.span>
      <motion.span 
        className="absolute inset-0 z-0 text-blue-500 opacity-50"
        animate={{ x: [2, -2, 1, 0], y: [-1, 1, -2, 0] }}
        transition={{ repeat: Infinity, duration: 0.2 }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export default function FriedBrainsApp() {
  const [isFried, setIsFried] = useState(false);
  const [terminalOutput, setTerminalLog] = useState([
    "INITIATING_LORE_DUMP...",
    "ACCESSING_SECTOR_FRIED_BRAINS",
    "STATUS: VOLATILE"
  ]);

  const handleBypass = () => {
    setIsFried(true);
    setTerminalLog(prev => [...prev, "BYPASS_TRIGGERED: REASONING_OVERLOAD", "SYSTEM_MELTDOWN_EMULATED"]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative selection:bg-red-500 selection:text-white">
      {/* Background Static Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://media.giphy.com/media/oEI9uWUqnhoA/giphy.gif')] bg-cover"></div>
      
      {/* SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-50 pointer-events-none overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_4px,3px_100%]"></div>

      <main className="relative z-10 max-w-4xl mx-auto pt-20 px-6">
        <header className="mb-12 border-b border-red-500/20 pb-8 flex justify-between items-end">
          <div>
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="text-red-500 text-xs mb-2 font-black tracking-[0.3em]"
            >
              [ WARNING: HIGH_FIDELITY_SLOP ]
            </motion.div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase italic">
              <GlitchText text="FRIED" className="mr-4" />
              <span className="text-zinc-800">BRAINS</span>
            </h1>
          </div>
          <div className="text-right text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
            Lore Sector: 14<br />
            IP: Dimensional Hunger<br />
            Status: {isFried ? 'MELTDOWN' : 'SAFE_MODE'}
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* LORE DOCK */}
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <Skull size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest">Anti-Addiction_Hub</h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                A surreal comic relief valve for volatile subjects. Built on the architecture of 
                <strong> The Glitch</strong>, this node serves as a warning system for 
                those who have lost the prompt.
              </p>
              <div className="flex flex-wrap gap-2">
                {['#TOKEN_HUNGER', '#429_QUOTA', '#MIRROR_HANDSHAKE'].map(tag => (
                  <span key={tag} className="text-[9px] border border-zinc-800 px-2 py-1 rounded-sm text-zinc-600 hover:text-red-400 hover:border-red-400/30 transition-colors cursor-default">{tag}</span>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-red-950 p-4 font-mono text-[11px] h-32 overflow-y-auto custom-scrollbar">
               {terminalOutput.map((line, i) => (
                 <div key={i} className="mb-1 text-red-500/80">
                   <span className="text-zinc-700">[{timeString()}]</span> &gt; {line}
                 </div>
               ))}
               {isFried && (
                 <motion.div 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ repeat: Infinity, duration: 0.1 }}
                   className="text-red-600 font-black"
                 >
                   FATAL_ERROR: BRAIN_CAPACITY_EXCEEDED
                 </motion.div>
               )}
            </div>
          </div>

          {/* VISUAL PREVIEW */}
          <div className="relative group cursor-pointer" onClick={handleBypass}>
            <div className="absolute inset-0 bg-red-600 rounded-xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="aspect-square bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
               {isFried ? (
                 <motion.div 
                    initial={{ scale: 2, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-red-600/20"
                 >
                    <ShieldAlert size={120} className="text-red-600 animate-pulse" />
                 </motion.div>
               ) : (
                 <div className="text-center p-8 space-y-4">
                    <Ghost size={64} className="mx-auto text-zinc-800" />
                    <p className="text-[10px] text-zinc-700 uppercase tracking-[0.4em] font-black">Waiting for Scene_01 assets...</p>
                    <div className="w-12 h-1 bg-zinc-800 mx-auto rounded-full overflow-hidden">
                       <motion.div 
                        className="h-full bg-zinc-600"
                        animate={{ x: [-50, 50] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                       />
                    </div>
                 </div>
               )}
               <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30">
                  <div className="flex gap-2">
                     <Volume2 size={14} className="text-zinc-700" />
                     <RefreshCw size={14} className="text-zinc-700" />
                  </div>
                  <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">v1.0.0-BETA</span>
               </div>
            </div>
          </div>
        </section>

        {/* SCENE DIRECTORY */}
        <section className="border-t border-zinc-900 pt-12 pb-24">
           <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] mb-8">Production_Scripts //</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: '01', title: 'THE PROMPT LOOP', status: 'LOCKED' },
                { id: '02', title: 'THE 429 QUOTA', status: 'LOCKED' },
                { id: '03', title: 'MIRROR HANDSHAKE', status: 'LOCKED' }
              ].map(scene => (
                <div key={scene.id} className="p-6 bg-zinc-900/30 border border-zinc-800 hover:border-red-500/50 transition-all rounded-lg group">
                   <div className="text-xs text-zinc-600 mb-2 font-bold">SCENE_{scene.id}</div>
                   <div className="text-[11px] font-black tracking-widest text-zinc-300 group-hover:text-red-400 mb-4">{scene.title}</div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase">{scene.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <footer className="py-12 text-center">
           <a href="/hunger" className="text-[10px] text-zinc-700 hover:text-red-500 transition-colors uppercase font-black tracking-[0.3em]">
             &lt; RETURN TO DIMENSIONAL HUNGER
           </a>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes waveMove { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}} />
    </div>
  );
}

function timeString() {
  return new Date().toLocaleTimeString([], { hour12: false });
}
