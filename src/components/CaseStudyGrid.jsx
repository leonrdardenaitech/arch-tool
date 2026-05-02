import React from 'react';
import './CaseStudyGrid.css';

const projects = [
  { 
    id: 1, 
    category: 'project',
    title: 'AI DATA INTEGRATION', 
    type: 'B2B DATA PIPELINE', 
    tech: 'WATZ-V2',
    glow: '#FF8C00', 
    visual: '/assets/video/node01image.gif', 
    problem: 'Hospitality environments lack the infrastructure to analyze fragmented operational data.',
    architecture: 'Scraping and analyzing local venue reviews to trigger automated AI performance interventions.',
    impact: 'Bridges the gap between raw web data and actionable B2B dashboard visualization.',
    metrics: ['Data Analysis', 'Sentiment Scraper', 'B2B Strategy'],
    link: 'https://leonrdarden.com/what2eat/'
  },
  { 
    id: 2, 
    category: 'project',
    title: 'BRAND ORCHESTRATION', 
    type: 'MULTI-MODAL PROMPTING', 
    tech: 'GOOGLE PROMPT MASTERY',
    glow: '#D500F9', 
    visual: 'https://www.youtube.com/embed/mqG0nnllQzU', 
    customComponent: 'routing-hud',
    problem: 'Disjointed creative workflows lead to brand drift and production latency.',
    architecture: 'Centralized prompt routing system that orchestrates simultaneous code and video generation.',
    impact: 'Ensures absolute brand consistency while eliminating production friction.',
    metrics: ['Prompt Engineering', 'Model Routing', 'Multi-Modal Ops'],
    link: '/brand-builder.html'
  },
  { 
    id: 3, 
    category: 'project',
    title: 'DEPLOYMENT PROTOCOL', 
    type: 'UTILITY ECOSYSTEM', 
    tech: 'MULTIPLE APP NODES',
    glow: '#00FF87', 
    visual: '/assets/images/wavio_preview.png', 
    customComponent: 'deployment-roster',
    problem: 'Application development often suffers from feature creep and fragmented wireframing.',
    architecture: 'Standardized "Darden Grade" protocol mandating token-efficient logic before production.',
    impact: 'Accelerates deployment while maintaining strict operational integrity across utility tools.',
    metrics: ['Hydro-Scan', 'WaveSync', 'Slime Nexus'],
    link: '#presentation',
    slides: [
      { text: "Phase 1 / Initialization: Mapping real-time personnel availability.", img: "weekly1.jpg" },
      { text: "Phase 2 / Conflict Scan: Scanning overlapping PTO requests.", img: "weekly2.jpg" },
      { text: "Phase 3 / Optimization: Dynamically redistributing resources.", img: "weekly3.jpg" },
      { text: "Phase 4 / Matrix Finalization: Mathematically optimized monthly schedule.", img: "weekly4.jpg" }
    ]
  },
  { 
    id: 4, 
    category: 'project',
    title: 'CREATIVE STRATEGIST', 
    type: 'STUDIO AUTOMATION', 
    tech: 'MULTI-MODAL AI',
    glow: '#FF3D00', 
    visual: '/assets/video/dreamgirl44.mp4', 
    customComponent: 'studio-monitor',
    problem: 'Multi-media production traditionally requires massive budgets and extensive timelines.',
    architecture: 'Synchronized AI workflow orchestrating vocals, instrumentation, and animation in parallel.',
    impact: 'Bypasses studio bottlenecks, compressing months of production into hours.',
    metrics: ['Audio Synth', 'AI Animation', 'Creative Strategy'],
    link: 'https://www.youtube.com/playlist?list=PLUC4Kgi3P6eOu3KlYD5GFkejRWecbv3iK'
  },
  { 
    id: 5, 
    category: 'project',
    title: 'AGENTIC WORKFLOWS', 
    type: 'AUTONOMOUS AGENTS', 
    tech: 'AGENTIC B2B UTILITY',
    glow: '#FFD600', 
    customComponent: 'agent-loop',
    problem: 'Passive chatbot interfaces require constant human prompting for complex tasks.',
    architecture: 'Autonomous reasoning loops that integrate directly with B2B utility infrastructure.',
    impact: 'Transforms AI into an independent operator capable of multi-step business execution.',
    metrics: ['Chain-of-Thought', 'Autonomous Loops', 'Token Efficiency'],
    link: 'https://leonrdardenaitech.github.io/leons-ai-solutions/'
  },
  { 
    id: 6, 
    category: 'project',
    title: 'R&D INFRASTRUCTURE', 
    type: 'MODEL-AGNOSTIC OPS', 
    tech: 'ECOSYSTEM INTEGRATION',
    glow: '#B0BEC5', 
    visual: '3d-brain.jpg',
    customComponent: 'rd-matrix',
    problem: 'Reliance on single-provider AI creates brittle systems prone to obsolescence.',
    architecture: 'Continuous R&D pipeline routing workflows across a matrix of frontier models.',
    impact: 'Guarantees future-proof adaptability and cost-effective model utilization.',
    metrics: ['API Integration', 'LangChain', 'Model Benchmarking'],
    link: '#',
    slides: [
      { text: "Node 1 / Neural Core: Logic-aware embeddings transform raw data into architectural insights.", img: "3d-brain.jpg" },
      { text: "Node 2 / Vector Vault: Secure RAG indexing with sub-millisecond retrieval latency.", img: "3d cloud.png" },
      { text: "Node 3 / Synthesis: Recombining verified sub-tasks into comprehensive B2B solutions.", img: "glowing crystal.png" }
    ]
  },
  { 
    id: 7, 
    category: 'project',
    title: 'SCALABLE EMPATHY', 
    type: 'UX SCALING', 
    tech: 'ASSISTIVE TECH R&D',
    glow: '#00BFFF', 
    visual: '/WavioWorld/images/myweb.png', 
    problem: 'Interfaces designed for "average" users fail under extreme mobility constraints.',
    architecture: 'Engineering targeted micro-utilities to force high performance under strict UX limits.',
    impact: 'Resilient interfaces that effortlessly scale from assistive tools to enterprise workflows.',
    metrics: ['Accessibility', 'UX Stress Testing', 'Modular Scaling'],
    link: 'https://leonrdarden.com/wavio'
  },
  { 
    id: 8, 
    category: 'project',
    title: 'CLOUD & SECURITY', 
    type: 'ZERO-TRUST ARCH', 
    tech: 'FIREBASE + MCP',
    glow: '#FF3D00', 
    customComponent: 'security-matrix',
    problem: 'Enterprise environments face risks of prompt injection and proprietary data leakage.',
    architecture: 'Zero-Trust security model using isolated cloud sandboxes and secure proxies.',
    impact: 'Enables high-efficiency AI deployment while guaranteeing data integrity and security.',
    metrics: ['Zero-Trust', 'IAM Security', 'MCP Integration'],
    link: '#',
    slides: [
      { text: "Phase 1 / Output Monitoring: Continuous analysis of LLM generations for security validation.", img: "seqscan1.png" },
      { text: "Phase 2 / Bias Detection: Identifying and neutralizing unintended patterns in real-time.", img: "seqscan2.png" },
      { text: "Phase 3 / Security Lock: Automated escalation triggered by high-risk handshake patterns.", img: "seqscan3.png" }
    ]
  }
];

const CaseStudyGrid = ({ onSelectProject }) => {
  return (
    <div className="case-study-grid">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="cd-case" 
          onClick={() => onSelectProject(project)}
          style={{ '--node-glow': project.glow }}
        >
          <div className="cd-disc">
            <div className="cd-center"></div>
            <div className="cd-label">
              <span className="cd-id">NODE_{project.id.toString().padStart(2, '0')}</span>
            </div>
            <div className="cd-holo-overlay"></div>
          </div>
          <div className="cd-info">
            <h3 className="cd-title">{project.title}</h3>
            <div className="cd-meta">
              <span className="cd-type" style={{ color: project.glow }}>{project.type}</span>
              <span className="cd-tech">{project.tech}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaseStudyGrid;
