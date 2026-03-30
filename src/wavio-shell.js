class WavioShell {
    constructor() {
        this.config = null;
        this.appContainer = document.getElementById('app-shell');
        this.isMuted = true;
        this.bgIndex = 0;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/config.json');
            this.config = await response.json();
            this.setupStaticElements();
            this.navigate('home'); 
            lucide.createIcons();
        } catch (err) {
            console.error("Shell Initialization Failed:", err);
        }
    }

    setupStaticElements() {
        document.getElementById('nav-brand').innerText = this.config.siteConfig.brand;
        document.getElementById('footer-privacy').innerText = this.config.siteConfig.privacyProtocol;
    }

    toggleSettings() {
        document.getElementById('settings-panel').classList.toggle('open');
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const video = document.getElementById('bg-video');
        const icon = document.getElementById('mute-icon');
        video.muted = this.isMuted;
        icon.setAttribute('data-lucide', this.isMuted ? 'volume-x' : 'volume-2');
        lucide.createIcons();
    }

    cycleBackground(dir) {
        this.bgIndex = (this.bgIndex + dir + this.config.backgrounds.length) % this.config.backgrounds.length;
        const bg = this.config.backgrounds[this.bgIndex];
        const video = document.getElementById('bg-video');
        const bgDiv = document.getElementById('global-bg');
        
        if (bg.type === 'video') {
            bgDiv.innerHTML = `<video id="bg-video" autoPlay loop muted="${this.isMuted}" playsinline class="w-full h-full object-cover opacity-30 mix-blend-screen scale-105" src="${bg.src}"></video><div class="absolute inset-0 bg-gradient-to-r from-[#001f3f]/80 via-transparent to-[#001f3f]/80"></div>`;
        } else {
            bgDiv.innerHTML = `<img class="w-full h-full object-cover opacity-20" src="${bg.src}"><div class="absolute inset-0 bg-gradient-to-r from-[#001f3f]/80 via-transparent to-[#001f3f]/80"></div>`;
        }
    }

    navigate(viewId) {
        window.scrollTo(0, 0);
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.getElementById(`link-${viewId}`);
        if (activeLink) activeLink.classList.add('active');

        this.appContainer.innerHTML = '';

        if (viewId === 'home') this.renderHome();
        else if (viewId === 'dashboard') this.renderDashboard();
        else if (viewId === 'architect') this.renderArchitect();
        else if (viewId === 'gestures') this.renderGestures();
        
        lucide.createIcons();
    }

    renderHome() {
        const h = this.config.hero;
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen w-full flex animate-fade-in pt-16">
                <!-- LEFT COLUMN: CENTERED CONTENT -->
                <main class="relative z-10 w-1/2 flex flex-col items-center justify-center text-center px-12">
                    <div class="space-y-8 max-w-xl">
                        <div class="space-y-2">
                            <h1 class="text-[120px] font-black italic tracking-tighter text-white leading-none drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">${h.title}</h1>
                            <div class="glass-pill mx-auto w-fit opacity-20">${h.badge}</div>
                        </div>
                        <div class="space-y-4">
                            <h2 class="text-3xl font-black uppercase tracking-[0.4em] text-cyan-400">Trigger from Hand Gestures</h2>
                            <p class="wavio-font-thin text-xl text-white/50 leading-relaxed">${h.body}</p>
                        </div>
                        <div class="flex justify-center gap-6 pt-8">
                            <button onclick="shell.navigate('dashboard')" class="btn-wavio-primary px-12 py-4 text-[10px]">Open Dashboard</button>
                            <button onclick="shell.navigate('gestures')" class="btn-wavio-outline px-12 py-4 text-[10px]">Learn Gestures</button>
                        </div>
                    </div>
                </main>

                <!-- RIGHT COLUMN: THE PHONE -->
                <div class="relative z-10 w-1/2 flex items-center justify-center pr-24">
                    <div class="phone-mockup flex flex-col bg-black scale-90 border-[1px] border-black ring-[12px] ring-[#001f3f] ring-inset outline outline-1 outline-black/40 shadow-3xl">
                        <div class="bg-[#001f3f] h-12 flex items-center justify-between px-6 text-white/50 z-20">
                            <span class="text-[9px] font-black tracking-widest">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                <i data-lucide="settings" size="10"></i>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-col relative overflow-hidden">
                            <div class="absolute inset-0 z-0 opacity-40">
                                <video autoPlay loop muted playsinline class="w-full h-full object-cover" src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"></video>
                            </div>
                            <div class="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <div class="mb-8 opacity-50">
                                    <h4 class="text-3xl font-black italic tracking-tighter text-white">WaVio</h4>
                                    <p class="text-[8px] uppercase tracking-[0.3em] text-cyan-400 font-bold mt-1">Trigger from hand gestures</p>
                                </div>
                                <div class="mb-12">
                                    <img src="/WavioWorld/images/placidplace-fish-13525.gif" class="w-24 h-24 animate-fish-float opacity-60" alt="Fish">
                                </div>
                                <p id="phone-msg" class="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black animate-pulse">Tap mic to wake</p>
                            </div>
                            <!-- Gesture Controls Layer -->
                            <div class="px-6 pb-4 grid grid-cols-4 gap-3 relative z-10 bg-black/40 backdrop-blur-md border-t border-white/5 pt-4">
                                <button class="p-2 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><i data-lucide="play" size="12"></i></button>
                                <button class="p-2 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><i data-lucide="pause" size="12"></i></button>
                                <button class="p-2 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><i data-lucide="rotate-ccw" size="12"></i></button>
                                <button class="p-2 bg-white/5 rounded-lg flex items-center justify-center text-white/40"><i data-lucide="cast" size="12"></i></button>
                            </div>
                            <!-- Bottom Triggers -->
                            <div class="flex items-center justify-center gap-5 pb-10 relative z-10 bg-black/40 backdrop-blur-md">
                                <button class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg text-white"><i data-lucide="mic" size="18"></i></button>
                                <button onclick="shell.initiateHandshake()" class="group w-20 h-20 bg-[#001f3f] rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl transition-all hover:bg-green-500 hover:border-white">
                                    <i data-lucide="radar" size="32" class="text-white group-hover:animate-ping"></i>
                                </button>
                                <button onclick="shell.navigate('dashboard')" class="w-12 h-12 bg-[#007bff] rounded-full flex items-center justify-center shadow-lg text-white"><i data-lucide="layout-dashboard" size="18"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen pt-32 px-12 max-w-7xl mx-auto animate-fade-in overflow-y-auto pb-32 custom-scrollbar">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
                    <!-- Circle Clock Widget -->
                    <div class="tech-tank-card flex flex-col items-center justify-center p-6 bg-black/40 border-l-4 border-cyan-500 relative overflow-hidden">
                        <div class="w-32 h-32 rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative">
                            <div class="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin duration-[10s]"></div>
                            <span class="text-2xl font-black italic text-cyan-400">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p class="text-[8px] uppercase tracking-widest text-white/30 mt-4">Neural_Time_Sync</p>
                    </div>

                    <!-- Acoustic Stream Telemetry -->
                    <div class="tech-tank-card col-span-2 p-8 bg-black/60 border-l-4 border-cyan-500 flex flex-col">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-xs font-black uppercase tracking-widest text-cyan-200">Acoustic_Stream</h3>
                            <div class="flex gap-2">
                                <div class="px-2 py-1 bg-green-500/20 text-green-400 text-[7px] font-black rounded uppercase">Ping: 19kHz</div>
                                <div class="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-[7px] font-black rounded uppercase">Prox: Active</div>
                            </div>
                        </div>
                        <div class="flex-1 font-mono text-[9px] opacity-40 space-y-2 overflow-hidden">
                            <p>[${new Date().toLocaleTimeString()}] Accelerometer Z-Axis: 0.98g (STABLE)</p>
                            <p>[${new Date().toLocaleTimeString()}] Ultrasonic Echo established: Sector 04-09</p>
                            <p>[${new Date().toLocaleTimeString()}] Handshake Verification... [SUCCESS]</p>
                        </div>
                    </div>

                    <!-- Battery Status -->
                    <div class="tech-tank-card p-6 bg-black/40 border-l-4 border-green-500 flex flex-col items-center justify-center">
                        <i data-lucide="battery-charging" class="text-green-400 mb-4" size="32"></i>
                        <span class="text-2xl font-black italic text-white">98%</span>
                        <p class="text-[8px] uppercase tracking-widest text-white/30 mt-2">Array_Vitality</p>
                    </div>

                    <!-- Fish Tank Widget -->
                    <div class="tech-tank-card col-span-2 p-0 overflow-hidden relative group">
                        <img src="/WavioWorld/images/placidplace-fish-18858.gif" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                        <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                            <div class="flex gap-4">
                                <button class="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500 text-white text-[8px] font-black rounded-lg uppercase transition-all">Feed Fish</button>
                                <button class="px-4 py-2 bg-white/5 hover:bg-white/20 text-white text-[8px] font-black rounded-lg uppercase transition-all">pH Balance</button>
                            </div>
                            <div class="text-cyan-400 animate-pulse"><i data-lucide="activity" size="16"></i></div>
                        </div>
                    </div>

                    <!-- Master Vault -->
                    <div class="tech-tank-card p-8 bg-black/60 border-l-4 border-fuchsia-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-fuchsia-200 mb-6">Master_Vault</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between border-b border-white/5 pb-2 text-[8px] opacity-40 uppercase"><span>Neural_Log</span><span>[SECURED]</span></div>
                            <div class="flex justify-between border-b border-white/5 pb-2 text-[8px] opacity-40 uppercase"><span>Vault_Archive</span><i data-lucide="lock" size="10"></i></div>
                        </div>
                    </div>

                    <!-- Voice Input Widget -->
                    <div class="tech-tank-card p-8 bg-black/60 border-l-4 border-red-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-red-200 mb-6">Voice_Node</h3>
                        <div class="flex flex-col items-center justify-center gap-4">
                            <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse"><i data-lucide="mic" class="text-red-500"></i></div>
                            <p class="text-[8px] uppercase tracking-widest text-white/30 italic">Listening for intent...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGestures() {
        this.appContainer.innerHTML = `
            <div class="relative min-h-screen pt-32 px-12 max-w-6xl mx-auto animate-fade-in overflow-y-auto pb-32 custom-scrollbar">
                <header class="mb-12 space-y-4">
                    <h2 class="text-5xl font-light tracking-[0.2em] text-cyan-400 uppercase wavio-font-thin">Gesture Calibration</h2>
                    <p class="text-[10px] font-mono text-cyan-700 uppercase tracking-[0.5em] font-bold">Neural Mapping // Acoustic Synthesis</p>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <!-- Flip Cards -->
                    ${['The Swipe', 'The Impact', 'Air Wave'].map((title, i) => `
                        <div class="group h-[300px] [perspective:1000px]">
                            <div class="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                <div class="absolute inset-0 h-full w-full [backface-visibility:hidden] tech-tank-card p-10 border-l-4 border-cyan-500 flex flex-col justify-between">
                                    <h3 class="text-2xl font-bold italic">${title}</h3>
                                    <p class="text-[9px] uppercase tracking-[0.3em] text-white/30">Hover to decode</p>
                                </div>
                                <div class="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)] tech-tank-card p-10 bg-cyan-900/40 border-l-4 border-cyan-400 flex flex-col justify-center">
                                    <p class="text-xs font-mono leading-relaxed italic text-white/80">Movement Language Node_${i+1}: Establish binary trigger through 19kHz doppler shift variance.</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="tech-tank-card p-12 bg-gradient-to-br from-[#001f3f] to-transparent border border-white/5 text-center space-y-8">
                    <h3 class="text-3xl font-black italic tracking-tighter uppercase">Calibrate / Customize</h3>
                    <button class="btn-wavio-primary px-16 py-5 text-xs shadow-2xl">Initialize Diagnostic</button>
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
                        <h2 class="text-xl text-cyan-400 tracking-[0.4em] uppercase font-bold">${d.subtitle}</h2>
                    </header>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <section class="space-y-8">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Technical_Dossier</h3>
                            <!-- Scrollable Technical Window -->
                            <div class="h-[200px] w-full bg-black/40 rounded-2xl border border-white/5 p-6 overflow-y-auto custom-scrollbar font-mono text-xs text-cyan-400/60 leading-relaxed whitespace-pre-line">
                                ${d.techSpecs}
                            </div>
                        </section>
                        <section class="space-y-8">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">WaVio_Marketing_Logic</h3>
                            <p class="text-[13px] leading-relaxed text-white/60 font-mono italic">${d.marketing}</p>
                        </section>
                    </div>

                    <div class="w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 relative group shadow-3xl">
                        <video autoPlay loop muted playsinline class="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-1000" src="/WavioWorld/video/Amazingly_Beautiful_3D_Aquarium_Live_Wallpaper_Wallpaper.mp4"></video>
                        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
                            <p class="text-[10px] font-black uppercase tracking-[1.5em] text-white/40 mb-2">Aquarium_Node_Active</p>
                            <div class="w-32 h-[1px] bg-cyan-500/50"></div>
                        </div>
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
