import React, { useState } from 'react';
import IdentityCard from './components/IdentityCard';
import CaseStudyGrid from './components/CaseStudyGrid';
import ProjectOverlay from './components/ProjectOverlay';
import ResumeSection from './components/ResumeSection';
import ResumePanel from './components/ResumePanel';
import './index.css';

function App() {
  const [selectedNode, setSelectedNode] = useState(null);

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
    </div>
  );
}

export default App;
