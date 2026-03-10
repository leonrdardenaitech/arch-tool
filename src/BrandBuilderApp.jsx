import React, { useState } from 'react';
import { Lightbulb, Download, Send, Sparkles, User, Mail, ShieldCheck, Lock, Globe, Zap, AlertTriangle, Cpu, Activity } from 'lucide-react';

const BrandBuilderApp = () => {
  const [phase, setPhase] = useState('input'); // 'input', 'auth', 'loading', 'display', 'complete'
  const [idea, setIdea] = useState('');
  const [why, setWhy] = useState('');
  const [stepIndex, setStepIndex] = useState(0); // 0: Billboard, 1: Newspaper, 2: Social
  const [imageUrls, setImageUrls] = useState([]);
  const [mockReport, setMockReport] = useState(null);
  const [loadingText, setLoadingText] = useState('Initializing Handshake...');

  const steps = [
    { label: "Global Billboard Concept", query: "billboard futuristic holographic", message: "Synthesizing Sector 1: Global Presence..." },
    { label: "Premier Newspaper Spread", query: "newspaper tech architecture", message: "Analyzing Sector 2: Media Resonance..." },
    { label: "Dynamic Social Engagement", query: "smartphone social media app", message: "Calculating Sector 3: Social Velocity..." }
  ];

  // --- MOCK GENERATOR LOGIC ---
  const generateMockReport = (brand, purpose) => {
    return {
      summary: `AI Agent 007 has identified a significant market gap for ${brand}. By addressing the core friction point ("${purpose}"), this venture positions itself at the intersection of high-growth trends and consumer demand.`,
      marketResearch: `Analysis of current sector volatility suggests ${brand} could capture 12-15% of niche market share within Q3. Competitor saturation is currently low in the specific vector defined by your vision.`,
      demand: `Global search trends for similar concepts have increased by 214% year-over-year. Consumer sentiment is shifting rapidly toward high-fidelity solutions.`,
      roadmap: `Phase 1: Alpha Deployment. Phase 2: Scaled Infrastructure. Phase 3: Global Market Saturation. Projected maturity: 18 months.`,
      risk: `Primary risk: Legacy Resistance. Mitigated by superior 007 logic gates providing a 40% efficiency advantage.`,
      need: `Structural transparency is the primary missing variable. ${brand} solves this via unique neural pipelines.`,
      value: `${brand} stands for technical excellence and market disruption. Agent 007 confirms high viability.`
    };
  };

  const handleStartSynthesis = () => {
    if (!idea || !why) return alert("Agent 007 requires both fields.");
    setPhase('auth');
  };

  const handleAuthorize = async () => {
    setPhase('loading');
    await runSequentialSynthesis();
  };

  const fetchSectorImage = async (index) => {
    const ts = Date.now();
    const cleanIdea = encodeURIComponent(idea);
    const sectorQuery = steps[index].query;
    // Low-res optimization (w=600) for sub-second efficiency
    return `https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop&sig=${ts}_${index}&q=${cleanIdea}_${sectorQuery}`;
  };

  const runSequentialSynthesis = async () => {
    setIsSynthesizing(true);
    const finalizedUrls = [];

    for (let i = 0; i < steps.length; i++) {
      setStepIndex(i);
      setLoadingText(steps[i].message);
      
      // Simulate "Behind the scenes" work (5 seconds per sector)
      await new Promise(r => setTimeout(r, 5000));
      
      const url = await fetchSectorImage(i);
      finalizedUrls.push(url);
      
      // Momentarily show the fetched image during loading sequence
      setLoadingText(`Sector ${i+1} Secured. Locking vectors...`);
      await new Promise(r => setTimeout(r, 1500));
    }

    setImageUrls(finalizedUrls);
    setMockReport(generateMockReport(idea, why));
    setPhase('display');
    setIsSynthesizing(false);
  };

  const downloadReport = () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    if (!window.html2pdf) return alert("PDF Engine Offline.");
    
    // Unsplash proxy to avoid CORS issues in PDF generation
    const images = element.getElementsByTagName('img');
    for (let img of images) {
      img.crossOrigin = "anonymous";
    }

    const opt = {
      margin: 0.2,
      filename: `${idea.replace(/\s+/g, '_')}_Intelligence_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#ffffff' 
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Force a small delay to allow images to potentially re-trigger with anonymous crossOrigin
    setTimeout(() => {
      window.html2pdf().from(element).set(opt).save();
    }, 500);
  };

  return (
    <div className="bb-container">
      <div className="bb-background" style={{ backgroundImage: "url('/arch-tool/Gemini_Generated_Image_1igk5j1igk5j1igk.png')" }}></div>
      <div className="bb-overlay"></div>

      <main className="bb-content">
        <header className="bb-header">
          <h1 className="bb-title">Brand Builder 007</h1>
          <p className="bb-subtitle">Neural Synthesis Interface <span className="text-[8px] opacity-40 ml-2">v1.4.0</span></p>
        </header>

        {phase === 'input' && (
          <section className="bb-input-section animate-slide-up">
            <div className="bb-input-box">
              <div className="bb-field">
                <label>Vision Node (Brand Name)</label>
                <input type="text" placeholder="e.g. Nano Banana..." value={idea} onChange={(e) => setIdea(e.target.value)} />
              </div>
              <div className="bb-field">
                <label>Operational Purpose</label>
                <input type="text" placeholder="e.g. High-efficiency snacks..." value={why} onChange={(e) => setWhy(e.target.value)} />
              </div>
              <button className="bb-trigger" onClick={handleStartSynthesis}>
                <Sparkles size={20} />
                <span>Establish Handshake</span>
              </button>
            </div>
          </section>
        )}

        {phase === 'auth' && (
          <div className="bb-modal-overlay">
            <div className="bb-auth-modal animate-scale-up">
              <div className="bb-auth-header">
                <ShieldCheck size={40} className="text-orange-500" />
                <h2>Neural Security Clearance</h2>
              </div>
              <p className="text-center text-slate-400 my-6">Authorize Agent 007 to allocate Google Cloud resources for real-time asset synthesis?</p>
              <div className="flex flex-col gap-4">
                <button className="bb-auth-btn-allow" onClick={handleAuthorize}>Authorize & Sync</button>
                <button className="bb-auth-btn-deny" onClick={() => setPhase('input')}>Terminate Link</button>
              </div>
            </div>
          </div>
        )}

        {phase === 'loading' && (
          <div className="bb-loading-screen animate-fade-in">
             <div className="bb-tech-matrix">
                <div className="bb-progress-ring">
                   <div className="bb-ring-segment"></div>
                   <div className="bb-ring-core"><Cpu className="text-orange-500 animate-pulse" size={40} /></div>
                </div>
                <h2 className="bb-loading-status mt-8 uppercase tracking-[0.3em] font-black">{loadingText}</h2>
                <div className="bb-loading-steps">
                   {steps.map((s, idx) => (
                     <div key={idx} className={`bb-step-dot ${idx <= stepIndex ? 'active' : ''}`}></div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {phase === 'display' && (
          <section className="bb-display-section animate-fade-in">
            <div className="bb-image-box">
                <img src={imageUrls[stepIndex]} className="w-full h-full object-cover transition-all duration-1000" />
                <div className="bb-sector-label">{steps[stepIndex].label}</div>
                <div className="bb-sector-nav">
                   {imageUrls.map((_, i) => (
                     <button key={i} onClick={() => setStepIndex(i)} className={`bb-dot ${i === stepIndex ? 'active' : ''}`} />
                   ))}
                </div>
            </div>
            
            <div className="flex justify-center mt-8">
               <button onClick={() => setPhase('complete')} className="px-12 py-4 bg-orange-600 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-500 transition-all shadow-2xl">Finalize Intel Report</button>
            </div>
          </section>
        )}

        {phase === 'complete' && mockReport && (
          <div className="bb-report-area animate-slide-up">
            <div className="bb-email-card" id="report-content">
              <div className="bb-email-header">
                <p><strong>To:</strong> Strategic Partner</p>
                <p><strong>From:</strong> AI Agent 007</p>
                <div className="bb-subject mt-4 pt-4 border-t border-dashed border-slate-200 uppercase font-black tracking-widest">Market Intelligence // {idea}</div>
              </div>
              <div className="bb-email-body p-10">
                <img src={imageUrls[1]} className="w-full rounded-2xl mb-8 shadow-lg" alt="Sector 2" />
                <div className="bb-report-grid grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-slate-700">
                   <div>
                      <h3 className="text-xs font-black uppercase text-orange-600 mb-2">Executive Summary</h3>
                      <p className="text-sm leading-relaxed">{mockReport.summary}</p>
                   </div>
                   <div>
                      <h3 className="text-xs font-black uppercase text-orange-600 mb-2">Market Research</h3>
                      <p className="text-sm leading-relaxed">{mockReport.marketResearch}</p>
                   </div>
                   <div>
                      <h3 className="text-xs font-black uppercase text-orange-600 mb-2">Confirmed Demand</h3>
                      <p className="text-sm leading-relaxed">{mockReport.demand}</p>
                   </div>
                   <div>
                      <h3 className="text-xs font-black uppercase text-orange-600 mb-2">Strategic Roadmap</h3>
                      <p className="text-sm leading-relaxed">{mockReport.roadmap}</p>
                   </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 italic text-slate-400 text-sm">"Efficiency is the only constant." — Agent 007</div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="bb-download-btn flex-1" onClick={downloadReport}><Download size={18} /> Download Brief</button>
              <button className="bb-reset-btn px-8" onClick={() => setPhase('input')}>New Node</button>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .bb-container { min-height: 100vh; background: #000; color: #fff; font-family: 'Inter', sans-serif; position: relative; overflow-x: hidden; }
        .bb-background { position: fixed; inset: 0; background-size: cover; background-position: center; filter: brightness(0.3); opacity: 0.5; }
        .bb-overlay { position: fixed; inset: 0; background: radial-gradient(circle, transparent, rgba(0,0,0,0.9)); }
        .bb-content { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; padding: 4rem 2rem; text-align: center; }
        .bb-title { font-size: 3.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; background: linear-gradient(to right, #fff, #ff6f00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bb-subtitle { color: #ff6f00; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; margin-top: 0.5rem; }
        .bb-input-box { background: rgba(15, 7, 5, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 111, 0, 0.2); padding: 3rem; border-radius: 2.5rem; margin-top: 4rem; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
        .bb-field { text-align: left; margin-bottom: 2rem; }
        .bb-field label { display: block; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: #ffa000; margin-bottom: 0.75rem; letter-spacing: 2px; }
        .bb-field input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 1rem; color: #fff; outline: none; transition: border 0.3s; }
        .bb-field input:focus { border-color: #ff6f00; }
        .bb-trigger { width: 100%; background: linear-gradient(45deg, #d32f2f, #ff6f00); padding: 1.5rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .bb-loading-screen { position: fixed; inset: 0; background: #fff; z-index: 1000; display: flex; flex-direction: column; items-center; justify-content: center; color: #333; }
        .bb-progress-ring { width: 120px; height: 120px; position: relative; display: flex; items-center; justify-content: center; }
        .bb-ring-segment { position: absolute; inset: 0; border: 4px solid #eee; border-top-color: #ff6f00; border-radius: 50%; animation: spin 1s infinite linear; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .bb-loading-steps { display: flex; gap: 1rem; margin-top: 3rem; }
        .bb-step-dot { width: 12px; height: 12px; border-radius: 50%; background: #eee; transition: all 0.5s; }
        .bb-step-dot.active { background: #ff6f00; box-shadow: 0 0 15px #ff6f00; }
        .bb-image-box { width: 100%; max-width: 800px; aspect-ratio: 16/9; border-radius: 2rem; overflow: hidden; border: 4px solid #222; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.8); margin-top: 4rem; }
        .bb-sector-label { position: absolute; top: 2rem; right: 2rem; background: rgba(0,0,0,0.8); padding: 0.5rem 1.5rem; border-radius: 2rem; font-size: 0.7rem; font-weight: 900; color: #ff6f00; border: 1px solid #ff6f00; }
        .bb-sector-nav { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; background: rgba(0,0,0,0.5); padding: 0.75rem 1.5rem; border-radius: 2rem; backdrop-filter: blur(10px); }
        .bb-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s; }
        .bb-dot.active { background: #ff6f00; box-shadow: 0 0 10px #ff6f00; }
        .bb-email-card { background: #fff; border-radius: 2.5rem; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.5); margin-top: 4rem; }
        .bb-email-header { background: #f8f9fa; padding: 3rem; text-align: left; color: #666; font-size: 0.9rem; }
        .bb-download-btn { background: #000; color: #fff; border: 2px solid #ff6f00; padding: 1.5rem; border-radius: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .bb-reset-btn { background: transparent; color: #ff6f00; border: 1px solid #ff6f00; border-radius: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
      ` }} />
    </div>
  );
};

export default BrandBuilderApp;