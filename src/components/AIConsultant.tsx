import React, { useState } from "react";
import { Message } from "../types";
import { MessageSquare, FileText, Send, RotateCw, AlertTriangle, HelpCircle, Check, BookOpen } from "lucide-react";

// Simple custom Markdown-to-HTML formatter to represent scientific papers beautifully
// without adding external fragile package dependencies for React 19.
function renderSimpleMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");
  
  return (
    <div className="space-y-3 font-sans leading-relaxed text-xs md:text-sm text-slate-350 select-text">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith("###")) {
          return <h4 key={idx} className="text-sm font-semibold text-cyan-400 mt-4 mb-2">{trimmed.replace("###", "").trim()}</h4>;
        }
        if (trimmed.startsWith("##")) {
          return <h3 key={idx} className="text-base font-bold text-emerald-400 mt-6 mb-2 border-b border-slate-800 pb-1">{trimmed.replace("##", "").trim()}</h3>;
        }
        if (trimmed.startsWith("#")) {
          return <h2 key={idx} className="text-lg font-bold text-slate-100 mt-8 mb-4 border-b-2 border-slate-800 pb-2">{trimmed.replace("#", "").trim()}</h2>;
        }
        
        // Bullet lists
        if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
          const content = trimmed.substring(1).trim();
          return (
            <li key={idx} className="list-disc list-inside ml-4 text-slate-300 pl-1 my-1">
              {parseInlineStyles(content)}
            </li>
          );
        }

        // Empty lines
        if (!trimmed) {
          return <div key={idx} className="h-2"></div>;
        }

        // Standard paragraph
        return <p key={idx} className="my-1.5 leading-relaxed text-slate-300">{parseInlineStyles(trimmed)}</p>;
      })}
    </div>
  );
}

// Inline styles parsing helper for bold and code highlights
function parseInlineStyles(text: string): React.ReactNode {
  // Bold match: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  // Code match: `code`
  const codeRegex = /`(.*?)`/g;

  let elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  // Custom combined tokenizer for standard bold and code
  const tokens: { start: number; end: number; type: 'bold' | 'code'; text: string }[] = [];
  
  // Find all bolds
  let bMatch;
  while ((bMatch = boldRegex.exec(text)) !== null) {
    tokens.push({
      start: bMatch.index,
      end: boldRegex.lastIndex,
      type: 'bold',
      text: bMatch[1]
    });
  }
  
  // Find all code tags
  let cMatch;
  while ((cMatch = codeRegex.exec(text)) !== null) {
    tokens.push({
      start: cMatch.index,
      end: codeRegex.lastIndex,
      type: 'code',
      text: cMatch[1]
    });
  }

  // Sort tokens by start position
  tokens.sort((a, b) => a.start - b.start);

  let currentPos = 0;
  tokens.forEach((token, idx) => {
    if (token.start >= currentPos) {
      // Append preceding plain text
      if (token.start > currentPos) {
        elements.push(<span key={`text-${idx}`}>{text.substring(currentPos, token.start)}</span>);
      }
      
      if (token.type === 'bold') {
        elements.push(<strong key={`bold-${idx}`} className="font-bold text-slate-100">{token.text}</strong>);
      } else {
        elements.push(<code key={`code-${idx}`} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-cyan-400">{token.text}</code>);
      }
      
      currentPos = token.end;
    }
  });

  if (currentPos < text.length) {
    elements.push(<span key="text-end">{text.substring(currentPos)}</span>);
  }

  return elements.length > 0 ? <>{elements}</> : text;
}

export default function AIConsultant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-welcome",
      role: "assistant",
      content: "اسلام علیکم! میں تھرمو ڈائنامک مانیٹری ماڈلر اور بلاک چین آرکیٹیکٹ ہوں۔ آپ اس پورٹل سے تھوریم پر مبنی ریزرو اور ہائیڈروجن کرنسی (HBC) کے معاشی نظام کا گہرائی سے تجزیہ، سفید یا پیپر کا مواد، یا سمارٹ کانٹریکٹ کا ڈھانچہ حاصل کر سکتے ہیں۔ مجھ سے کوئی بھی کسٹم سوال پوچھیں یا بائیں جانب دیے گئے ابواب (Chapters) کو جنریٹ کریں۔",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const [activeWhitepaperText, setActiveWhitepaperText] = useState<string>("");
  const [activeWhitepaperTitle, setActiveWhitepaperTitle] = useState<string>("");

  const preBakedChapters = [
    {
      title: "باب 1: بائیوفزیکل اکنامکس اور توانائی کی مادی حقیقت (The Energy Theory of Value)",
      prompt: "Compose a comprehensive, detailed academic whitepaper section explaining 'Biophysical Economics' and 'The Energy Theory of Value' under the Nitrogen-Hydrogen-Thorium monetary system. Discuss how printing currency without physical energy (Joules) input degrades sovereign monetary power, referencing terrestrial constraints, and how our 1g hydrogen = 1 HBC token peg enforces thermodynamic equilibrium."
    },
    {
      title: "باب 2: تھوریم ریزرو اور مادی ذخیرہ کاری کے اصول (Thorium Stable Reserve and Depository Standard)",
      prompt: "Write a high-level scientific paper block on the Thorium Standard as a central stable reserve sovereign backstop. Explain why Thorium-232 is the absolute stable terrestrial security (reject curium or non-terrestrial lunar cases) and explain the math modeling of backing ratio: how state-held physical thorium reserves handle trade shocks and backstop the digital HBC tokens."
    },
    {
      title: "باب 3: پشاور یونیورسٹی خودمختار نیٹ ورک کا لاجسٹک ماڈل (Autonomous University Network (HUN) Logistical Case Study)",
      prompt: "Compose a highly specific, local macroeconomic case study on transforming Peshawar University into an autonomous 'Hydrogen University Network (HUN)'. Explain how the campus's Thorium Micro-Reactor (TMR-1), Khyber Solar Electrolyzers, and Student hostels combine into a closed thermodynamic cycle, allowing tuition payments, dinner ledgers, and transit fueling and research stipends to resolve using HBC in a decentralized micro-economy."
    },
    {
      title: "باب 4: بلاک چین کنسنسس ، bPoW اور سمارٹ کانٹریکٹ ڈھانچہ (bPoW Consensus & Solid Smart Contract Architecture)",
      prompt: "Draft a formal technical whitepaper chapter detailing Biophysical Proof-of-Work (bPoW) consensus algorithms and the Solidity smart contract requirements for HBC. Explain why thermodynamic water splitting is the ultimate mining block verification mechanism (preventing energy wastage) and provide brief specifications for the PEg index feedback loops and open Zeppelin ERC20 overrides."
    }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    setErrorText("");
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = inputText;
    setInputText("");
    setLoading(true);

    // Entertaining thermodynamic loading statements
    const loadingStates = [
      "Calibrating Thorium baseline cores...",
      "Resolving biophysical Carnot boundaries...",
      "Matching Hydrogen mass splitting logs...",
      "Solving biophysical feedback loops..."
    ];
    let stepIdx = 0;
    setLoadingStep(loadingStates[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % loadingStates.length;
      setLoadingStep(loadingStates[stepIdx]);
    }, 2000);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, type: "chat" })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: data.text,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        throw new Error(data.error || "Gemini route experienced an issue.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to communicate with the server.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleGenerateChapter = async (chapterTitle: string, chapterPrompt: string) => {
    if (loading) return;

    setErrorText("");
    setActiveWhitepaperTitle(chapterTitle);
    setActiveWhitepaperText("");
    setLoading(true);

    const loadingStates = [
      "Gathering quantitative biophysical data...",
      "Analyzing Peshawar campus macroeconomics...",
      "Formulating thermodynamic equations...",
      "Compiling Solidity smart codes..."
    ];
    let stepIdx = 0;
    setLoadingStep(loadingStates[0]);
    const stepInterval = setInterval(() => {
      stepIdx = (stepIdx + 1) % loadingStates.length;
      setLoadingStep(loadingStates[stepIdx]);
    }, 1800);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: chapterPrompt, type: "whitepaper" })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setActiveWhitepaperText(data.text);
      } else {
        throw new Error(data.error || "Whitepaper generation error.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Could not generate chapter.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="space-y-6" id="ai-consulting-suite">
      
      {/* Alert if Gemini key is missing */}
      {errorText && (
        <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="font-sans">
            <p className="text-xs font-bold text-red-300">سستم کنکشن کی غلطی (API Connection Alert)</p>
            <p className="text-[11px] text-red-400 mt-0.5 leading-relaxed font-light">
              {errorText}. Please configure a valid <code>GEMINI_API_KEY</code> in the **Settings &gt; Secrets** panel.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Academic Chapter selection */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4 font-sans">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic">
              <span className="w-1 h-3 bg-emerald-500 block"></span>
              Whitepaper Chapter Drafting
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Select any pre-baked chapter below. The AI Modeler will draft a detailed, scientific analysis on demand based on the unified master prompt guidelines.
            </p>

            <div className="space-y-2 pt-2">
              {preBakedChapters.map((chapter, idx) => {
                const isActive = activeWhitepaperTitle === chapter.title;
                return (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleGenerateChapter(chapter.title, chapter.prompt)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 cursor-pointer ${
                      isActive 
                        ? "bg-slate-950 border-emerald-555/80 text-slate-200" 
                        : "bg-slate-950/50 border-slate-850 hover:border-slate-800 text-slate-300"
                    }`}
                  >
                    <span className="font-semibold font-sans">{chapter.title.split(":")[0]}</span>
                    <span className="text-[10px] text-slate-500 leading-snug line-clamp-2 font-sans font-light">
                      {chapter.title.split(":")[1].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-3 bg-slate-950 rounded-lg border border-slate-850 font-sans">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-500 leading-relaxed font-sans font-light">
                Our model utilizes <strong>gemini-2.5-flash</strong> with strict system directives representing unified thermodynamic theories.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic display (Chat or generated whitepaper paper) */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          
          {/* Tabs header between active Chat and active Paper Workspace */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setActiveWhitepaperTitle("");
                setActiveWhitepaperText("");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                !activeWhitepaperTitle 
                  ? "bg-slate-900 border border-slate-800 text-slate-105" 
                  : "bg-slate-950/40 text-slate-500 hover:text-slate-200 border border-slate-900/50"
              }`}
            >
              کنسلٹنٹ چیٹ روم (Consultation Chat)
            </button>

            {activeWhitepaperTitle && (
              <div className="px-4 py-2 bg-slate-900 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider border border-emerald-950 rounded-lg flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Active Whitepaper: {activeWhitepaperTitle.split(":")[0]}
              </div>
            )}
          </div>

          {/* Core visual panel workspace */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col overflow-hidden max-h-[500px] shadow-xl relative animate-fadeIn">
            
            {/* Loading state indicator */}
            {loading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
                <RotateCw className="w-8 h-8 text-emerald-555 animate-spin text-emerald-500" />
                <p className="text-xs font-mono text-emerald-400 tracking-wider uppercase animate-pulse">{loadingStep}</p>
                <span className="text-[10px] text-slate-500 italic font-mono">Interfacing server-side Gemini cores...</span>
              </div>
            )}

            {activeWhitepaperTitle ? (
              // Generated Whitepaper view
              <div className="flex-1 p-6 overflow-y-auto max-h-[440px] bg-slate-950/30">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h3 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
                    {activeWhitepaperTitle}
                  </h3>
                  
                  {activeWhitepaperText ? (
                    renderSimpleMarkdown(activeWhitepaperText)
                  ) : (
                    <div className="text-center py-20 text-slate-550 italic text-xs">
                      The model is composing this chapter...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Chat conversation view
              <div className="flex-1 flex flex-col justify-between max-h-[460px]">
                {/* Message stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[380px] bg-slate-950/20">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`p-4 rounded-lg max-w-[85%] text-xs md:text-sm leading-relaxed ${
                        msg.role === "user" 
                          ? "bg-cyan-950/40 text-slate-105 border border-cyan-900/40 rounded-tr-none text-right font-light" 
                          : "bg-slate-950/70 text-slate-205 border border-slate-850/80 rounded-tl-none text-left font-light"
                      }`}>
                        
                        {/* Render simple parsed content */}
                        <div className="whitespace-pre-line font-sans">
                          {parseInlineStyles(msg.content)}
                        </div>

                        <span className="text-[8px] text-slate-500 font-mono block mt-2 text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-20 text-slate-500 italic text-xs font-sans">
                      Consultation registers are currently empty.
                    </div>
                  )}
                </div>

                {/* Input forms */}
                <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-850/60 flex gap-2">
                  <input
                    type="text"
                    disabled={loading}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="تھوریم ریزرو سسٹم یا پشاور ماڈل کے بارے میں سوال پوچھیں..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-205 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                  </button>
                </form>
              </div>
            )}

          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-2 text-right">
            Model context restricted to Biophysical & Thermodynamic bounds &bull; No space applications allowed
          </div>
        </div>

      </div>
    </div>
  );
}
