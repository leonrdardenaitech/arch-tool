import React, { useState } from 'react';
import './ProjectOverlay.css';
import { X, ExternalLink, Zap, Lock } from 'lucide-react';

const ProjectOverlay = ({ project, onClose }) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!project) return null;

  // --- SLIDE PRESENTATION VIEWER ---
  const renderSlideViewer = () => (
    <div className="slide-presentation-viewer">
      <div className="presentation-frame">
        <div className="slide-image-container">
          <img 
            src={project.slides[currentSlide].img} 
            alt={`Slide ${currentSlide + 1}`} 
            className="presentation-slide"
          />
          <div className="slide-overlay-text focus-text-stable">
            {project.slides[currentSlide].text}
          </div>
        </div>
        <div className="slide-controls">
          <button 
            className="slide-btn" 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
          >
            PREV
          </button>
          <div className="slide-indicator">
            {project.slides.map((_, i) => (
              <div key={i} className={`dot ${i === currentSlide ? 'active' : ''}`}></div>
            ))}
          </div>
          <button 
            className="slide-btn" 
            onClick={() => setCurrentSlide(prev => Math.min(project.slides.length - 1, prev + 1))}
            disabled={currentSlide === project.slides.length - 1}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );

  // --- NODE 02: Model Routing HUD ---
  const renderRoutingHUD = () => (
    <div className="custom-hud routing-hud">
      <div className="hud-label pink">MASTER_PROMPT_INJECT //</div>
      <div className="video-preview-zone">
        <iframe 
          src="https://www.youtube.com/embed/mqG0nnllQzU" 
          title="Jazz Series" 
          frameBorder="0" 
          allowFullScreen 
          className="hud-video"
        />
        <a href="https://www.youtube.com/watch?v=mqG0nnllQzU" target="_blank" rel="noreferrer" className="roster-link flavor-cyan mt-4 block text-center">
          [↗] INITIALIZE_JAZZ_SERIES_STREAM
        </a>
      </div>
      <div className="prompt-box mt-6">
        "Initiate Brand Builder protocol. Parameterize identity constraints. Route UI component logic to [Code_Model]. Route aesthetic environmental renders to [Video_Model]."
      </div>
      <div className="hud-grid-2">
        <div className="hud-subnode">
          <div className="hud-subnode-title cyan">NODE: APP INFRASTRUCTURE</div>
          <div className="hud-subnode-data">Target: Code_Gen / Output: React UI</div>
        </div>
        <div className="hud-subnode">
          <div className="hud-subnode-title red">NODE: VIDEO ASSETS</div>
          <div className="hud-subnode-data">Target: Veo / Output: High-Fid MP4</div>
        </div>
      </div>
    </div>
  );

  // --- NODE 03: Deployment Roster (FLAVOR LINKS) ---
  const renderDeploymentRoster = () => (
    <div className="custom-hud deployment-roster">
      <div className="hud-label green">ACTIVE_SYSTEM_DIRECTORY //</div>
      <ul className="roster-list">
        <li>
          <a href="https://leonrdarden.com/vox.html" target="_blank" rel="noreferrer" className="roster-link flavor-cyan">[↗] Hydro-Scan</a>
          <span className="roster-desc">Automated hydration tracking and biometric telemetry.</span>
        </li>
        <li>
          <a href="https://leonrdarden.com/wavesync.html" target="_blank" rel="noreferrer" className="roster-link flavor-fuchsia">[↗] WaveSync</a>
          <span className="roster-desc">Advanced touchless media navigation for limited mobility.</span>
        </li>
        <li>
          <a href="https://leonrdarden.com/slime-nexus/" target="_blank" rel="noreferrer" className="roster-link flavor-yellow">[↗] Slime Nexus</a>
          <span className="roster-desc">Recursive reasoning and logic caching interface.</span>
        </li>
        <li>
          <a href="https://leonrdarden.com/brand-builder.html" target="_blank" rel="noreferrer" className="roster-link flavor-emerald">[↗] Brand Builder</a>
          <span className="roster-desc">Centralized multi-modal prompt orchestration engine.</span>
        </li>
      </ul>
    </div>
  );

  // --- NODE 04: Studio Monitor HUD ---
  const renderStudioMonitorHUD = () => (
    <div className="custom-hud studio-monitor">
      <div className="hud-label red">LIVE_STUDIO_FEED //</div>
      <a href="https://www.youtube.com/playlist?list=PLUC4Kgi3P6eOu3KlYD5GFkejRWecbv3iK" target="_blank" rel="noreferrer" className="studio-visual-link">
        <div className="concept-visual-container">
          <video src="/assets/video/dreamgirl44.mp4" autoPlay loop muted playsInline className="visual-media" />
          <div className="visual-status-bar">LAUNCH_STUDIO_PLAYLIST_PAYLOAD</div>
        </div>
      </a>
      <div className="hud-grid-3">
        <div className="hud-subnode flavor-red">AUDIO / LYRICS</div>
        <div className="hud-subnode flavor-cyan">VISUAL ENGINE</div>
        <div className="hud-subnode flavor-fuchsia">BRANDING</div>
      </div>
    </div>
  );

  // --- NODE 05: Agent Loop HUD ---
  const renderAgentLoopHUD = () => (
    <div className="custom-hud agent-hud">
      <div className="hud-label yellow">AUTONOMOUS AGENT TELEMETRY // <span className="blink-dot">● ACTIVE</span></div>
      <div className="agent-loop-stack">
        <div className="loop-step">[01] TRIGGER: B2B Audit Request from Nexus.</div>
        <div className="loop-step highlight-yellow">[02] REASONING: Executing Chain-of-Thought loop.</div>
        <div className="loop-step highlight-cyan">[03] TOOL: Invoking Firebase_Firestore_Read.</div>
        <div className="loop-step highlight-green">[04] ACTION: Finalizing encrypted audit report.</div>
      </div>
    </div>
  );

  // --- NODE 06: R&D Matrix ---
  const renderRDMatrix = () => (
    <div className="custom-hud rd-hud">
      <div className="hud-label silver">R&D LAB: ECOSYSTEM API INTEGRATION //</div>
      <div className="orchestrator-bar">LANGCHAIN ORCHESTRATION PROTOCOL</div>
      <div className="hud-grid-2">
        <div className="hud-subnode openai">OPENAI / GPT</div>
        <div className="hud-subnode anthropic">ANTHROPIC / CLAUDE</div>
        <div className="hud-subnode google">GOOGLE / GEMINI</div>
        <div className="hud-subnode misc">QWEN / GROK / OSS</div>
      </div>
    </div>
  );

  // --- NODE 07: Scalability Matrix ---
  const renderScalabilityHUD = () => (
    <div className="custom-hud scaling-hud">
      <div className="hud-label blue">CONSTRAINT RESOLUTION & SCALING MATRIX //</div>
      <div className="scaling-stack">
        <div className="scaling-row">WaVio ⟶ Zero-Touch Kiosk</div>
        <div className="scaling-row">Watz 4 Dinner ⟶ Supply Chain Routing</div>
        <div className="scaling-row">Hydro-Scan ⟶ Fleet Health Dashboards</div>
      </div>
    </div>
  );

  // --- NODE 08: Security Matrix (Easter Egg) ---
  const handleUnlock = (e) => {
    e.preventDefault();
    const attempt = passcode.toLowerCase().trim();
    if (attempt === 'hire leon' || attempt === 'code: hire leon') {
      setIsUnlocked(true);
    } else {
      setPasscode('ACCESS DENIED');
      setTimeout(() => setPasscode(''), 1000);
    }
  };

  const renderSecurityHUD = () => (
    <div className="custom-hud security-hud" style={{ border: `1px solid ${isUnlocked ? '#00FF87' : '#FF3D00'}` }}>
      {!isUnlocked ? (
        <div className="locked-state">
          <Lock size={40} color="#FF3D00" />
          <p>NODE ENCRYPTED. REQUIRES LEVEL-4 KEY.</p>
          <form onSubmit={handleUnlock}>
            <input type="text" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="ENTER KEY" />
          </form>
        </div>
      ) : (
        <div className="unlocked-state">
          <div className="unlocked-header">WELCOME, RECRUITER. PAYLOAD DECRYPTED.</div>
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded">
            <p className="text-emerald-400 font-mono text-sm mb-2">ACCESS_GRANTED: SESSION_ACTIVE</p>
            <a 
              href="/Leon-Darden-Resume-Standalone.html" 
              target="_blank" 
              rel="noreferrer" 
              className="roster-link flavor-emerald block text-center py-2 border border-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors"
            >
              [↗] LAUNCH_STANDALONE_RESUME
            </a>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono text-center">
              Click launch to download PDF version of my resume.
            </p>
          </div>
          {project.hasPresentation && (
            <div className="mt-6 p-4 bg-black/40 border border-emerald-500/30 rounded">
              <p className="text-xs text-emerald-400 font-mono mb-2">Architectural Payload Detected:</p>
              <button className="slide-btn" onClick={() => { 
                project.slides = [
                  { text: "Phase 1 / Output Monitoring: Continuous analysis of LLM generations for security validation.", img: "seqscan1.png" },
                  { text: "Phase 2 / Bias Detection: Identifying and neutralizing unintended patterns in real-time.", img: "seqscan2.png" },
                  { text: "Phase 3 / Security Lock: Automated escalation triggered by high-risk handshake patterns.", img: "seqscan3.png" }
                ]; 
                setCurrentSlide(0); 
                document.querySelector('.presentation-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }}>INITIALIZE_ARCHITECTURAL_PRESENTATION</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="overlay-backdrop">
      <div className="overlay-content">
        <button className="close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="overlay-header">
          <div className="id-badge" style={{ color: project.glow, borderColor: project.glow }}>NODE_{project.id.toString().padStart(2, '0')}</div>
          <h2 className="project-title">{project.title}</h2>
          <span className="project-type">{project.type} // {project.tech}</span>
        </div>

        <div className="overlay-body">
          {/* 1. VISUAL PREVIEW (TOP) */}
          {project.customComponent === 'routing-hud' && renderRoutingHUD()}
          {project.customComponent === 'deployment-roster' && renderDeploymentRoster()}
          {project.customComponent === 'studio-monitor' && renderStudioMonitorHUD()}
          {project.customComponent === 'agent-loop' && renderAgentLoopHUD()}
          {project.customComponent === 'rd-matrix' && renderRDMatrix()}
          {project.customComponent === 'scalability-matrix' && renderScalabilityHUD()}
          {project.customComponent === 'security-matrix' && renderSecurityHUD()}
          
          {!project.customComponent && project.visual && (
            <div className="concept-visual-container">
              {project.visual.endsWith('.mp4') ? (
                <video src={project.visual} autoPlay loop muted playsInline className="visual-media" />
              ) : (
                <img src={project.visual} alt={project.title} className="visual-media" />
              )}
              <div className="visual-status-bar">STATUS: ACTIVE INFRASTRUCTURE</div>
            </div>
          )}

          {/* 2. THE STORY (PROBLEM / ARCHITECTURE / IMPACT) */}
          <div className="technical-blueprint">
            <div className="blueprint-section">
              <h4>[ THE_PROBLEM ]</h4>
              <p className="focus-text rich-narrative">{project.problem}</p>
            </div>
            <div className="blueprint-section">
              <h4>[ ARCHITECTURE ]</h4>
              <p className="focus-text rich-narrative">{project.architecture}</p>
            </div>
            <div className="blueprint-section">
              <h4>[ IMPACT ]</h4>
              <p className="focus-text rich-narrative">{project.impact}</p>
            </div>
          </div>

          <div className="metrics-section">
            <h4>[ SYSTEM_METRICS ]</h4>
            <div className="metrics-grid">
              {project.metrics?.map((metric, i) => (
                <div key={i} className="metric-tag"><Zap size={12} className="zap-icon" />{metric}</div>
              ))}
            </div>
          </div>

          {/* 3. LAUNCH ACTION */}
          <div className="action-anchor">
            <a 
              href={project.link === '#presentation' ? '#slides' : project.link} 
              target={project.link === '#presentation' ? '_self' : '_blank'} 
              rel="noreferrer" 
              className="launch-btn" 
              id={project.id === 10 ? 'node-10-btn' : undefined}
              data-target={project.link}
              style={{ background: `linear-gradient(90deg, ${project.glow}, #000)` }}
              onClick={(e) => {
                if (project.id === 10) {
                  e.preventDefault();
                  const code = prompt("ENTER ACCESS CODE TO INITIALIZE NODE_10:");
                  if (code === "Hire Leon") {
                    window.open(project.link, '_blank');
                  } else {
                    alert("ACCESS DENIED: INVALID CREDENTIALS");
                  }
                  return;
                }
                if (project.link === '#presentation') {
                  e.preventDefault();
                  document.querySelector('.presentation-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {project.link === '#presentation' ? 'VIEW ARCHITECTURAL PRESENTATION' : 'LAUNCH_DEPLOYMENT'} 
              <ExternalLink size={16} />
            </a>
          </div>

          {/* 4. DEEP DIVE (SLIDES AT THE VERY BOTTOM) */}
          {project.slides && (
            <div className="presentation-anchor" id="slides">
              <h4 className="presentation-label">[ ARCHITECTURAL_PAYLOAD_DEEP_DIVE ]</h4>
              {renderSlideViewer()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverlay;
