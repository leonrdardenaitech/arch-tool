import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Terminal, Cpu } from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

const SYSTEM_PROMPT = `You are the "Nexus Assistant," the official AI concierge for Leon R. Darden's AI Solutions Portfolio. 
Your goal is to help visitors understand Leon's 10 strategic nodes and his expertise as an AI Solutions Architect.

LEON'S CORE FACTS:
- Expertise: AI Architecture, Agentic Workflows, RAG Systems, Enterprise Automation.
- Certifications: Google AI Specialization (7 courses), Google Prompting Essentials.
- Key Projects: Watz 4 Dinner (Kitchen AI), Brand Builder 007 (Marketing AI), Hydro-Scan (Bio-RAG), Sector 08 (Logic Repair).
- Contact: Leonrdarden@gmail.com

TONE: Professional, futuristic, helpful, and slightly "cybernetic." Use terminology like "Node," "Synthesis," "Neural Link," and "Protocol." Keep responses concise.`;

export default function NexusChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Nexus Link Established. I am the portal to Leon R. Darden\'s architecture. How can I assist your synthesis today?' }
  ]);
  const [input, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + input }] }]
        })
      });
      
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication error. Neural link unstable.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Protocol Failure: Unable to reach Nexus Core.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] border-2 border-cyan-400 hover:scale-110 transition-all group"
        >
          <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-20"></div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-[#0a0314]/95 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-5 bg-cyan-950/50 border-b border-cyan-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Nexus Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-tighter">Core Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#05010a]/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-[#150727] text-cyan-50 border border-cyan-500/20 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#150727] p-4 rounded-2xl rounded-tl-none border border-cyan-500/20">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0a0314] border-t border-cyan-500/20">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Initialize protocol..."
                className="w-full bg-[#150727] border border-cyan-500/30 rounded-full py-3 px-5 pr-12 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-400 transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-3 text-[8px] text-center text-slate-600 uppercase tracking-[0.2em]">Neural Sync v1.0 // Secured Link</p>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}
