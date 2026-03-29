import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWavio } from '../context/WavioContext';
import { MousePointer2, Settings, Volume2, Info } from 'lucide-react';

const WavioHome = () => {
  const navigate = useNavigate();
  const { isSonarActive, toggleSonar, globalTheme } = useWavio();

  const handleEnterTank = async () => {
    if (!isSonarActive) {
      await toggleSonar(); // Asks for Mic Permission & Starts 19kHz pulse
    }
    navigate('/dashboard'); // Moves to the Tech Tank
  };

  const isVideo = globalTheme.endsWith('.mp4');

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black font-sans">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video 
            autoPlay loop muted playsinline
            className="w-full h-full object-cover opacity-40 mix-blend-screen scale-110"
            src={`/WavioWorld/video/${globalTheme}`} 
          />
        ) : (
          <img 
            src={`/WavioWorld/images/${globalTheme}`} 
            className="w-full h-full object-cover opacity-30 animate-pulse-slow" 
            alt="Environment" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/80 via-transparent to-[#001f3f]/80"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-4xl space-y-12">
        <div className="space-y-4">
          <div className="glass-pill mx-auto w-fit">For Aquarium Lovers</div>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            WaVio
          </h1>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.4em] text-cyan-400 opacity-80">
            Trigger from Hand Gestures
          </h2>
        </div>

        <p className="wavio-font-thin text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl">
          Control your media with acoustic sensing. No touch needed—just wave your hand through the air while enjoying the serene aquarium backdrop.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 pt-8">
          <button 
            onClick={handleEnterTank}
            className="btn-wavio-primary px-12 py-5 text-sm shadow-[0_0_40px_rgba(0,123,255,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Open Dashboard
          </button>
          <button 
            onClick={() => navigate('/gestures')}
            className="btn-wavio-outline px-12 py-5 text-sm hover:scale-105 active:scale-95 transition-all"
          >
            Learn Gestures
          </button>
        </div>
      </div>

      {/* Side Utilities (Visual Only for Home) */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-6 opacity-40">
        <Settings size={20} className="text-white hover:text-cyan-400 cursor-pointer transition-colors" />
        <Volume2 size={20} className="text-white hover:text-cyan-400 cursor-pointer transition-colors" />
        <Info size={20} className="text-white hover:text-cyan-400 cursor-pointer transition-colors" />
      </div>

      {/* The Floating Anchor */}
      <div className="absolute bottom-12 opacity-50 flex flex-col items-center group cursor-help">
        <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-16 h-16 animate-fish-float" alt="Pulse" />
        <span className="text-[8px] uppercase tracking-[0.5em] mt-4 text-cyan-500 group-hover:text-white transition-colors">Tap mic to wake</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default WavioHome;
