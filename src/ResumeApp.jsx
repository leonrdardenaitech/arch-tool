import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronLeft,
  Download,
  CheckCircle2,
  Cpu,
  Layers,
  Code,
  Zap,
  Globe
} from 'lucide-react';

export default function ResumeApp() {
  return (
    <div className="min-h-screen py-20 px-6 font-sans selection:bg-cyan-500/30 text-[#e0e0e0]" 
         style={{ 
           background: `linear-gradient(rgba(10, 10, 12, 0.94), rgba(10, 10, 12, 0.98)), url('/background78.jpeg') no-repeat center center fixed`,
           backgroundSize: 'cover'
         }}>
      
      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-4 flex justify-between items-center backdrop-blur-xl border-b border-white/5 bg-black/20">
        <a href="/portfolio.html" className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-all uppercase text-[10px] font-black tracking-widest group text-decoration-none">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
        </a>
        <div className="text-[10px] font-black tracking-[0.4em] text-[#b026ff] uppercase hidden sm:block">Architectural Dossier // LD-26</div>
        <a href="/assets/images/Leon_R_Darden_Dark_Architect_Resume.pdf" download="Leon_R_Darden_Resume.pdf" className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] text-decoration-none text-white">
          <Download size={14} /> Download PDF
        </a>
      </nav>

      {/* Main Resume Container */}
      <main className="max-w-[900px] mx-auto bg-[#0a0a0a]/85 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        
        {/* Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00f3ff] via-[#b026ff] to-[#00f3ff]"></div>

        <div className="p-8 md:p-16">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row items-center gap-8 border-b border-white/5 pb-12 mb-12">
            <div className="w-20 h-20 rounded-full border-2 border-[#00f3ff] p-0.5 flex-shrink-0 shadow-[0_0_20px_rgba(0,243,255,0.3)] relative">
               <div className="absolute inset-0 rounded-full border border-[#b026ff]/50 animate-pulse"></div>
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src="/assets/images/leon_headshot_static.png" alt="Leon R. Darden" className="w-full h-full object-cover contrast-110" />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#00f3ff] uppercase italic mb-1">Leon R. Darden</h1>
              <div className="text-lg font-bold text-[#b026ff] uppercase tracking-[0.2em] mb-4">AI Solutions Architect</div>
              <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-zinc-400 text-[11px] font-mono uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#00f3ff]" /> Lithonia, GA 30058</div>
                <div className="text-zinc-700">|</div>
                <div className="flex items-center gap-1.5"><Phone size={12} className="text-[#00f3ff]" /> (678) 763-0580</div>
                <div className="text-zinc-700">|</div>
                <div className="flex items-center gap-1.5"><Mail size={12} className="text-[#00f3ff]" /> leonrdarden@gmail.com</div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-zinc-400 text-[11px] font-mono uppercase tracking-widest mt-2">
                <a href="https://leonrdarden.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors text-decoration-none"><Globe size={12} className="text-[#b026ff]" /> leonrdarden.com</a>
                <div className="text-zinc-700">|</div>
                <a href="https://linkedin.com/in/leon-darden" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors text-decoration-none"><ExternalLink size={12} className="text-[#b026ff]" /> linkedin.com/in/leon-darden</a>
              </div>
            </div>
          </header>

          <div className="space-y-16">
            
            {/* Professional Profile */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f3ff] mb-6 flex items-center gap-4">
                [ PROFESSIONAL_PROFILE ] <div className="h-[1px] flex-1 bg-white/5"></div>
              </h2>
              <p className="text-base leading-relaxed text-zinc-300 font-medium">
                Strategic and results-driven AI Solutions Architect with over 15 years of experience in systems support, technical operations, and client-facing solutions. Recently completed the comprehensive Google AI Professional suite, specializing in the integration of Large Language Models (LLMs) to solve enterprise challenges. Proven track record in optimizing complex workflows via SAP, automating communications, and designing high-fidelity AI-native applications.
              </p>
            </section>

            {/* Distinguished Credentials */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f3ff] mb-6 flex items-center gap-4">
                [ DISTINGUISHED_CREDENTIALS ] <div className="h-[1px] flex-1 bg-white/5"></div>
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                <li className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:border-[#b026ff]/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#b026ff]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(176,38,255,0.1)]">
                    <CheckCircle2 size={20} className="text-[#b026ff]" />
                  </div>
                  <div>
                    <div className="text-white font-black text-xs uppercase tracking-tight">Google AI Professional</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Verified Mastery // Feb 2026</div>
                  </div>
                </li>
                <li className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex items-center gap-4 hover:border-[#b026ff]/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#b026ff]/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(176,38,255,0.1)]">
                    <CheckCircle2 size={20} className="text-[#b026ff]" />
                  </div>
                  <div>
                    <div className="text-white font-black text-xs uppercase tracking-tight">Prompting Essentials</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Advanced Logic // Jan 2026</div>
                  </div>
                </li>
              </ul>
            </section>

            {/* Technical Capabilities */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f3ff] mb-8 flex items-center gap-4">
                [ TECHNICAL_CAPABILITIES ] <div className="h-[1px] flex-1 bg-white/5"></div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <h3 className="text-[#b026ff] font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Cpu size={12} /> AI & Machine Learning
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">Prompt Engineering, Gemini Pro Integration, Generative AI Strategy, LLM Workflow Automation.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[#b026ff] font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Code size={12} /> Development & Web
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">React.js, JavaScript (ES6+), HTML5/CSS3, Tailwind CSS, API Integration (REST).</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[#b026ff] font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Layers size={12} /> Enterprise Systems
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">SAP ERP, CRM (ACT, Enteract), Data Analysis, Technical Troubleshooting.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[#b026ff] font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Zap size={12} /> Design & Creative
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">Multi-modal Asset Generation, Brand Strategy, Adobe Creative Suite.</p>
                </div>
              </div>
            </section>

            {/* Professional Experience */}
            <section className="space-y-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f3ff] mb-10 flex items-center gap-4">
                [ PROFESSIONAL_EXPERIENCE ] <div className="h-[1px] flex-1 bg-white/5"></div>
              </h2>

              <div className="space-y-12">
                <ExperienceItem 
                  title="Independent Researcher | AI Solutions Development"
                  company="Stonecrest, GA"
                  date="2024 – Present"
                  points={[
                    "Dedicated 2,000+ hours to intensive upskilling in Generative AI, Prompt Engineering, and Full-stack development.",
                    "Architected and launched a live digital portfolio showcasing integrated Gemini AI solutions.",
                    "Developed custom logic for automated branding and voice-activated data logging systems."
                  ]}
                />
                
                <ExperienceItem 
                  title="Operations Solutions Specialist"
                  company="Live Ops / Duke Energy"
                  location="Lithonia, GA"
                  date="2020 – 2024"
                  points={[
                    "Managed high-volume utility data and billing functions via SAP, maintaining 99% accuracy in account management.",
                    "Provided technical assistance to internal contractors, translating utility protocols into actionable operational steps.",
                    "Optimized customer care workflows by implementing improved problem-solving frameworks for escalations."
                  ]}
                />

                <ExperienceItem 
                  title="Client Solutions Consultant"
                  company="Vertex / Georgia Natural Gas"
                  location="Kennesaw, GA"
                  date="2008 – 2014"
                  points={[
                    "Consistently ranked in the Top 5% of production, leveraging data-driven strategies to drive business growth.",
                    "Collaborated on design concepts for the GNG App, utilizing artistic skills to improve mobile user engagement."
                  ]}
                />

                <ExperienceItem 
                  title="Systems Support Analyst"
                  company="New Health Care Management"
                  location="Atlanta, GA"
                  date="2004 – 2008"
                  points={[
                    "Performed large-scale data conversions and repairs of critical customer data to support cross-departmental operations.",
                    "Lead trainer for staff on SAP processing software, ensuring seamless adoption of new technical workflows."
                  ]}
                />
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00f3ff] mb-8 flex items-center gap-4">
                [ ACADEMIC_FOUNDATION ] <div className="h-[1px] flex-1 bg-white/5"></div>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white/[0.02] rounded-xl border-l-2 border-[#b026ff]">
                  <div className="text-white font-black text-xs uppercase tracking-tight">Telecommunications Management</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-1">DeVry Institute of Technology (Decatur, GA)</div>
                </div>
                <div className="p-5 bg-white/[0.02] rounded-xl border-l-2 border-[#b026ff]">
                  <div className="text-white font-black text-xs uppercase tracking-tight">Graphic & Commercial Arts</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Occupational Education Center (Decatur, GA)</div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <footer className="p-12 bg-black/40 border-t border-white/5 text-center">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
             Architect: Leon R. Darden // Lithonia GA
           </div>
           <div className="mt-4 text-[9px] font-mono text-zinc-800 uppercase tracking-widest">
             Privacy Protocol Active // Sourced via Gemini 1.5 Pro // v2.6.26
           </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .text-decoration-none { text-decoration: none; }
      `}</style>
    </div>
  );
}

function ExperienceItem({ title, company, location, date, points }) {
  return (
    <div className="group">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
        <div>
          <h3 className="text-white font-black text-lg uppercase tracking-tight group-hover:text-[#00f3ff] transition-colors">{title}</h3>
          <div className="text-[10px] text-[#b026ff] font-black uppercase tracking-[0.2em] mt-1">
            {company} {location && <span className="text-zinc-600 mx-2">//</span>} {location}
          </div>
        </div>
        <div className="text-[9px] font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest border border-white/5 flex-shrink-0">
          {date}
        </div>
      </div>
      <ul className="space-y-3 list-none p-0">
        {points.map((p, i) => (
          <li key={i} className="text-[13px] text-zinc-400 leading-relaxed flex gap-4 font-medium">
            <span className="text-[#00f3ff] font-black shrink-0">/</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
