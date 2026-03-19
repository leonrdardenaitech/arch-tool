import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Trash2, X, ChevronRight, CookingPot, Utensils, Apple, 
  CheckCircle2, Info, AlertCircle, Mic, RefreshCw, Settings, ShieldAlert, 
  Home, Save, Upload, Download, Pizza, Beef, Carrot, Fish, Croissant, 
  Coffee, Egg, Sparkles, Activity, ShieldCheck, Volume2, VolumeX, Play, Search,
  Film, Monitor, ArrowRight, ExternalLink
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_NAME = "gemini-flash-latest";

// --- NEURAL PROMPT ENGINE ---
const SYSTEM_PROMPT = `You are the "Watz 4 Dinner" Kitchen Appliance OS.
Output ONLY raw JSON. No markdown. No prose.

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
      "prep_time_minutes": number,
      "left_column_ingredients": [{"item": "string", "amount": "string"}],
      "right_column_instructions": ["string"],
      "nutrition_facts": {"calories": number, "protein_g": number, "carbs_g": number, "fat_g": number}
    }
  ],
  "underlying_features": {
    "dessert_ideas": [{"title": "string", "description": "string"}],
    "tomorrow_breakfast": {"title": "string", "description": "string"},
    "leftover_spice_up": "string"
  }
}

STRICT RULES:
1. Provide EXACTLY 5 high-fidelity dinner options.
2. Use ONLY ingredients provided + pantry staples.
3. Strictly respect the "Blocklist".
4. Nutrition must be realistic.
5. Provide 2 desserts and 1 breakfast strategy.
`;

// --- GLOBAL COMPONENTS ---

const TextLogo = ({ className = "" }) => (
  <div className={`flex items-center justify-center font-black tracking-tighter leading-none italic select-none ${className}`}>
    <span className="text-orange-500">?</span>
    <span className="text-white">4DINNER</span>
    <span className="text-orange-500">?</span>
  </div>
);

const VideoCard = ({ src, title, subtitle, isMuted }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-left">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
        <p className="text-[10px] text-orange-500/60 font-black uppercase tracking-[0.2em]">{subtitle}</p>
      </div>
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-video bg-black rounded-[2rem] overflow-hidden border-2 border-white/5 hover:border-orange-500 transition-all shadow-2xl"
      >
        <video 
          ref={videoRef}
          src={src} 
          loop 
          muted
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

// --- APP COMPONENTS ---

const ApplianceSplash = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute inset-0 z-[700] bg-[#120A05] flex flex-col items-center justify-center animate-in fade-in duration-700 px-10">
      <TextLogo className="text-6xl w-full" />
      <div className="mt-12 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-orange-600 animate-loading-bar" />
      </div>
    </div>
  );
};

const PlateLoader = () => {
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
    <div className="absolute inset-0 z-[500] bg-[#120A05]/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-40 h-40 rounded-full border-4 border-orange-600/20 bg-white/5 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-t-2 border-orange-600 rounded-full animate-spin duration-[2s]" />
        <div className="grid grid-cols-2 gap-6 animate-pulse">
          {currentIcons.map((Icon, idx) => (
            <Icon key={idx} size={28} className="text-orange-500/80" strokeWidth={1.5} />
          ))}
        </div>
      </div>
      <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.4em] animate-pulse">Consulting Neural Chefs...</p>
    </div>
  );
};

// --- MAIN PORTAL ---

export default function WatzV2App() {
  const [isHandshaken, setIsHandshaken] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [appStep, setAppStep] = useState('boot');
  const [loading, setLoading] = useState(false);
  const [appError, setAppError] = useState(null);
  
  const [ingredients, setIngredients] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [staples, setStaples] = useState(['Salt', 'Pepper', 'Olive Oil', 'Water', 'Garlic Powder']);
  const [useStaples, setUseStaples] = useState(true);
  const [aiData, setAiData] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [recipeImage, setRecipeImage] = useState(null);
  const [imageTimer, setImageTimer] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [exclusionValue, setExclusionValue] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isHandshaken && appStep === 'boot') {
      const timer = setTimeout(() => setAppStep('welcome'), 2500);
      return () => clearTimeout(timer);
    }
  }, [isHandshaken, appStep]);

  const handleHandshake = () => {
    setIsHandshaken(true);
    setIsMuted(false);
  };

  const callGemini = async (payload) => {
    if (!apiKey) { setAppError("System Offline: API Key Missing."); return null; }
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "API Failure");
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleanedText = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (err) {
      setAppError(`Nexus Error: ${err.message}`);
      return null;
    }
  };

  const handleFridgeScan = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setLoading(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    const payload = { 
      contents: [{ parts: [{ text: "Identify food items. List as JSON string array: ['item1', 'item2']" }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }] }],
      generationConfig: { responseMimeType: "application/json" }
    };
    const result = await callGemini(payload);
    if (result && Array.isArray(result)) {
      setIngredients(prev => [...new Set([...prev, ...result])]);
    } else if (result && result.detected_ingredients) {
      setIngredients(prev => [...new Set([...prev, ...result.detected_ingredients])]);
    }
    setLoading(false);
    setAppStep('input');
  };

  const generateDinner = async () => {
    setLoading(true);
    const finalIngredients = useStaples ? [...ingredients, ...staples] : ingredients;
    const prompt = `Ingredients: ${finalIngredients.join(', ')}. Blocklist: ${exclusions.join(', ')}. Generate exactly 5 high-fidelity meal options in JSON.`;
    const payload = { 
      contents: [{ parts: [{ text: prompt }] }], 
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, 
      generationConfig: { responseMimeType: "application/json" } 
    };
    const result = await callGemini(payload);
    if (result) { 
      setAiData(result); 
      setSelectedMeal(result.dinner_options[0]); 
      setAppStep('results'); 
    }
    setLoading(false);
  };

  useEffect(() => {
    if (appStep === 'scanning') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => { streamRef.current = s; if (videoRef.current) videoRef.current.srcObject = s; })
        .catch(e => setAppError("Camera Link Failed."));
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  }, [appStep]);

  useEffect(() => {
    if (selectedMeal) {
      setRecipeImage(null);
      if (imageTimer) clearTimeout(imageTimer);
      const timer = setTimeout(() => {
        setRecipeImage(`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop&sig=${selectedMeal.id}`);
      }, 2000);
      setImageTimer(timer);
    }
  }, [selectedMeal]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 overflow-x-hidden font-sans">
      
      {/* 1. HEADER BRANDING */}
      <header className="py-12 border-b border-white/5 bg-gradient-to-b from-[#120A05] to-transparent relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#f9731633_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 relative z-10 text-center">
          <TextLogo className="text-7xl md:text-9xl drop-shadow-[0_0_50px_rgba(249,115,22,0.3)]" />
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.8em] text-orange-500 animate-pulse">Neural Kitchen Interface // v2.0 Beta</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        
        {/* 2. MEDIA PORTAL */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          <VideoCard src="/watzcommercial.mp4" title="Commercial Deployment" subtitle="The Kitchen Appliance OS" isMuted={isMuted} />
          <VideoCard src="/hologram4dinner.mp4" title="Neural Hologram" subtitle="Vision-to-Logic Core" isMuted={isMuted} />
        </section>

        {/* 3. RECRUITMENT & INFO */}
        <section className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent"></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Join the Beta Ops</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed text-center">
              We are recruiting kitchen intelligence specialists to stress-test the Neural Backbone v1.5. 
              Help us refine the vision-to-logic synthesis and hardware-accelerated recipe generation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
            <a href="mailto:Leonrdarden@gmail.com?subject=Watz V2 Beta Application" className="px-10 py-5 bg-orange-600 hover:bg-orange-500 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95">
              Apply to Beta <ArrowRight size={16} />
            </a>
            <a href="/instructions-watz-v2.html" target="_blank" className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all">
              Read Manual <ExternalLink size={16} />
            </a>
          </div>
        </section>

        {/* 4. THE ENGINE (Phone App Container) */}
        <section className="flex flex-col items-center space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-widest text-orange-500 italic">Interface Portal</h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Hardware Handshake Required to Initialize</p>
          </div>

          <div className="relative w-full max-w-[440px] h-[880px] bg-[#1a1a1a] rounded-[3.5rem] border-[14px] border-[#B45309] shadow-[0_60px_120px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col scale-90 sm:scale-100 origin-top">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#333] rounded-b-3xl z-[800]"></div>
            <div className="absolute top-4 left-10 z-[800] flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Neural Link {apiKey ? 'OK' : 'OFF'}</span>
            </div>

            {!isHandshaken && (
              <div className="absolute inset-0 z-[900] bg-[#120A05] flex flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
                  <ShieldCheck size={80} className="text-orange-500 relative z-10 mx-auto" strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white text-center">Initialize Appliance</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-12 px-6 leading-relaxed text-center text-zinc-400">Authorize Neural Vision and Audio Synthesis to Begin</p>
                <button onClick={handleHandshake} className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all">Authorize & Sync</button>
              </div>
            )}

            <div className="flex-1 bg-kitchen-cream overflow-hidden flex flex-col relative text-kitchen-woodDark">
              <ApplianceSplash isVisible={appStep === 'boot'} />
              {loading && <PlateLoader />}
              
              {['welcome', 'input', 'results'].includes(appStep) && (
                <header className="h-[100px] bg-kitchen-woodBase flex flex-col items-center justify-center relative shrink-0 border-b-4 border-kitchen-woodDark px-8">
                  <TextLogo className="text-4xl w-full" />
                  <button onClick={() => setShowSettings(!showSettings)} className="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-all z-[600]">
                    <Settings size={20} className={showSettings ? 'rotate-90 text-orange-400' : ''} />
                  </button>
                </header>
              )}

              <div className="flex-1 relative flex flex-col overflow-hidden">
                {/* SETTINGS DROPDOWN */}
                {showSettings && (
                  <div className="absolute inset-x-4 top-4 bg-white border-2 border-kitchen-woodBase rounded-3xl shadow-2xl z-[500] p-6 space-y-6 text-left animate-in slide-in-from-top-4 max-h-[80%] overflow-y-auto custom-scrollbar">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-kitchen-woodBase mb-3 flex items-center gap-2">
                        <ShieldAlert size={14} /> Hazard Blocklist
                      </h4>
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="text" value={exclusionValue} onChange={e => setExclusionValue(e.target.value)} 
                          onKeyDown={e => e.key === 'Enter' && exclusionValue && (setExclusions([...exclusions, exclusionValue]), setExclusionValue(''))} 
                          placeholder="e.g. Peanuts" className="flex-1 text-[10px] border-b border-zinc-200 outline-none p-1" 
                        />
                        <button onClick={() => exclusionValue && (setExclusions([...exclusions, exclusionValue]), setExclusionValue(''))} className="text-orange-600 font-black text-xs">+</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exclusions.map((ex, i) => (
                          <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-[8px] font-black rounded-full border border-red-100 flex items-center gap-1">
                            {ex} <X size={8} className="cursor-pointer" onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="text-[10px] font-black uppercase text-kitchen-woodBase mb-3 flex items-center gap-2">
                        <Sparkles size={14} /> System Bonuses
                      </h4>
                      {aiData ? (
                        <div className="space-y-4">
                          <div className="bg-orange-50 p-3 rounded-xl">
                            <p className="text-[8px] font-black text-orange-600 uppercase mb-1">Dessert Node</p>
                            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-tighter">{aiData.underlying_features.dessert_ideas[0].title}</p>
                            <p className="text-[8px] text-zinc-500 leading-tight mt-1">{aiData.underlying_features.dessert_ideas[0].description}</p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-xl">
                            <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">Morning Strategy</p>
                            <p className="text-[10px] font-black text-zinc-800 uppercase tracking-tighter">{aiData.underlying_features.tomorrow_breakfast.title}</p>
                            <p className="text-[8px] text-zinc-500 leading-tight mt-1">{aiData.underlying_features.tomorrow_breakfast.description}</p>
                          </div>
                        </div>
                      ) : <p className="text-[8px] text-zinc-400">Generate dinner to unlock projections</p>}
                    </div>
                    <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-kitchen-woodBase text-white rounded-xl font-black uppercase tracking-widest text-[9px]">Close Portal</button>
                  </div>
                )}

                {appStep === 'welcome' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 space-y-8 animate-in fade-in duration-700">
                    <button onClick={() => setAppStep('scanning')} className="w-full p-10 bg-white border-4 border-kitchen-woodBase rounded-[3rem] shadow-[0_15px_30px_rgba(120,53,15,0.2)] hover:bg-kitchen-woodBase hover:text-white transition-all group flex flex-col items-center gap-4">
                      <Camera size={48} className="text-kitchen-woodBase group-hover:text-white transition-colors" />
                      <span className="font-black uppercase tracking-widest text-lg text-kitchen-woodDark group-hover:text-white">Scan Storage</span>
                    </button>
                    <button onClick={() => setAppStep('input')} className="w-full p-10 bg-[#E2E8F0] border-4 border-zinc-300 rounded-[3rem] shadow-lg hover:border-kitchen-woodBase transition-all group flex flex-col items-center gap-4">
                      <Plus size={48} className="text-zinc-400 group-hover:text-kitchen-woodBase transition-colors" />
                      <span className="font-black uppercase tracking-widest text-lg text-kitchen-woodDark">Manual List</span>
                    </button>
                  </div>
                )}

                {appStep === 'scanning' && (
                  <div className="flex-1 bg-black relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain grayscale opacity-60" />
                    <canvas ref={canvasRef} className="hidden" />
                    <button onClick={handleFridgeScan} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center border-[8px] border-white/20 shadow-2xl active:scale-90 transition-all"><Camera size={32} className="text-black" /></button>
                    <button onClick={() => setAppStep('welcome')} className="absolute top-12 left-6 text-white/60 hover:text-white"><X size={32} /></button>
                  </div>
                )}

                {appStep === 'input' && (
                  <div className="flex-1 flex flex-col p-8 text-left h-full">
                    <h3 className="text-sm font-black text-kitchen-woodBase uppercase tracking-widest mb-6">Master Inventory</h3>
                    <div className="flex gap-2 mb-8">
                      <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && inputValue && (setIngredients([...new Set([...ingredients, inputValue.trim()])]), setInputValue(''))} placeholder="Add..." className="flex-1 bg-white border-2 border-kitchen-silverLight rounded-2xl px-4 py-3 font-bold text-kitchen-woodDark placeholder:text-zinc-300 outline-none focus:border-kitchen-woodBase" />
                      <button onClick={() => inputValue && (setIngredients([...new Set([...ingredients, inputValue.trim()])]), setInputValue(''))} className="bg-kitchen-woodBase text-white p-4 rounded-2xl shadow-md active:scale-95 transition-all"><Plus /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                      {ingredients.map((ing, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-zinc-100 flex justify-between shadow-sm animate-in slide-in-from-left duration-200">
                          <span className="font-black text-kitchen-woodDark uppercase text-xs tracking-tight">{ing}</span>
                          <Trash2 size={16} className="text-red-300 hover:text-red-600 transition-colors cursor-pointer" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} />
                        </div>
                      ))}
                      {ingredients.length === 0 && <div className="text-center py-12 text-zinc-300 font-black uppercase tracking-widest text-[8px] border-2 border-dashed border-zinc-100 rounded-2xl">Inventory Empty</div>}
                    </div>
                    <div className="pt-8">
                      <button onClick={generateDinner} disabled={ingredients.length === 0} className="w-full py-6 bg-kitchen-woodBase text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-30">Plan Dinner</button>
                    </div>
                  </div>
                )}

                {appStep === 'results' && aiData && selectedMeal && (
                  <div className="flex-1 flex flex-col text-left overflow-hidden">
                    <div className="p-4 bg-white border-b flex gap-3 overflow-x-auto scrollbar-hide shrink-0 snap-x">
                      {aiData.dinner_options.map(meal => (
                        <button key={meal.id} onClick={() => { setSelectedMeal(meal); setCheckedSteps({}); }} className={`px-4 py-3 rounded-xl text-[8px] font-black uppercase whitespace-nowrap border-2 snap-center transition-all shrink-0 ${selectedMeal.id === meal.id ? 'bg-kitchen-woodBase text-white border-kitchen-woodBase shadow-md' : 'bg-zinc-50 border-zinc-100 text-zinc-400'}`}>{meal.title}</button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
                      <div className="bg-white rounded-[2rem] border-2 border-kitchen-woodBase overflow-hidden shadow-sm">
                        <div className="p-6 space-y-4">
                          <h2 className="text-lg font-black text-kitchen-woodDark uppercase tracking-tighter leading-tight">{selectedMeal.title}</h2>
                          <div className="grid grid-cols-4 gap-2">
                            {Object.entries(selectedMeal.nutrition_facts).map(([k, v]) => (
                              <div key={k} className="text-center border-r last:border-0 border-zinc-100"><p className="text-[6px] font-black text-zinc-400 uppercase tracking-widest">{k.split('_')[0]}</p><p className="text-[9px] font-black text-kitchen-woodBase">{v}{k.includes('g') ? 'g' : ''}</p></div>
                            ))}
                          </div>
                        </div>
                        <div className={`h-40 w-full transition-opacity duration-1000 ${recipeImage ? 'opacity-100' : 'opacity-0'}`}><img src={recipeImage} className="w-full h-full object-cover" alt="Recipe" /></div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-2"><Apple size={10}/> Required Pantry</h4>
                          <div className="space-y-2">
                            {selectedMeal.left_column_ingredients.map((ing, i) => (
                              <div key={i} className="bg-white p-3 rounded-xl border border-zinc-100 shadow-sm flex justify-between items-center">
                                <p className="text-[10px] font-bold text-zinc-800 leading-tight">{ing.item}</p>
                                <p className="text-[9px] font-black text-kitchen-woodLight uppercase">{ing.amount}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-2"><Utensils size={10}/> Execution Protocol</h4>
                          <div className="space-y-2">
                            {selectedMeal.right_column_instructions.map((step, i) => (
                              <button key={i} onClick={() => setCheckedSteps({...checkedSteps, [i]: !checkedSteps[i]})} className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex gap-4 ${checkedSteps[i] ? 'bg-zinc-50 border-zinc-100 opacity-40 scale-95' : 'bg-white border-zinc-100 shadow-md'}`}>
                                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${checkedSteps[i] ? 'bg-zinc-300' : 'bg-kitchen-woodBase'} text-white shadow-inner`}>{i+1}</div>
                                <p className="text-xs font-bold text-kitchen-woodDark leading-tight tracking-tight">{step}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-white border-t flex justify-between items-center z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                      <button onClick={() => { setAppStep('welcome'); setAiData(null); setIngredients([]); }} className="text-zinc-400 hover:text-kitchen-woodBase uppercase font-black text-[10px] tracking-widest transition-colors flex items-center gap-2"><Home size={14} /> Reset OS</button>
                      <button onClick={() => window.print()} className="p-3 bg-kitchen-woodBase text-white rounded-xl shadow-lg active:scale-95 transition-all"><Download size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-2 w-32 bg-zinc-700/20 rounded-full mx-auto my-4 shrink-0" />
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-8 text-zinc-600 text-center flex flex-col items-center">
          <TextLogo className="text-4xl opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">© 2026 LEON R DARDEN // SECURE AI SYSTEMS</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        :root { --kitchen-cream: #FAFAF9; --kitchen-woodBase: #78350F; --kitchen-woodLight: #B45309; --kitchen-woodDark: #451A03; --kitchen-silverLight: #E2E8F0; }
        .bg-kitchen-cream { background: var(--kitchen-cream); }
        .bg-kitchen-woodBase { background: var(--kitchen-woodBase); }
        .bg-kitchen-woodDark { background: var(--kitchen-woodDark); }
        .text-kitchen-woodBase { color: var(--kitchen-woodBase); }
        .text-kitchen-woodDark { color: var(--kitchen-woodDark); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        @keyframes loadingBar { 0% { width: 0%; transform: translateX(-100%); } 50% { width: 70%; transform: translateX(0%); } 100% { width: 100%; transform: translateX(100%); } }
        .animate-loading-bar { animation: loadingBar 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}} />
    </div>
  );
}
