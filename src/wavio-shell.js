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
                                <button class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">▶</button>
                                <button class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">II</button>
                                <button class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">↺</button>
                                <button class="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">⏰</button>
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
            <div class="relative z-10 max-w-5xl mx-auto p-6 md:p-24 space-y-24 animate-fade-in overflow-y-auto h-screen custom-scrollbar">
                <header class="space-y-6">
                    <div class="glass-pill w-fit border-cyan-500/30">${d.badge}</div>
                    <h1 class="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                        Leon R. <span class="text-cyan-500">Darden</span>
                    </h1>
                    <p class="text-sm font-mono text-cyan-700 uppercase tracking-[0.4em] font-bold">${d.subtitle}</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-16 pb-32">
                    <section class="space-y-8">
                        <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Professional_Identity</h3>
                        <p class="text-[13px] leading-relaxed text-white/60 font-mono">${d.content}</p>
                    </section>
                    <section class="space-y-8">
                        <div class="tech-tank-card p-8 bg-cyan-900/10 border-l-4 border-cyan-500 shadow-2xl">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-4">Meta_Brand_Logic</h3>
                            <p class="text-[12px] font-mono text-white/40 leading-loose italic">${d.metaBrand}</p>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        this.appContainer.innerHTML = `
            <div class="pt-32 px-12 max-w-7xl mx-auto animate-fade-in h-screen overflow-y-auto custom-scrollbar pb-32">
                <div class="flex justify-between items-center mb-12">
                    <h2 class="text-4xl font-black italic uppercase tracking-tighter text-cyan-400">System_Control</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="tech-tank-card p-10 bg-black/40 border-l-4 border-cyan-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-cyan-200 mb-6">Acoustic_Stream</h3>
                        <div id="logs" class="space-y-4 font-mono text-[10px] opacity-40">
                            <p>[${new Date().toLocaleTimeString()}] Pinging sectors...</p>
                        </div>
                    </div>
                    <div class="tech-tank-card p-10 bg-black/40 border-l-4 border-fuchsia-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-fuchsia-200 mb-6">Master_Vault</h3>
                        <div class="space-y-2 opacity-40 text-[9px] uppercase">
                            <div class="flex justify-between border-b border-white/5 pb-2"><span>Archive_01</span><span>[LOCKED]</span></div>
                            <div class="flex justify-between border-b border-white/5 pb-2"><span>Neural_Log</span><span>[LOCKED]</span></div>
                        </div>
                    </div>
                    <div class="tech-tank-card p-0 overflow-hidden relative border border-white/10 aspect-video">
                        <img src="/WavioWorld/images/placidplace-fish-18858.gif" class="w-full h-full object-cover opacity-40">
                    </div>
                </div>
            </div>
        `;
    }

    renderGestures() {
        this.appContainer.innerHTML = `
            <div class="pt-32 px-12 max-w-6xl mx-auto animate-fade-in h-screen overflow-y-auto custom-scrollbar pb-32">
                <header class="mb-12">
                    <h2 class="text-5xl font-light tracking-[0.2em] text-cyan-400 uppercase wavio-font-thin">Gesture Calibration</h2>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="tech-tank-card p-8 border-l-4 border-cyan-500">
                        <h3 class="text-xl font-bold italic mb-4">The Swipe</h3>
                        <p class="text-xs opacity-50 font-mono tracking-widest">Action: Rewind_15s</p>
                    </div>
                    <div class="tech-tank-card p-8 border-l-4 border-red-500">
                        <h3 class="text-xl font-bold italic mb-4">The Impact</h3>
                        <p class="text-xs opacity-50 font-mono tracking-widest">Action: Play_Pause</p>
                    </div>
                    <div class="tech-tank-card p-8 border-l-4 border-yellow-500">
                        <h3 class="text-xl font-bold italic mb-4">Air Wave</h3>
                        <p class="text-xs opacity-50 font-mono tracking-widest">Action: Skip</p>
                    </div>
                </div>
            </div>
        `;
    }

    initiateHandshake() {
        const msg = document.getElementById('phone-msg');
        msg.innerText = "Dispensing Feed...";
        setTimeout(() => { msg.innerText = "Tap mic to wake"; }, 3000);
    }
}

window.shell = new WavioShell();
