import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wavioEngine from '../utils/sonarEngine';
import { Activity, X, RotateCcw, Play, Pause } from 'lucide-react';

const WavioFocusMode = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Ensure Sonar is active in this mode
    wavioEngine.start();

    const handleSwipe = () => {
      if (videoRef.current) {
        // Rewind 15 Seconds
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 15);
        showFeedback('REWIND', <RotateCcw size={80} />);
      }
    };

    const handleBump = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
          showFeedback('PLAY', <Play size={80} fill="currentColor" />);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
          showFeedback('PAUSE', <Pause size={80} fill="currentColor" />);
        }
      }
    };

    window.addEventListener('WavioSwipe', handleSwipe);
    window.addEventListener('WavioBump', handleBump);

    return () => {
      window.removeEventListener('WavioSwipe', handleSwipe);
      window.removeEventListener('WavioBump', handleBump);
    };
  }, []);

  const showFeedback = (text, icon) => {
    setFeedback({ text, icon });
    setTimeout(() => setFeedback(null), 1500); 
  };

  const handleExit = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen w-screen bg-black relative flex items-center justify-center overflow-hidden">
      
      {/* Visual Sonar Indicator */}
      <div className="absolute top-8 right-8 z-50 flex flex-col items-center opacity-40">
        <div className="w-12 h-12 bg-cyan-900/20 border border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
          <Activity size={20} className="text-cyan-400" />
        </div>
        <span className="text-[8px] text-cyan-400 font-mono mt-2 tracking-widest uppercase">Acoustic Guard Active</span>
      </div>

      {/* The Media Player */}
      <div className="w-full h-full relative z-10 group">
        <video 
          ref={videoRef}
          src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4" 
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Hidden Interaction Shield (Prevents accidental touches) */}
        <div className="absolute inset-0 z-20 pointer-events-none"></div>
      </div>

      {/* Gross Motor Feedback Overlay */}
      {feedback && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            {feedback.icon}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-[0.3em] uppercase italic">
            {feedback.text}
          </h1>
        </div>
      )}

      {/* Caregiver Exit Button (Requires double-tap to prevent accidental exit) */}
      <button 
        onDoubleClick={handleExit}
        className="absolute top-8 left-8 z-50 p-4 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-full transition-all group"
        title="Double click to exit"
      >
        <X size={24} className="text-white/20 group-hover:text-white" />
      </button>

      {/* Initial Interaction Prompt */}
      {!isPlaying && !feedback && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="p-12 rounded-[3rem] bg-black/40 border border-white/10 backdrop-blur-xl text-center space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest text-white/60 italic">Kiosk Locked</h3>
            <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-500 animate-pulse">Bump table to play media</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WavioFocusMode;
