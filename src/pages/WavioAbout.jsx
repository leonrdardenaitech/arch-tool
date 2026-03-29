import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Github, Linkedin, Mail, ShieldCheck, Cpu, Code, Zap } from 'lucide-react';

const WavioAbout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000814] text-white font-sans overflow-x-hidden">
      
      {/* Background Distraction */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/WavioWorld/images/aquarium screensaver GIF.gif" 
          className="w-full h-full object-cover opacity-20" 
          alt="Distraction" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000814] via-transparent to-[#000814]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-24 space-y-24">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white transition-all"
        >
          <ChevronLeft size={16} /> Close Dossier
        </button>

        {/* Hero Section */}
        <header className="space-y-6">
          <div className="glass-pill w-fit">Architect_Dossier_v2.0</div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            Leon R. <span className="text-cyan-500">Darden</span>
          </h1>
          <p className="text-sm font-mono text-cyan-700 uppercase tracking-[0.4em]">AI Solutions Architect // Engineer El</p>
        </header>

        {/* The "Boring" Professional Vault Section (Shrunken Fonts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <section className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Professional_Identity</h3>
              <div className="text-[11px] leading-relaxed text-white/60 space-y-4 font-mono">
                <p>Strategic and results-driven AI Solutions Architect with over 15 years of experience in systems support, technical operations, and client-facing solutions.</p>
                <p>Recently completed the comprehensive Google AI Professional suite, specializing in the integration of Large Language Models (LLMs) to solve enterprise challenges.</p>
                <p>Proven track record in optimizing complex workflows via SAP, automating communications, and designing high-fidelity AI-native applications.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Technical_Stack</h3>
              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-cyan-400/60">
                <div className="flex items-center gap-2"><Cpu size={12} /> Gemini 1.5 Pro</div>
                <div className="flex items-center gap-2"><Code size={12} /> React / Node.js</div>
                <div className="flex items-center gap-2"><Zap size={12} /> Prompt Eng.</div>
                <div className="flex items-center gap-2"><ShieldCheck size={12} /> Trust Infra</div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">The_Ruthless_Protocol</h3>
              <div className="text-[11px] leading-relaxed text-white/60 space-y-4 font-mono">
                <p>The objective is to secure high-leverage AI Solutions and Technical Operations roles within the Decatur/Atlanta metropolitan corridor.</p>
                <p>By leveraging a background in complex customer solutions (Utilities/Logistics), the goal is to bypass automated Applicant Tracking Systems (ATS).</p>
                <p>Digital Archaeology: Use depreciated/archived data to find names of department heads and decision-makers.</p>
              </div>
            </div>

            <div className="tech-tank-card p-8 bg-cyan-900/10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-4">Meta_Brand_Logic</h3>
              <p className="text-[11px] font-mono text-white/40 leading-loose">
                The "?" represents the user's query; the "2" represents the transition to a solution. Every "?" product builds "Brand Equity" for the next. Trust in one leads to trust in all.
              </p>
            </div>
          </section>

        </div>

        {/* Closing Visual */}
        <div className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 relative group">
           <img 
             src="/WavioWorld/images/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4" 
             className="hidden" 
             alt="Fallback" 
           />
           <video 
             autoPlay loop muted playsInline 
             className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
             src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"
           />
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[8px] font-black uppercase tracking-[1em] text-white/20">Acoustic_Architecture_Node</p>
           </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-white/5 flex justify-between items-center opacity-20 pb-24">
          <p className="text-[9px] font-mono">ARCH-TOOL // SECTOR_ABOUT // 2026</p>
          <div className="flex gap-6">
            <Github size={16} />
            <Linkedin size={16} />
            <Mail size={16} />
          </div>
        </footer>

      </div>
    </div>
  );
};

export default WavioAbout;
