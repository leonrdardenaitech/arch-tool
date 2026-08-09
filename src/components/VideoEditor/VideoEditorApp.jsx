import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FabricCanvas } from './FabricCanvas';
import { StateLedger } from './StateLedger';
import { useFFmpeg } from './useFFmpeg';
import { 
  Zap, 
  Terminal, 
  Layout, 
  Settings, 
  FolderOpen, 
  Share2, 
  Play, 
  AlertCircle 
} from 'lucide-react';

export default function VideoEditorApp() {
  const { status: ffmpegStatus } = useFFmpeg();
  
  const [state, setState] = useState({
    layers: [],
    canvasWidth: 800,
    canvasHeight: 450,
    resolution: '16:9'
  });

  const handleStateUpdate = useCallback((newState) => {
    setState(newState);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-gray-200 overflow-hidden font-sans select-none">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-purple-500/20 px-4 flex items-center justify-between bg-black relative z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="font-bold tracking-tighter text-xl uppercase">
              Atlas<span className="text-purple-500 font-black">Core</span>
            </span>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
              <FolderOpen size={14} /> File
            </button>
            <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
              <Layout size={14} /> View
            </button>
            <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
              <Share2 size={14} /> Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-mono text-purple-400">
            <Terminal size={12} />
            <span>FFMPEG: {ffmpegStatus}</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors text-gray-400">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Workspace Central */}
        <FabricCanvas state={state} onStateUpdate={handleStateUpdate} />

        {/* Right Sidebar: State Ledger */}
        <StateLedger state={state} />
      </main>

      {/* Interactive Timeline & Control Bar */}
      <footer className="h-48 border-t border-purple-500/20 bg-black flex flex-col">
        {/* Playback Controls */}
        <div className="h-12 border-b border-purple-500/10 flex items-center px-4 justify-between bg-black/50">
          <div className="flex items-center gap-6">
            <button className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-transform active:scale-95 shadow-lg">
              <Play size={16} className="text-white fill-current ml-0.5" />
            </button>
            <div className="font-mono text-[11px] text-purple-400 tracking-[0.2em]">
              00:00:12:14 / <span className="opacity-40 text-purple-200">00:01:00:00</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span>Layers: {state.layers.length}</span>
            <div className="w-1 h-1 rounded-full bg-purple-500/30" />
            <span>Objects: {state.layers.length}</span>
          </div>
        </div>

        {/* Timeline Tracks Placeholder */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#050505] relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#A855F7_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <AnimatePresence>
            {state.layers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-gray-700 gap-3 border border-dashed border-purple-500/10 rounded-xl bg-purple-500/[0.02]"
              >
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                   <AlertCircle size={32} className="text-purple-500/40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-500">No Coordinate Data</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-mono">Initialize Media Layers to populate timeline</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-1.5 relative z-10">
                {state.layers.sort((a, b) => b.zIndex - a.zIndex).map((layer) => (
                  <motion.div 
                    layout
                    key={layer.id}
                    className="h-9 bg-purple-500/[0.03] border border-purple-500/10 rounded-md flex items-center px-4 gap-3 group hover:bg-purple-500/[0.08] hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="text-[10px] font-mono text-purple-300/80 uppercase tracking-wider w-32 truncate">{layer.id}</span>
                    
                    <div className="flex-1 flex items-center gap-1">
                      <div className="h-[2px] bg-purple-500/10 flex-1 relative overflow-hidden rounded-full">
                         <motion.div 
                           initial={{ x: '-100%' }}
                           animate={{ x: '0%' }}
                           className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 w-full" 
                         />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-[9px] font-mono text-purple-500/60 flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
                        <span>X:{layer.x}</span>
                        <span>Y:{layer.y}</span>
                      </div>
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">Z:{layer.zIndex}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
}
