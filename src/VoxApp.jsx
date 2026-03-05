import React, { useState, useEffect, useRef } from 'react';
import { Mic, Waves, Activity, Circle, Bluetooth, ShieldAlert, Info, PlayCircle, X, CheckCircle2, ChevronRight, Volume2, Database, Zap, Power } from 'lucide-react';

const VoxApp = () => {
  const [phase, setPhase] = useState('cinematic'); // 'cinematic', 'pitch', 'ready', 'transition', 'app'
  const [isRecording, setIsRecording] = useState(false);
  const [hydration, setHydration] = useState(42);
  const [statusText, setStatusText] = useState('Neural Matrix Calibrating...');
  const [logs, setLogs] = useState([
    { time: '08:15 AM', item: 'Morning Coffee', impact: -5 },
    { time: '09:30 AM', item: 'Electrolyte Water', impact: +12 }
  ]);
  const [syncStatus, setStatusSync] = useState({ ring: false, wristband: false });
  const [voxMessage, setVoxMessage] = useState("System Ready. Good morning, Partner. I'm monitoring your hydration vectors.");
  const [dbStatus, setDbStatus] = useState("Initializing Micro-DB...");
  const audioRef = useRef(null);

  // --- CINEMATIC SEQUENCE LOGIC ---
  useEffect(() => {
    if (phase === 'cinematic') {
      // 1. Initial silhouette delay
      setTimeout(() => {
        setPhase('pitch');
      }, 2000);
    }
    
    if (phase === 'pitch') {
      // 2. Loading simulation while pitch is visible
      setTimeout(() => {
        setDbStatus("Neural Database Pre-Calculated (Temporary Session)");
      }, 8000);
      
      // 3. Show the "Ready" button after pitch hold
      setTimeout(() => {
        setPhase('ready');
      }, 15000);
    }
  }, [phase]);

  const startVoxExperience = () => {
    // Play sound on user gesture
    playWaves();
    setPhase('transition');
    
    // Final zoom into the app
    setTimeout(() => {
      setPhase('app');
    }, 4000);
  };

  const playWaves = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const noise = ctx.createBufferSource();
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      noise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  // --- fRAG SIMULATION (Synthesis Prototype Mode) ---
  const processVoiceInput = (text) => {
    setStatusText('fRAG Engine: Fetching Neural Context...');
    setTimeout(() => {
      let lowerText = text.toLowerCase();
      let impact = 0;
      let response = "";
      let item = "Unknown Source";

      if (lowerText.includes('water')) { 
        impact = 15; 
        item = "Pure Water"; 
        response = "Hydration confirmed. I've updated the micro-DB and synced with your ring."; 
      } else if (lowerText.includes('coffee') || lowerText.includes('soda')) { 
        impact = -8; 
        item = "Caffeine Intake"; 
        response = "Caffeine detected. Adjusting hydration bar for diuretic effects."; 
      } else { 
        response = "Input ambiguous. Please specify beverage type for fRAG synthesis."; 
      }

      if (impact !== 0) {
        setHydration(prev => Math.max(0, Math.min(100, prev + impact)));
        setLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), item, impact }, ...logs]);
      }
      setVoxMessage(response);
      setStatusText('Standby: Neural Link Active.');
    }, 1500);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setStatusText('Vox is listening...');
      setTimeout(() => {
        setIsRecording(false);
        const inputs = ["I just drank a bottle of water", "Had a coffee", "Just finished some electrolytes"];
        processVoiceInput(inputs[Math.floor(Math.random() * inputs.length)]);
      }, 3000);
    }
  };

  return (
    <div className="vox-container">
      {/* CINEMATIC LANDING LAYER */}
      {phase !== 'app' && (
        <div className={`vox-cinematic-overlay ${phase === 'transition' ? 'zoom-out' : ''}`}>
          <div className="phone-silhouette">
            <div className={`pitch-content ${(phase === 'pitch' || phase === 'ready') ? 'fade-in' : ''} ${phase === 'transition' ? 'fade-out' : ''}`}>
              <div className="pitch-text">
                <p>
                  Major brands build for the average. <br/>
                  <strong>We build for the elite.</strong> <br/>
                  Vox is the straightforward assistant filling the gap where wearables fall short. <br/>
                  From the pickleball court to the nursery, we've secured the hydration vectors that matter most.
                </p>
              </div>
              
              <div className="loading-area">
                <div className="loading-subtext">
                  <Database size={12} className="animate-pulse" /> <span>{dbStatus}</span>
                </div>
                
                {phase === 'ready' && (
                  <button className="vox-launch-btn animate-bounce-in" onClick={startVoxExperience}>
                    <Power size={20} />
                    <span>Establish Neural Link</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN APP INTERFACE */}
      <main className={`vox-main-content ${phase === 'app' ? 'app-ready' : 'app-hidden'}`}>
        <header className="vox-header">
          <div className="vox-logo-area">
            <Waves className="vox-accent-blue" size={28} />
            <div>
              <h2>Hydro-Scan</h2>
              <p>AI AGENT: VOX // SYNTHESIS PROTOTYPE</p>
            </div>
          </div>
          <div className="vox-system-status">
             <div className={`status-dot ${syncStatus.ring ? 'online' : ''}`}></div>
             <span>{syncStatus.ring ? 'PROTOTYPE SYNCED' : 'STANDALONE MODE'}</span>
          </div>
        </header>

        <section className="vox-monitor-section">
          <div className="vox-hydration-card">
            <div className="v-label-group">
              <h3>Daily Hydration Status</h3>
              <span className={`v-percent ${hydration < 30 ? 'critical' : ''}`}>{hydration}%</span>
            </div>
            <div className="vox-progress-container">
              <div className="vox-progress-fill" style={{ width: `${hydration}%` }}>
                <div className="vox-wave"></div>
              </div>
            </div>
            <div className="vox-persona-msg">
              <Volume2 size={20} className="vox-accent-green" />
              <p>"{voxMessage}"</p>
            </div>
          </div>
        </section>

        <section className="vox-interaction-grid">
          <div className="vox-interaction-card v-voice">
            <button className={`vox-mic-btn ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
              <Mic size={40} />
              <div className="mic-rings"></div>
            </button>
            <p className="v-hint">{statusText}</p>
            <span className="v-sub-hint">Voice-fRAG: Log your consumption</span>
          </div>

          <div className="vox-interaction-card v-hardware">
            <h4>SYNTHESIS NODES</h4>
            <div className="v-device-list">
              <div className={`v-device ${syncStatus.ring ? 'active' : ''}`} onClick={() => setStatusSync(s => ({...s, ring: true}))}>
                <Circle size={20} />
                <div className="v-dev-info">
                  <p>Silicon Ring</p>
                  <span>{syncStatus.ring ? 'CALIBRATED' : 'DEMO SYNC'}</span>
                </div>
                {syncStatus.ring && <CheckCircle2 size={16} className="v-online" />}
              </div>
              <div className={`v-device ${syncStatus.wristband ? 'active' : ''}`} onClick={() => setStatusSync(s => ({...s, wristband: true}))}>
                <Activity size={20} />
                <div className="v-dev-info">
                  <p>Neural Wristband</p>
                  <span>{syncStatus.wristband ? 'CALIBRATED' : 'DEMO SYNC'}</span>
                </div>
                {syncStatus.wristband && <CheckCircle2 size={16} className="v-online" />}
              </div>
            </div>
          </div>
        </section>

        <section className="vox-intel-section">
          <div className="vox-intel-card">
            <div className="v-intel-header">
              <Zap size={18} className="vox-accent-blue" />
              <h4>fRAG RETRIEVAL HISTORY</h4>
            </div>
            <div className="v-log-list">
              {logs.map((log, i) => (
                <div key={i} className="v-log-item">
                  <span className="v-log-time">{log.time}</span>
                  <span className="v-log-name">{log.item}</span>
                  <span className={`v-log-impact ${log.impact > 0 ? 'pos' : 'neg'}`}>
                    {log.impact > 0 ? '+' : ''}{log.impact}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --v-bg: #050a0f;
          --v-card: #0d151d;
          --v-blue: #3b82f6;
          --v-green: #10b981;
          --v-red: #ef4444;
          --v-text: #f8fafc;
          --v-dim: #64748b;
        }

        .vox-container { min-height: 100vh; background: var(--v-bg); color: var(--v-text); font-family: 'Inter', sans-serif; position: relative; overflow: hidden; }

        /* CINEMATIC LAYER */
        .vox-cinematic-overlay {
          position: fixed; inset: 0; z-index: 2000; background: #000;
          display: flex; align-items: center; justify-content: center;
          transition: transform 4s cubic-bezier(0.16, 1, 0.3, 1), opacity 2s;
        }
        .vox-cinematic-overlay.zoom-out { transform: scale(5); opacity: 0; pointer-events: none; }

        .phone-silhouette {
          width: 320px; height: 640px; background: #0a0a0a; border: 4px solid #1a1a1a;
          border-radius: 3rem; display: flex; align-items: center; justify-content: center;
          padding: 2rem; position: relative; box-shadow: 0 0 100px rgba(59,130,246,0.1);
        }
        .phone-silhouette::before { content: ''; position: absolute; top: 20px; width: 60px; height: 5px; background: #1a1a1a; border-radius: 10px; }

        .pitch-content { text-align: center; opacity: 0; transition: opacity 2s ease-in; width: 100%; }
        .pitch-content.fade-in { opacity: 1; }
        .pitch-content.fade-out { opacity: 0; transition: opacity 1s; }
        
        .pitch-text p { font-size: 1rem; line-height: 1.6; color: #ccc; margin-bottom: 2rem; }
        .pitch-text strong { color: var(--v-blue); font-size: 1.2rem; display: block; margin: 0.5rem 0; }

        .loading-area { min-height: 100px; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .loading-subtext { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.55rem; font-weight: 900; color: #444; text-transform: uppercase; letter-spacing: 1px; }

        .vox-launch-btn {
          background: var(--v-blue); color: #fff; border: none; padding: 1rem 1.5rem; 
          border-radius: 1rem; font-weight: 900; text-transform: uppercase; 
          display: flex; align-items: center; gap: 0.75rem; cursor: pointer;
          box-shadow: 0 0 20px rgba(59,130,246,0.4); font-size: 0.8rem;
          transition: transform 0.2s;
        }
        .vox-launch-btn:hover { transform: scale(1.05); background: #2563eb; }

        /* APP READY STATE */
        .vox-main-content { max-width: 800px; margin: 0 auto; padding: 2rem; transition: opacity 2s; }
        .app-hidden { opacity: 0; }
        .app-ready { opacity: 1; }

        /* COMPONENTS */
        .vox-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .vox-logo-area h2 { font-weight: 900; text-transform: uppercase; font-size: 1.25rem; margin: 0; }
        .vox-logo-area p { font-size: 0.6rem; font-weight: 900; color: var(--v-dim); letter-spacing: 2px; margin: 0; }
        
        .vox-hydration-card { background: var(--v-card); padding: 2.5rem; border-radius: 2rem; border: 1px solid #222; margin-bottom: 2rem; }
        .v-percent { font-size: 4rem; font-weight: 900; line-height: 1; }
        .vox-progress-container { height: 50px; background: #000; border-radius: 1rem; overflow: hidden; position: relative; border: 2px solid #222; }
        .vox-progress-fill { height: 100%; background: linear-gradient(to right, var(--v-blue), #60a5fa); transition: width 1s; }
        
        .vox-interaction-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .vox-interaction-card { background: var(--v-card); border-radius: 2rem; padding: 2rem; border: 1px solid #222; }
        
        .vox-mic-btn { width: 70px; height: 70px; border-radius: 50%; background: #1e293b; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .vox-mic-btn.recording { background: var(--v-red); animation: pulse 1s infinite; }

        .v-device { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #000; border-radius: 1rem; border: 1px solid #222; cursor: pointer; margin-bottom: 0.5rem; }
        .v-device.active { border-color: var(--v-blue); }
        .v-dev-info p { margin: 0; font-size: 0.8rem; font-weight: 800; }
        .v-dev-info span { font-size: 0.6rem; color: var(--v-dim); }

        .v-log-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #000; border-radius: 0.75rem; font-size: 0.8rem; margin-bottom: 0.5rem; }

        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes bounceIn { 
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        .vox-accent-blue { color: var(--v-blue); }
        .vox-accent-green { color: var(--v-green); }
      ` }} />
    </div>
  );
};

export default VoxApp;
