import React, { useState, useEffect } from 'react';
import { useWavio } from '../context/WavioContext';
import { 
  Activity, Battery, Droplets, Thermometer, Wind, 
  Settings, Play, Pause, RotateCcw, AlarmClock, Mic, Radar, 
  ArrowLeft, ArrowRight, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WavioDashboard = () => {
  const navigate = useNavigate();
  const { isEcoMode, toggleEcoMode, batteryLevel, isSonarActive, toggleSonar } = useWavio();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-6 md:p-12 pt-24">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-light tracking-[0.2em] text-cyan-400 uppercase">System Overview</h2>
          <p className="text-[10px] font-mono text-cyan-700 uppercase tracking-widest mt-2">
            Node: Stonecrest_GA // Protocol: Acoustic_Sensing_v1.5
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-5xl font-thin tracking-tighter text-white/20">{time}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Widget 1: Digital Biome (Water Quality) */}
        <div className="tech-tank-card p-10 flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Digital Biome</h3>
              <Droplets size={18} className="text-cyan-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40">pH Balance</span>
                <span className="text-sm font-mono text-green-400">7.2 OK</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Temperature</span>
                <div className="flex items-center gap-2">
                  <Thermometer size={14} className="text-orange-500" />
                  <span className="text-sm font-mono text-cyan-400">78.5°F</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Oxygen Sat.</span>
                <div className="flex items-center gap-2">
                  <Wind size={14} className="text-blue-400" />
                  <span className="text-sm font-mono text-white">98%</span>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-4 border-2 border-cyan-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all">
            Dispense Digital Feed
          </button>
        </div>

        {/* Widget 2: Power Management */}
        <div className={`tech-tank-card p-10 flex flex-col justify-between transition-all duration-700 ${isEcoMode ? 'border-t-4 border-green-500/50' : 'border-t-4 border-red-500/50'}`}>
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">System Vitality</h3>
                <p className="text-[9px] font-mono text-white/30 mt-1">{isEcoMode ? 'Eco-Tank Active' : 'Performance Mode'}</p>
              </div>
              <button 
                onClick={toggleEcoMode}
                className={`w-14 h-7 rounded-full p-1 transition-colors duration-500 ${isEcoMode ? 'bg-green-600' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-500 shadow-lg ${isEcoMode ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Battery Reserve</span>
                <span className="text-2xl font-thin tracking-tighter text-white">{Math.round(batteryLevel)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isEcoMode ? 'bg-green-400' : 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]'}`} 
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Activity size={12} className={isSonarActive ? "text-red-500 animate-pulse" : "text-zinc-600"} />
                <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">
                  Sonar Drain: {isEcoMode ? 'Reduced' : 'Nominal'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={toggleSonar}
            className={`mt-8 w-full py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isSonarActive ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
          >
            {isSonarActive ? 'Deactivate Sonar' : 'Re-engage Array'}
          </button>
        </div>

        {/* Widget 3: Phone Mirror UI */}
        <div className="flex flex-col items-center justify-center">
          <div className="phone-mockup relative flex flex-col group overflow-hidden">
            {/* Phone Screen Background */}
            <div className="absolute inset-0 z-0">
              <img src="/WavioWorld/images/placidplace-fish-18858.gif" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="Mobile Biome" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            {/* Phone Header */}
            <div className="relative z-10 px-8 pt-10 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-widest">{time}</span>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-zinc-700'}`} />
                <Settings size={14} className="text-white/40" />
              </div>
            </div>

            {/* Phone Body */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="mb-12">
                <h4 className="text-3xl font-black italic tracking-tighter">WaVio</h4>
                <p className="text-[8px] uppercase tracking-[0.4em] text-cyan-400 font-bold">Trigger active</p>
              </div>

              <div className="relative mb-12">
                <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-20 h-20 animate-fish-float" alt="Fish" />
                {isSonarActive && <div className="absolute inset-0 scale-150 border border-cyan-500/20 rounded-full animate-ping" />}
              </div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black animate-pulse">Tap mic to wake</p>
            </div>

            {/* Media Controls (Static Visuals) */}
            <div className="relative z-10 grid grid-cols-4 gap-4 px-8 pb-8">
              <button className="p-3 bg-white/5 border border-white/5 rounded-full flex items-center justify-center"><Play size={14} fill="currentColor" /></button>
              <button className="p-3 bg-white/5 border border-white/5 rounded-full flex items-center justify-center"><Pause size={14} /></button>
              <button className="p-3 bg-white/5 border border-white/5 rounded-full flex items-center justify-center"><RotateCcw size={14} /></button>
              <button className="p-3 bg-white/5 border border-white/5 rounded-full flex items-center justify-center"><AlarmClock size={14} /></button>
            </div>

            {/* Triggers */}
            <div className="relative z-10 flex items-center justify-center gap-6 pb-12">
              <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg"><Mic size={16} /></button>
              <button className={`w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center border-4 border-red-600/50 shadow-2xl ${isSonarActive ? 'sonar-pulse' : ''}`}>
                <Radar size={24} className="text-white" />
              </button>
              <button 
                onClick={() => navigate('/focus')}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Activity size={16} />
              </button>
            </div>

            {/* Toggle Arrows */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-20"><ArrowLeft size={16} /></div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-20"><ArrowRight size={16} /></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-900 mt-8">Mobile Portal Mirror</p>
        </div>

      </div>

      {/* Navigation Shortcuts */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full flex gap-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
            <Home size={14} /> Home
          </button>
          <button onClick={() => navigate('/gestures')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
            <Radar size={14} /> Gestures
          </button>
          <button onClick={() => navigate('/focus')} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-all">
            <Activity size={14} /> Focus Mode
          </button>
        </div>
      </footer>
    </div>
  );
};

export default WavioDashboard;
