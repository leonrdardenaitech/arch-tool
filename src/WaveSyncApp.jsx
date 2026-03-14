import React, { useState, useEffect, useRef } from 'react';

const WaveSyncApp = () => {
  // App States: 'splash', 'initial', 'discovery', 'calibration', 'active', 'sleep'
  const [appStep, setAppStep] = useState('splash');
  const [isListening, setIsListening] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Wand / Sensor Tracking
  const [wandPos, setWandPos] = useState(50); // Percentage 0-100
  
  // Custom Profiles & Mapping
  const [activeProfile, setActiveProfile] = useState('A');
  const [profiles, setProfiles] = useState({
    A: { wave: 'Rewind 15s', double: 'Play/Pause', hover: 'Mute' },
    B: { wave: 'Skip 30s', double: 'Stop', hover: 'Volume Up' },
    C: { wave: 'Next Track', double: 'Shuffle', hover: 'Bass Boost' },
    D: { wave: 'Custom 1', double: 'Custom 2', hover: 'Custom 3' }
  });
  const [isEditing, setIsEditing] = useState(false);

  // Calibration State
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [calibrationStep, setCalibrationStep] = useState('wave'); 
  const [glowColor, setGlowColor] = useState('transparent');
  
  // Gesture Logic
  const [waveCount, setWaveCount] = useState(0);
  const waveTimer = useRef(null);
  const lastWaveTime = useRef(0);
  const DEBOUNCE_DELAY = 500;

  // Cinematic Splash Transition
  useEffect(() => {
    if (appStep === 'splash') {
      const timer = setTimeout(() => setAppStep('initial'), 3000);
      return () => clearTimeout(timer);
    }
  }, [appStep]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    setWandPos(xPercent);

    if (appStep === 'sleep') {
        setAppStep('active');
        triggerAction('WAKE-UP', 0);
    }
  };

  const startNetworkSync = (e) => {
    e.stopPropagation();
    setIsScanning(true);
    setAppStep('discovery');
    setTimeout(() => {
      setDiscoveredDevices([
        { name: 'Studio Roku Pro', type: 'Roku', ip: '192.168.1.10' },
        { name: 'Fire TV Cube', type: 'Cast', ip: '192.168.1.15' },
        { name: 'DJ Booth Tablet', type: 'Cast', ip: '192.168.1.20' }
      ]);
      setIsScanning(false);
    }, 2500);
  };

  const triggerAction = (action, count) => {
    setLastAction(action);
    const colors = { 1: '#ff4d00', 2: '#facc15', 3: '#ff0000', 0: '#facc15' };
    setGlowColor(colors[count] || colors[1]);
    setTimeout(() => setGlowColor('transparent'), 800);

    if (appStep === 'calibration') {
      setCalibrationProgress(prev => Math.min(prev + 34, 100));
      if (calibrationStep === 'wave') setCalibrationStep('double');
      else if (calibrationStep === 'double') setCalibrationStep('hover');
    }
  };

  const handleVirtualSensor = (e) => {
    if (!isListening && appStep !== 'calibration') return;
    
    const now = Date.now();
    if (now - lastWaveTime.current < DEBOUNCE_DELAY) return;
    
    lastWaveTime.current = now;
    setWaveCount(prev => prev + 1);
    if (waveTimer.current) clearTimeout(waveTimer.current);
    waveTimer.current = setTimeout(() => {
      const count = waveCount + 1;
      const mapping = profiles[activeProfile];
      let action = "";
      if (count === 1) action = mapping.wave;
      else if (count === 2) action = mapping.double;
      else action = mapping.hover;
      
      triggerAction(action, count);
      setWaveCount(0);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#0d0000] flex items-center justify-center p-4 font-sans text-yellow-400 overflow-hidden">
      
      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fire-pulse { 0%, 100% { box-shadow: 0 0 20px #ff000033; } 50% { box-shadow: 0 0 50px #ff4d0066; } }
        @keyframes scan-laser { 0% { top: -10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        @keyframes wand-glow { 0%, 100% { opacity: 0.5; filter: blur(4px); } 50% { opacity: 1; filter: blur(8px); } }
        .ignite-glow { text-shadow: 0 0 10px #facc15, 0 0 20px #ff4d00; }
      `}</style>

      {/* STATIONARY PHONE FORM FACTOR */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseEnter={handleVirtualSensor}
        style={{ 
            boxShadow: `0 0 80px ${glowColor === 'transparent' ? '#ff000022' : glowColor}`,
            transition: 'box-shadow 0.3s ease'
        }}
        className="w-[380px] h-[780px] bg-[#1a0505] border-[12px] border-[#2a0a0a] rounded-[60px] relative overflow-hidden flex flex-col group"
      >
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#2a0a0a] rounded-b-3xl z-[100] flex items-center justify-center">
            <div className="w-10 h-1 bg-[#3d0f0f] rounded-full"></div>
        </div>

        {/* DYNAMIC WAVE WAND (STATUS BAR INDICATOR) */}
        <div className="absolute top-10 inset-x-0 h-1 z-50 px-8">
            <div className="relative w-full h-full">
                <div 
                    style={{ left: `${wandPos}%`, transition: 'left 0.1s ease-out' }}
                    className={`absolute -translate-x-1/2 w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15] 
                        ${isListening ? 'animate-[wand-glow_1s_infinite]' : 'opacity-40'}`}
                ></div>
            </div>
        </div>

        {/* STEP 0: SPLASH */}
        {appStep === 'splash' && (
          <div className="absolute inset-0 z-[200] bg-[#0d0000] flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                <span className="text-7xl">🔥</span>
              </div>
            </div>
            <h1 className="mt-8 text-3xl font-black tracking-[0.3em] italic text-yellow-400 ignite-glow uppercase">Ignition</h1>
            <p className="mt-2 text-[10px] tracking-[0.5em] text-yellow-500/50 font-black uppercase">Priming Edge Sensors</p>
          </div>
        )}

        {/* STEP: SLEEP MODE */}
        {appStep === 'sleep' && (
            <div className="absolute inset-0 z-[150] bg-black/90 flex flex-col items-center justify-center cursor-none">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping mb-4"></div>
                <p className="text-[10px] font-black tracking-[0.5em] text-yellow-400 uppercase">Stealth Mode Active</p>
                <p className="mt-2 text-xs text-yellow-500/50 italic uppercase">Wave to Wake</p>
            </div>
        )}

        {/* HEADER */}
        <div className="h-16 flex justify-between items-end px-8 pb-2 z-50">
            <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase italic">WaveSync // v2.0</span>
            <div className="flex gap-4">
                <button onClick={(e) => { e.stopPropagation(); setAppStep('sleep'); }} className="text-yellow-400 hover:text-white transition-colors">
                    <span className="text-lg">⏻</span>
                </button>
            </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col hide-scrollbar overflow-y-auto px-6 py-4 z-10 relative">
          
          {/* STEP 1: INITIAL */}
          {appStep === 'initial' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center">
                    <h2 className="text-5xl font-black italic tracking-tighter text-yellow-400">IGNITE.</h2>
                    <p className="text-[10px] text-yellow-500/50 tracking-[0.4em] font-black uppercase mt-2">Broadcast Sync Pulse</p>
                </div>

                <button 
                  onClick={startNetworkSync}
                  className="group relative w-60 h-60 rounded-full flex items-center justify-center transition-transform active:scale-90"
                >
                    <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/20 border-4 border-yellow-500/30 rounded-full animate-[fire-pulse_4s_infinite]"></div>
                    <div className="relative flex flex-col items-center gap-2">
                        <span className="text-5xl group-hover:rotate-12 transition-transform duration-500">💥</span>
                        <span className="text-[10px] font-black tracking-widest text-yellow-400 group-hover:text-white uppercase">Engage</span>
                    </div>
                </button>
            </div>
          )}

          {/* STEP 2: DISCOVERY */}
          {appStep === 'discovery' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-500">
              <header className="space-y-1">
                <h2 className="text-3xl font-black italic tracking-tighter text-yellow-400 uppercase">The Probe.</h2>
                <p className="text-[10px] text-yellow-500/50 font-black uppercase tracking-widest">
                    {isScanning ? 'Pinging Local Wifi Abyss...' : `${discoveredDevices.length} Targets Verified`}
                </p>
              </header>

              <div className="space-y-3">
                {isScanning ? (
                  <div className="h-64 bg-red-950/20 rounded-[40px] border border-yellow-500/20 overflow-hidden relative flex items-center justify-center">
                     <div className="absolute inset-x-0 h-[2px] bg-yellow-400 blur-sm animate-[scan-laser_2s_infinite]"></div>
                     <p className="text-[10px] font-black text-yellow-400 tracking-[0.5em] uppercase opacity-50">SSDP Analysis</p>
                  </div>
                ) : (
                  discoveredDevices.map((device, i) => (
                    <button 
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedDevice(device); }}
                      className={`w-full p-6 rounded-[32px] border-2 text-left transition-all relative overflow-hidden group
                        ${selectedDevice?.ip === device.ip ? 'bg-red-600/20 border-yellow-400 shadow-[0_0_20px_#facc1533]' : 'bg-[#2a0a0a]/50 border-yellow-500/10 hover:border-yellow-500/30'}`}
                    >
                      <div className="flex justify-between items-center relative z-10">
                        <div>
                          <p className={`font-black text-sm tracking-tight ${selectedDevice?.ip === device.ip ? 'text-white' : 'text-yellow-400'}`}>{device.name}</p>
                          <p className="text-[10px] text-yellow-500/50 font-black uppercase">{device.type} // {device.ip}</p>
                        </div>
                        <span className="text-2xl group-hover:scale-125 transition-transform">{device.type === 'Roku' ? '📺' : '📡'}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {selectedDevice && !isScanning && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setAppStep('calibration'); }}
                  className="w-full bg-yellow-400 py-6 rounded-3xl font-black text-xs tracking-[0.3em] uppercase text-black shadow-2xl shadow-yellow-400/20 hover:bg-white transition-colors"
                >
                  Confirm Payload
                </button>
              )}
            </div>
          )}

          {/* STEP 3: CALIBRATION */}
          {appStep === 'calibration' && (
            <div className="flex-1 flex flex-col space-y-10 animate-in zoom-in-95 duration-700">
                <header>
                    <h2 className="text-3xl font-black italic tracking-tighter text-yellow-400 uppercase">Calibration.</h2>
                    <p className="text-[10px] text-yellow-500/50 font-black uppercase tracking-widest">Syncing with {selectedDevice?.name || 'Device'}</p>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
                    <div className="w-full max-w-[200px] h-1.5 bg-red-950 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 transition-all duration-1000 shadow-[0_0_10px_#facc15]" style={{width: `${calibrationProgress}%`}}></div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-yellow-400 uppercase">
                            {calibrationStep === 'wave' && "Perform 1 Swipe"}
                            {calibrationStep === 'double' && "Perform Double Tap"}
                            {calibrationStep === 'hover' && "Steady Hover"}
                        </h3>
                        <p className="text-[10px] text-yellow-500/50 uppercase tracking-widest font-bold px-8">
                            Verify the target device reacts to your motion.
                        </p>
                    </div>

                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-yellow-500/20 flex items-center justify-center group cursor-none">
                        <div className="text-center group-hover:scale-125 transition-transform duration-500">
                            <span className="text-5xl block mb-2">👋</span>
                            <div className="h-1 w-8 bg-yellow-400 mx-auto rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {calibrationProgress >= 100 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setAppStep('active'); setIsListening(true); }}
                        className="w-full bg-yellow-400 py-6 rounded-3xl font-black text-xs tracking-[0.3em] uppercase text-black shadow-2xl shadow-yellow-400/20"
                    >
                        Deploy Sensor
                    </button>
                )}
            </div>
          )}

          {/* STEP 4: ACTIVE */}
          {appStep === 'active' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-500">
                <header className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black italic tracking-tighter text-yellow-400 uppercase">Live.</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-yellow-500/50 font-black tracking-widest uppercase italic">Target: {selectedDevice?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-1 bg-red-950/30 p-1 rounded-xl border border-yellow-500/10">
                        {['A', 'B', 'C', 'D'].map(p => (
                            <button 
                                key={p}
                                onClick={(e) => { e.stopPropagation(); setActiveProfile(p); }}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${activeProfile === p ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-yellow-600 hover:text-yellow-400'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex flex-col items-center py-6 relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsListening(!isListening); }}
                        className={`w-60 h-60 rounded-full border-[10px] flex flex-col items-center justify-center gap-3 transition-all duration-700
                            ${isListening 
                                ? 'bg-[#1a0505] border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.4)] scale-105' 
                                : 'bg-[#0d0000] border-yellow-950 grayscale'
                            }`}
                    >
                        <span className={`text-6xl transition-transform ${isListening ? 'scale-110 animate-pulse' : ''}`}>
                            {isListening ? '🔥' : '🌑'}
                        </span>
                        <p className={`text-[10px] font-black tracking-[0.5em] ${isListening ? 'text-yellow-400' : 'text-yellow-950'}`}>
                            {isListening ? 'LISTENING' : 'OFFLINE'}
                        </p>
                    </button>

                    <div className="mt-10 h-8 flex items-center">
                        {lastAction && (
                            <div className="bg-yellow-400/10 px-8 py-2 rounded-full border border-yellow-400/30 animate-in zoom-in-90">
                                <span className="text-[10px] font-black tracking-[0.2em] text-yellow-400 uppercase italic">Executed: {lastAction}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#2a0a0a]/30 rounded-[40px] p-6 border border-yellow-500/10 space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] font-black text-yellow-500/50 uppercase tracking-widest italic font-bold">Config Profile {activeProfile}</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                            className="text-[10px] font-black text-yellow-400 hover:text-white uppercase tracking-widest"
                        >
                            {isEditing ? '✓ Save' : '✎ Edit'}
                        </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
                        {[
                            { g: '👋', k: 'wave', n: 'Single Wave' },
                            { g: '👋👋', k: 'double', n: 'Double Swipe' },
                            { g: '✋', k: 'hover', n: 'Static Hover' }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#1a0505] p-5 rounded-3xl flex justify-between items-center border border-yellow-500/10 group hover:border-yellow-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{item.g}</span>
                                    <span className="text-[10px] font-black text-yellow-600 uppercase font-bold">{item.n}</span>
                                </div>
                                {isEditing ? (
                                    <input 
                                        className="bg-yellow-950/30 border-b border-yellow-400 text-[10px] font-black text-yellow-400 w-24 text-right outline-none"
                                        value={profiles[activeProfile][item.k]}
                                        onChange={(e) => {
                                            const newProfiles = {...profiles};
                                            newProfiles[activeProfile][item.k] = e.target.value;
                                            setProfiles(newProfiles);
                                        }}
                                    />
                                ) : (
                                    <span className="text-[11px] font-black text-yellow-400 uppercase tracking-tighter italic">{profiles[activeProfile][item.k]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

          </div>
          )}

        </div>

        {/* HOME INDICATOR */}
        <div className="h-12 flex items-center justify-center z-50">
            <div className="w-32 h-1.5 bg-yellow-950 rounded-full opacity-30"></div>
        </div>

      </div>

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,#3d0f0f_0%,#000_80%)] pointer-events-none"></div>
    </div>
  );
};

export default WaveSyncApp;
