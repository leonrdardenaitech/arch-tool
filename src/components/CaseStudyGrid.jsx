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
    problem: 'Local hospitality environments often suffer from negative feedback loops and operational bottlenecks, but lack the technical infrastructure to analyze their own data.',
    architecture: 'Applying Google AI Data Analysis modules, I mapped the strategic blueprint to scrape local venue scores and reviews to target low-performing restaurants for "Darden Grade" automated AI interventions.',
    impact: 'Visualized data flow across multiple mobile form-factors, bridging the gap between raw web scraping and a polished, client-facing dashboard.',
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
    problem: 'Developing a cohesive brand ecosystem traditionally requires disjointed workflows across separate teams, resulting in brand drift and production latency.',
    architecture: 'I engineered a centralized, multi-modal prompt routing system. This architecture acts as a Master Controller, programmatically routing sub-prompts to specialized models for simultaneous code and video generation.',
    impact: 'Established a single source of truth at the prompt level, guaranteeing absolute brand consistency while reducing production friction to zero.',
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
    problem: 'Standard application development often suffers from feature creep and fragmented codebases due to a lack of unified wireframing protocols.',
    architecture: 'Translating Google AI App Building modules into a production environment, I engineered the "Darden Grade" protocol. This mandates strict wireframing and token-efficient logic before production code is written.',
    impact: 'Drastically reduces time-to-deployment while ensuring operational integrity. Allows for rapid scaling of lightweight, high-functionality utility tools sharing a unified DNA.',
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
    problem: 'Developing cohesive, multi-media IP traditionally requires disjointed departments and massive budgets. Scaling creative universes rapidly is impossible under standard studio constraints.',
    architecture: 'Utilized multi-modal AI ecosystems to achieve "God Mode" pipeline efficiency for "The Burning Antennas." Orchestrated a synchronized AI workflow to generate vocals, instrumentation, and animations.',
    impact: 'Completely bypassed traditional studio bottlenecks, compressing months of effort into hours. Proves AI as a complete, autonomous production studio.',
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
    problem: 'Standard AI integrations rely on passive "chatbot" interfaces that require constant human prompting. B2B operations require autonomous digital workforces.',
    architecture: 'Designed Agentic Workflows under the "Darden Trust Infrastructure." Utilizing Snapback and Nexus concepts, these systems move beyond basic prompting into autonomous reasoning loops.',
    impact: 'Transforms AI from a software tool into an independent operator. Guarantees predictable, token-efficient execution for complex, multi-step business operations.',
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
    problem: 'Enterprise architecture reliant on a single provider creates brittle systems that become obsolete the moment a competitor releases a more efficient model.',
    architecture: 'Operate a continuous internal R&D pipeline utilizing orchestration frameworks to route workflows across a diverse matrix of frontier models (GPT-4, Claude, Gemini, Qwen).',
    impact: 'Guarantees absolute adaptability and future-proof deployment. Ensures client workflows are always powered by the most efficient, cost-effective models.',
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
    problem: 'Standard application development targets the "average" user, resulting in bloated interfaces that fail under extreme constraints like limited mobility.',
    architecture: 'Utilize everyday human pain points as the proving ground for enterprise architecture. Engineering targeted micro-utilities like WaVio forces systems to operate under the strictest constraints.',
    impact: 'Solving for extreme edge cases produces the most resilient user interfaces possible, which then effortlessly scale to high-volume B2B enterprise workflows.',
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
    problem: 'Enterprise B2B environments are hesitant to deploy autonomous AI due to risks including prompt injection, unauthorized access, and proprietary data leakage.',
    architecture: 'Built on a Zero-Trust security model. I engineer isolated cloud sandboxes utilizing Firebase Auth and secure proxies to gate agentic workflows.',
    impact: 'Ensures AI implementations enhance efficiency without compromising integrity. Provides clients with assurance that proprietary workflows remain localized and secured.',
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
