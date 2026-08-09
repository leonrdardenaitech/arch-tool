import React, { useState, useEffect } from 'react';
import IdentityCard from './components/IdentityCard';
import CaseStudyGrid from './components/CaseStudyGrid';
import ProjectOverlay from './components/ProjectOverlay';
import ResumeSection from './components/ResumeSection';
import ResumePanel from './components/ResumePanel';
import VideoEditorApp from './components/VideoEditor/VideoEditorApp';
import AtlasCoreV2App from './components/AtlasCoreV2/AtlasCoreV2App';
import './index.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#/nle') {
        setSelectedNode({ id: 13, category: 'nle', title: 'AI-NATIVE NLE (VIDEO EDITOR)' });
      } else if (hash === '#/architect') {
        setSelectedNode({ id: 12, category: 'project', title: 'ATLAS CORE: THE ENTERPRISE AGENTIC SCALABILITY' });
      } else if (hash === '#/dashboard') {
        // Dashboard is handled by command-center.html, but we can add a fallback here if needed
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectNode = (node) => {
    setSelectedNode(node);
  };

  const handleClose = () => {
    setSelectedNode(null);
  };

  return (
    <div className="portfolio-container">
      {/* Background Watermark */}
      <div className="global-watermark">ꟻB</div>
      
      {/* Main Content Area */}
      <main className="main-layout">
        <section className="sidebar-section">
          <IdentityCard selectedProject={selectedNode} />
        </section>
        
        <section className="content-section">
          <CaseStudyGrid onSelectProject={handleSelectNode} />
          <ResumeSection onSelectNode={handleSelectNode} />
        </section>
      </main>

      {/* MODULAR ROUTING: Render UI based on Node Category */}
      
      {/* 1. Projects Category */}
      {selectedNode?.category === 'project' && (
        <ProjectOverlay project={selectedNode} onClose={handleClose} />
      )}

      {/* 2. Resume Category (The new scrollable side panel) */}
      {selectedNode?.category === 'resume' && (
        <ResumePanel node={selectedNode} onClose={handleClose} />
      )}

      {/* 3. Certs Category (Placeholder for your "Special" treatment later) */}
      {selectedNode?.category === 'certs' && (
        <div className="certs-special-placeholder" onClick={handleClose}>
          <div className="special-inner">
             <h2 style={{color: '#FFF'}}>FUTURE_CERT_MODULE</h2>
             <p style={{color: '#00FF87'}}>ARCHITECTURE PENDING...</p>
             <p style={{color: '#555', fontSize: '0.7rem', marginTop: '20px'}}>Click anywhere to dismiss.</p>
          </div>
          <style>{`
            .certs-special-placeholder {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(0,0,0,0.9); z-index: 3000;
              display: flex; justify-content: center; align-items: center;
              backdrop-filter: blur(20px); cursor: pointer;
            }
            .special-inner { text-align: center; font-family: monospace; border: 1px solid #333; padding: 50px; border-radius: 20px;}
          `}</style>
        </div>
      )}
      {/* 4. AI-Native NLE (Video Editor) */}
      {selectedNode?.category === 'nle' && (
        <div className="video-editor-modal">
          <div className="modal-close-btn" onClick={handleClose}>×</div>
          <VideoEditorApp />
          <style>{`
            .video-editor-modal {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: #000; z-index: 5000;
            }
            .modal-close-btn {
              position: absolute; top: 10px; right: 20px; 
              color: #A855F7; font-size: 30px; cursor: pointer; z-index: 6000;
              font-family: sans-serif;
            }
          `}</style>
        </div>
      )}
      {/* 5. Atlas Core v2 (Sandboxed Agent) */}
      {selectedNode?.id === 12 && (
        <div className="atlas-v2-modal">
          <div className="modal-close-btn" onClick={handleClose}>×</div>
          <AtlasCoreV2App />
          <style>{`
            .atlas-v2-modal {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: #000; z-index: 5000;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default App;
