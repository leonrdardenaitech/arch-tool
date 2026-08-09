import React from 'react';
import './CaseStudyGrid.css';

const projects = [
  { 
    id: 1, 
    category: 'project',
    title: 'B2B AI BUSINESS AUDITS', 
    type: 'B2B DATA PIPELINE', 
    tech: 'SNAPBACK & CHRONOS',
    glow: '#FF8C00', 
    visual: '/assets/video/node01image.gif', 
    problem: 'Hospitality environments lack the infrastructure to analyze fragmented operational data.',
    architecture: 'Deployment of the Restaurant Intelligence Architect, including the SnapBack Agent (reputation management) and Chronos Architect (scheduling).',
    impact: 'Bridges the gap between raw web data and actionable B2B dashboard visualization.',
    metrics: ['Restaurant Intelligence', 'SnapBack Agent', 'Chronos Architect'],
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
    title: 'HYDRO-SCAN NODE', 
    type: 'UTILITY ECOSYSTEM', 
    tech: 'VOICE & NEURAL KEYBOARD',
    glow: '#00FF87', 
    visual: '/assets/images/wavio_preview.png', 
    customComponent: 'deployment-roster',
    problem: 'Application development often suffers from feature creep and fragmented wireframing.',
    architecture: 'Multimodal entry system using Voice and Neural Keyboard integrated with a HITL RAG system for personalized hydration tracking.',
    impact: 'Accelerates deployment while maintaining strict operational integrity across utility tools.',
    metrics: ['Multimodal Input', 'HITL RAG System', 'Neural Keyboard'],
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
    visual: '3d-brain88.jpg',
    customComponent: 'rd-matrix',
    problem: 'Reliance on single-provider AI creates brittle systems prone to obsolescence.',
    architecture: 'Continuous R&D pipeline routing workflows across a matrix of frontier models.',
    impact: 'Guarantees future-proof adaptability and cost-effective model utilization.',
    metrics: ['API Integration', 'LangChain', 'Model Benchmarking'],
    link: '#',
    slides: [
      { text: "Node 1 / Neural Core: Logic-aware embeddings transform raw data into architectural insights.", img: "3d-brain88.jpg" },
      { text: "Node 2 / Vector Vault: Secure RAG indexing with sub-millisecond retrieval latency.", img: "3d cloud88.png" },      
      { text: "Node 3 / Synthesis: Recombining verified sub-tasks into comprehensive B2B solutions.", img: "glowing crystal88.png" }
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
      { text: "Phase 1 / Output Monitoring: Continuous analysis of LLM generations for security validation.", img: "seqscan188.png" },
      { text: "Phase 2 / Bias Detection: Identifying and neutralizing unintended patterns in real-time.", img: "seqscan2.png" },
      { text: "Phase 3 / Security Lock: Automated escalation triggered by high-risk handshake patterns.", img: "seqscan3.png" }
    ]
  },
  { 
    id: 9, 
    category: 'project',
    title: 'CODE ORCHESTRATION', 
    type: 'AI AGENTIC HUB', 
    tech: 'GEMINI CLI + GENAI',
    glow: '#00E5FF', 
    visual: '/securtyClip88.mp4',
    customComponent: 'arch-tool-node',
    problem: 'Previous AI workflows relied on deprecated SDKs and manual terminal execution, creating operational friction and interrupting continuous development pipelines.',
    architecture: 'Upgraded the background Python service to the modern google-genai SDK and engineered an "Auto-Bridge" clipboard watcher that detects ###DRAFT### tags. Deployed the Gemini CLI for codebase orchestration across Vite-based React frontends and Capacitor mobile directories.',
    impact: 'Achieved zero-latency AI integration by running the assistant as a persistent system tray application, powering seamless Human-in-the-Loop (HITL) workflows without manual hotkey or terminal intervention.',
    metrics: ['Gemini CLI', 'Auto-Bridge', 'SDK Migration'],
    link: 'https://github.com/leonrdardenaitech/arch-tool'
  },
  { 
    id: 10, 
    category: 'project',
    title: 'LOCAL AI COPILOT', 
    type: 'PRIVACY-FIRST AUTOMATION', 
    tech: 'QWEN 2.5 + OLLAMA + EXTENSION',
    glow: '#7C4DFF', 
    problem: 'Aggressive ATS bot-protection and privacy risks from exposing sensitive personal data like phone numbers and work history to cloud-based APIs.',
    architecture: 'Multi-agent system using a custom Manifest V3 Browser Extension and a local LLM running via Ollama to bypass browser sandboxing safely. This node operates as a decentralized intelligence layer, routing sensitive data away from cloud scrutiny.',
    impact: 'Bypasses ATS detection with zero token costs while keeping all routing and sensitive user data behind the personal firewall. Transforms the browser into an agentic workstation.',
    metrics: ['Local LLM', 'Browser Extension', 'Privacy-First Ops'],
    link: 'https://github.com/leonrdardenaitech/gemma4-extension'
    },
  {
    id: 11,
    title: "ENTERPRISE TPM + SOLUTIONS ARCHITECT",
    category: "project",
    visual: "/4in1overlay88.png",
    glow: "#00E5FF",
    metrics: ["Notion + Jira", "Zapier MCP", "Gemma 4"],
    problem: "Need for verifiable, real-world enterprise deployments.",
    architecture: "Orchestrated enterprise-grade pipelines via Zapier MCP to optimize e-commerce fulfillment. Revitalized legacy Watz 4 Dinner infrastructure into a high-scale B2B routing engine.",
    impact: "Real-world, verifiable deployment of multi-agent systems. Bypasses traditional middleware bottlenecks.",
    link: "/watz-v2.html"
  },
  {
    id: 12,
    title: "ATLAS CORE: THE ENTERPRISE AGENTIC SCALABILITY",
    category: "project",
    visual: "/BurningOne/image/Atlaslogolayingdown.png",
    glow: "#FFD700",
    metrics: ["CODE ORCHESTRATION", "AI AGENTIC HUB", "GEMINI CLI + GENAI"],
    problem: "Bypassing $250/mo enterprise AI constraints.",
    architecture: "Built on the Forge Foundation. A Mega-Brain Neural Specialist acting as Chief of Operations.",
    impact: "Operates as a Thanos-level Heavy Hitter, saving companies a fortune in operational overhead.",
    link: "https://github.com/leonrdardenaitech/atlas-core"
  },
  {
    id: 13,
    title: "AI-NATIVE NLE (VIDEO EDITOR)",
    category: "nle",
    type: "REAL-TIME VIDEO PRODUCTION",
    tech: "FFMPEG + FABRIC.JS",
    glow: "#A855F7",
    visual: "/assets/video/leon_awake_loop.mp4",
    problem: "Traditional video editing is linear and computationally expensive.",
    architecture: "Browser-based NLE using FFmpeg.wasm for client-side processing and Fabric.js for object-oriented layer management.",
    impact: "Enables instant, automated video assembly and creative iteration without studio overhead.",
    metrics: ["FFmpeg.wasm", "Fabric.js", "State Ledger"],
    link: "#"
  },
  {
    id: 14,
    title: "BURN-1: DIMENSIONAL HUNGER",
    category: "project",
    visual: "/assets/video/dreamgirl44.mp4",
    glow: "#FF4500",
    metrics: ["AI ANIMATION", "LORE", "CINEMATIC"],
    problem: "Maintaining visual consistency in long-form AI animation.",
    architecture: "31-shot cinematic pipeline using the 'Archetype Bypass' strategy to maintain character traits across generative variations.",
    impact: "Production of high-fidelity narrative lore with zero API cost via local rendering and automated assembly.",
    link: "/fried-brains.html"
  },
  {
    id: 15,
    title: "EXECUTIVE COMMAND CENTER",
    category: "project",
    visual: "googlcertbutton88.png",
    glow: "#00FF87",
    metrics: ["PYTHON + MCP", "PIPER TTS", "GEO-AWARE"],
    problem: "Managing cross-platform professional identity and local toolsets in a unified environment.",
    architecture: "Centralized Python MCP gateway with real-time city-aware briefing, voice synthesis (Piper), and automated asset synchronization.",
    impact: "100% professional data consistency and real-time operational readiness for high-stakes B2B audits.",
    link: "/command-center.html"
  }
];
const CaseStudyGrid = ({ onSelectProject }) => {
  return (
    <div className="case-study-grid">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className={`cd-case node-${project.id}`} 
          onClick={() => onSelectProject(project)}
          style={{ '--node-glow': project.glow }}
        >
          <div className="cd-disc">
            {project.id === 12 ? (
              <img src="/BurningOne/image/node12_icon.png" alt="Atlas Core" className="w-full h-full object-contain" />
            ) : project.id === 11 ? (
              <img src="/BurningOne/image/node11_icon.png" alt="Enterprise TPM" className="w-full h-full object-contain" />
            ) : (
              <>
                <div className="cd-center"></div>
                <div className="cd-label">
                  <span className="cd-id">NODE_{project.id.toString().padStart(2, '0')}</span>
                </div>
              </>
            )}
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
