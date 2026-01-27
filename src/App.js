import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Shield, Database, Globe, 
  Server, Zap, Code, Terminal, Send, Loader, 
  TrendingUp, CheckCircle, Award
} from 'lucide-react';
import './App.css';

// LOGO
import logo from './logo.png'; 

// API
const API_KEY = "AIzaSyD1vznl4J0CuUhDxmV5avkJuaQuyRGZWuE"; 

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [aiInput, setAiInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    { 
      role: 'model', 
      text: 'SYSTEM: Connected to Nexora Secure Cloud. Sovereign AI initialized. How can I assist you?' 
    }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // SMART AI HANDLER
  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setAiInput('');
    setIsLoading(true);

    try {
      // 1. Auto-Detect Model
      const modelsReq = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      if (!modelsReq.ok) throw new Error("Key Check Failed");
      
      const modelsData = await modelsReq.json();
      const validModel = modelsData.models?.find(m => 
        m.supportedGenerationMethods.includes("generateContent") &&
        (m.name.includes("gemini") || m.name.includes("flash"))
      );

      if (!validModel) throw new Error("No Model Found");
      const modelName = validModel.name.split("/").pop();

      // 2. Generate Content
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Nexora Intelligence. Professional Corporate Tone. Answer: ${userText}`
              }]
            }]
          })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error("API Error");
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      setChatHistory(prev => [...prev, { role: 'model', text: aiResponse }]);

    } catch (error) {
      console.error("AI Error:", error);
      
      // FAILSAFE BACKUP
      let errorMsg = "Network Unstable. Switching to Local Secure Mode.";
      const lower = userText.toLowerCase();

      if (lower.includes("risk")) errorMsg = "RISK ANALYSIS: Primary risk is global competition (AWS/Google). Mitigation: 100% Data Residency compliance (DPDP Act).";
      else if (lower.includes("compliance")) errorMsg = "COMPLIANCE STATUS: Certified for RBI (Banking), SEBI (Markets), IRDAI (Insurance), and MeitY.";
      else if (lower.includes("revenue") || lower.includes("finance")) errorMsg = "FINANCIALS: ₹312 Cr Revenue (FY25) with 52.5% Gross Margin. Projected IPO Valuation: ₹4,200 Cr+.";
      else if (lower.includes("future")) errorMsg = "ROADMAP: Expanding to Middle East/SE Asia. Launching Banking-specific LLMs for rural India.";
      else if (lower.includes("hi")) errorMsg = "Greetings. I am Nexora Intelligence (Secure Instance). Ready to serve.";

      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'model', text: errorMsg }]);
      }, 1000);
    }
    
    setIsLoading(false);
  };

  const navToStudio = () => setActiveTab('studio');

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        
        {/* HERE IS YOUR LOGO IMAGE */}
        <div className="logo-section" onClick={() => setActiveTab('home')}>
          <img src={logo} alt="Nexora Logo" className="nav-logo" />
        </div>

        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
          <button className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Nexora</button>
          <button className={`nav-btn ${activeTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveTab('vision')}>Vision Mission</button>
          <button className={`nav-btn ${activeTab === 'why' ? 'active' : ''}`} onClick={() => setActiveTab('why')}>Why Nexora?</button>
        </div>
        
        <button className="studio-btn" style={{padding: '0.5rem 1rem', fontSize:'0.9rem'}} onClick={navToStudio}>
            <Cpu size={16} /> <span className="studio-text">Nexora AI</span>
        </button>
      </nav>

      <main className="main-content">
          {/* HOME PAGE */}
          {activeTab === 'home' && (
            <div className="page-wrapper fade-in">
              <div className="hero-section">
                <div className="hero-bg-glow"></div>
                <div className="hero-content slide-up">
                  <div style={{display:'inline-block', padding:'6px 16px', borderRadius:'20px', background:'rgba(249,115,22,0.1)', color:'#f97316', marginBottom:'1.5rem', border:'1px solid rgba(249,115,22,0.3)', fontWeight:'600'}}>
                    🇮🇳 India's First Sovereign AI Cloud 🇮🇳
                  </div>
                  <h1 className="hero-title">Nexora AI Solutions Ltd.</h1>
                  <p className="hero-usp">
                    The only full-stack, sovereign AI infrastructure compliant with <span className="highlight-box"> RBI & SEBI </span> norms.
                    Empowering 4,800+ enterprises.
                  </p>
                  
                  <div className="hero-actions">
                    <button className="studio-btn" style={{padding: '1.2rem 3.5rem', fontSize: '1.25rem'}} onClick={navToStudio}>
                      <Zap size={24} /> Try Nexora Intelligence Studio
                    </button>
                  </div>
                </div>
              </div>

              <div className="stats-ticker slide-up" style={{animationDelay:'0.3s'}}>
                <div className="ticker-item"><span>4,800+</span> Customers</div>
                <div style={{width:'1px', height:'40px', background:'rgba(255,255,255,0.1)'}}></div>
                <div className="ticker-item"><span>10+</span> Cloud Regions</div>
                <div style={{width:'1px', height:'40px', background:'rgba(255,255,255,0.1)'}}></div>
                <div className="ticker-item"><span>120+</span> Services</div>
              </div>

              <div className="grid-container slide-up" style={{animationDelay:'0.5s'}}>
                <div className="glass-card">
                   <div className="card-icon-box"><Server size={24}/></div>
                   <h3>IaaS (Infrastructure)</h3>
                   <p>Virtual servers & storage with 100% data residency.</p>
                </div>
                <div className="glass-card">
                   <div className="card-icon-box"><Code size={24}/></div>
                   <h3>PaaS (Platforms)</h3>
                   <p>Managed databases & API platforms for developers.</p>
                </div>
                <div className="glass-card">
                   <div className="card-icon-box"><Shield size={24}/></div>
                   <h3>Security & Compliance</h3>
                   <p>Pre-certified for RBI, SEBI, IRDAI, & MeitY norms.</p>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT PAGE */}
          {activeTab === 'about' && (
            <div className="page-wrapper fade-in">
              <div className="hero-section" style={{padding: '2rem 0'}}>
                <h2 className="hero-title">About <span className="text-orange">Nexora</span></h2>
                <div className="glass-card slide-up" style={{textAlign: 'left'}}>
                  <p style={{fontSize: '1.2rem', lineHeight: '1.8'}}>
                    Founded in <strong>2015 in Hyderabad</strong>, Nexora AI is India's premier "Intelligent Cloud" platform.
                    We operate <strong>10 Cloud Regions</strong> across India, South East Asia, & the Middle East, specifically catering to regulated industries.
                  </p>
                  <div className="info-grid">
                    <div className="info-box"><h4>4,800+</h4><span>Clients</span></div>
                    <div className="info-box"><h4>2,000+</h4><span>Engineers</span></div>
                    <div className="info-box"><h4>120+</h4><span>Services</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISION & MISSION */}
          {activeTab === 'vision' && (
            <div className="page-wrapper fade-in">
               <div className="hero-section" style={{padding: '2rem 0'}}>
                  <h2 className="hero-title">Vision <span className="text-orange">Mission</span></h2>
                  <div className="split-layout slide-up">
                    <div className="vision-box">
                      <Globe size={40} className="text-orange" style={{marginBottom:'1rem'}}/>
                      <h3 className="text-orange">Global Vision</h3>
                      <p style={{fontSize: '1.2rem', fontStyle: 'italic'}}>"To become the most trusted cloud & AI backbone that empowers businesses to innovate & scale with confidence."</p>
                    </div>
                    <div className="mission-box">
                      <Database size={40} style={{color: '#3b82f6', marginBottom:'1rem'}}/>
                      <h3 style={{color: '#3b82f6'}}>Core Mission</h3>
                      <p style={{fontSize: '1.2rem', fontStyle: 'italic'}}>"To deliver secure, scalable, & intelligent cloud solutions that help organizations build faster, innovate smarter, & adopt advanced technology without complexity."</p>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* WHY NEXORA? (USPs) */}
          {activeTab === 'why' && (
            <div className="page-wrapper fade-in">
              <div className="hero-section" style={{padding: '2rem 0'}}>
                <h2 className="hero-title">Why <span className="text-orange">Nexora?</span></h2>
                <div className="usp-grid slide-up">
                   <div className="usp-card">
                     <h3><TrendingUp size={20}/> Early Entry (2015)</h3>
                     <p>We established infrastructure before the AI boom, securing early trust & credibility.</p>
                   </div>
                   <div className="usp-card">
                     <h3><Shield size={20}/> Built-for-India</h3>
                     <p>Tailored specifically for local regulations (RBI/SEBI), unlike foreign providers.</p>
                   </div>
                   <div className="usp-card">
                     <h3><Cpu size={20}/> Intelligence Studio</h3>
                     <p>Our flagship platform to securely build, train, & deploy AI models within India.</p>
                   </div>
                   <div className="usp-card">
                     <h3><Server size={20}/> Full-Stack Ecosystem</h3>
                     <p>End-to-end control covering IaaS, PaaS, SaaS, & 120+ services.</p>
                   </div>
                   <div className="usp-card">
                     <h3><Award size={20}/> Strong Talent Base</h3>
                     <p>In-house team of 2,000+ AI engineers driving rapid innovation.</p>
                   </div>
                   <div className="usp-card">
                     <h3><CheckCircle size={20}/> Brand Philosophy</h3>
                     <p>"Intelligent Cloud for an Intelligent India" - aligning with national digital vision.</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* INTELLIGENCE STUDIO */}
          {activeTab === 'studio' && (
            <div className="page-wrapper fade-in" style={{marginTop: '2rem'}}>
              <div className="studio-container">
                <div className="studio-header">
                  <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <Terminal size={24} color="#f97316" />
                    <h3 style={{margin:0, color:'white'}}>Nexora Intelligence Studio</h3>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', background:'rgba(74, 222, 128, 0.1)', padding:'4px 12px', borderRadius:'20px'}}>
                    <span className="spin" style={{width:'8px', height:'8px', background:'#4ade80', borderRadius:'50%', display:'block'}}></span>
                    <span style={{color:'#4ade80', fontSize:'0.8rem', fontWeight:'bold'}}>SYSTEM ONLINE</span>
                  </div>
                </div>
                
                <div className="chat-interface">
                  <div className="chat-history">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`msg-row ${msg.role}`}>
                         {msg.role === 'model' && 
                           <div className="ai-avatar"><Cpu size={16}/></div>
                         }
                        <div className="msg-bubble">
                           <div className="msg-text">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="msg-row model">
                        <div className="ai-avatar"><Loader size={16} className="spin"/></div>
                        <div className="msg-bubble" style={{fontStyle:'italic', color:'#94a3b8'}}>Processing secure request...</div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  <form className="input-bar" onSubmit={handleAiSubmit}>
                    <input type="text" placeholder="Ask Nexora Intelligence Studio..." value={aiInput} onChange={(e) => setAiInput(e.target.value)} disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !aiInput} className="send-btn">
                      <Send size={24} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>This is a demo website developed & hosted by <strong>Team: 04</strong> for the competition <strong>Vyapaar Vichaar</strong> at <strong>BMCC Finance Club's Finance Fest - Vyapaar Manan 3 (2026).</strong> </p> 
          <p>This is a simulation for educational purposes; all content is fictional & any resemblance to real entities is coincidental.</p>
          <p><strong>Team: 04 - Shreyas Patil, Shrimay Raut, Aadnyeya Deore, Tanmay Musale.</strong></p>
        </div>
      </footer>
    </div>
  );
};

export default App;