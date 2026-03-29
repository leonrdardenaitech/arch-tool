import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  const { isSonarActive, isEcoMode } = useWavio();
  
  if (location.pathname === '/focus') return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#001f3f] border-b border-white/5 h-16 flex items-center px-8">
      {/* Far Left: Settings */}
      <div className="flex-1 flex items-center gap-6">
        <Settings size={18} className="text-white/40 hover:text-white cursor-pointer transition-colors" />
        <div className="text-xl font-black italic tracking-tighter text-white">WaVio</div>
      </div>

      {/* Center: Pages (Thin Arial Style) */}
      <div className="flex-[2] flex justify-center items-center gap-10">
        <Link to="/" className="text-[12px] font-light font-sans uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Home</Link>
        <Link to="/dashboard" className="text-[12px] font-light font-sans uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/gestures" className="text-[12px] font-light font-sans uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">Gestures</Link>
        <Link to="/about" className="text-[12px] font-light font-sans uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">About</Link>
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
            <Route path="/about" element={<WavioAbout />} />
            <Route path="/focus" element={<WavioFocusMode />} />
          </Routes>
        </div>
      </Router>
    </WavioProvider>
  );
};

export default WavioApp;
