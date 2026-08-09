import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code } from 'lucide-react';

export const StateLedger = ({ state }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0A0A0A] border-l border-purple-500/20 w-80 h-full flex flex-col font-mono text-[10px]"
    >
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-black">
        <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest text-[12px]">
          <Database size={14} />
          <span>State Ledger</span>
        </div>
        <div className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-sm border border-purple-500/30 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span>Sync</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-purple-300/80">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>

      <div className="p-4 border-t border-purple-500/20 bg-black/50 text-purple-500/50 flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <Code size={10} />
          <span>Engine: ATLAS CORE v1.0.0</span>
        </div>
        <div>Coordinates: Absolute (Fabric-Wrapped)</div>
      </div>
    </motion.div>
  );
};
