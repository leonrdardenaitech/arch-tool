import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Trash2, X, ChevronRight, CookingPot, Utensils, Apple, CheckCircle2, Info, AlertCircle, Mic, RefreshCw, Settings, ShieldAlert, Home, Save, Upload, Download, Pizza, Beef, Carrot, Fish, Croissant, Coffee, Egg, Video, PlayCircle, ShieldCheck } from 'lucide-react';

// Securely access the Vercel/Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

// Using the exact, explicit model version to bypass generic routing bugs
const MODEL_NAME = "gemini-flash-latest";

// Local asset path
const CUSTOM_LOGO_URL = "/watzlogopop.png"; 

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

RULES (Neural Backbone v1.5):
1. MANDATORY: Provide EXACTLY 5 distinct, high-fidelity dinner options. No more, no less.
2. NUTRITION: Ensure each meal is balanced and realistic (5-12 core ingredients).
3. EXCLUSIONS: Strictly filter out all items listed in the "Strict Exclusions" vector.
4. VARIETY: Provide 2 dessert ideas and 1 breakfast strategy.
5. FORMAT: Pure JSON only. No prose.

Strict Exclusions: `;

// --- Custom Logo Component ---
const AppLogo = ({ size = 24, className = "", width }) => {
  return <img src={CUSTOM_LOGO_URL} alt="W4D Logo" className={`object-contain ${className}`} style={{ width: width || size, height: 'auto' }} />;
};

// --- Stable UI Wrapper with Status Indicator ---
const PhoneFrame = ({ children, hasKey }) => (
  <div className="relative mx-auto w-full max-w-[420px] h-[820px] bg-[#1a1a1a] rounded-[3.5rem] border-[12px] border-[#B45309] shadow-[0_60px_120px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col transition-all duration-300">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#333] rounded-b-[1.2rem] z-[400]"></div>
    
    <div className="absolute top-3 left-8 z-[400] flex items-center gap-1.5 opacity-80">
       <div className={`w-2 h-2 rounded-full ${hasKey ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse'}`}></div>
       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 font-mono">OS OK</span>
    </div>

    <div className="flex-1 bg-[#FAFAF9] overflow-hidden relative flex flex-col">
      {children}
    </div>
    <div className="h-1.5 w-24 bg-[#666] rounded-full mx-auto my-3 shrink-0 absolute bottom-2 left-1/2 -translate-x-1/2 z-[400]"></div>
  </div>
);

// --- Appliance Splash Screen ---
function ApplianceSplash({ isVisible }) {
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-[#120A05] transition-opacity duration-700 ease-in-out" style={{ opacity: isVisible ? 1 : 0 }}>
      <div className="relative flex flex-col items-center animate-fade-in-up">
        <img src={CUSTOM_LOGO_URL} alt="Watz 4 Dinner OS" className="w-40 h-auto object-contain drop-shadow-[0_0_40px_rgba(249,115,22,0.2)] animate-pulse-slow" />
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-40 h-1 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-orange-500 animate-loading-bar rounded-full" />
          </div>
          <span className="text-[9px] text-orange-500/70 uppercase tracking-[0.3em] font-black">Initializing OS...</span>
        </div>
      </div>
    </div>
  );
}

// --- Plate Loader ---
function PlateLoader() {
  const [iconIndex, setIconIndex] = useState(0);
  const allIcons = [Pizza, Apple, Carrot, Beef, Fish, Croissant, Coffee, Egg];

  useEffect(() => {
    const interval = setInterval(() => setIconIndex((prev) => (prev + 1) % 8), 600);
    return () => clearInterval(interval);
  }, []);

  const currentIcons = [
    allIcons[iconIndex % 8],
    allIcons[(iconIndex + 1) % 8],
    allIcons[(iconIndex + 2) % 8],
    allIcons[(iconIndex + 3) % 8],
  ];

  return (
    <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#120A05]/95 backdrop-blur-md px-10 text-center">
      <div className="relative w-32 h-32 rounded-full border-4 border-orange-500/50 bg-[#F4F1EA] shadow-[inset_0_8px_16px_rgba(0,0,0,0.1)] flex items-center justify-center mb-8">
        <div className="grid grid-cols-2 gap-4 animate-pulse-slow">
          {currentIcons.map((IconComponent, idx) => (
            <div key={idx} className="flex items-center justify-center animate-fade-in-up">
              <IconComponent className="text-zinc-800 w-8 h-8" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
      <span className="text-[10px] text-orange-500 uppercase tracking-[0.3em] font-black animate-pulse">Syncing Appliance...</span>
    </div>
  );
}

export default function WatzV2App() {
  const [isApplianceBooting, setIsApplianceBooting] = useState(true);
  const [appStep, setAppStep] = useState('welcome'); 
  const [ingredients, setIngredients] = useState(['Eggs', 'Milk', 'Cheese', 'Onions', 'Garlic']);
  const [inputValue, setInputValue] = useState('');
  const [exclusions, setExclusions] = useState([]);
  const [exclusionValue, setExclusionValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [appError, setAppError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const bootTimer = setTimeout(() => setIsApplianceBooting(false), 2500);
    return () => clearTimeout(bootTimer);
  }, []);

  const executeRefiner = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setAppError(null);
    try {
      const blockedList = exclusions.join(', ');
      const prompt = `Available ingredients: ${ingredients.join(', ')}. Exclude: ${blockedList}. Generate the full meal plan JSON with 5 realistic dinner options.`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + blockedList }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "API Error");
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const result = JSON.parse(text.replace(/```json|```/g, '').trim());
      
      setAiData(result);
      setAppStep('results');
      setSelectedMeal(result.dinner_options[0]);
    } catch (err) {
      setAppError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-6 font-sans text-zinc-100 overflow-x-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: MARKETING & VIDEOS */}
        <div className="space-y-12 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} /> Google Play Closed Beta
            </div>
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.9]">
              Watz 4 Dinner? <br />
              <span className="text-orange-500 italic">Version 2.0</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-md leading-relaxed">
              Experience the future of kitchen intelligence. Our V2 engine features hardware-accelerated animations and deeper multimodal reasoning.
            </p>
          </div>

          {/* VIDEO SHOWCASE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square shadow-2xl">
              <video src="/watzcommercial.mp4" loop muted playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Commercial 01</p>
                <p className="text-xs font-bold text-white">The Lifestyle</p>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square shadow-2xl">
              <video src="/hologram4dinner.mp4" loop muted playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Commercial 02</p>
                <p className="text-xs font-bold text-white">The Tech</p>
              </div>
            </div>
          </div>

          {/* TESTER ACTION */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
              <RefreshCw className="text-orange-500" /> Apply to Beta Test
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Google requires 20 active testers. Download the prototype, fill out the form, and help us finalize the release.
            </p>
            <a 
              href="mailto:Leonrdarden@gmail.com?subject=Watz 4 Dinner Beta Feedback&body=Tester Name:%0D%0ADevice Model:%0D%0AOverall Impression (1-10):%0D%0AWhat was your favorite feature?%0D%0AAny issues or bugs observed?"
              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
            >
              Get Tester Template <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* RIGHT: THE INTERACTIVE PROTOTYPE */}
        <div className="relative animate-in fade-in slide-in-from-right duration-1000">
          <PhoneFrame hasKey={!!apiKey}>
            <ApplianceSplash isVisible={isApplianceBooting} />
            {loading && <PlateLoader />}
            
            {appStep === 'welcome' && (
              <div className="flex-1 flex flex-col items-center justify-center p-10 bg-[#F5F5F4] text-center">
                <AppLogo width={240} className="mb-12 drop-shadow-2xl" />
                <button onClick={() => setAppStep('input')} className="w-full py-6 bg-[#FAFAF9] border-4 border-[#78350F] rounded-[2.5rem] text-[#78350F] font-black uppercase tracking-widest hover:bg-[#78350F] hover:text-white transition-all shadow-xl">
                  Initialize OS
                </button>
                <p className="mt-8 text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">v2.0 Beta Protocol</p>
              </div>
            )}

            {appStep === 'input' && (
              <div className="flex-1 flex flex-col bg-[#FAFAF9] p-8 space-y-8">
                <div className="flex justify-center"><AppLogo size={40} /></div>
                <div className="space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#B45309]">Master Pantry</h2>
                  <div className="flex gap-2">
                    <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Add items..." className="flex-1 px-4 py-3 rounded-xl border-2 border-zinc-200 outline-none focus:border-orange-500" />
                    <button onClick={() => { if(inputValue) { setIngredients([...ingredients, inputValue]); setInputValue(''); } }} className="p-3 bg-orange-600 text-white rounded-xl"><Plus /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-zinc-200 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-tight flex items-center gap-2">
                        {ing} <X size={10} className="cursor-pointer" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={executeRefiner} className="mt-auto w-full py-5 bg-[#78350F] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Plan Dinner
                </button>
              </div>
            )}

            {appStep === 'results' && aiData && (
              <div className="flex-1 flex flex-col bg-[#FAFAF9] overflow-hidden">
                <div className="p-4 border-b bg-white flex gap-3 overflow-x-auto scrollbar-hide">
                  {aiData.dinner_options.map(meal => (
                    <button key={meal.id} onClick={() => setSelectedMeal(meal)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${selectedMeal?.id === meal.id ? 'bg-[#B45309] text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                      {meal.title}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border-2 border-[#78350F] shadow-md">
                    <h2 className="text-xl font-black uppercase tracking-tight mb-4">{selectedMeal?.title}</h2>
                    <div className="space-y-2">
                      {selectedMeal?.left_column_ingredients.map((ing, i) => (
                        <div key={i} className="flex justify-between text-xs py-2 border-b border-zinc-50">
                          <span className="font-medium">{ing.item}</span>
                          <span className="text-orange-600 font-bold">{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setAppStep('welcome')} className="p-6 text-[10px] font-black uppercase text-zinc-400 hover:text-orange-600 tracking-widest"><Home size={16} className="inline mr-2" /> Reboot OS</button>
              </div>
            )}
          </PhoneFrame>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loadingBar { 0% { width: 0%; transform: translateX(-100%); } 50% { width: 70%; transform: translateX(0%); } 100% { width: 100%; transform: translateX(100%); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-loading-bar { animation: loadingBar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
