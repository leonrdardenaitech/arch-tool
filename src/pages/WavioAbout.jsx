import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWavio } from '../context/WavioContext';
import { ChevronLeft, Github, Linkedin, Mail, ShieldCheck, Cpu, Code, Zap, Database, Terminal } from 'lucide-react';

const WavioAbout = () => {
  const navigate = useNavigate();
  const { globalTheme } = useWavio();
  const isVideo = globalTheme.endsWith('.mp4');

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans overflow-x-hidden relative">
      
      {/* --- CONTINUOUS BACKGROUND --- */}
      <div className="fixed inset-0 z-0">
        {globalTheme !== 'blank' && (
          isVideo ? (
            <video 
              autoPlay loop muted playsinline
              className="w-full h-full object-cover opacity-20"
              src={`/WavioWorld/video/${globalTheme}`} 
            />
          ) : (
            <img 
              src={`/WavioWorld/images/${globalTheme}`} 
              className="w-full h-full object-cover opacity-20" 
              alt="Background" 
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000814] via-transparent to-[#000814]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-24 space-y-24">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-all group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Close Dossier
        </button>

        {/* Hero Section */}
        <header className="space-y-6">
          <div className="glass-pill w-fit border-cyan-500/30">Architect_Dossier_v2.1</div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
            Leon R. <span className="text-cyan-500">Darden</span>
          </h1>
          <p className="text-sm font-mono text-cyan-700 uppercase tracking-[0.4em] font-bold">AI Solutions Architect // Systems Integration Expert</p>
        </header>

        {/* Deep Dive Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <section className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 flex items-center gap-2">
                <Terminal size={12} /> Professional_Identity
              </h3>
              <div className="text-[13px] leading-relaxed text-white/60 space-y-6 font-mono">
                <p>Strategic and results-driven AI Solutions Architect with over 15 years of experience in systems support, technical operations, and client-facing solutions. Expertise lies in bridging the gap between raw machine logic and human-centric design.</p>
                <p>Recently completed the comprehensive Google AI Professional suite, specializing in the integration of Large Language Models (LLMs) to solve enterprise challenges. My work focuses on high-fidelity RAG systems, autonomous agentic workflows, and secure AI infrastructure.</p>
                <p>Proven track record in optimizing complex workflows via SAP, automating multi-channel communications, and designing AI-native applications that prioritize accessibility and data integrity.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 flex items-center gap-2">
                <Cpu size={12} /> Technical_Stack_Core
              </h3>
              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-cyan-400/60">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><Cpu size={12} /> Gemini 1.5 Pro</div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><Code size={12} /> React / Node.js</div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><Zap size={12} /> Prompt Eng.</div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><ShieldCheck size={12} /> Trust Infra</div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><Database size={12} /> Vector RAG</div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5"><Activity size={12} /> telemetry API</div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2 flex items-center gap-2">
                <ShieldCheck size={12} /> The_Ruthless_Protocol
              </h3>
              <div className="text-[13px] leading-relaxed text-white/60 space-y-6 font-mono">
                <p>The objective is to secure high-leverage AI Solutions and Technical Operations roles within the Atlanta metropolitan corridor. My approach is rooted in "Engineering Empathy"—building tools that solve real problems for real people.</p>
                <p>By leveraging a background in complex customer solutions for major utilities and logistics firms, I architect systems that bypass automated friction and deliver immediate value to decision-makers.</p>
                <p>Digital Archaeology: I utilize depreciated data patterns and modern AI synthesis to identify organizational bottlenecks and pre-generate mitigation strategies before they are requested.</p>
              </div>
            </div>

            <div className="tech-tank-card p-8 bg-cyan-900/10 border-l-4 border-cyan-500 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-4">Meta_Brand_Logic</h3>
              <p className="text-[12px] font-mono text-white/40 leading-loose italic">
                The "?" represents the user's query; the "2" represents the transition to a solution. Every product in the ecosystem builds "Brand Equity" for the next. Trust in one node leads to trust in the entire network. WaVio is the sensory manifestation of this trust protocol.
              </p>
            </div>
          </section>

        </div>

        {/* Closing Visual Section */}
        <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-3xl">
           <video 
             autoPlay loop muted playsInline 
             className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
             src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"
           />
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
              <p className="text-[10px] font-black uppercase tracking-[1.5em] text-white/40 mb-2">Acoustic_Architecture_Node</p>
              <div className="w-32 h-[1px] bg-cyan-500/50"></div>
           </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-white/5 flex justify-between items-center opacity-40 pb-24">
          <p className="text-[9px] font-mono tracking-widest uppercase">ARCH-TOOL // SECTOR_ABOUT // SYNC_STATUS_OK</p>
          <div className="flex gap-8">
            <Github size={18} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            <Linkedin size={18} className="hover:text-cyan-400 cursor-pointer transition-colors" />
            <Mail size={18} className="hover:text-cyan-400 cursor-pointer transition-colors" />
          </div>
        </footer>

      </div>
    </div>
  );
};

export default WavioAbout;
