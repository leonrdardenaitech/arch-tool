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
  const { isSonarActive, toggleSonar, globalTheme, setGlobalTheme, isEcoMode } = useWavio();
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

  const handleEnterTank = async () => {
    if (!isSonarActive) await toggleSonar();
    navigate('/dashboard');
  };

  const isVideo = globalTheme.endsWith('.mp4');

  return (
    <div className="relative min-h-screen w-full flex bg-black font-sans overflow-x-hidden">
      
      {/* --- CONTINUOUS BACKGROUND --- */}
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f]/90 via-[#001f3f]/20 to-[#001f3f]/90"></div>
      </div>

      {/* --- LEFT COLUMN: CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-12 lg:px-24 max-w-3xl">
        <div className="space-y-8">
          <div className="glass-pill w-fit opacity-10">For Aquarium Lovers</div>
          
          <div className="space-y-2">
            <h1 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              WaVio
            </h1>
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-cyan-400">
              Trigger from Hand Gestures
            </h2>
          </div>

          <p className="wavio-font-thin text-xl text-white/60 leading-relaxed max-w-xl">
            Control your media with acoustic sensing. No touch needed—just wave your hand through the air while enjoying the serene aquarium backdrop.
          </p>

          <div className="flex gap-6 pt-8">
            <button 
              onClick={handleEnterTank}
              className="btn-wavio-primary px-10 py-4 text-xs shadow-[0_0_30px_rgba(0,123,255,0.4)]"
            >
              Open Dashboard
            </button>
            <button 
              onClick={() => navigate('/gestures')}
              className="btn-wavio-outline px-10 py-4 text-xs"
            >
              Learn Gestures
            </button>
          </div>
        </div>
      </main>

      {/* --- MIDDLE RIGHT: PHONE FORM FACTOR --- */}
      <div className="relative z-10 flex-1 hidden lg:flex items-center justify-center pr-24">
        <div className="phone-mockup flex flex-col">
          {/* Phone Status Bar */}
          <div className="bg-[#001f3f] h-14 flex items-center justify-between px-8 text-white/70">
            <span className="text-[10px] font-black tracking-widest">{time}</span>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
              <Settings size={12} />
            </div>
          </div>

          {/* Phone Body */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Inner Phone Background */}
            <div className="absolute inset-0 z-0 opacity-20">
               {isVideo ? (
                 <video autoPlay loop muted playsinline className="w-full h-full object-cover" src={`/WavioWorld/video/${globalTheme}`} />
               ) : (
                 <img className="w-full h-full object-cover" src={`/WavioWorld/images/${globalTheme}`} />
               )}
            </div>

            <div className="relative z-10 mb-12">
              <h4 className="text-3xl font-black italic tracking-tighter">WaVio</h4>
              <p className="text-[8px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Trigger from hand gestures</p>
            </div>

            <div className="relative z-10 mb-12">
              <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-20 h-20 animate-fish-float opacity-60" alt="Fish" />
            </div>

            <p className="relative z-10 text-[9px] uppercase tracking-[0.3em] text-white/40 font-black animate-pulse">Tap mic to wake</p>
          </div>

          {/* Phone Media Controls */}
          <div className="px-8 pb-8 grid grid-cols-4 gap-4 relative z-10">
            {[Play, Pause, RotateCcw, AlarmClock].map((Icon, idx) => (
              <button key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10">
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* Phone Triggers */}
          <div className="flex items-center justify-center gap-6 pb-12 relative z-10">
            <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg"><Mic size={16} /></button>
            <button className={`w-16 h-16 bg-[#001f3f] rounded-full flex items-center justify-center border-2 border-red-600 shadow-2xl ${isSonarActive ? 'sonar-pulse' : ''}`}>
              <Radar size={24} className="text-white" />
            </button>
            <button className="w-10 h-10 bg-[#007bff] rounded-full flex items-center justify-center shadow-lg"><Activity size={16} /></button>
          </div>

          {/* Side Toggle Arrows */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-20"><ChevronLeft size={16} /></div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-20"><ChevronRight size={16} /></div>
        </div>
      </div>

      {/* --- FAR RIGHT UTILITY SIDEBAR --- */}
      <div className="relative z-[20] w-20 flex flex-col items-center py-24 gap-12 bg-black/40 backdrop-blur-xl border-l border-white/5">
        <button onClick={() => setIsMuted(!isMuted)} className="text-white opacity-40 hover:opacity-100 transition-opacity">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex flex-col gap-4">
          {backgrounds.map((bg, idx) => (
            <button 
              key={idx}
              onClick={() => setGlobalTheme(bg.src)}
              className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition-all ${globalTheme === bg.src ? 'border-cyan-400 scale-110 shadow-[0_0_10px_#22d3ee]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
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

      {/* --- SCROLL CONTENT: MARKETING --- */}
      {/* (Reserved for scroll logic if needed) */}

    </div>
  );
};

export default WavioHome;
