import React, { useState, useEffect } from 'react';
import { useWavio } from '../context/WavioContext';
import { 
  Activity, Battery, Droplets, Thermometer, Wind, 
  Settings, Play, Pause, RotateCcw, AlarmClock, Mic, Radar, 
  ArrowLeft, ArrowRight, Home, Terminal, Cpu, Database,
  Lock, Zap, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WavioDashboard = () => {
  const navigate = useNavigate();
  const { isEcoMode, toggleEcoMode, batteryLevel, isSonarActive, toggleSonar, isFindMyDoorActive } = useWavio();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [logs, setLogs] = useState([]);
  const [phoneMessage, setPhoneMessage] = useState('Mirroring Node');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (isSonarActive) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] Acoustic Ping: ${(Math.random() * 100).toFixed(2)}Hz detected.`, ...prev].slice(0, 15));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSonarActive]);

  const handleFeedFish = () => {
    setPhoneMessage('Dispensing Feed...');
    setTimeout(() => setPhoneMessage('Mirroring Node'), 3000);
  };

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans p-4 pt-20 flex gap-4 overflow-hidden relative">
      
      {/* Find My Door Overlay (Active State) */}
      {isFindMyDoorActive && (
        <div className="absolute inset-0 z-[150] bg-cyan-900/20 backdrop-blur-sm pointer-events-none flex items-center justify-center">
          <div className="flex flex-col items-center animate-pulse">
            <Radar size={120} className="text-cyan-400 opacity-40 mb-8" />
            <h2 className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">Doorway Detected</h2>
          </div>
        </div>
      )}

      {/* --- LEFT: TECHNICAL GRID (REPLIT STYLE) --- */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4">
        
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
              <p key={i} className="text-cyan-200/80 animate-in fade-in slide-in-from-left-1 duration-300">{log}</p>
            )) : (
              <p className="italic">Waiting for sonar handshake...</p>
            )}
          </div>
        </div>

        {/* Widget 2: Digital Biome */}
        <div className="tech-tank-card p-6 bg-[#001f3f]/20 border-l-2 border-cyan-500/30">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200 mb-6 flex items-center gap-2">
            <Droplets size={12} /> Digital_Biome
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">pH_Balance</p>
              <p className="text-sm font-mono text-green-400">7.2 OK</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">Temp_Core</p>
              <p className="text-sm font-mono text-cyan-400">78.5°F</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">O2_Sat</p>
              <p className="text-sm font-mono text-white">98%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] text-white/30 uppercase tracking-widest">Salinity</p>
              <p className="text-sm font-mono text-white">1.025</p>
            </div>
          </div>
        </div>

        {/* Widget 3: Power & Array */}
        <div className="tech-tank-card p-6 flex flex-col justify-between border-l-2 border-red-500/30">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">Array_Vitality</h3>
              <p className="text-[8px] font-mono text-white/20 mt-1">{isEcoMode ? 'Eco_Mode Active' : 'Max_Power'}</p>
            </div>
            <Battery size={14} className={batteryLevel < 20 ? "text-red-500 animate-pulse" : "text-green-500"} />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${isEcoMode ? 'bg-green-400' : 'bg-cyan-500'}`} style={{ width: `${batteryLevel}%` }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="opacity-40 uppercase tracking-widest">Reserve</span>
              <span>{Math.round(batteryLevel)}%</span>
            </div>
          </div>
          <button onClick={toggleSonar} className={`mt-4 py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isSonarActive ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
            {isSonarActive ? 'Kill_Array' : 'Initialize'}
          </button>
        </div>

        {/* Widget 4: Master Vault */}
        <div className="tech-tank-card p-6 bg-black/40 border-l-2 border-fuchsia-500/30">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-6 flex items-center gap-2">
            <Lock size={12} /> Master_Vault
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-[9px] uppercase tracking-widest opacity-50">Sonar_Archive_01</span>
              <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group opacity-30">
              <span className="text-[9px] uppercase tracking-widest">Neural_Handshake_Log</span>
              <Lock size={10} />
            </div>
            <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <span className="text-[9px] uppercase tracking-widest opacity-50">Gesture_Macros</span>
              <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Widget 5: Processor Load */}
        <div className="tech-tank-card p-6 bg-black/40 border-l-2 border-yellow-500/30">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-6 flex items-center gap-2">
            <Cpu size={12} /> Neural_Load
          </h3>
          <div className="h-12 w-full flex items-end gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 bg-yellow-500/20 rounded-t-sm" style={{ height: `${20 + Math.random() * 60}%` }} />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
            <span>Cycle_Freq</span>
            <span>2.8 GHz</span>
          </div>
        </div>

      </div>

      {/* --- RIGHT: PHONE MIRROR & MINI AQUARIUM --- */}
      <div className="w-[340px] flex flex-col gap-4 pr-4">
        {/* Mini Aquarium Widget */}
        <div className="tech-tank-card h-48 p-0 overflow-hidden relative group border-2 border-white/5">
          <img 
            src="/WavioWorld/images/placidplace-fish-18858.gif" 
            className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
            alt="Mini Tank" 
          />
          <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] uppercase tracking-widest border border-white/5 backdrop-blur-md">Acoustic_View_01</div>
          <div className="absolute bottom-2 right-2 text-cyan-400 animate-pulse">
            <Activity size={16} />
          </div>
        </div>

        {/* Phone Mirror (Shrunken with Hardware Border) */}
        <div className="phone-mockup flex flex-col scale-75 origin-top border-[1px] border-black ring-[12px] ring-[#001f3f] ring-inset outline outline-1 outline-black/40">
          <div className="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50">
            <span className="text-[9px] font-black tracking-widest">{time.split(' ')[0]}</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
              <Settings size={10} />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 opacity-20">
               <img className="w-full h-full object-cover" src="/WavioWorld/images/placidplace-fish-13525.gif" alt="Mirror" />
            </div>
            <div className="relative z-10 mb-8">
              <h4 className="text-2xl font-black italic tracking-tighter text-white">WaVio</h4>
              <p className="text-[7px] uppercase tracking-[0.3em] text-cyan-400 font-bold">{phoneMessage}</p>
            </div>
            <img src="/WavioWorld/images/placidplace-fish-13525.gif" className="w-16 h-16 animate-fish-float opacity-40 relative z-10" alt="Fish" />
          </div>
          <div className="relative z-10 bg-black flex items-center justify-center gap-4 pb-12">
             <button 
               onClick={handleFeedFish}
               className="w-12 h-12 bg-[#001f3f] border border-red-600/30 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
             >
               <Radar size={20} className={isSonarActive ? 'text-red-500' : 'text-white/20'} />
             </button>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut & Privacy */}
      <div className="fixed bottom-6 left-6 z-[80] flex items-center gap-6">
        <button onClick={() => navigate('/')} className="p-4 bg-[#001f3f] rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all shadow-3xl hover:border-cyan-500/50">
          <Home size={20} />
        </button>
        <div className="flex flex-col opacity-20 hover:opacity-100 transition-opacity">
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

export default WavioDashboard;
