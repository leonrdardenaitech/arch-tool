import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Lightbulb, Download, Send, Sparkles, User, Mail, ChevronRight, ChevronLeft } from 'lucide-react';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

const BrandBuilderApp = () => {
  const [phase, setPhase] = useState('input'); // 'input', 'processing', 'complete'
  const [idea, setIdea] = useState('');
  const [why, setWhy] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [reportHtml, setReportHtml] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const carouselLabels = ["Global Billboard Concept", "Premier Newspaper Spread", "Dynamic Social Engagement"];
  const scrollRef = useRef(null);

  const generateBrandVision = async () => {
    if (!idea || !why) {
      alert("Agent 007 requires both fields to be populated.");
      return;
    }

    setPhase('processing');
    setLoading(true);
    setProgress(0);
    
    try {
      // Parallel Processing
      const imagePromise = simulateImageGeneration(idea);
      const reportPromise = generateGeminiReport(idea, why);

      const [urls, html] = await Promise.all([imagePromise, reportPromise]);
      
      setImageUrls(urls);
      setReportHtml(html);
      setLoading(false);

      // Start the 21-second sequence (7s per image)
      startVisualSequence(urls);

    } catch (err) {
      console.error("Nexus Link Severed:", err);
      alert("Operational Error: " + err.message);
      setPhase('input');
    }
  };

  const simulateImageGeneration = async (brandIdea) => {
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 3000));
    return [
      `https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop&text=Billboard_${encodeURIComponent(brandIdea)}`,
      `https://images.unsplash.com/photo-1585829365294-bb7c63b3ecda?q=80&w=1200&auto=format&fit=crop&text=Newspaper_${encodeURIComponent(brandIdea)}`,
      `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop&text=Social_${encodeURIComponent(brandIdea)}`
    ];
  };

  const generateGeminiReport = async (brandIdea, brandWhy) => {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are AI Agent 007. Provide an expert market intelligence report. Include a 'Short Summary of Findings' at the top. Format as clean HTML snippets (<h3> and <p>). Do not use markdown backticks."
    });

    const prompt = `Brand: ${brandIdea}. Purpose: ${brandWhy}. Draft the Intelligence Report.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const startVisualSequence = (urls) => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < urls.length) {
        setIsFading(true);
        setTimeout(() => {
          setCurrentImageIndex(currentIdx);
          setIsFading(false);
        }, 800);
      } else {
        clearInterval(interval);
        setPhase('complete');
      }
    }, 7000); // 7 seconds per image
  };

  const downloadReport = () => {
    const element = document.getElementById('report-content');
    const brandName = idea || 'Brand';
    const opt = {
      margin: 0.5,
      filename: `${brandName}_Brief_007.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    if (window.html2pdf) window.html2pdf().set(opt).from(element).save();
    else alert("PDF Library Offline.");
  };

  return (
    <div className="bb-container">
      {/* Background Overlay */}
      <div className="bb-background" style={{ backgroundImage: "url('/arch-tool/Gemini_Generated_Image_1igk5j1igk5j1igk.png')" }}></div>
      <div className="bb-overlay"></div>

      <main className="bb-content">
        {/* Header */}
        <header className="bb-header animate-fade-in">
          <h1 className="bb-title">Brand Builder</h1>
          <p className="bb-subtitle">Powered by AI Agent 007</p>
        </header>

        {/* Phase 1: Input Fields */}
        {phase === 'input' && (
          <section className="bb-input-section animate-slide-up">
            <div className="bb-input-box">
              <div className="bb-field">
                <label>Brand Vision</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nano Banana - Eco-friendly fruit tech..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
              </div>
              <div className="bb-field">
                <label>Operational Purpose</label>
                <input 
                  type="text" 
                  placeholder="e.g. Solving the global snack waste crisis..."
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                />
              </div>
              <button className="bb-trigger" onClick={generateBrandVision}>
                <Sparkles size={20} />
                <span>Initialize Synthesis</span>
              </button>
            </div>
          </section>
        )}

        {/* Phase 2: Processing & Image Display */}
        {(phase === 'processing' || phase === 'complete') && (
          <section className="bb-display-section animate-fade-in">
            {/* Image Box */}
            <div className="bb-image-box">
              {loading ? (
                <div className="bb-loader">
                  <div className="bb-spinner"></div>
                  <p>Agent 007 is decrypting visual assets...</p>
                </div>
              ) : (
                <div className="bb-carousel">
                  <img 
                    src={imageUrls[currentImageIndex]} 
                    alt="Visualization" 
                    className={`bb-img ${isFading ? 'fading' : ''}`}
                  />
                  <div className="bb-img-label">{carouselLabels[currentImageIndex]}</div>
                  
                  {/* Image Scrollbar/Navigation */}
                  <div className="bb-img-nav">
                    {imageUrls.map((_, i) => (
                      <button 
                        key={i} 
                        className={`bb-dot ${i === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Report Box (Shows after processing is done) */}
            {phase === 'complete' && (
              <div className="bb-report-area animate-slide-up">
                <div className="bb-email-card" id="report-content">
                  <div className="bb-email-header">
                    <div className="bb-meta">
                      <p><User size={14} /> <strong>To:</strong> Strategic Partner</p>
                      <p><Send size={14} /> <strong>From:</strong> AI Agent 007</p>
                    </div>
                    <div className="bb-subject">
                      <strong>Subject:</strong> Market Intelligence // {idea}
                    </div>
                  </div>
                  
                  <div className="bb-email-body">
                    {/* Secondary Image showing in report as requested */}
                    <img src={imageUrls[1]} alt="Report Visual" className="bb-report-img" />
                    
                    <div className="bb-report-text" dangerouslySetInnerHTML={{ __html: reportHtml }}></div>
                    
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
                  <button className="bb-reset-btn" onClick={() => setPhase('input')}>
                    New Synthesis
                  </button>
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
        }

        .bb-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          color: #fff;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          background: #000;
        }

        .bb-background {
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
          filter: brightness(0.4);
        }

        .bb-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, transparent, rgba(0,0,0,0.8));
          z-index: 1;
        }

        .bb-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bb-header { text-align: center; margin-bottom: 4rem; }
        .bb-title { 
          font-size: 4rem; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: -2px;
          background: linear-gradient(to right, #fff, var(--bb-orange));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .bb-subtitle { 
          font-size: 1rem; 
          font-weight: 700; 
          color: var(--bb-orange); 
          text-transform: uppercase; 
          letter-spacing: 4px;
        }

        /* INPUT BOX */
        .bb-input-box {
          background: var(--bb-glass);
          backdrop-blur: 20px;
          padding: 3rem;
          border-radius: 2rem;
          border: 1px solid var(--bb-border);
          width: 100%;
          max-width: 600px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }

        .bb-field { margin-bottom: 2rem; }
        .bb-field label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 900;
          color: var(--bb-orange-light);
          margin-bottom: 0.75rem;
          letter-spacing: 2px;
        }
        .bb-field input {
          width: 100%;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
        }
        .bb-field input:focus {
          border-color: var(--bb-orange);
          background: rgba(0,0,0,0.6);
          box-shadow: 0 0 20px rgba(255, 111, 0, 0.2);
        }

        .bb-trigger {
          width: 100%;
          background: linear-gradient(45deg, var(--bb-red), var(--bb-orange));
          border: none;
          padding: 1.5rem;
          border-radius: 1rem;
          color: #fff;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: transform 0.2s, filter 0.3s;
        }
        .bb-trigger:hover { filter: brightness(1.2); transform: translateY(-2px); }

        /* IMAGE DISPLAY */
        .bb-image-box {
          width: 100%;
          max-width: 800px;
          aspect-ratio: 16/9;
          background: #000;
          border: 4px solid #333;
          border-radius: 2rem;
          overflow: hidden;
          margin-bottom: 4rem;
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .bb-loader {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: #050505;
        }
        .bb-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,111,0,0.1);
          border-top-color: var(--bb-orange);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .bb-carousel { height: 100%; position: relative; }
        .bb-img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: opacity 0.8s ease-in-out;
        }
        .bb-img.fading { opacity: 0; }

        .bb-img-label {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(0,0,0,0.7);
          padding: 0.5rem 1.5rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--bb-orange);
          border: 1px solid var(--bb-orange);
          text-transform: uppercase;
        }

        .bb-img-nav {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          background: rgba(0,0,0,0.4);
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          backdrop-blur: 10px;
        }
        .bb-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: none;
          cursor: pointer;
        }
        .bb-dot.active { background: var(--bb-orange); box-shadow: 0 0 10px var(--bb-orange); }

        /* REPORT AREA */
        .bb-report-area { width: 100%; max-width: 850px; }
        .bb-email-card {
          background: #fff;
          color: #333;
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .bb-email-header {
          background: #f8f9fa;
          padding: 2.5rem;
          border-bottom: 2px solid #eee;
        }
        .bb-meta { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
        .bb-meta p { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #666; }
        .bb-subject { font-size: 1.25rem; color: #000; padding-top: 1.5rem; border-top: 1px dashed #ddd; }

        .bb-email-body { padding: 3rem; }
        .bb-report-img { 
          width: 100%; 
          border-radius: 1.5rem; 
          margin-bottom: 3rem; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .bb-report-text h3 { 
          font-size: 1.1rem; 
          text-transform: uppercase; 
          color: var(--bb-red); 
          margin-top: 2rem; 
          margin-bottom: 0.75rem; 
          font-weight: 900;
        }
        .bb-report-text p { margin-bottom: 1.25rem; line-height: 1.7; color: #444; }

        .bb-signature { margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #f8f9fa; }
        .bb-valediction { font-style: italic; color: #999; margin-top: 0.5rem; }

        .bb-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 3rem;
          width: 100%;
        }
        .bb-download-btn {
          flex: 2;
          background: #000;
          color: #fff;
          border: 2px solid var(--bb-orange);
          padding: 1.5rem;
          border-radius: 1.5rem;
          font-weight: 900;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
        }
        .bb-reset-btn {
          flex: 1;
          background: transparent;
          color: var(--bb-orange);
          border: 1px solid var(--bb-orange);
          border-radius: 1.5rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
        }

        .bb-footer {
          margin-top: 5rem;
          text-align: center;
          padding-bottom: 4rem;
          opacity: 0.6;
        }
        .bb-footer p { font-size: 0.9rem; font-style: italic; }
        .bb-footer span { color: var(--bb-orange); font-weight: 700; }

        /* ANIMATIONS */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: var(--bb-brown); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--bb-red); }
      ` }} />
    </div>
  );
};

export default BrandBuilderApp;
