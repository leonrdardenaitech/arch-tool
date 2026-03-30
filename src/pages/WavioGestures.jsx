import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWavio } from '../context/WavioContext';
import { ChevronLeft, Radar, MousePointer2, Zap, Radio, Activity, Mic, Target, RefreshCcw, Info } from 'lucide-react';

const GestureFlipCard = ({ title, command, logic, icon: Icon, colorClass, borderClass }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-[350px] [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Front Side */}
        <div className={`absolute inset-0 h-full w-full [backface-visibility:hidden] tech-tank-card p-10 flex flex-col justify-between border-l-4 ${borderClass} shadow-2xl overflow-hidden`}>
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold uppercase tracking-tight italic">{title}</h3>
              <p className={`text-[10px] font-black uppercase tracking-widest ${colorClass} bg-white/5 px-3 py-1 rounded-full w-fit`}>Action: {command}</p>
            </div>
            <Icon size={40} className={`${colorClass} opacity-20 group-hover:opacity-100 transition-all`} />
          </div>
          <div className="relative z-10 bg-black/40 rounded-2xl p-6 border border-white/5 text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-white/30 animate-pulse">Tap to decode logic</p>
          </div>
          <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="absolute bottom-[-10%] right-[-5%] w-48 h-48 opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-1000" alt="Fish" />
        </div>

        {/* Back Side (The Universal Language) */}
        <div className={`absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] tech-tank-card p-10 flex flex-col border-l-4 ${borderClass} shadow-2xl bg-gradient-to-br from-black to-slate-900`}>
          <div className="flex items-center gap-3 mb-6">
            <Info size={18} className={colorClass} />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Universal Language</h3>
          </div>
          <div className="flex-1 space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[8px] font-black uppercase text-white/30 block mb-2 tracking-widest">Logic Path</span>
              <p className="text-sm text-cyan-100 italic leading-relaxed font-mono">"{logic}"</p>
            </div>
            <div className="space-y-2">
              <span className="text-[8px] font-black uppercase text-white/30 block tracking-widest">Sensitivity Required</span>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass.replace('text', 'bg')} w-3/4 shadow-[0_0_10px_currentColor]`} />
              </div>
            </div>
          </div>
          <button className="mt-auto flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40">
            <RefreshCcw size={12} /> Flip Back
          </button>
        </div>

      </div>
    </div>
  );
};

const WavioGestures = () => {
  const navigate = useNavigate();
  const { globalTheme } = useWavio();
  const isVideo = globalTheme.endsWith('.mp4');

  const gestures = [
    {
      title: "The Swipe",
      command: "Rewind_15s",
      logic: "Perform a broad horizontal motion 4-6 inches from the microphone. Detects Doppler shift.",
      icon: Radar,
      colorClass: "text-cyan-400",
      borderClass: "border-cyan-500"
    },
    {
      title: "The Impact",
      command: "Play_Pause",
      logic: "Deliver a gross-motor impact to the surface. Z-axis telemetry > 8.5g triggers state toggle.",
      icon: Zap,
      colorClass: "text-red-400",
      borderClass: "border-red-500"
    },
    {
      title: "Air Wave",
      command: "Skip_Forward",
      logic: "Dual-sweep detection. Consecutive Doppler shifts within 500ms initiates track progression.",
      icon: MousePointer2,
      colorClass: "text-yellow-400",
      borderClass: "border-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-6 md:p-12 pt-24 relative overflow-x-hidden">
      
      {/* --- CONTINUOUS BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        {globalTheme !== 'blank' && (
          isVideo ? (
            <video 
              autoPlay loop muted playsinline
              className="w-full h-full object-cover opacity-10"
              src={`/WavioWorld/video/${globalTheme}`} 
            />
          ) : (
            <img 
              src={`/WavioWorld/images/${globalTheme}`} 
              className="w-full h-full object-cover opacity-10" 
              alt="Background" 
            />
          )
        )}
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Tank
        </button>

        {/* Header */}
        <header className="space-y-4">
          <h2 className="text-5xl font-light tracking-[0.2em] text-cyan-400 uppercase wavio-font-thin">Gesture Calibration</h2>
          <p className="text-xs font-mono text-cyan-700 uppercase tracking-[0.5em] font-bold">Calibration // Neural Mapping // Acoustic Synthesis</p>
        </header>

        {/* Flip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gestures.map((g, idx) => (
            <GestureFlipCard key={idx} {...g} />
          ))}
        </div>

        {/* Global Calibration Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
           <section className="lg:col-span-2">
             <div className="tech-tank-card p-12 text-center space-y-8 bg-gradient-to-br from-cyan-900/20 to-transparent border border-white/5">
               <Radio size={64} className="mx-auto text-cyan-500 animate-pulse" />
               <div className="space-y-3">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">Recalibrate Acoustic Array</h3>
                 <p className="text-[11px] uppercase tracking-[0.5em] text-white/20 font-bold">Establishing new baseline echo frequency...</p>
               </div>
               <button className="btn-wavio-primary px-16 py-5 text-xs shadow-2xl">Run Diagnostic</button>
             </div>
           </section>

           {/* Side Mini Tank & Privacy */}
           <div className="flex flex-col gap-4">
             <div className="tech-tank-card flex-1 p-0 overflow-hidden relative group">
                <img 
                  src="/WavioWorld/images/Finding Nemo Coral GIF by Monterey Bay Aquarium.gif" 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-1000" 
                  alt="Mini Tank" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-cyan-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Node_Visual_04</span>
                  </div>
                  <Activity size={14} className="text-cyan-500 animate-pulse" />
                </div>
             </div>
             
             <div className="flex flex-col items-center text-center p-4 opacity-20 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-cyan-500 mb-1">
                  <Lock size={10} />
                  <span className="text-[7px] font-black uppercase tracking-[0.3em]">Privacy Protocol</span>
                </div>
                <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-relaxed">
                  Acoustic telemetry is processed locally. Zero data persistence.
                </p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default WavioGestures;
