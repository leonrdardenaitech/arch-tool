import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Download, Send, Sparkles, User, Mail, ShieldCheck, Lock, Globe, Zap, AlertTriangle } from 'lucide-react';

const BrandBuilderApp = () => {
  const [phase, setPhase] = useState('input'); // 'input', 'auth', 'loading', 'display', 'complete'
  const [idea, setIdea] = useState('');
  const [why, setWhy] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [mockReport, setMockReport] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing Google GenAI Handshake...');

  const carouselLabels = ["Global Billboard Concept", "Premier Newspaper Spread", "Dynamic Social Engagement"];

  // --- MOCK GENERATOR LOGIC ---
  const generateMockReport = (brand, purpose) => {
    return {
      summary: `AI Agent 007 has identified a significant market gap for ${brand}. By addressing the core friction point ("${purpose}"), this venture positions itself at the intersection of high-growth trends and consumer demand.`,
      marketResearch: `Analysis of current sector volatility suggests ${brand} could capture 12-15% of niche market share within Q3. Competitor saturation is currently low in the specific vector defined by the user's vision. Global indices indicate a shift toward high-fidelity solutions in this category.`,
      demand: `Google search trends for similar concepts have increased by 214% year-over-year. Consumer sentiment is shifting rapidly toward solutions that prioritize efficiency and the specific values outlined in the ${brand} roadmap. Data suggests a 0.85 correlation between user pain points and this solution.`,
      roadmap: `Phase 1: Alpha Deployment and Neural Calibration. Phase 2: Scaled Infrastructure Integration. Phase 3: Global Market Saturation. ${brand} is projected to reach operational maturity within 18 months.`,
      risk: `Primary risk identified as "Legacy Resistance." However, the superior logic gates of ${brand} provide a 40% efficiency advantage over existing systems, mitigating adoption friction.`,
      need: `The primary problem identified is a lack of structural transparency. ${brand} solves this by implementing the specific logic gates mentioned in the operational purpose, creating a 'Blue Ocean' strategy.`,
      value: `${brand} stands for technical excellence and market disruption. It stands against legacy bottlenecks and inefficient resource allocation. Agent 007 confirms high viability.`
    };
  };

  const handleStartSynthesis = () => {
    if (!idea || !why) {
      alert("Agent 007 requires both fields to be populated.");
      return;
    }
    setPhase('auth');
  };

  const handleAuthorize = () => {
    setPhase('loading');
    runLoadingSequence();
  };

  const runLoadingSequence = () => {
    const messages = [
      "Establishing Secure Neural Link...",
      "Bypassing Regional Firewalls...",
      "Fetching Sector 1: Global Billboard Concept...",
      "Analyzing Global Market Vectors...",
      "Fetching Sector 2: Premier Newspaper Spread...",
      "Synthesizing Visual Assets via Google Imagen 4.0...",
      "Fetching Sector 3: Dynamic Social Engagement...",
      "Finalizing Intelligence Report..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[i]);
      i++;
      if (i >= messages.length) {
        clearInterval(interval);
        startVisualSequence();
      }
    }, 1800); // Total ~14.4 seconds
  };

  const startVisualSequence = () => {
    const ts = Date.now();
    const cleanIdea = encodeURIComponent(idea);
    // Lower resolution (w=800) for faster loading and distinct keywords for variety
    const urls = [
      `https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop&sig=${ts}_bb&q=${cleanIdea}_billboard`,
      `https://images.unsplash.com/photo-1585829365294-bb7c63b3ecda?q=80&w=800&auto=format&fit=crop&sig=${ts}_news&q=${cleanIdea}_newspaper`,
      `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop&sig=${ts}_soc&q=${cleanIdea}_social_media`
    ];
    
    // Pre-load images to avoid blank flashes
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    setImageUrls(urls);
    setMockReport(generateMockReport(idea, why));
    setPhase('display');

    let currentIdx = 0;
    const seqInterval = setInterval(() => {
      currentIdx++;
      if (currentIdx < urls.length) {
        setIsFading(true);
        setTimeout(() => {
          setCurrentImageIndex(currentIdx);
          setIsFading(false);
        }, 800);
      } else {
        clearInterval(seqInterval);
        setPhase('complete');
      }
    }, 6000); // 6s per image to give viewer time
  };

  const downloadReport = () => {
    const element = document.getElementById('report-content');
    const brandName = idea || 'Brand';
    
    if (!window.html2pdf) {
      alert("PDF Library Offline.");
      return;
    }

    // Clone element to prevent UI artifacts during export
    const opt = {
      margin: 0.2,
      filename: `${brandName.replace(/\s+/g, '_')}_Intelligence_Report_007.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        letterRendering: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    window.html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="bb-container">
      <div className="bb-background" style={{ backgroundImage: "url('/arch-tool/Gemini_Generated_Image_1igk5j1igk5j1igk.png')" }}></div>
      <div className="bb-overlay"></div>

      <main className="bb-content">
        <header className="bb-header">
          <h1 className="bb-title">Brand Builder</h1>
          <p className="bb-subtitle">Powered by AI Agent 007 <span className="text-[8px] opacity-40 ml-2">v1.3.0</span></p>
        </header>

        {/* PHASE 1: INPUT */}
        {phase === 'input' && (
          <section className="bb-input-section animate-slide-up">
            <div className="bb-input-box">
              <div className="bb-field">
                <label>Brand Vision</label>
                <input type="text" placeholder="e.g. Nano Banana..." value={idea} onChange={(e) => setIdea(e.target.value)} />
              </div>
              <div className="bb-field">
                <label>Operational Purpose</label>
                <input type="text" placeholder="e.g. Solving snacks..." value={why} onChange={(e) => setWhy(e.target.value)} />
              </div>
              <button className="bb-trigger" onClick={handleStartSynthesis}>
                <Sparkles size={20} />
                <span>Initialize Synthesis</span>
              </button>
            </div>
          </section>
        )}

        {/* PHASE 2: AUTH MODAL */}
        {phase === 'auth' && (
          <div className="bb-modal-overlay">
            <div className="bb-auth-modal animate-scale-up">
              <div className="bb-auth-header">
                <ShieldCheck size={40} className="bb-orange-text" />
                <h2>Legal & Security Clearance</h2>
              </div>
              <div className="bb-auth-body">
                <p>Allow <strong>AI Agent 007</strong> to establish a temporary high-bandwidth neural link via <strong>Google Gemini Pro 1.5</strong>?</p>
                <ul className="bb-auth-list">
                  <li><Globe size={14} /> Permission to use global internet for Google Search indexing.</li>
                  <li><Zap size={14} /> Allocation of Google GenAI compute resources for real-time synthesis.</li>
                  <li><Lock size={14} /> End-to-end encryption of brand assets within the 007 secure vault.</li>
                </ul>
                <div className="bb-auth-disclaimer">
                  *This protocol is governed by the Darden AI Architecture Framework. No personal data is stored beyond this session.
                </div>
              </div>
              <div className="bb-auth-actions">
                <button className="bb-auth-btn-allow" onClick={handleAuthorize}>Authorize & Sync</button>
                <button className="bb-auth-btn-deny" onClick={() => setPhase('input')}>Deny Access</button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: LOADING SCREEN */}
        {phase === 'loading' && (
          <div className="bb-loading-screen animate-fade-in">
             <div className="bb-google-loader">
                <div className="bb-g-dot blue"></div>
                <div className="bb-g-dot red"></div>
                <div className="bb-g-dot yellow"></div>
                <div className="bb-g-dot green"></div>
             </div>
             <h2 className="bb-loading-status">{loadingText}</h2>
             <div className="bb-ad-banner">
                <span className="bb-ad-tag">AD</span>
                <p>Google Cloud: Transform your enterprise with the power of <span>Vertex AI</span>. Build faster, scale further.</p>
             </div>
          </div>
        )}

        {/* PHASE 4: DISPLAY & COMPLETE */}
        {(phase === 'display' || phase === 'complete') && (
          <section className="bb-display-section animate-fade-in">
            <div className="bb-image-box">
                <div className="bb-carousel">
                  <img src={imageUrls[currentImageIndex]} alt="Visualization" className={`bb-img ${isFading ? 'fading' : ''}`} />
                  <div className="bb-img-label">{carouselLabels[currentImageIndex]}</div>
                  <div className="bb-img-nav">
                    {imageUrls.map((_, i) => (
                      <button key={i} className={`bb-dot ${i === currentImageIndex ? 'active' : ''}`} onClick={() => setCurrentImageIndex(i)} />
                    ))}
                  </div>
                </div>
            </div>

            {phase === 'complete' && mockReport && (
              <div className="bb-report-area animate-slide-up">
                <div className="bb-email-card" id="report-content">
                  <div className="bb-email-header">
                    <div className="bb-meta">
                      <p><User size={14} /> <strong>To:</strong> Strategic Partner</p>
                      <p><Send size={14} /> <strong>From:</strong> AI Agent 007</p>
                    </div>
                    <div className="bb-subject"><strong>Subject:</strong> Market Intelligence // {idea}</div>
                  </div>
                  <div className="bb-email-body">
                    <img src={imageUrls[1]} alt="Report Visual" className="bb-report-img" />
                    <div className="bb-report-text">
                        <h3>Short Summary of Findings</h3>
                        <p>{mockReport.summary}</p>
                        <h3>Market Research</h3>
                        <p>{mockReport.marketResearch}</p>
                        <h3>Confirm Demand</h3>
                        <p>{mockReport.demand}</p>
                        <h3>Strategic Roadmap</h3>
                        <p>{mockReport.roadmap}</p>
                        <h3>Risk Assessment</h3>
                        <p>{mockReport.risk}</p>
                        <h3>Customer Need</h3>
                        <p>{mockReport.need}</p>
                        <h3>Brand Value</h3>
                        <p>{mockReport.value}</p>
                    </div>
                    <div className="bb-signature">
                      <p>Expertly synthesized by <strong>AI Agent 007</strong></p>
                      <p className="bb-valediction">"Efficiency is the only constant."</p>
                    </div>
                  </div>
                </div>

                <div className="bb-actions">
                  <button className="bb-download-btn" onClick={downloadReport}>
                    <Lightbulb size={20} />
                    <span>Download PDF Brief</span>
                  </button>
                  <button className="bb-reset-btn" onClick={() => setPhase('input')}>New Synthesis</button>
                </div>

                <footer className="bb-footer">
                  <p>AI Agent 007 says: "It was my pleasure! Have a great day, <span>Strategic Partner</span>!"</p>
                </footer>
              </div>
            )}
          </section>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bb-brown: #3e2723;
          --bb-red: #d32f2f;
          --bb-orange: #ff6f00;
          --bb-orange-light: #ffa000;
          --bb-glass: rgba(15, 7, 5, 0.85);
          --bb-border: rgba(255, 111, 0, 0.3);
          --g-blue: #4285F4; --g-red: #EA4335; --g-yellow: #FBBC05; --g-green: #34A853;
        }

        .bb-container { position: relative; min-height: 100vh; width: 100%; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; background: #000; }
        .bb-background { position: fixed; inset: 0; background-size: cover; background-position: center; z-index: 0; filter: brightness(0.4); }
        .bb-overlay { position: fixed; inset: 0; background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.8)); z-index: 1; }
        .bb-content { position: relative; z-index: 10; max-width: 900px; margin: 0 auto; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; }

        .bb-header { text-align: center; margin-bottom: 4rem; }
        .bb-title { font-size: 4rem; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; background: linear-gradient(to right, #fff, var(--bb-orange)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; }
        .bb-subtitle { font-size: 1rem; font-weight: 700; color: var(--bb-orange); text-transform: uppercase; letter-spacing: 4px; }

        /* INPUT */
        .bb-input-box { background: var(--bb-glass); backdrop-blur: 20px; padding: 3rem; border-radius: 2rem; border: 1px solid var(--bb-border); width: 100%; max-width: 600px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .bb-field { margin-bottom: 2rem; }
        .bb-field label { display: block; font-size: 0.7rem; text-transform: uppercase; font-weight: 900; color: var(--bb-orange-light); margin-bottom: 0.75rem; letter-spacing: 2px; }
        .bb-field input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.25rem 1.5rem; color: #fff; font-size: 1rem; outline: none; transition: all 0.3s; }
        .bb-field input:focus { border-color: var(--bb-orange); background: rgba(0,0,0,0.6); box-shadow: 0 0 20px rgba(255, 111, 0, 0.2); }
        .bb-trigger { width: 100%; background: linear-gradient(45deg, var(--bb-red), var(--bb-orange)); border: none; padding: 1.5rem; border-radius: 1rem; color: #fff; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; transition: transform 0.2s, filter 0.3s; }
        .bb-trigger:hover { filter: brightness(1.2); transform: translateY(-2px); }

        /* MODAL */
        .bb-modal-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.9); display: flex; items-center; justify-content: center; padding: 2rem; backdrop-blur: 10px; }
        .bb-auth-modal { background: #111; border: 1px solid #333; border-radius: 2rem; max-width: 500px; width: 100%; padding: 3rem; box-shadow: 0 0 50px rgba(255,111,0,0.2); }
        .bb-auth-header { text-align: center; margin-bottom: 2rem; }
        .bb-auth-header h2 { font-weight: 900; text-transform: uppercase; margin-top: 1rem; letter-spacing: -1px; color: #fff; }
        .bb-orange-text { color: var(--bb-orange); }
        .bb-auth-body p { text-align: center; color: #ccc; margin-bottom: 2rem; line-height: 1.6; }
        .bb-auth-list { list-style: none; padding: 0; margin-bottom: 2rem; }
        .bb-auth-list li { display: flex; align-items: center; gap: 1rem; color: #999; font-size: 0.85rem; margin-bottom: 1rem; border-bottom: 1px solid #222; padding-bottom: 0.75rem; }
        .bb-auth-disclaimer { font-size: 0.7rem; color: #555; font-style: italic; text-align: center; }
        .bb-auth-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
        .bb-auth-btn-allow { background: #fff; color: #000; border: none; padding: 1.25rem; border-radius: 1rem; font-weight: 900; text-transform: uppercase; cursor: pointer; }
        .bb-auth-btn-deny { background: transparent; color: #555; border: none; font-size: 0.8rem; text-transform: uppercase; font-weight: 900; cursor: pointer; }

        /* LOADING SCREEN */
        .bb-loading-screen { position: fixed; inset: 0; z-index: 200; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #555; }
        .bb-google-loader { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
        .bb-g-dot { width: 16px; height: 16px; border-radius: 50%; animation: jump 0.6s infinite alternate; }
        .bb-g-dot.blue { background: var(--g-blue); animation-delay: 0s; }
        .bb-g-dot.red { background: var(--g-red); animation-delay: 0.15s; }
        .bb-g-dot.yellow { background: var(--g-yellow); animation-delay: 0.3s; }
        .bb-g-dot.green { background: var(--g-green); animation-delay: 0.45s; }
        @keyframes jump { from { transform: translateY(0); } to { transform: translateY(-20px); } }
        .bb-loading-status { font-weight: 400; font-size: 1.25rem; margin-bottom: 4rem; color: #333; }
        .bb-ad-banner { background: #f8f9fa; border: 1px solid #eee; padding: 2rem; border-radius: 1rem; max-width: 500px; text-align: center; }
        .bb-ad-tag { background: #fff; border: 1px solid #ccc; font-size: 0.6rem; padding: 0.1rem 0.4rem; border-radius: 0.2rem; font-weight: 900; margin-bottom: 1rem; display: inline-block; }
        .bb-ad-banner p { font-size: 0.9rem; line-height: 1.6; color: #666; }
        .bb-ad-banner p span { color: var(--g-blue); font-weight: 700; }

        /* DISPLAY */
        .bb-image-box { width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #000; border: 4px solid #333; border-radius: 2rem; overflow: hidden; margin-bottom: 4rem; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
        .bb-carousel { height: 100%; position: relative; }
        .bb-img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.8s ease-in-out; }
        .bb-img.fading { opacity: 0; }
        .bb-img-label { position: absolute; top: 2rem; right: 2rem; background: rgba(0,0,0,0.7); padding: 0.5rem 1.5rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 900; color: var(--bb-orange); border: 1px solid var(--bb-orange); text-transform: uppercase; }
        .bb-img-nav { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 1rem; background: rgba(0,0,0,0.4); padding: 0.75rem 1.5rem; border-radius: 2rem; backdrop-blur: 10px; }
        .bb-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; cursor: pointer; }
        .bb-dot.active { background: var(--bb-orange); box-shadow: 0 0 10px var(--bb-orange); }

        .bb-report-area { width: 100%; max-width: 850px; }
        .bb-email-card { background: #fff; color: #333; border-radius: 2rem; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
        .bb-email-header { background: #f8f9fa; padding: 2.5rem; border-bottom: 2px solid #eee; }
        .bb-meta { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .bb-meta p { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #666; }
        .bb-subject { font-size: 1.25rem; color: #000; padding-top: 1.5rem; border-top: 1px dashed #ddd; }
        .bb-email-body { padding: 3rem; text-align: left; }
        .bb-report-img { width: 100%; border-radius: 1.5rem; margin-bottom: 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .bb-report-text h3 { font-size: 1.1rem; text-transform: uppercase; color: var(--bb-red); margin-top: 2rem; margin-bottom: 0.75rem; font-weight: 900; }
        .bb-report-text p { margin-bottom: 1.25rem; line-height: 1.7; color: #444; }
        
        /* PDF EXPORT SPECIFIC STYLES */
        .pdf-export-mode .bb-report-text h3 { color: #d32f2f !important; }
        .pdf-export-mode .bb-report-text p { color: #000 !important; }
        .pdf-export-mode .bb-subject { color: #000 !important; border-top: 1px dashed #000 !important; }
        .pdf-export-mode .bb-meta p { color: #333 !important; }
        .pdf-export-mode .bb-email-card { box-shadow: none !important; border: 1px solid #eee; }

        .bb-signature { margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #f8f9fa; }
        .bb-valediction { font-style: italic; color: #999; margin-top: 0.5rem; }

        .bb-actions { display: flex; gap: 1.5rem; margin-top: 3rem; width: 100%; }
        .bb-download-btn { flex: 2; background: #000; color: #fff; border: 2px solid var(--bb-orange); padding: 1.5rem; border-radius: 1.5rem; font-weight: 900; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; }
        .bb-reset-btn { flex: 1; background: transparent; color: var(--bb-orange); border: 1px solid var(--bb-orange); border-radius: 1.5rem; font-weight: 900; text-transform: uppercase; cursor: pointer; }
        .bb-footer { margin-top: 5rem; text-align: center; padding-bottom: 4rem; opacity: 0.6; }
        .bb-footer p { font-size: 0.9rem; font-style: italic; color: #fff; }
        .bb-footer span { color: var(--bb-orange); font-weight: 700; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: var(--bb-brown); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--bb-red); }
      ` }} />
    </div>
  );
};

export default BrandBuilderApp;