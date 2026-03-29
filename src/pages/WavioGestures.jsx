import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Radar, MousePointer2, Zap, Radio } from 'lucide-react';

const WavioGestures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-6 md:p-12 pt-24">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-all"
        >
          <ChevronLeft size={16} /> Back to Tank
        </button>

        {/* Header */}
        <header className="space-y-4">
          <h2 className="text-4xl font-light tracking-[0.2em] text-cyan-400 uppercase">Gesture Calibration</h2>
          <p className="text-xs font-mono text-cyan-700 uppercase tracking-widest">Calibration // Mapping // Synthesis</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gesture 1: Wave */}
          <div className="tech-tank-card p-10 group relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight">The Swipe</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Binary Command: Rewind_15s</p>
              </div>
              <Radar size={32} className="text-cyan-400 opacity-20 group-hover:opacity-100 group-hover:animate-ping transition-all" />
            </div>
            <div className="relative z-10 bg-black/40 rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Status: Active</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic">
                "Perform a broad horizontal motion 4-6 inches from the microphone. System detects the ultrasonic doppler shift to trigger the command."
              </p>
            </div>
            <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="absolute bottom-[-20%] right-[-10%] w-48 h-48 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-1000" alt="Logic" />
          </div>

          {/* Gesture 2: Bump */}
          <div className="tech-tank-card p-10 group relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight">The Impact</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Binary Command: Play_Pause</p>
              </div>
              <Zap size={32} className="text-red-400 opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all" />
            </div>
            <div className="relative z-10 bg-black/40 rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Status: Active</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic">
                "Deliver a gross-motor impact to the surface holding the device. Telemetry sensor Z-axis > 8.5g will toggle the media state."
              </p>
            </div>
            <img src="/WavioWorld/images/placidplace-fish-18858.gif" className="absolute bottom-[-20%] right-[-10%] w-48 h-48 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-1000" alt="Logic" />
          </div>

        </div>

        {/* Global Calibration Action */}
        <section className="pt-12">
          <div className="tech-tank-card p-12 text-center space-y-8 bg-gradient-to-br from-cyan-900/20 to-transparent">
            <Radio size={48} className="mx-auto text-cyan-500 animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Recalibrate Acoustic Array</h3>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">Establishing new baseline echo frequency...</p>
            </div>
            <button className="btn-wavio-primary px-12 py-4 text-xs">Run Diagnostic</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default WavioGestures;
