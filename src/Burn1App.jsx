import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Skull, 
  MapPin, 
  Activity, 
  Shield, 
  Wind,
  Zap,
  Volume2,
  Lock
} from 'lucide-react';

export default function Burn1App() {
  const [lighterFlicked, setLighterFlicked] = useState(false);
  const [systemLogs, setLogs] = useState([
    "LOCATION: UNDISCLOSED_ALLEYWAY",
    "OBJECT_DETECTED: ANTIQUE_BRASS_LIGHTER",
    "STATUS: STABLE"
  ]);

  const handleFlick = () => {
    setLighterFlicked(true);
    setLogs(prev => [...prev, "IGNITION_SEQUENCE_INITIALIZED", "BURN1_VECTORS_MANIFESTING", "WARNING: THERMAL_SPIKE_DETECTED"]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono overflow-hidden relative selection:bg-orange-600 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.1] bg-[url('/assets/video/dreamgirl44.mp4')] bg-cover"></div>
      
      {/* Heavy Rain/Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-20 bg-[url('https://media.giphy.com/media/oEI9uWUqnhoA/giphy.gif')] mix-blend-screen"></div>

      <main className="relative z-10 max-w-4xl mx-auto pt-20 px-6">
        <header className="mb-12 border-b border-orange-900/40 pb-8 flex justify-between items-end">
          <div>
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-orange-600 text-xs mb-2 font-black tracking-[0.4em]"
            >
              [ SECTOR: URBAN_HORROR ]
            </motion.div>
            <h1 className="text-7xl font-black italic tracking-tighter uppercase">
              BURN<span className="text-orange-600">-</span>1
            </h1>
            <p className="text-[10px] text-zinc-600 mt-2 tracking-[0.2em] font-black uppercase">A Darden Architecture Lore Fragment</p>
          </div>
          <div className="text-right text-[9px] text-zinc-500 uppercase tracking-widest leading-relaxed">
            Asset: The Cursed Lighter<br />
            Status: {lighterFlicked ? 'IGNITED' : 'COLD'}<br />
            ID: DH-01-BURN
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* LORE INFUSION */}
          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-lg backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-3 mb-6 text-orange-500">
                <Flame size={24} />
                <h2 className="text-xs font-black uppercase tracking-widest">The_Scuffle_Protocol</h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                31 shots of cinematic tension. A dirty sneaker on wet pavement. 
                A pile of discarded server racks. The spark that changes everything.
                <strong> Burn-1</strong> isn't just a story; it's a structural manifestation of 
                creative friction.
              </p>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase font-black">
                    <MapPin size={12} />
                    <span>The Alleyway (Redan Sector)</span>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] text-zinc-600 uppercase font-black">
                    <Activity size={12} />
                    <span>31 Shots / 4K Workflow</span>
                 </div>
              </div>
            </div>

            {/* LIVE FEED */}
            <div className="bg-black border border-orange-950/30 p-4 font-mono text-[10px] h-32 overflow-y-auto">
               {systemLogs.map((log, i) => (
                 <div key={i} className="mb-1 text-orange-700/80">
                   &gt; {log}
                 </div>
               ))}
               {lighterFlicked && (
                 <motion.div 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ repeat: Infinity, duration: 0.5 }}
                   className="text-orange-500 font-bold"
                 >
                   RESONANCE_DETECTED: DIMENSIONAL_SHIFT_IN_PROGRESS
                 </motion.div>
               )}
            </div>
          </div>

          {/* THE INTERACTIVE LIGHTER */}
          <div className="relative group cursor-pointer" onClick={handleFlick}>
            <AnimatePresence>
              {lighterFlicked && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-orange-600/20 blur-[100px] z-0"
                />
              )}
            </AnimatePresence>
            
            <div className="aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl transition-all hover:border-orange-500/50">
               {lighterFlicked ? (
                 <div className="relative flex items-center justify-center">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ repeat: Infinity, duration: 0.1 }}
                    >
                      <Flame size={120} className="text-orange-500 fill-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.5)]" />
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
                 </div>
               ) : (
                 <div className="text-center space-y-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Lock size={48} className="mx-auto text-zinc-700" />
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black">Click to Flick</p>
                 </div>
               )}
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-30">
                  <div className="flex gap-4">
                     <Volume2 size={16} className="text-zinc-800" />
                     <Wind size={16} className="text-zinc-800" />
                  </div>
                  <span className="text-[9px] text-zinc-800 font-black uppercase tracking-widest italic">Archetype_Bypass_v4</span>
               </div>
            </div>
          </div>
        </section>

        {/* STORYBOARD SECTIONS */}
        <section className="border-t border-zinc-900 pt-16 pb-32">
           <h3 className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em] mb-10 text-center">Production_Milestones //</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['KICKED_OUT', 'THE_FIND', 'IGNITION', 'THE_BRAWL'].map((step, i) => (
                <div key={step} className="p-4 bg-zinc-900/20 border border-zinc-800 rounded group hover:border-orange-500/30 transition-all">
                   <div className="text-[8px] text-zinc-700 mb-1">0{i+1}_STORYBOARD</div>
                   <div className="text-[10px] font-black text-zinc-500 group-hover:text-orange-600 tracking-widest">{step}</div>
                </div>
              ))}
           </div>
        </section>

        <footer className="py-20 text-center">
           <a href="/hunger" className="text-[10px] text-zinc-800 hover:text-orange-600 transition-colors uppercase font-black tracking-[0.4em] border-b border-zinc-900 pb-2">
             &lt; RETURN TO DIMENSIONAL HUNGER
           </a>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}} />
    </div>
  );
}
