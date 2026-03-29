import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Github, Linkedin, Mail } from 'lucide-react';

const WavioAbout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-6 md:p-12 pt-24 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-all"
        >
          <ChevronLeft size={16} /> Back to Tank
        </button>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="glass-pill w-fit">Project Documentation</div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
            Acoustic <span className="text-cyan-500">Intelligence</span>
          </h1>
          <p className="wavio-font-thin text-xl text-white/60 leading-relaxed max-w-2xl">
            WaVio is a physical interaction layer for multimodal superintelligence. By transforming standard microphones into 19kHz ultrasonic radar, we enable zero-touch control in any environment.
          </p>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="tech-tank-card p-10 space-y-6">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
              <Info size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">The Vision</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Designed for high-load engineering desks, commercial kitchens, and assistive care kiosks. WaVio bridges the gap between binary logic and human serenity.
            </p>
          </div>

          <div className="tech-tank-card p-10 space-y-6">
            <img src="/WavioWorld/images/aquarium screensaver GIF.gif" className="w-full aspect-video object-cover rounded-xl opacity-50" alt="Logic" />
            <h3 className="text-xl font-bold uppercase tracking-tight">System Core</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Utilizing Fast Fourier Transform (FFT) to decode Doppler shifts in real-time. No cameras. No invasive tracking. Just sound.
            </p>
          </div>
        </div>

        {/* Architect Footer */}
        <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Architect: Leon R. Darden</p>
            <p className="text-[8px] font-mono mt-1 uppercase">Stonecrest, GA // 2026</p>
          </div>
          <div className="flex gap-8">
            <Github size={18} className="hover:text-cyan-400 cursor-pointer" />
            <Linkedin size={18} className="hover:text-cyan-400 cursor-pointer" />
            <Mail size={18} className="hover:text-cyan-400 cursor-pointer" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WavioAbout;
