import React, { useState, useEffect, useRef } from 'react';
import { Mic, Waves, Activity, Circle, Bluetooth, ShieldAlert, Info, PlayCircle, X, CheckCircle2, ChevronRight, Speaker } from 'lucide-react';

const VoxApp = () => {
  const [phase, setPhase] = useState('pitch'); // 'pitch', 'auth', 'app'
  const [isRecording, setIsRecording] = useState(false);
  const [hydration, setHydration] = useState(42);
  const [statusText, setStatusText] = useState('Standby: Ready for neural handshake.');
  const [logs, setLogs] = useState([
    { time: '08:15 AM', item: 'Morning Coffee', impact: -5 },
    { time: '09:30 AM', item: 'Electrolyte Water', impact: +12 }
  ]);
  const [syncStatus, setStatusSync] = useState({ ring: false, wristband: false, wearable: 'Disconnected' });
  const [voxMessage, setVoxMessage] = useState("Good morning, Partner. You've got pickleball at 10 AM. Let's get that hydration bar into the green zone before you hit the court.");

  // --- fRAG SIMULATION ENGINE ---
  const processVoiceInput = (text) => {
    setStatusText('fRAG Engine: Retrieving biometric context...');
    
    // Simulating Retrieval-Augmented Generation logic
    setTimeout(() => {
      let lowerText = text.toLowerCase();
      if (lowerText.includes('water')) {
        setHydration(prev => Math.min(100, prev + 15));
        setVoxMessage("Excellent choice. Pure hydration. I've logged 16oz and synchronized it with your prototype ring.");
        setLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), item: 'Water Bottle', impact: 15 }, ...logs]);
      } else if (lowerText.includes('coffee') || lowerText.includes('soda')) {
        setHydration(prev => Math.max(0, prev - 8));
        setVoxMessage("Careful now. That caffeine has a diuretic effect. I've adjusted your levels. Drink some water soon, partner.");
        setLogs([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), item: 'Caffeinated Drink', impact: -8 }, ...logs]);
      } else {
        setVoxMessage("I heard you, but I'm not sure how that affects your hydration. Can you tell me if it was water, juice, or something else?");
      }
      setStatusText('Standby: Ready for neural handshake.');
    }, 1500);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setStatusText('Vox is listening...');
      // Simulated voice recognition
      setTimeout(() => {
        setIsRecording(false);
        const inputs = ["I just drank a big bottle of water", "Had a cup of coffee before the match"];
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        processVoiceInput(randomInput);
      }, 3000);
    }
  };

  const startSync = (device) => {
    setStatusText(`Syncing ${device}...`);
    setTimeout(() => {
      setStatusSync(prev => ({ ...prev, [device]: true }));
      setStatusText(`${device} Online.`);
      if (device === 'ring') setHydration(68); // Syncing shows "true" level
    }, 2000);
  };

  return (
    <div className="vox-container">
      {/* PITCH OVERLAY */}
      {phase === 'pitch' && (
        <div className="vox-pitch-overlay">
          <div className="vox-pitch-card animate-scale-up">
            <div className="vox-pitch-header">
              <Waves size={48} className="vox-accent-blue" />
              <h1>HYDRO-SCAN // VOX</h1>
            </div>
            <div className="vox-pitch-body">
              <p className="vox-pitch-lead">"The giants overlooked us. We didn't."</p>
              <p>Apple and Garmin build for the masses. <strong>Vox</strong> builds for the masters of the court. A straightforward AI assistant that turns your voice into vital health data.</p>
              <div className="vox-feature-grid">
                <div className="v-feat"><Mic size={16} /><span>Voice-to-Hydration Analysis</span></div>
                <div className="v-feat"><Activity size={16} /><span>fRAG Neural Retrieval</span></div>
                <div className="v-feat"><Bluetooth size={16} /><span>Prototype Hardware Sync</span></div>
              </div>
            </div>
            <button className="vox-pitch-btn" onClick={() => setPhase('app')}>
              <PlayCircle size={24} />
              <span>Enter Vox Interface</span>
            </button>
          </div>
        </div>
      )}

      <main className="vox-main-content">
        {/* TOP STATUS BAR */}
        <header className="vox-header">
          <div className="vox-logo-area">
            <Waves className="vox-accent-blue" size={28} />
            <div>
              <h2>Hydro-Scan</h2>
              <p>AI AGENT: VOX v5.3</p>
            </div>
          </div>
          <div className="vox-system-status">
             <div className={`status-dot ${syncStatus.ring ? 'online' : ''}`}></div>
             <span>System: {syncStatus.ring ? 'CALIBRATED' : 'SATELLITE ONLY'}</span>
          </div>
        </header>

        {/* MAIN HYDRATION MONITOR */}
        <section className="vox-monitor-section">
          <div className="vox-hydration-card">
            <div className="v-label-group">
              <h3>Daily Hydration Status</h3>
              <span className={`v-percent ${hydration < 30 ? 'critical' : ''}`}>{hydration}%</span>
            </div>
            
            {/* WAVE ANIMATION BAR */}
            <div className="vox-progress-container">
              <div className="vox-progress-fill" style={{ width: `${hydration}%` }}>
                <div className="vox-wave"></div>
              </div>
            </div>

            <div className="vox-persona-msg">
              <Speaker size={20} className="vox-accent-green" />
              <p>"{voxMessage}"</p>
            </div>
          </div>
        </section>

        {/* INTERACTION AREA */}
        <section className="vox-interaction-grid">
          {/* VOICE LOGGING */}
          <div className="vox-interaction-card v-voice">
            <button className={`vox-mic-btn ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
              <Mic size={40} />
              <div className="mic-rings"></div>
            </button>
            <p className="v-hint">{statusText}</p>
            <span className="v-sub-hint">Press to log beverage (e.g. "I drank 16oz of water")</span>
          </div>

          {/* HARDWARE SYNC */}
          <div className="vox-interaction-card v-hardware">
            <h4>PROTOTYPE NODES</h4>
            <div className="v-device-list">
              <div className={`v-device ${syncStatus.ring ? 'active' : ''}`} onClick={() => startSync('ring')}>
                <Circle size={20} />
                <div className="v-dev-info">
                  <p>Silicon Ring</p>
                  <span>{syncStatus.ring ? 'SYNCED' : 'TAP TO CONNECT'}</span>
                </div>
                {syncStatus.ring && <CheckCircle2 size={16} className="v-online" />}
              </div>
              <div className={`v-device ${syncStatus.wristband ? 'active' : ''}`} onClick={() => startSync('wristband')}>
                <Activity size={20} />
                <div className="v-dev-info">
                  <p>Neural Wristband</p>
                  <span>{syncStatus.wristband ? 'SYNCED' : 'TAP TO CONNECT'}</span>
                </div>
                {syncStatus.wristband && <CheckCircle2 size={16} className="v-online" />}
              </div>
            </div>
          </div>
        </section>

        {/* LOGS & fRAG INTEL */}
        <section className="vox-intel-section">
          <div className="vox-intel-card">
            <div className="v-intel-header">
              <ShieldAlert size={18} />
              <h4>NEURAL LOGS // fRAG RETRIEVAL</h4>
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

        .vox-container {
          min-height: 100vh;
          background: var(--v-bg);
          color: var(--v-text);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* PITCH */
        .vox-pitch-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-blur: 10px; }
        .vox-pitch-card { background: var(--v-card); border: 1px solid #222; border-radius: 2rem; max-width: 600px; padding: 4rem; text-align: center; box-shadow: 0 0 100px rgba(59,130,246,0.2); }
        .vox-pitch-header h1 { font-size: 3rem; font-weight: 900; margin-top: 1rem; letter-spacing: -2px; }
        .vox-pitch-lead { font-size: 1.5rem; color: var(--v-green); font-weight: 700; font-style: italic; margin: 2rem 0 1rem; }
        .vox-feature-grid { display: grid; grid-template-cols: 1fr; gap: 1rem; margin: 2rem 0; text-align: left; background: rgba(0,0,0,0.3); padding: 2rem; border-radius: 1rem; }
        .v-feat { display: flex; align-items: center; gap: 1rem; color: var(--v-dim); font-weight: 600; }
        .vox-pitch-btn { width: 100%; background: var(--v-blue); color: #fff; border: none; padding: 1.5rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; transition: transform 0.2s; }
        .vox-pitch-btn:hover { transform: scale(1.05); background: #2563eb; }

        /* APP LAYOUT */
        .vox-main-content { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .vox-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .vox-logo-area { display: flex; align-items: center; gap: 1rem; }
        .vox-logo-area h2 { font-weight: 900; text-transform: uppercase; font-size: 1.25rem; line-height: 1; }
        .vox-logo-area p { font-size: 0.6rem; font-weight: 900; color: var(--v-dim); letter-spacing: 2px; }
        .vox-system-status { font-size: 0.7rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; color: var(--v-dim); }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--v-red); }
        .status-dot.online { background: var(--v-green); box-shadow: 0 0 10px var(--v-green); }

        /* MONITOR */
        .vox-hydration-card { background: var(--v-card); padding: 3rem; border-radius: 2rem; border: 1px solid #222; margin-bottom: 2rem; }
        .v-label-group { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
        .v-label-group h3 { font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--v-dim); font-size: 0.8rem; }
        .v-percent { font-size: 4rem; font-weight: 900; line-height: 1; }
        .v-percent.critical { color: var(--v-red); animation: pulse 1s infinite; }

        .vox-progress-container { height: 60px; background: #000; border-radius: 1rem; overflow: hidden; position: relative; border: 2px solid #222; }
        .vox-progress-fill { height: 100%; background: linear-gradient(to right, var(--v-blue), #60a5fa); transition: width 1s ease-in-out; position: relative; }
        .vox-wave { position: absolute; right: 0; top: 0; bottom: 0; width: 20px; background: rgba(255,255,255,0.2); filter: blur(10px); animation: wave 2s infinite linear; }

        .vox-persona-msg { margin-top: 2rem; display: flex; gap: 1rem; padding: 1.5rem; background: rgba(16,185,129,0.05); border-radius: 1rem; border-left: 4px solid var(--v-green); }
        .vox-persona-msg p { font-weight: 600; font-style: italic; color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; }

        /* INTERACTION */
        .vox-interaction-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .vox-interaction-card { background: var(--v-card); border-radius: 2rem; padding: 2rem; border: 1px solid #222; }
        
        .v-voice { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .vox-mic-btn { width: 100px; height: 100px; border-radius: 50%; background: #1e293b; border: none; color: #fff; cursor: pointer; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: all 0.3s; }
        .vox-mic-btn.recording { background: var(--v-red); transform: scale(1.1); }
        .mic-rings { position: absolute; inset: -10px; border: 2px solid var(--v-blue); border-radius: 50%; opacity: 0; }
        .recording .mic-rings { animation: ripple 1.5s infinite; opacity: 1; }

        .v-hint { font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; }
        .v-sub-hint { font-size: 0.6rem; color: var(--v-dim); text-transform: uppercase; font-weight: 900; }

        .v-hardware h4 { font-size: 0.7rem; font-weight: 900; color: var(--v-dim); margin-bottom: 1.5rem; letter-spacing: 2px; }
        .v-device-list { display: flex; flex-direction: column; gap: 1rem; }
        .v-device { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #000; border-radius: 1rem; border: 1px solid #222; cursor: pointer; transition: all 0.3s; }
        .v-device.active { border-color: var(--v-blue); background: rgba(59,130,246,0.05); }
        .v-dev-info p { font-weight: 800; font-size: 0.85rem; }
        .v-dev-info span { font-size: 0.6rem; font-weight: 900; color: var(--v-dim); }
        .v-online { color: var(--v-green); margin-left: auto; }

        /* INTEL */
        .vox-intel-card { background: var(--v-card); border-radius: 2rem; padding: 2rem; border: 1px solid #222; }
        .v-intel-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; color: var(--v-dim); }
        .v-intel-header h4 { font-size: 0.7rem; font-weight: 900; letter-spacing: 2px; }
        .v-log-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .v-log-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #000; border-radius: 0.75rem; font-size: 0.85rem; }
        .v-log-time { color: var(--v-dim); font-weight: 700; width: 80px; }
        .v-log-name { font-weight: 800; flex: 1; }
        .v-log-impact { font-weight: 900; }
        .v-log-impact.pos { color: var(--v-green); }
        .v-log-impact.neg { color: var(--v-red); }

        /* ANIMATIONS */
        @keyframes ripple { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes wave { 0% { transform: translateX(-100%); } 100% { transform: translateX(500%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        .vox-accent-blue { color: var(--v-blue); }
        .vox-accent-green { color: var(--v-green); }
      ` }} />
    </div>
  );
};

export default VoxApp;
