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
  
  if (location.pathname === '/focus') return null; // Hide for immersive focus mode

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
      <div className="flex gap-2 items-center pointer-events-auto bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400">
        <Link to="/" className="hover:text-white transition-colors px-2">Home</Link>
        <span className="opacity-20">/</span>
        <Link to="/dashboard" className="hover:text-white transition-colors px-2">Tank</Link>
        <span className="opacity-20">/</span>
        <Link to="/gestures" className="hover:text-white transition-colors px-2">Gestures</Link>
        <span className="opacity-20">/</span>
        <Link to="/about" className="hover:text-white transition-colors px-2">About</Link>
      </div>
      
      <div className="flex gap-3 pointer-events-auto items-center">
        {isEcoMode && (
          <span className="bg-green-900/40 text-green-400 border border-green-500/30 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
            Eco_Mode
          </span>
        )}
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border backdrop-blur-md transition-all ${isSonarActive ? 'bg-red-900/40 text-red-400 border-red-500/50 animate-pulse' : 'bg-slate-900/40 text-slate-400 border-white/10'}`}>
          Sonar: {isSonarActive ? 'Engaged' : 'Standby'}
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
