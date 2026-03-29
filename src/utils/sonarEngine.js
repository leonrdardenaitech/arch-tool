/**
 * WaVio Sonar Engine
 * Utilizing Web Audio API for inaudible high-frequency (19kHz) gesture detection
 * and Accelerometer telemetry for impact (bump) detection.
 */

class WavioEngine {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.analyzer = null;
    this.isListening = false;
    this.animationFrameId = null;
    this.targetFrequency = 19000; // 19kHz
    this.sensitivity = 50; 
    this.baselineEcho = 0; 
    this.motionHandler = null;
  }

  async start() {
    if (this.isListening) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioCtx.createMediaStreamSource(stream);
      
      this.analyzer = this.audioCtx.createAnalyser();
      this.analyzer.fftSize = 2048;
      this.analyzer.smoothingTimeConstant = 0.8;
      source.connect(this.analyzer);

      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(this.targetFrequency, this.audioCtx.currentTime);
      
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime); // Very low volume
      
      this.oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();
      
      this.isListening = true;
      this._scanAcoustics();
      this._listenForBumps();
      console.log("🌊 WaVio Sonar: ONLINE");
    } catch (err) {
      console.error("WaVio Init Failed. Need HTTPS/Mic.", err);
    }
  }

  _scanAcoustics() {
    if (!this.isListening) return;
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);

    const nyquist = this.audioCtx.sampleRate / 2;
    const targetBin = Math.floor((this.targetFrequency / nyquist) * this.analyzer.frequencyBinCount);
    const currentEcho = dataArray[targetBin];

    // Low-pass filter for baseline
    this.baselineEcho = (this.baselineEcho * 0.95) + (currentEcho * 0.05);

    // Detection logic
    if (currentEcho > this.baselineEcho + this.sensitivity) {
      this._triggerEvent('WavioSwipe', { strength: currentEcho });
      this._cooldown(); 
    }

    if (this.isListening) {
      this.animationFrameId = requestAnimationFrame(() => this._scanAcoustics());
    }
  }

  _listenForBumps() {
    this.motionHandler = (event) => {
      const forceZ = Math.abs(event.acceleration?.z || 0);
      if (forceZ > 8.5) {
        this._triggerEvent('WavioBump', { force: forceZ });
        this._cooldown();
      }
    };
    window.addEventListener('devicemotion', this.motionHandler);
  }

  _triggerEvent(eventName, payload) {
    window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
  }

  _cooldown() {
    this.isListening = false;
    setTimeout(() => { 
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.isListening = true; 
        this._scanAcoustics(); 
      }
    }, 1000);
  }

  stop() {
    this.isListening = false;
    if (this.oscillator) { 
      try { this.oscillator.stop(); } catch(e) {}
      this.oscillator.disconnect(); 
    }
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.motionHandler) window.removeEventListener('devicemotion', this.motionHandler);
    if (this.audioCtx) this.audioCtx.close();
    console.log("🌊 WaVio Sonar: OFFLINE");
  }
}

const wavioEngine = new WavioEngine();
export default wavioEngine;
