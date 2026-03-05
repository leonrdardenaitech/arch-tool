import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

const BrandBuilderApp = () => {
  const [phase, setPhase] = useState('input'); // 'input', 'carousel', 'report'
  const [idea, setIdea] = useState('');
  const [why, setWhy] = useState('');
  const [loadingText, setLoadingText] = useState('Agent 007 is analyzing market data...');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState([]);
  const [reportHtml, setReportHtml] = useState('');
  const [isFading, setIsFading] = useState(false);

  const carouselLabels = ["Billboard Visualization", "Newspaper Advertisement", "Social Media Feed"];

  const generateBrandVision = async () => {
    if (!idea || !why) {
      alert("Please fill in both fields to activate Agent 007.");
      return;
    }

    setPhase('carousel');
    
    try {
      // Parallel Processing: Simulated Image Gen and Real Gemini Report
      const imagePromise = simulateImageGeneration(idea);
      const reportPromise = generateGeminiReport(idea, why);

      const [urls, html] = await Promise.all([imagePromise, reportPromise]);
      
      setImageUrls(urls);
      setReportHtml(html);

      // Start the 15-second visual journey (3 images * 5 seconds)
      runCarouselSequence(urls, html);

    } catch (err) {
      console.error("Critical Failure:", err);
      alert("Nexus Link Broken: " + err.message);
      setPhase('input');
    }
  };

  const simulateImageGeneration = async (brandIdea) => {
    // Artificial delay to feel like AI is working
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
      `https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800&auto=format&fit=crop&text=Billboard_${encodeURIComponent(brandIdea)}`,
      `https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop&text=Newspaper_${encodeURIComponent(brandIdea)}`,
      `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&text=Social_${encodeURIComponent(brandIdea)}`
    ];
  };

  const generateGeminiReport = async (brandIdea, brandWhy) => {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are AI Agent 007, an elite brand strategist and market researcher. Analysis of Brand Idea and Value Proposition. Format EXACTLY as structured HTML snippets (<h3> and <p> tags) under: Market Research, Confirm Demand, Customer Need, Brand Value. Raw HTML only, no markdown."
    });

    const prompt = `Brand Idea: ${brandIdea}. Value Proposition: ${brandWhy}. Generate the Intelligence Report.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const runCarouselSequence = (urls, html) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < urls.length) {
        setIsFading(true);
        setTimeout(() => {
          setCurrentImageIndex(index);
          setIsFading(false);
        }, 500);
      } else {
        clearInterval(interval);
        setPhase('report');
      }
    }, 5000);
  };

  const downloadReport = () => {
    const element = document.getElementById('report-content-to-print');
    const brandName = idea || 'Brand';
    
    const opt = {
      margin:       0.5,
      filename:     `${brandName.replace(/\s+/g, '_')}_Intelligence_Report_007.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      alert("PDF Generation Library not loaded.");
    }
  };

  return (
    <div className="brand-builder-root">
      <div className="app-container">
        
        {phase === 'input' && (
          <div id="input-section" className="card fade-in">
            <h1 className="logo">BRAND BUILDER <span>007</span></h1>
            <p className="subtitle">Architect your brand vision in 15 seconds.</p>
            <div className="input-group">
              <label>What is your Brand idea?</label>
              <input 
                type="text" 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A sustainable coffee brand using recycled materials..."
              />
            </div>
            <div className="input-group">
              <label>Why do we need your brand?</label>
              <input 
                type="text" 
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="e.g. Current coffee packaging is wasteful and non-recyclable..."
              />
            </div>
            <button onClick={generateBrandVision} className="btn-generate">Generate Brand Vision</button>
          </div>
        )}

        {phase === 'carousel' && (
          <div id="carousel-section" className="carousel-container fade-in">
            <div className="analysis-status">
              <div className="spinner"></div>
              <h3 id="loading-text">{loadingText}</h3>
            </div>
            <div className="image-wrapper">
              <img 
                id="carousel-image" 
                src={imageUrls[currentImageIndex]} 
                alt="Brand Mockup"
                style={{ opacity: isFading ? 0 : 1 }}
              />
              <div className="image-label" id="carousel-label">
                {carouselLabels[currentImageIndex]}
              </div>
            </div>
          </div>
        )}

        {phase === 'report' && (
          <div id="email-report-section" className="fade-in">
            <div className="email-container" id="report-content-to-print">
              <div className="email-header">
                <p><strong>To:</strong> You</p>
                <p><strong>From:</strong> AI Agent 007</p>
                <p className="subject-line">
                  <strong>Subject:</strong> Market Intelligence Report: <span id="display-brand-name">{idea}</span>
                </p>
              </div>
              <div className="email-body">
                <img id="email-attachment" src={imageUrls[1]} alt="Newspaper Mockup" className="email-attachment-img" />
                <div id="ai-report-body" dangerouslySetInnerHTML={{ __html: reportHtml }}>
                </div>
                <p className="email-signature">Best regards,<br /><strong>AI Agent 007</strong></p>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={downloadReport} className="btn-download">
                📥 Download Brand Brief (PDF)
              </button>
              <button onClick={() => setPhase('input')} className="btn-secondary">Build Another Vision</button>
            </div>
          </div>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .brand-builder-root {
          font-family: 'Inter', sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          min-height: 100vh;
          padding: 2rem;
        }
        .app-container { max-width: 900px; margin: 0 auto; }
        .card { background-color: #1e293b; padding: 3rem; border-radius: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .logo { font-weight: 900; font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; }
        .logo span { background: linear-gradient(to right, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { text-align: center; color: #94a3b8; margin-bottom: 3rem; }
        .input-group { margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 1rem 1.5rem; background: #000; border: 1px solid #334155; border-radius: 0.75rem; color: #fff; outline: none; }
        input:focus { border-color: #10b981; }
        .btn-generate { width: 100%; padding: 1.25rem; background: #10b981; color: #000; font-weight: 900; text-transform: uppercase; border-radius: 0.75rem; cursor: pointer; border: none; }
        .spinner { width: 20px; height: 20px; border: 3px solid rgba(16, 185, 129, 0.2); border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .image-wrapper { position: relative; background: #000; border-radius: 1.5rem; overflow: hidden; border: 4px solid #1e293b; }
        #carousel-image { width: 100%; display: block; min-height: 400px; object-fit: cover; transition: opacity 0.5s; }
        .image-label { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.8); padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 900; font-size: 0.75rem; color: #10b981; border: 1px solid #10b981; }
        .email-container { background: #fff; color: #1e293b; border-radius: 1.5rem; overflow: hidden; margin-top: 2rem; text-align: left; }
        .email-header { background: #f1f5f9; padding: 2rem; border-bottom: 1px solid #e2e8f0; }
        .email-body { padding: 2rem; }
        .email-attachment-img { width: 100%; border-radius: 0.75rem; margin-bottom: 2rem; }
        .action-buttons { margin-top: 2rem; display: flex; gap: 1rem; }
        .btn-download { flex: 2; background: #6366f1; color: #fff; padding: 1rem; border-radius: 0.75rem; font-weight: bold; cursor: pointer; border: none; }
        .btn-secondary { flex: 1; background: transparent; border: 1px solid #334155; color: #94a3b8; border-radius: 0.75rem; cursor: pointer; }
      ` }} />
    </div>
  );
};

export default BrandBuilderApp;
