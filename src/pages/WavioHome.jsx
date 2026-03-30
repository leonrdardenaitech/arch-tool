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
  const [phoneMessage, setPhoneMessage] = useState('Tap mic to wake');

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
    setPhoneMessage('Dispensing Feed...');
    if (!isSonarActive) await toggleSonar();
    setTimeout(() => {
      setIsInitializing(false);
      setPhoneMessage('Tap mic to wake');
    }, 5000);
  };

  const isVideo = globalTheme.endsWith('.mp4');

  const cycleBackground = (dir) => {
    const idx = backgrounds.findIndex(b => b.src === globalTheme);
    const newIdx = (idx + dir + backgrounds.length) % backgrounds.length;
    setGlobalTheme(backgrounds[newIdx].src);
  };

  return (
    <div className="relative min-h-screen w-full flex bg-[#000814] font-sans overflow-hidden select-none">
      
      {/* --- GLOBAL CONTINUOUS BACKGROUND (Synced with Phone) --- */}
      <div className="absolute inset-0 z-0">
        {globalTheme !== 'blank' && (
          isVideo ? (
            <video 
              autoPlay loop muted={isMuted} playsinline
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

      {/* --- GLOBAL VIEWPORT ARROWS --- */}
      <div 
        onClick={() => cycleBackground(-1)}
        className="fixed top-1/2 left-4 -translate-y-1/2 z-[60] opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-4"
      >
        <ChevronLeft size={48} className="text-white" />
      </div>
      <div 
        onClick={() => cycleBackground(1)}
        className="fixed top-1/2 right-24 -translate-y-1/2 z-[60] opacity-20 hover:opacity-100 transition-opacity cursor-pointer p-4"
      >
        <ChevronRight size={48} className="text-white" />
      </div>

      {/* --- LEFT COLUMN: CONTENT (Shrunken for Whitespace) --- */}
      <main className="relative z-10 w-1/2 flex flex-col justify-center pl-24 pr-12 scale-90 origin-left">
        <div className="space-y-6">
          <div className="space-y-0">
            <h1 className="text-[120px] font-black italic tracking-tighter text-white leading-[0.8] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              WaVio
            </h1>
            <div className="glass-pill w-fit mt-6 opacity-10">For Aquarium Lovers</div>
          </div>
          
          <div className="pt-6 space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-cyan-400">
              Trigger from Hand Gestures
            </h2>
            <p className="wavio-font-thin text-lg text-white/50 leading-relaxed max-w-md">
              Control your media with acoustic sensing. No touch needed—just wave your hand through the air while enjoying the serene aquarium backdrop.
            </p>
          </div>

          <div className="flex gap-6 pt-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-wavio-primary px-12 py-4 text-[10px]"
            >
              Open Dashboard
            </button>
            <button 
              onClick={() => navigate('/gestures')}
              className="btn-wavio-outline px-12 py-4 text-[10px]"
            >
              Learn Gestures
            </button>
          </div>
        </div>
      </main>

      {/* --- MIDDLE RIGHT: PHONE FORM FACTOR (Shrunken and Shifted Down) --- */}
      <div className="relative z-10 w-1/2 flex items-center justify-center pr-24 pt-16">
        <div className="phone-mockup flex flex-col bg-black scale-90 border-[1px] border-black ring-[12px] ring-[#001f3f] ring-inset outline outline-1 outline-black/40">
          
          {/* Phone Status Bar */}
          <div className="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50 z-20">
            <span className="text-[9px] font-black tracking-widest">{time}</span>
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
              <Settings size={10} />
            </div>
          </div>

          {/* Phone Body with Video Background Covering Full Height */}
          <div className="flex-1 flex flex-col relative overflow-hidden">
            {/* Inner Phone Background (Synced with main, flows behind everything) */}
            <div className="absolute inset-0 z-0 opacity-40">
               {globalTheme !== 'blank' && (
                 isVideo ? (
                   <video autoPlay loop muted playsinline className="w-full h-full object-cover" src={`/WavioWorld/video/${globalTheme}`} />
                 ) : (
                   <img className="w-full h-full object-cover" src={`/WavioWorld/images/${globalTheme}`} alt="Phone Background" />
                 )
               )}
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-8 opacity-40">
                <h4 className="text-3xl font-black italic tracking-tighter text-white">WaVio</h4>
                <p className="text-[8px] uppercase tracking-[0.3em] text-cyan-400 font-bold mt-1">Trigger from hand gestures</p>
              </div>

              <div className="mb-12">
                <img 
                  src="/WavioWorld/images/placidplace-fish-13525.gif" 
                  className="w-24 h-24 animate-fish-float opacity-60 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                  alt="Floating Fish" 
                />
              </div>

              <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black animate-pulse">{phoneMessage}</p>
            </div>

            {/* Phone Media Controls (Linked to Gestures Page) */}
            <div className="px-6 pb-6 grid grid-cols-4 gap-3 relative z-10 bg-black/40 backdrop-blur-md">
              {[Play, Pause, RotateCcw, AlarmClock].map((Icon, idx) => (
                <button 
                  key={idx} 
                  onClick={() => navigate('/gestures')}
                  className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>

            {/* Phone Triggers (Bottom Row - Slightly Bigger) */}
            <div className="flex items-center justify-center gap-5 pb-12 relative z-10 bg-black/40 backdrop-blur-md">
              <button className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white">
                <Mic size={18} />
              </button>
              
              {/* The Heart of WaVio: Sonar Button (Fish Feeder Mode) */}
              <button 
                onClick={handleInitialize}
                className={`w-20 h-20 bg-[#001f3f] rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl transition-all ${isInitializing ? 'bg-green-500 border-white scale-110 animate-pulse' : ''}`}
              >
                <Radar size={32} className={isInitializing ? 'text-white' : 'text-white/80'} />
              </button>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-12 h-12 bg-[#007bff] rounded-full flex items-center justify-center shadow-lg text-white"
              >
                <Activity size={18} />
              </button>
            </div>
          </div>

          {/* Inner Phone Toggle Arrows (Visual only) */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-20 z-20"><ChevronLeft size={16} /></div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-20 z-20"><ChevronRight size={16} /></div>
        </div>
      </div>

      {/* --- FAR RIGHT UTILITY SIDEBAR --- */}
      <div className="relative z-[70] w-20 flex flex-col items-center py-20 gap-10 bg-[#001f3f]/40 backdrop-blur-2xl border-l border-white/5">
        <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="flex flex-col gap-4">
          {backgrounds.map((bg, idx) => (
            <button 
              key={idx}
              onClick={() => setGlobalTheme(bg.src)}
              className={`w-10 h-10 rounded-lg border-2 overflow-hidden transition-all ${globalTheme === bg.src ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-white/5 opacity-30 hover:opacity-100'}`}
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
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-[#001f3f] to-transparent pointer-events-none flex flex-col items-center justify-end pb-6 px-4">
        <div className="flex flex-col items-center text-center space-y-1 opacity-20 group hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-cyan-500">
            <Lock size={10} />
            <span className="text-[7px] font-black uppercase tracking-[0.3em]">Privacy Protocol</span>
          </div>
          <p className="text-[8px] font-bold text-white uppercase tracking-widest">
            Acoustic telemetry is processed locally. Zero data persistence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WavioHome;
