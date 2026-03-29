import React, { useState, useEffect } from 'react';
import { useWavio } from '../context/WavioContext';
import { 
  Activity, Battery, Droplets, Thermometer, Wind, 
  Settings, Play, Pause, RotateCcw, AlarmClock, Mic, Radar, 
  ArrowLeft, ArrowRight, Home, Terminal, Cpu, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WavioDashboard = () => {
  const navigate = useNavigate();
  const { isEcoMode, toggleEcoMode, batteryLevel, isSonarActive, toggleSonar } = useWavio();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (isSonarActive) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Acoustic Ping: ${(Math.random() * 100).toFixed(2)}Hz detected.`, ...prev].slice(0, 10));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSonarActive]);

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-4 pt-20 flex gap-4 overflow-hidden">
      
      {/* --- LEFT: TECHNICAL GRID (REPLIT STYLE) --- */}
      <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-4">
        
        {/* Widget 1: System Console */}
        <div className="tech-tank-card p-6 row-span-2 flex flex-col border-[#001f3f] bg-black/60">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 flex items-center gap-2">
              <Terminal size={12} /> System_Console
            </h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
            </div>
          </div>
          <div className="flex-1 font-mono text-[10px] space-y-2 opacity-60 overflow-y-auto pr-2 custom-scrollbar">
            {logs.length > 0 ? logs.map((log, i) => (
              <p key={i} className="text-cyan-200/80">{log}</p>
            )) : (
              <p className="italic">Waiting for sonar handshake...</p>
            )}
          </div>
        </div>

        {/* Widget 2: Digital Biome (Consolidated) */}
        <div className="tech-tank-card p-6 bg-[#001f3f]/20">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200 mb-4">Digital_Biome</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase">pH_Balance</p>
              <p className="text-sm font-mono text-green-400">7.2 OK</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase">Temp_Core</p>
              <p className="text-sm font-mono text-cyan-400">78.5°F</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase">O2_Sat</p>
              <p className="text-sm font-mono text-white">98%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase">Salinity</p>
              <p className="text-sm font-mono text-white">1.025</p>
            </div>
          </div>
        </div>

        {/* Widget 3: Power & Array */}
        <div className="tech-tank-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">Array_Vitality</h3>
              <p className="text-[8px] font-mono text-white/20 mt-1">{isEcoMode ? 'Eco_Mode Active' : 'Max_Power'}</p>
            </div>
            <Battery size={14} className={batteryLevel < 20 ? "text-red-500" : "text-green-500"} />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${isEcoMode ? 'bg-green-400' : 'bg-cyan-500'}`} style={{ width: `${batteryLevel}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="opacity-40 uppercase">Reserve</span>
              <span>{Math.round(batteryLevel)}%</span>
            </div>
          </div>
          <button onClick={toggleSonar} className={`mt-4 py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isSonarActive ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
            {isSonarActive ? 'Kill_Array' : 'Initialize'}
          </button>
        </div>

        {/* Widget 4: Mini Aquarium (Distraction) */}
        <div className="tech-tank-card p-0 overflow-hidden relative group">
          <img src="/WavioWorld/images/placidplace-fish-18858.gif" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Mini Tank" />
          <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] uppercase tracking-widest border border-white/5">Acoustic_View_01</div>
        </div>

        {/* Widget 5: Processor Load */}
        <div className="tech-tank-card p-6 bg-black/40">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200 mb-4 flex items-center gap-2"><Cpu size={12} /> Neural_Load</h3>
          <div className="h-12 w-full flex items-end gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
            ))}
          </div>
        </div>

      </div>

      {/* --- RIGHT: PHONE MIRROR --- */}
      <div className="w-[340px] flex items-center justify-center pr-4">
        <div className="phone-mockup flex flex-col scale-90 origin-right border-[8px]">
          <div className="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50">
            <span className="text-[9px] font-black tracking-widest">{time.split(' ')[0]}</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSonarActive ? 'bg-red-500' : 'bg-white/10'}`} />
              <Settings size={10} />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 opacity-10">
               <img className="w-full h-full object-cover" src="/WavioWorld/images/placidplace-fish-13525.gif" alt="Mirror" />
            </div>
            <div className="relative z-10 mb-8">
              <h4 className="text-2xl font-black italic tracking-tighter text-white">WaVio</h4>
              <p className="text-[7px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Mirroring Node</p>
            </div>
            <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-16 h-16 animate-fish-float opacity-40 relative z-10" alt="Fish" />
          </div>
          <div className="relative z-10 bg-black flex items-center justify-center gap-4 pb-12">
             <button className="w-10 h-10 bg-blue-900/40 border border-white/10 rounded-full flex items-center justify-center"><Radar size={18} className="text-white/40" /></button>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut */}
      <div className="fixed bottom-6 left-6">
        <button onClick={() => navigate('/')} className="p-4 bg-[#001f3f] rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all shadow-2xl">
          <Home size={20} />
        </button>
      </div>

    </div>
  );
};

export default WavioDashboard;
