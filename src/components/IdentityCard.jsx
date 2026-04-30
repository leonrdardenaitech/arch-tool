import React, { useState, useEffect, useRef } from 'react';
import './IdentityCard.css';

const IdentityCard = ({ selectedProject }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [terminalLog, setTerminalLog] = useState([
    { type: 'system', text: "Agentic infrastructure active." },
    { type: 'system', text: "Type 'help' for available commands." }
  ]);
  
  const logEndRef = useRef(null);

  // IdentityBot Telemetry Feed Logic
  const messages = [
    "SYSTEM ONLINE. DARDEN ARCHITECTURE ACTIVE.",
    "SCANNING B2B PIPELINES...",
    "ALL 8 NODES SECURED. READY FOR HR INQUIRY.",
    "AWAITING COMMAND...",
    "DARDEN GRADE PROTOCOLS INITIALIZED."
  ];

  useEffect(() => {
    let currentMessageIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;

    const type = () => {
      const currentMessage = messages[currentMessageIndex];
      
      if (!isDeleting && currentCharIndex <= currentMessage.length) {
        setDisplayText(currentMessage.substring(0, currentCharIndex));
        currentCharIndex++;
        typingSpeed = 50;
        setIsTyping(true);
      } else if (isDeleting && currentCharIndex >= 0) {
        setDisplayText(currentMessage.substring(0, currentCharIndex));
        currentCharIndex--;
        typingSpeed = 25;
        setIsTyping(true);
      }

      if (currentCharIndex === currentMessage.length + 1) {
        isDeleting = true;
        typingSpeed = 2000;
        setIsTyping(false);
      } else if (currentCharIndex === -1) {
        isDeleting = false;
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        typingSpeed = 500;
        setIsTyping(false);
      }

      setTimeout(type, typingSpeed);
    };

    const typingTimeout = setTimeout(type, typingSpeed);
    return () => clearTimeout(typingTimeout);
  }, []);

  // Sync terminal with project selection
  useEffect(() => {
    if (selectedProject) {
      const accessLog = [
        { type: 'system', text: `ACCESSING NODE_${selectedProject.id.toString().padStart(2, '0')}...` },
        { type: 'system', text: `ESTABLISHING DOWNLINK: ${selectedProject.title}` }
      ];
      setTerminalLog(prev => [...prev, ...accessLog]);
    }
  }, [selectedProject]);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLog]);

  const commandCache = {
    "help": "Available commands: summary, projects, contact, clear",
    "summary": "Bridging machine intelligence with human operational trust. 2000+ hours of dedicated AI research. Focus: B2B workflows and utility systems.",
    "projects": "Accessing project grid... Click any disc to view deployment architecture.",
    "contact": "LOC: Atlanta Metro | Requesting secure comms...",
  };

  const handleCommandSubmit = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const command = inputValue.trim().toLowerCase();
      
      const newLog = [...terminalLog, { type: 'user', text: `> ${command}` }];
      
      let responseText = "";
      if (command === 'clear') {
         setTerminalLog([]);
         setInputValue("");
         return;
      } else if (commandCache[command]) {
         responseText = commandCache[command];
      } else {
         responseText = "Unrecognized command. Type 'help' for options, or await backend LLM connection.";
      }

      setTerminalLog([...newLog, { type: 'system', text: responseText }]);
      setInputValue("");
    }
  };

  return (
    <div 
      className={`card-wrapper ${isAwake ? 'system-awake' : ''}`}
      onMouseEnter={() => setIsAwake(true)}
      onMouseLeave={() => setIsAwake(false)}
    >
      <div className="card-inner">
        
        <div className="card-header">
          <h1 className="name">LEON R. DARDEN</h1>
          <div className="title">AI Solutions Architect</div>
        </div>

        <div className="photo-container">
          {isAwake ? (
            <video 
              src="/assets/video/leon_awake_loop.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="headshot active-mouth"
            />
          ) : (
            <img 
              src="/assets/images/leon_headshot_zoom.png" 
              alt="Leon R. Darden" 
              className="headshot idle-still"
            />
          )}
          <div className="screen-glare"></div> 
        </div>

        <div className="terminal-container">
          <div className="terminal-output">
            {terminalLog.map((log, index) => (
              <div key={index} className={`log-entry ${log.type === 'user' ? 'user-cmd' : 'sys-res'}`}>
                {log.text}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          
          <div className="input-line">
            <span className="prompt-arrow">&gt;</span>
            <input 
              type="text" 
              className="terminal-input" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleCommandSubmit}
              placeholder={isAwake ? "Awaiting command..." : "System idle..."}
              disabled={!isAwake} 
            />
            <span className={`cursor ${isAwake ? 'blink' : ''}`}>_</span>
          </div>
        </div>

        {/* IDENTITY BOT TELEMETRY (NOW UNDER INPUT BOX) */}
        <div className="bot-overlay-feed-static">
           &gt; {displayText}<span className="cursor blink">_</span>
        </div>

        <div className="contact-grid">
          <div className="contact-node full-width"><span>LOC:</span> Atlanta Metro Area</div>
          <a href="mailto:Leonrdarden@gmail.com" className="contact-node highlight"><span>EM:</span> CONTACT ME</a>
          <a href="https://www.linkedin.com/in/leon-darden-686899a5" target="_blank" rel="noreferrer" className="contact-node"><span>IN:</span> LINKEDIN</a>
          <a href="https://github.com/leonrdardenaitech" target="_blank" rel="noreferrer" className="contact-node"><span>GIT:</span> GITHUB</a>
        </div>

        <div className="privacy-notice">
          © 2026 LEON R. DARDEN // PRIVACY PROTOCOL ACTIVE // SECURE DATA HANDSHAKE ONLY
        </div>

      </div>
    </div>
  );
};

export default IdentityCard;
