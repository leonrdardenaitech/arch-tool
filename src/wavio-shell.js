class WavioShell {
    constructor() {
        this.config = null;
        this.appContainer = document.getElementById('app-shell');
        this.isInitializing = false;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/config.json');
            this.config = await response.json();
            this.setupStaticElements();
            this.navigate('home'); 
        } catch (err) {
            console.error("Shell Initialization Failed:", err);
        }
    }

    setupStaticElements() {
        document.getElementById('nav-brand').innerText = this.config.siteConfig.brand;
        document.getElementById('footer-privacy').innerText = this.config.siteConfig.privacyProtocol;
    }

    navigate(viewId) {
        window.scrollTo(0, 0);
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.getElementById(`link-${viewId}`);
        if (activeLink) activeLink.classList.add('active');

        this.appContainer.innerHTML = '';

        if (viewId === 'home') {
            this.renderHome();
        } else if (viewId === 'dashboard') {
            this.renderDashboard();
        } else if (viewId === 'architect') {
            this.renderArchitect();
        } else if (viewId === 'gestures') {
            this.renderGestures();
        }
    }

    renderHome() {
        const h = this.config.hero;
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen w-full flex animate-fade-in">
                <!-- LEFT COLUMN -->
                <main class="relative z-10 w-1/2 flex flex-col justify-center pl-24 pr-12 scale-90 origin-left">
                    <div class="space-y-6">
                        <h1 class="text-[120px] font-black italic tracking-tighter text-white leading-[0.8] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">${h.title}</h1>
                        <div class="glass-pill w-fit mt-6 opacity-10">${h.badge}</div>
                        <div class="pt-6 space-y-4">
                            <h2 class="text-2xl font-black uppercase tracking-[0.4em] text-cyan-400">${h.subtitle}</h2>
                            <p class="wavio-font-thin text-lg text-white/50 leading-relaxed max-w-md">${h.body}</p>
                        </div>
                        <div class="flex gap-6 pt-12">
                            <button onclick="shell.navigate('dashboard')" class="btn-wavio-primary px-12 py-4 text-[10px]">Open Dashboard</button>
                            <button onclick="shell.navigate('gestures')" class="btn-wavio-outline px-12 py-4 text-[10px]">Learn Gestures</button>
                        </div>
                    </div>
                </main>

                <!-- RIGHT COLUMN: THE PHONE -->
                <div class="relative z-10 w-1/2 flex items-center justify-center pr-24 pt-16">
                    <div class="phone-mockup flex flex-col bg-black scale-90 border-[1px] border-black ring-[12px] ring-[#001f3f] ring-inset outline outline-1 outline-black/40">
                        <div class="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50 z-20">
                            <span class="text-[9px] font-black tracking-widest">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div class="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                        </div>
                        <div class="flex-1 flex flex-col relative overflow-hidden">
                            <div class="absolute inset-0 z-0 opacity-40">
                                <video autoPlay loop muted playsinline class="w-full h-full object-cover" src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"></video>
                            </div>
                            <div class="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <div class="mb-8 opacity-40">
                                    <h4 class="text-3xl font-black italic tracking-tighter text-white">WaVio</h4>
                                    <p class="text-[8px] uppercase tracking-[0.3em] text-cyan-400 font-bold mt-1">Trigger from hand gestures</p>
                                </div>
                                <div class="mb-12">
                                    <img src="/WavioWorld/images/placidplace-fish-13525.gif" class="w-24 h-24 animate-fish-float opacity-60" alt="Fish">
                                </div>
                                <p id="phone-msg" class="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black animate-pulse">Tap mic to wake</p>
                            </div>
                            <!-- Controls -->
                            <div class="px-6 pb-6 grid grid-cols-4 gap-3 relative z-10 bg-black/40 backdrop-blur-md">
                                <button onclick="shell.navigate('gestures')" class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">▶</button>
                                <button onclick="shell.navigate('gestures')" class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">II</button>
                                <button onclick="shell.navigate('gestures')" class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">↺</button>
                                <button onclick="shell.navigate('gestures')" class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">⏰</button>
                            </div>
                            <!-- Triggers -->
                            <div class="flex items-center justify-center gap-5 pb-12 relative z-10 bg-black/40 backdrop-blur-md">
                                <button class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white">🎤</button>
                                <button onclick="shell.initiateHandshake()" class="w-20 h-20 bg-[#001f3f] rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl transition-all">📡</button>
                                <button onclick="shell.navigate('dashboard')" class="w-12 h-12 bg-[#007bff] rounded-full flex items-center justify-center shadow-lg text-white">📊</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderArchitect() {
        const d = this.config.sections.architect;
        this.appContainer.innerHTML = `
            <div class="relative z-10 min-h-screen animate-fade-in overflow-y-auto pt-24 pb-32 custom-scrollbar">
                <div class="max-w-5xl mx-auto px-6 space-y-24">
                    <header class="space-y-6">
                        <div class="glass-pill w-fit border-cyan-500/30">${d.badge}</div>
                        <h1 class="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                            Leon R. <span class="text-cyan-500">Darden</span>
                        </h1>
                        <p class="text-sm font-mono text-cyan-700 uppercase tracking-[0.4em] font-bold">${d.subtitle}</p>
                    </header>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <section class="space-y-8">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Professional_Identity</h3>
                            <div class="text-[13px] leading-relaxed text-white/60 space-y-6 font-mono">
                                <p>${d.content}</p>
                            </div>
                            <div class="space-y-4 pt-8">
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Technical_Stack_Core</h3>
                                <div class="grid grid-cols-2 gap-4 text-[10px] font-mono text-cyan-400/60">
                                    <div class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">Gemini 1.5 Pro</div>
                                    <div class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">React / Node.js</div>
                                    <div class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">Prompt Eng.</div>
                                    <div class="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">Vector RAG</div>
                                </div>
                            </div>
                        </section>
                        <section class="space-y-8">
                            <div class="tech-tank-card p-8 bg-cyan-900/10 border-l-4 border-cyan-500 shadow-2xl">
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-4">Meta_Brand_Logic</h3>
                                <p class="text-[12px] font-mono text-white/40 leading-loose italic">${d.metaBrand}</p>
                            </div>
                        </section>
                    </div>

                    <div class="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-3xl">
                        <video autoPlay loop muted playsinline class="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-1000" src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"></video>
                        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
                            <p class="text-[10px] font-black uppercase tracking-[1.5em] text-white/40 mb-2">Acoustic_Architecture_Node</p>
                            <div class="w-32 h-[1px] bg-cyan-500/50"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen pt-32 px-12 max-w-7xl mx-auto animate-fade-in overflow-y-auto pb-32">
                <div class="flex justify-between items-center mb-12">
                    <h2 class="text-4xl font-black italic uppercase tracking-tighter text-cyan-400">System_Control</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="tech-tank-card p-10 bg-black/60 border-l-4 border-cyan-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-cyan-200 mb-6">Acoustic_Stream</h3>
                        <div id="logs" class="space-y-4 font-mono text-[10px] opacity-40">
                            <p>[${new Date().toLocaleTimeString()}] Establishing echo frequency...</p>
                            <p>[${new Date().toLocaleTimeString()}] System: ONLINE</p>
                        </div>
                    </div>
                    <div class="tech-tank-card p-10 bg-black/60 border-l-4 border-fuchsia-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-fuchsia-200 mb-6">Master_Vault</h3>
                        <div class="space-y-3 opacity-40 text-[9px] uppercase">
                            <div class="flex justify-between border-b border-white/5 pb-2"><span>Archive_01</span><span>[SECURED]</span></div>
                            <div class="flex justify-between border-b border-white/5 pb-2"><span>Neural_Log</span><span>[SECURED]</span></div>
                        </div>
                    </div>
                    <div class="tech-tank-card p-0 overflow-hidden relative border border-white/10 aspect-video group">
                        <img src="/WavioWorld/images/placidplace-fish-18858.gif" class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <div class="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[8px] uppercase tracking-widest border border-white/5">Visual_Node_01</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGestures() {
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen pt-32 px-12 max-w-6xl mx-auto animate-fade-in overflow-y-auto pb-32">
                <header class="mb-12 space-y-4">
                    <h2 class="text-5xl font-light tracking-[0.2em] text-cyan-400 uppercase wavio-font-thin">Gesture Calibration</h2>
                    <p class="text-[10px] font-mono text-cyan-700 uppercase tracking-[0.5em] font-bold">Neural Mapping // Acoustic Synthesis</p>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="tech-tank-card p-10 border-l-4 border-cyan-500 group relative overflow-hidden">
                        <h3 class="text-2xl font-bold italic mb-4">The Swipe</h3>
                        <p class="text-[10px] uppercase font-black tracking-widest text-cyan-500 bg-white/5 px-3 py-1 rounded-full w-fit mb-8">Action: Rewind</p>
                        <p class="text-xs text-white/40 font-mono italic leading-relaxed">Detecting ultrasonic doppler shift from broad horizontal motion.</p>
                        <img src="/WavioWorld/images/placidplace-fish-13525.gif" class="absolute bottom-[-10%] right-[-5%] w-32 h-32 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    </div>
                    <div class="tech-tank-card p-10 border-l-4 border-red-500 group relative overflow-hidden">
                        <h3 class="text-2xl font-bold italic mb-4">The Impact</h3>
                        <p class="text-[10px] uppercase font-black tracking-widest text-red-500 bg-white/5 px-3 py-1 rounded-full w-fit mb-8">Action: Play/Pause</p>
                        <p class="text-xs text-white/40 font-mono italic leading-relaxed">Mapping Z-axis telemetry triggers to binary media state toggle.</p>
                        <img src="/WavioWorld/images/placidplace-fish-18858.gif" class="absolute bottom-[-10%] right-[-5%] w-32 h-32 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    </div>
                    <div class="tech-tank-card p-10 border-l-4 border-yellow-500 group relative overflow-hidden">
                        <h3 class="text-2xl font-bold italic mb-4">Air Wave</h3>
                        <p class="text-[10px] uppercase font-black tracking-widest text-yellow-500 bg-white/5 px-3 py-1 rounded-full w-fit mb-8">Action: Skip</p>
                        <p class="text-xs text-white/40 font-mono italic leading-relaxed">Consecutive sweep detection initiates track progression.</p>
                        <img src="/WavioWorld/images/placidplace-fish-13525.gif" class="absolute bottom-[-10%] right-[-5%] w-32 h-32 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    </div>
                </div>
            </div>
        `;
    }

    initiateHandshake() {
        const msg = document.getElementById('phone-msg');
        msg.innerText = "Dispensing Feed...";
        msg.classList.remove('animate-pulse');
        msg.classList.add('text-green-400');
        setTimeout(() => { 
            msg.innerText = "Tap mic to wake"; 
            msg.classList.add('animate-pulse');
            msg.classList.remove('text-green-400');
        }, 3000);
    }
}

window.shell = new WavioShell();
