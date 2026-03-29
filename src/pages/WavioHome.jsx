import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWavio } from '../context/WavioContext';
import { 
  Settings, Volume2, VolumeX, Info, 
  Play, Pause, RotateCcw, AlarmClock, 
  Mic, Radar, Activity, ChevronLeft, ChevronRight 
} from 'lucide-react';

const WavioHome = () => {
  const navigate = useNavigate();
  const { 
    isSonarActive, toggleSonar, globalTheme, setGlobalTheme, 
    isEcoMode, isInitializing, setIsInitializing 
  } = useWavio();
  
  const [isMuted, setIsMuted] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const backgrounds = [
    { name: 'Aquarium MP4', type: 'video', src: 'Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4' },
    { name: 'GIF 1', type: 'image', src: 'aquarium GIF.gif' },
    { name: 'GIF 2', type: 'image', src: 'aquarium screensaver GIF.gif' },
    { name: 'GIF 3', type: 'image', src: 'Finding Nemo Coral GIF by Monterey Bay Aquarium.gif' },
    { name: 'GIF 4', type: 'image', src: 'placidplace-fish-18858.gif' },
    { name: 'Blank', type: 'image', src: 'blank' }
  ];

  const handleInitialize = async () => {
    setIsInitializing(true);
    if (!isSonarActive) await toggleSonar();
    // After 5 seconds the context will set isInitializing to false automatically
  };

  const isVideo = globalTheme.endsWith('.mp4');

  return (
    <div className="relative min-h-screen w-full flex bg-[#000814] font-sans overflow-hidden select-none">
      
      {/* --- GLOBAL VIEWPORT ARROWS --- */}
      <div className="fixed top-1/2 left-4 -translate-y-1/2 z-[60] opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
        <ChevronLeft size={32} className="text-white" />
      </div>
      <div className="fixed top-1/2 right-24 -translate-y-1/2 z-[60] opacity-20 hover:opacity-100 transition-opacity cursor-pointer">
        <ChevronRight size={32} className="text-white" />
      </div>

      {/* --- CONTINUOUS BACKGROUND (Synced with Phone) --- */}
      <div className="absolute inset-0 z-0">
        {globalTheme !== 'blank' && (
          isVideo ? (
            <video 
              autoPlay loop muted playsinline
              className="w-full h-full object-cover opacity-40 mix-blend-screen scale-105"
              src={`/WavioWorld/video/${globalTheme}`} 
            />
          ) : (
            <img 
              src={`/WavioWorld/images/${globalTheme}`} 
              className="w-full h-full object-cover opacity-30" 
              alt="Background" 
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/95 via-transparent to-[#001f3f]/95"></div>
      </div>

      {/* --- LEFT COLUMN: CONTENT --- */}
      <main className="relative z-10 w-1/2 flex flex-col justify-center pl-24 pr-12">
        <div className="space-y-6">
          <div className="space-y-0">
            <h1 className="text-[120px] font-black italic tracking-tighter text-white leading-[0.8] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              WaVio
            </h1>
            <div className="glass-pill w-fit opacity-10 mt-4 ml-2">For Aquarium Lovers</div>
          </div>
          
          <div className="pt-4 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-[0.5em] text-cyan-400">
              Trigger from Hand Gestures
            </h2>
            <p className="wavio-font-thin text-base text-white/50 leading-relaxed max-w-md">
              Control your media with acoustic sensing. No touch needed—just wave your hand through the air while enjoying the serene aquarium backdrop.
            </p>
          </div>

          <div className="flex gap-4 pt-10">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-wavio-primary px-8 py-3 text-[10px] shadow-[0_0_20px_rgba(0,123,255,0.3)] hover:border-red-600 border border-transparent"
            >
              Open Dashboard
            </button>
            <button 
              onClick={() => navigate('/gestures')}
              className="btn-wavio-outline px-8 py-3 text-[10px] hover:border-red-600"
            >
              Learn Gestures
            </button>
          </div>
        </div>
      </main>

      {/* --- MIDDLE RIGHT: PHONE FORM FACTOR --- */}
      <div className="relative z-10 w-1/2 flex items-center justify-center pr-24">
        <div className="phone-mockup flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border-[10px] border-[#001f3f]">
          {/* Phone Status Bar */}
          <div className="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50">
            <span className="text-[9px] font-black tracking-widest">{time}</span>
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
              <Settings size={10} />
            </div>
          </div>

          {/* Phone Body */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-black">
            {/* Inner Phone Background (Synced with main) */}
            <div className="absolute inset-0 z-0 opacity-20">
               {globalTheme !== 'blank' && (
                 isVideo ? (
                   <video autoPlay loop muted playsinline className="w-full h-full object-cover" src={`/WavioWorld/video/${globalTheme}`} />
                 ) : (
                   <img className="w-full h-full object-cover" src={`/WavioWorld/images/${globalTheme}`} />
                 )
               )}
            </div>

            <div className="relative z-10 mb-8">
              <h4 className="text-2xl font-black italic tracking-tighter text-white">WaVio</h4>
              <p className="text-[7px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Trigger from hand gestures</p>
            </div>

            <div className="relative z-10 mb-8">
              <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-16 h-16 animate-fish-float opacity-40" alt="Fish" />
            </div>

            <p className="relative z-10 text-[8px] uppercase tracking-[0.3em] text-white/30 font-black animate-pulse">Tap mic to wake</p>
          </div>

          {/* Phone Media Controls */}
          <div className="px-6 pb-6 grid grid-cols-4 gap-3 relative z-10 bg-black">
            {[Play, Pause, RotateCcw, AlarmClock].map((Icon, idx) => (
              <button key={idx} className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all">
                <Icon size={12} />
              </button>
            ))}
          </div>

          {/* Phone Triggers */}
          <div className="flex items-center justify-center gap-5 pb-10 relative z-10 bg-black">
            <button className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white"><Mic size={14} /></button>
            
            {/* The Heart of WaVio: Sonar Button */}
            <button 
              onClick={handleInitialize}
              className={`w-14 h-14 bg-[#001f3f] rounded-full flex items-center justify-center border-2 border-red-600 shadow-2xl transition-all ${isInitializing ? 'bg-green-500 border-white scale-110 animate-pulse' : ''}`}
            >
              <Radar size={20} className={isInitializing ? 'text-white' : 'text-white/80'} />
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 bg-[#007bff] rounded-full flex items-center justify-center shadow-lg text-white"
            >
              <Activity size={14} />
            </button>
          </div>

          {/* Phone Toggle Arrows */}
          <div className="absolute top-1/2 left-1.5 -translate-y-1/2 opacity-10"><ChevronLeft size={12} /></div>
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 opacity-10"><ChevronRight size={12} /></div>
        </div>
      </div>

      {/* --- FAR RIGHT UTILITY SIDEBAR --- */}
      <div className="relative z-[70] w-20 flex flex-col items-center py-20 gap-10 bg-[#001f3f]/40 backdrop-blur-2xl border-l border-white/5">
        <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="flex flex-col gap-3">
          {backgrounds.map((bg, idx) => (
            <button 
              key={idx}
              onClick={() => setGlobalTheme(bg.src)}
              className={`w-9 h-9 rounded-md border-2 overflow-hidden transition-all ${globalTheme === bg.src ? 'border-cyan-400 scale-110' : 'border-white/5 opacity-30 hover:opacity-100'}`}
              title={bg.name}
            >
              {bg.src === 'blank' ? (
                <div className="w-full h-full bg-slate-900" />
              ) : (
                <img 
                  src={bg.type === 'video' ? '/WavioWorld/images/placidplace-fish-13525.gif' : `/WavioWorld/images/${bg.src}`} 
                  className="w-full h-full object-cover" 
                  alt="Picker"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- SCROLL SECTION: DARK BLUE BORDER MARKETING --- */}
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-[#001f3f] to-transparent pointer-events-none" />
    </div>
  );
};

export default WavioHome;
