import React from 'react';
import './ResumeSection.css';
import { ShieldCheck, Briefcase, GraduationCap, ChevronRight, Terminal } from 'lucide-react';

const resumeData = [
  {
    id: 'thesis',
    category: 'resume',
    title: '[ SYSTEM_THESIS ]',
    icon: <ShieldCheck size={20} />,
    color: '#FDFFB6', 
    short: 'Bridging machine intelligence with human operational trust.',
    details: (
      <>
        <p className="narrative-summary focus-text">
          Transitioning a robust background in logistics and creative production into high-level systems architecture. 
          Driven by over <strong>2,000+ hours of dedicated AI research</strong>.
        </p>
        <div className="data-line"></div>
        <div className="technical-arsenal">
          <h5 className="focus-text">Technical Arsenal & Architectural Stack</h5>
          <p className="focus-text"><strong>AI & LLM Orchestration:</strong> Gemini CLI, Custom AI Agent Synthesis (Gems), and advanced prompt engineering to drive high-fidelity, deterministic outputs from generative models.</p>
          <p className="focus-text"><strong>Systems & Integration:</strong> Model Context Protocol (MCP) for secure tool execution, recursive logic gates, and autonomous multi-agent pipelines (e.g., Python-driven boardroom loops).</p>
          <p className="focus-text"><strong>Development & Workflow:</strong> Agentic IDEs for rapid, thread-based "vibe coding," Google Antigravity, and full-stack implementation.</p>
          <p className="focus-text"><strong>Infrastructure & Edge Computing:</strong> Designing decentralized, local AI nodes for low-latency, privacy-first processing outside of traditional cloud environments.</p>
        </div>
      </>
    )
  },
  {
    id: 'history',
    category: 'resume',
    title: '[ LOGISTICAL_LOGIC_HISTORY ]',
    icon: <Briefcase size={20} />,
    color: '#D500F9',
    short: 'Operational Optimization & System Stress Testing.',
    details: (
      <div className="experience-list">
        <div className="exp-node focus-text">
          <h5>Systems & Logistics Operations (2020 - 2025)</h5>
          <p>Managed high-volume delivery streams with 99%+ efficiency. This era served as the proving ground for recursive reasoning and real-time conflict resolution.</p>
          <p>Applied these principles to autonomous AI agent loops, ensuring high-fidelity delivery of digital assets with the same precision as physical logistics.</p>
        </div>
        <div className="exp-node focus-text">
          <h5>Creative Direction & Brand Architecture</h5>
          <p>Orchestrated multi-media IP and brand identities. Established the "Darden Grade" for visual integrity, bridging creative vision with technical execution.</p>
        </div>
      </div>
    )
  },
  {
    id: 'google-ai-spec', 
    category: 'project',
    title: '[ VERIFIED_CREDENTIALS ]',
    icon: <GraduationCap size={20} />,
    color: 'RAINBOW',
    short: 'Google AI Specialization & Prompting Essentials Mastery.',
    image: "ai-cert564.gif",
    link: '#presentation',
    problem: 'Proving architectural competence across the full generative AI lifecycle.',
    architecture: 'A recursive 7-course mastery track spanning multi-modal orchestration, agentic logic, and secure infrastructure.',
    impact: 'Established the "Darden Grade" for professional AI implementation. Certified mastery of the Google AI Professional ecosystem.',
    metrics: ['7-Course Specialization', 'Prompt Engineering Mastery', 'Agentic Deployment'],
    slides: [
      { 
        text: "FINAL BOSS / GOOGLE AI PROFESSIONAL: Verified mastery of the full AI development lifecycle, from prompt engineering to full-stack application deployment.", 
        img: "ai-cert564.gif" 
      },
      { 
        text: "NODE 1: AI FUNDAMENTALS & LOGIC - Mapping machine capabilities to complex B2B workflow solutions.", 
        img: "image_a73dac.jpg.jpeg" 
      },
      { 
        text: "NODE 2: RESEARCH & DATA SYNTHESIS - Extracting high-fidelity intelligence from unstructured data streams.", 
        img: "image_a74128.jpg.jpeg" 
      },
      { 
        text: "NODE 3: AGENTIC ARCHITECTURE - Deployed 20+ custom artifacts using agentic logic and recursive reasoning loops.", 
        img: "button3423.png" 
      },
      { 
        text: "NODE 4: SECURITY & GUARDRAILS - Implementation of Zero-Trust security models and logic-gate prompt engineering.", 
        img: "ai-cert564.gif" 
      }
    ],
    description: "Google AI Professional Certificate (Feb 23, 2026). Fluent in AI architecture and vibe-coded deployment."
  }
];

const ResumeSection = ({ onSelectNode }) => {
  return (
    <div className="resume-section">
      {resumeData.map((node) => (
        <div 
          key={node.id} 
          className={`resume-node node-${node.id} holowindow-container ${node.color === 'RAINBOW' ? 'rainbow-border' : ''}`}
          onClick={() => onSelectNode(node)}
        >
          <div className="node-inner">
            <div className="node-icon-wrapper" style={{ color: node.color !== 'RAINBOW' ? node.color : '' }}>
              {node.icon}
            </div>
            <div className="node-text">
              <h4 className="focus-text">{node.title}</h4>
              <p className="focus-text">{node.short}</p>
            </div>
            <div className="node-action">
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResumeSection;
