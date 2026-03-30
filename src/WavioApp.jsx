import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Settings, ShieldCheck, DoorOpen, LogOut, Radio } from 'lucide-react';
import { WavioProvider, useWavio } from './context/WavioContext';
import './wavio.css';

// Pages
import WavioHome from './pages/WavioHome';
import WavioDashboard from './pages/WavioDashboard';
import WavioGestures from './pages/WavioGestures';
import WavioAbout from './pages/WavioAbout';
import WavioFocusMode from './pages/WavioFocusMode';

const GlobalNav = () => {
  const location = useLocation();
  const { isSonarActive, isEcoMode, isFindMyDoorActive, toggleFindMyDoor } = useWavio();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  if (location.pathname === '/focus') return null;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#001f3f] border-b border-white/5 h-16 flex items-center px-8 shadow-2xl">
        {/* Far Left: Settings */}
        <div className="flex-1 flex items-center gap-6">
          <Settings 
            size={18} 
            className="text-white/40 hover:text-white cursor-pointer transition-colors" 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          />
          <div className="text-xl font-black italic tracking-tighter text-white">WaVio</div>
        </div>

        {/* Center: Pages (Thin Arial Style) */}
        <div className="flex-[2] flex justify-center items-center gap-10">
          <Link to="/" className="text-[12px] wavio-font-thin uppercase text-white/70 hover:text-white transition-colors">Home</Link>
          <Link to="/dashboard" className="text-[12px] wavio-font-thin uppercase text-white/70 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/gestures" className="text-[12px] wavio-font-thin uppercase text-white/70 hover:text-white transition-colors">Gestures</Link>
          <Link to="/architect" className="text-[12px] wavio-font-thin uppercase text-white/70 hover:text-white transition-colors">Architect</Link>
        </div>
        
        {/* Far Right: Status Indicators */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded-full border border-white/5">
            {isEcoMode && <span className="text-[8px] font-black text-green-400">ECO</span>}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Sonar</span>
              <div className={`w-2 h-2 rounded-full ${isSonarActive ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} />
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Dropdown Overlay */}
      {isSettingsOpen && (
        <div className="fixed top-16 left-8 z-[110] w-64 bg-[#001f3f] border border-white/10 rounded-2xl shadow-3xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 px-2">Advanced Logic</h3>
            <button 
              onClick={() => { toggleFindMyDoor(); setIsSettingsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isFindMyDoorActive ? 'bg-cyan-500 text-black font-black' : 'text-white/60 hover:bg-white/5'}`}
            >
              <DoorOpen size={16} />
              <span className="text-xs uppercase tracking-widest">Find My Door</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 transition-all">
              <ShieldCheck size={16} />
              <span className="text-xs uppercase tracking-widest">Trust Protocol</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 transition-all">
              <Radio size={16} />
              <span className="text-xs uppercase tracking-widest">Acoustic Sync</span>
            </button>
            <div className="pt-4 mt-4 border-t border-white/5">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
                <LogOut size={16} />
                <span className="text-xs uppercase tracking-widest text-red-500">Kill Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const WavioApp = () => {
  return (
    <WavioProvider>
      <Router>
        <div className="wavio-app-root bg-[#000814] text-white min-h-screen overflow-hidden font-sans selection:bg-cyan-500/30">
          <GlobalNav />
          <Routes>
            <Route path="/" element={<WavioHome />} />
            <Route path="/dashboard" element={<WavioDashboard />} />
            <Route path="/gestures" element={<WavioGestures />} />
            <Route path="/architect" element={<WavioAbout />} />
            <Route path="/focus" element={<WavioFocusMode />} />
          </Routes>
        </div>
      </Router>
    </WavioProvider>
  );
};

export default WavioApp;
