class WavioShell {
    constructor() {
        this.config = null;
        this.appContainer = document.getElementById('app-shell');
        this.init();
    }

    async init() {
        try {
            // Use absolute path for GitHub Pages compatibility
            const response = await fetch('/config.json');
            this.config = await response.json();
            this.setupStaticElements();
            this.navigate('home'); 
        } catch (err) {
            console.error("Shell Initialization Failed. Ensure config.json is in public folder.", err);
        }
    }

    setupStaticElements() {
        document.getElementById('nav-brand').innerText = this.config.siteConfig.brand;
        document.getElementById('footer-privacy').innerText = this.config.siteConfig.privacyProtocol;
    }

    navigate(viewId) {
        // Update Nav Links
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.getElementById(`link-${viewId}`);
        if (activeLink) activeLink.classList.add('active');

        // Clear current view
        this.appContainer.innerHTML = '';

        if (viewId === 'home') {
            this.renderHome();
        } else if (viewId === 'dashboard') {
            this.renderDashboard();
        } else {
            this.renderGenericSection(viewId);
        }
    }

    renderHome() {
        const h = this.config.hero;
        this.appContainer.innerHTML = `
            <div class="relative h-screen flex flex-col justify-center px-24 animate-fade-in">
                <div class="space-y-6">
                    <h1 class="text-[140px] font-black italic tracking-tighter leading-[0.8] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">${h.title}</h1>
                    <div class="glass-pill w-fit mt-6 opacity-10">${h.badge}</div>
                    
                    <div class="pt-6 space-y-4">
                        <h2 class="text-2xl font-black uppercase tracking-[0.4em] text-cyan-400">${h.subtitle}</h2>
                        <p class="wavio-font-thin text-lg text-white/50 leading-relaxed max-w-md">${h.body}</p>
                    </div>

                    <div class="flex gap-6 pt-12">
                        <button onclick="window.shell.navigate('dashboard')" class="btn-wavio-primary px-12 py-4 text-[10px]">${h.ctaPrimary}</button>
                        <button onclick="window.shell.navigate('gestures')" class="btn-wavio-outline px-12 py-4 text-[10px]">${h.ctaSecondary}</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderDashboard() {
        this.appContainer.innerHTML = `
            <div class="pt-32 px-12 max-w-7xl mx-auto animate-fade-in">
                <div class="flex justify-between items-center mb-12">
                    <h2 class="text-4xl font-black italic uppercase tracking-tighter text-cyan-400">System_Control</h2>
                    <div class="flex gap-4">
                        <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/40">Status: Online</div>
                        <div class="px-4 py-2 bg-cyan-500 text-black font-black rounded-full text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.5)]">Array: Active</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="tech-tank-card p-10 bg-black/40 border-l-4 border-cyan-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-cyan-200 mb-6">Acoustic_Stream</h3>
                        <div class="space-y-4 font-mono text-[10px] opacity-40">
                            <p>[${new Date().toLocaleTimeString()}] Pinging sectors 07-09...</p>
                            <p>[${new Date().toLocaleTimeString()}] Echo established: 19.0kHz</p>
                            <p>[${new Date().toLocaleTimeString()}] No anomalies detected.</p>
                        </div>
                    </div>
                    <div class="tech-tank-card p-10 bg-black/40 border-l-4 border-fuchsia-500">
                        <h3 class="text-xs font-black uppercase tracking-widest text-fuchsia-200 mb-6">Master_Vault</h3>
                        <button class="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">Unlock Logs</button>
                    </div>
                    <div class="tech-tank-card p-0 overflow-hidden relative border border-white/10 aspect-video">
                        <img src="/WavioWorld/images/placidplace-fish-18858.gif" class="w-full h-full object-cover opacity-40">
                        <div class="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-[8px] uppercase tracking-widest border border-white/5">Visual_Node_01</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderGenericSection(sectionId) {
        const data = this.config.sections[sectionId];
        if (!data) return;

        this.appContainer.innerHTML = `
            <div class="pt-32 px-12 max-w-5xl mx-auto animate-fade-in">
                <div class="glass-pill w-fit mb-6 border-cyan-500/30">${data.badge}</div>
                <h1 class="text-8xl font-black italic uppercase leading-[0.8] mb-4">${data.title}</h1>
                <h2 class="text-xl text-cyan-400 tracking-[0.4em] uppercase mb-12">${data.subtitle}</h2>
                <div class="text-lg text-white/60 leading-relaxed font-mono space-y-8">
                    <p>${data.content}</p>
                    ${data.metaBrand ? `
                        <div class="tech-tank-card p-8 bg-cyan-900/10 border-l-4 border-cyan-500 mt-12 shadow-2xl">
                            <h3 class="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-4">Meta_Brand_Logic</h3>
                            <p class="text-[12px] italic opacity-60">${data.metaBrand}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Global Instance
window.shell = new WavioShell();
