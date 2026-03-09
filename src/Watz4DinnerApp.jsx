import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Trash2, X, ChevronRight, CookingPot, Utensils, Apple, CheckCircle2, Info, AlertCircle, Mic, RefreshCw, Settings, ShieldAlert, Home, Save, Upload } from 'lucide-react';

// Securely access the Vercel/Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_NAME = "gemini-1.5-flash"; 

// Local asset path
const CUSTOM_LOGO_URL = "/arch-tool/whats4dinner.png"; 

const SYSTEM_PROMPT = `You are the backend logic engine for "Watz 4 Dinner".
Output ONLY raw JSON. No markdown. No conversational text.

REQUIRED JSON SCHEMA:
{
  "scan_results": {
    "detected_ingredients": ["string"],
    "ignored_due_to_exclusions": ["string"]
  },
  "dinner_options": [
    {
      "id": "meal_1",
      "title": "string",
      "prep_time_minutes": 25,
      "left_column_ingredients": [{"item": "string", "amount": "string"}],
      "right_column_instructions": ["string"],
      "nutrition_facts": {"calories": 500, "protein_g": 30, "carbs_g": 40, "fat_g": 20}
    }
  ],
  "underlying_features": {
    "dessert_ideas": [{"title": "string", "description": "string"}],
    "tomorrow_breakfast": {"title": "string", "description": "string"},
    "leftover_spice_up": "string"
  }
}

RULES:
1. Provide exactly 5 distinct dinner options.
2. Ensure each meal is a complete, realistic recipe using 5 to 12 ingredients.
3. Provide 2 dessert ideas and 1 breakfast idea.
4. Strictly respect these exclusions: `;

// --- Custom Logo Component ---
const AppLogo = ({ size = 24, className = "", width }) => {
  if (CUSTOM_LOGO_URL) {
    return <img src={CUSTOM_LOGO_URL} alt="W4D Logo" className={`object-contain ${className}`} style={{ width: width || size, height: 'auto' }} />;
  }
  return <CookingPot size={size} className={className} />;
};

// --- Stable UI Wrapper with Status Indicator ---
const PhoneFrame = ({ children, hasKey }) => (
  <div className="relative mx-auto w-full max-w-[420px] h-[820px] bg-[#1a1a1a] rounded-[3.5rem] border-[14px] border-[#B45309] shadow-[0_60px_120px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-300">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#333] rounded-b-[1.5rem] z-[400]"></div>
    
    {/* NEXUS STATUS LIGHT (TOP LEFT) */}
    <div className="absolute top-2 left-8 z-[400] flex items-center gap-1.5 opacity-80">
       <div className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse'}`}></div>
       <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/40 font-mono">Nexus {hasKey ? 'OK' : 'OFF'}</span>
    </div>

    <div className="flex-1 bg-[#FAFAF9] overflow-hidden relative flex flex-col">
      {children}
    </div>
    <div className="h-1.5 w-28 bg-[#666] rounded-full mx-auto my-3 shrink-0"></div>
  </div>
);

export default function Watz4DinnerApp() {
  const [appStep, setAppStep] = useState('welcome'); 
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [exclusions, setExclusions] = useState([]);
  const [exclusionValue, setExclusionValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [appError, setAppError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- API Utilities ---
  async function callGemini(payload) {
    if (!apiKey) {
      setAppError("Neural Link Offline: VITE_GEMINI_API_KEY is not detected. Please verify Vercel settings.");
      return null;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.error?.message || `API Failure: ${response.status}`);
      }
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Empty response from AI Core.");
      
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err) {
      setAppError(`Nexus Error: ${err.message}`);
      throw err;
    }
  }

  useEffect(() => {
    const startCamera = async () => {
      if (appStep === 'scanning') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Camera access error:", err);
        }
      }
    };
    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
    if (appStep === 'scanning') startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [appStep]);

  const handleFridgeScan = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setLoading(true);
    setAppError(null);
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    try {
      const payload = {
        contents: [{
          parts: [
            { text: `Identify all food items in this image. Use them to generate the full meal plan JSON with 5 realistic dinner options. Exclude: ${exclusions.join(', ')}.` },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + exclusions.join(', ') }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      const result = await callGemini(payload);
      
      if (result && result.dinner_options) {
        setAiData(result);
        const newIngredients = result.scan_results?.detected_ingredients || [];
        setIngredients(prev => [...new Set([...prev, ...newIngredients])]);
        setAppStep('results');
        setSelectedMeal(result.dinner_options[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setAppError(null);

    const reader = new FileReader();
    const safeMimeType = (file.type === "image/heic" || file.type === "image/heif" || !file.type) ? "image/jpeg" : file.type;

    reader.onloadend = async () => {
      try {
        const base64String = reader.result.split(',')[1];
        
        const payload = {
          contents: [{
            parts: [
              { text: `Identify all food items in this image. Use them to generate the full meal plan JSON with 5 realistic dinner options. Exclude: ${exclusions.join(', ')}.` },
              { inlineData: { mimeType: safeMimeType, data: base64String } }
            ]
          }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + exclusions.join(', ') }] },
          generationConfig: { responseMimeType: "application/json" }
        };
        const result = await callGemini(payload);
        
        if (result && result.dinner_options) {
          setAiData(result);
          const newIngredients = result.scan_results?.detected_ingredients || [];
          setIngredients(prev => [...new Set([...prev, ...newIngredients])]);
          setAppStep('results');
          setSelectedMeal(result.dinner_options[0]);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateFromManual = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setAppError(null);
    try {
      const prompt = `Available ingredients: ${ingredients.join(', ')}. Exclude: ${exclusions.join(', ')}. Generate the full meal plan JSON with 5 realistic dinner options.`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + exclusions.join(', ') }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      const result = await callGemini(payload);
      if (result && result.dinner_options) {
        setAiData(result);
        setAppStep('results');
        setSelectedMeal(result.dinner_options[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    if (inputValue.trim()) {
      setIngredients(prev => [...new Set([...prev, inputValue.trim()])]);
      setInputValue('');
    }
  };

  const addExclusion = () => {
    if (exclusionValue.trim()) {
      setExclusions(prev => [...new Set([...prev, exclusionValue.trim()])]);
      setExclusionValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FAFAF9]/95 backdrop-blur-md px-10 text-center text-kitchen-woodDark">
          <RefreshCw className="w-24 h-24 text-[#78350F] animate-spin mb-8" />
          <p className="font-black uppercase tracking-[0.4em] text-lg animate-pulse">Syncing Appliance...</p>
        </div>
      )}

      <PhoneFrame hasKey={!!apiKey}>
        {/* ERROR PROTOCOL OVERLAY */}
        {appError && (
          <div className="absolute inset-x-6 top-24 z-[300] bg-[#451A03] border-4 border-red-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-in slide-in-from-top-8">
            <ShieldAlert size={36} className="mb-3 text-red-500 animate-pulse" />
            <h3 className="font-black uppercase tracking-widest text-sm mb-2 text-red-400">Error Protocol</h3>
            <p className="text-[10px] font-bold opacity-90 mb-6 leading-relaxed px-2">{appError}</p>
            <button onClick={() => setAppError(null)} className="bg-red-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform">Acknowledge & Reboot</button>
          </div>
        )}

        {/* HEADER */}
        {appStep !== 'welcome' && appStep !== 'scanning' && (
          <div className="bg-[#451A03] pt-12 pb-5 px-8 flex justify-center items-center shrink-0 border-b-4 border-[#78350F] z-10 relative text-white">
            <div className="cursor-pointer" onClick={() => setAppStep('welcome')}>
              <AppLogo size={appStep === 'input' ? 52 : 40} className="drop-shadow-lg" />
            </div>
            <div className="absolute right-8 bottom-6">
               <Settings className="text-[#B45309]" size={20} />
            </div>
          </div>
        )}

        {/* WELCOME */}
        {appStep === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-start p-8 text-center bg-[#F5F5F4] overflow-y-auto animate-in fade-in duration-500">
            <div className="w-full max-w-[320px] flex flex-col items-center pt-16 pb-12">
              <AppLogo width={320} className="mb-12 drop-shadow-2xl" />
              
              <div className="h-2 w-24 bg-[#78350F] rounded-full mb-12"></div>
              
              <div className="space-y-6 w-full">
                <button onClick={() => setAppStep('scanning')} className="w-full flex flex-col items-center p-8 bg-[#FAFAF9] border-4 border-[#78350F] rounded-[3rem] shadow-xl hover:bg-[#78350F] hover:text-white transition-all text-[#78350F]">
                  <Camera className="w-12 h-12 mb-4" />
                  <span className="font-black uppercase tracking-widest text-base">Scan Storage</span>
                </button>
                <button onClick={() => setAppStep('input')} className="w-full flex flex-col items-center p-8 bg-[#FAFAF9] border-4 border-[#94A3B8] rounded-[3rem] shadow-xl hover:border-[#78350F] transition-all text-[#451A03]">
                  <Plus className="w-12 h-12 mb-4 text-[#94A3B8]" />
                  <span className="font-black uppercase tracking-widest text-base">Manual List</span>
                </button>
              </div>
              <p className="mt-16 text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.5em]">Appliance OS v1.4</p>
            </div>
          </div>
        )}

        {/* SCANNING */}
        {appStep === 'scanning' && (
          <div className="flex-1 bg-black relative flex flex-col">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-60 contrast-125" />
            <canvas ref={canvasRef} className="hidden" />
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            
            <div className="absolute top-16 left-8 right-8 text-center bg-[#451A03]/90 backdrop-blur-md p-5 rounded-[1.5rem] text-white">
              <p className="text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 animate-pulse"><RefreshCw size={14} className="animate-spin" /> Analyzing Storage</p>
            </div>
            
            <div className="absolute inset-x-0 bottom-20 flex flex-col items-center gap-8">
              <button onClick={handleFridgeScan} className="w-28 h-28 bg-white rounded-full flex items-center justify-center border-[12px] border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.4)] active:scale-90 transition-transform"><Camera size={42} className="text-black" /></button>
              
              <div className="flex gap-4">
                <button onClick={() => setAppStep('welcome')} className="text-white font-black uppercase tracking-[0.4em] text-[10px] bg-black/40 px-6 py-2 rounded-full border border-white/10">Abort</button>
                <button onClick={() => fileInputRef.current.click()} className="text-white font-black uppercase tracking-[0.2em] text-[10px] bg-[#B45309] px-6 py-2 rounded-full flex items-center gap-2 border border-white/20 shadow-xl active:scale-95 transition-all">
                  <Upload size={14} /> Upload Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INPUT */}
        {appStep === 'input' && (
          <div className="flex-1 flex flex-col h-full bg-[#FAFAF9]">
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section>
                <h2 className="text-sm font-black text-[#78350F] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <Utensils size={18} /> Master Pantry List
                </h2>
                <div className="flex gap-3">
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIngredient()} placeholder="Salmon, Eggs..." className="flex-1 bg-white border-2 border-[#94A3B8] rounded-2xl px-5 py-4 font-bold text-base outline-none focus:border-[#78350F]" />
                  <button onClick={addIngredient} className="bg-[#78350F] text-white w-14 h-14 flex items-center justify-center rounded-2xl active:scale-90 transition-transform"><Plus size={28}/></button>
                </div>
                <div className="mt-8 space-y-3">
                  {ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#94A3B8]/30 shadow-sm animate-in slide-in-from-left duration-200">
                      <span className="text-sm font-black text-[#451A03] uppercase tracking-tight">{ing}</span>
                      <Trash2 size={20} className="text-red-300 hover:text-red-600 cursor-pointer" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              </section>
              <section className="pt-6 border-t border-[#94A3B8]/20">
                <h2 className="text-sm font-black text-red-800 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <AlertCircle size={18} /> Exclusion Filters
                </h2>
                <div className="flex gap-3">
                  <input type="text" value={exclusionValue} onChange={e => setExclusionValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExclusion()} placeholder="Allergies..." className="flex-1 bg-white border-2 border-[#B45309] rounded-2xl px-5 py-4 font-bold text-base outline-none focus:border-[#B45309]" />
                  <button onClick={addExclusion} className="border-2 border-[#78350F] text-[#78350F] w-14 h-14 flex items-center justify-center rounded-2xl shadow-md active:scale-90 transition-transform"><Plus size={28}/></button>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  {exclusions.map((ex, i) => (
                    <span key={i} className="bg-red-50 text-red-900 px-4 py-2 rounded-full border border-red-200 text-xs font-black uppercase flex items-center gap-2">
                      {ex} <X size={14} className="cursor-pointer" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} />
                    </span>
                  ))}
                </div>
              </section>
            </div>
            <div className="p-8 bg-white border-t-2 border-[#F5F5F4]">
              <button onClick={generateFromManual} disabled={ingredients.length === 0} className="w-full bg-[#78350F] text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xl shadow-xl active:scale-95 transition-all">
                Plan Dinner
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {appStep === 'results' && aiData && selectedMeal && (
          <div className="flex-1 flex flex-col h-full bg-[#FAFAF9]">
            <div className="p-5 flex gap-4 overflow-x-auto scrollbar-hide snap-x bg-[#F5F5F4] border-b-2 border-[#94A3B8]/20 shrink-0">
              {aiData.dinner_options?.map((meal) => (
                <button key={meal.id} onClick={() => { setSelectedMeal(meal); setCompletedSteps([]); }} className={`flex-shrink-0 w-52 p-5 rounded-3xl border-4 transition-all text-left snap-start ${selectedMeal.id === meal.id ? 'bg-[#78350F] text-white border-[#B45309]' : 'bg-white text-[#451A03] border-[#94A3B8]/30'}`}>
                  <p className="text-[10px] font-black uppercase opacity-60 mb-1">{meal.prep_time_minutes} min</p>
                  <h3 className="font-black text-sm uppercase leading-tight line-clamp-2">{meal.title}</h3>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar pb-20 text-slate-700">
              <div className="bg-white rounded-[2.5rem] p-8 border-4 border-[#78350F] shadow-xl animate-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-black text-[#451A03] uppercase tracking-tighter leading-tight mb-8 border-b-2 border-[#F5F5F4] pb-5">{selectedMeal.title}</h2>
                <div className="space-y-5 mb-10 text-left">
                  <h4 className="text-[11px] font-black text-[#B45309] uppercase tracking-[0.2em]">Required Pantry</h4>
                  {selectedMeal.left_column_ingredients?.map((ing, i) => (
                    <div key={i} className="text-xs font-bold bg-[#F5F5F4] p-4 rounded-xl border border-[#94A3B8]/10 flex justify-between shadow-sm">
                      <span className="truncate pr-2">{ing.item}</span>
                      <span className="text-[#78350F] font-black">{ing.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 text-left">
                  <h4 className="text-[11px] font-black text-[#B45309] uppercase tracking-[0.2em]">Instructions</h4>
                  {selectedMeal.right_column_instructions?.map((step, i) => (
                    <button key={i} onClick={() => setCompletedSteps(prev => prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i])} className={`w-full text-left p-6 rounded-[1.5rem] border-2 flex gap-4 items-start transition-all ${completedSteps.includes(i) ? 'opacity-30 bg-[#F5F5F4] grayscale' : 'bg-white border-[#94A3B8]/20 shadow-md'}`}>
                      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-xs ${completedSteps.includes(i) ? 'bg-[#94A3B8]' : 'bg-[#78350F]'} text-white`}>{completedSteps.includes(i) ? <CheckCircle2 size={16} /> : i + 1}</div>
                      <p className={`text-base font-bold leading-snug tracking-tight ${completedSteps.includes(i) ? 'line-through' : 'text-[#451A03]'}`}>{step}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-[#451A03] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden text-left">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 border-b border-white/10 pb-4"><Info size={16} /> Projections</h4>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Morning Protocol</p>
                    <h5 className="font-black text-lg uppercase tracking-tight">{aiData.underlying_features?.tomorrow_breakfast?.title}</h5>
                    <p className="text-xs opacity-80 mt-2 font-medium">{aiData.underlying_features?.tomorrow_breakfast?.description}</p>
                  </div>
                  <div className="h-px bg-white/10 w-full" />
                  <div>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-3">Leftover Strategy</p>
                    <p className="text-xs italic font-bold leading-relaxed border-l-4 border-white pl-4">"{aiData.underlying_features?.leftover_spice_up}"</p>
                  </div>
                </div>
              </div>
              <button onClick={() => { setAppStep('welcome'); setIngredients([]); setAiData(null); }} className="w-full py-10 text-[#94A3B8] font-black uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-3 hover:text-[#78350F] transition-colors"><Home size={18} /> Clear Appliance Data</button>
            </div>
          </div>
        )}
      </PhoneFrame>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}} />
    </div>
  );
}
