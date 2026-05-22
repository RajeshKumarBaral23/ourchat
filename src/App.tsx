import { useState, useEffect } from "react";
import { FullState, ChatMessage, Memory, Rule } from "./types";
import BiometricOverlay from "./components/BiometricOverlay";
import Header from "./components/Header";
import ChatTab from "./components/ChatTab";
import MemoriesTab from "./components/MemoriesTab";
import FutureTab from "./components/FutureTab";
import RulesTab from "./components/RulesTab";
import FinancesTab from "./components/FinancesTab";
import AInsightsTab from "./components/AInsightsTab";
import SecurityTab from "./components/SecurityTab";
import { MessageSquare, Heart, Compass, ShieldAlert, Sparkles, BookOpen, Coins, ChevronRight, HelpCircle } from "lucide-react";

export default function App() {
  const [activeUser, setActiveUser] = useState<"leo" | "luna">("leo");
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "memories" | "goals" | "rules" | "finances" | "insights" | "security">("memories");
  const [dbState, setDbState] = useState<FullState | null>(null);
  const [isJailbrokenSimulated, setIsJailbrokenSimulated] = useState(false);
  const [showDeploymentInstructions, setShowDeploymentInstructions] = useState(false);

  // Screeshot simulation states
  const [screenshotFlash, setScreenshotFlash] = useState(false);
  const [screenshotLogAlert, setScreenshotLogAlert] = useState<string | null>(null);

  // Synchronize state from backend
  const fetchState = async () => {
    try {
      const response = await fetch("/api/state");
      const data = await response.json();
      setDbState(data);
    } catch (err) {
      console.error("Failed to sync cosmic state coordinates:", err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Post screenshot logs to backend
  const postSecurityViolation = async (type: string) => {
    try {
      const res = await fetch("/api/security/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: activeUser, type })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local status
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger simulated screenshot
  const triggerSimulationScreenshot = () => {
    setScreenshotFlash(true);
    setScreenshotLogAlert(`📸 Screenshot blocked! Admin ${activeUser.toUpperCase()} was logged.`);
    postSecurityViolation("Screenshot blocked");
    
    // Play a lovely synthesizer frequency note for alert feedback
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, audioCtx.currentTime); // alert alert frequency
      osc.start();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio fallback
    }

    setTimeout(() => {
      setScreenshotFlash(false);
    }, 450);

    setTimeout(() => {
      setScreenshotLogAlert(null);
    }, 4000);
  };

  // Chat actions
  const handleSendMessage = async (text: string, isDisappearing: boolean) => {
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: activeUser, text, isDisappearing })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await fetch("/api/chat/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearChatHistory = async () => {
    try {
      const res = await fetch("/api/chat/clear", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Memory additions & actions
  const handleAddMemory = async (title: string, description: string, category: string, imageUrl?: string) => {
    try {
      const res = await fetch("/api/memories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, uploader: activeUser, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactMemory = async (id: string, type: "heart" | "hug" | "kiss") => {
    try {
      const res = await fetch("/api/memories/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentMemory = async (id: string, text: string) => {
    try {
      const res = await fetch("/api/memories/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, sender: activeUser, text })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rules dynamic actions
  const handleAddRule = async (text: string, category: string) => {
    try {
      const res = await fetch("/api/rules/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category, createdBy: activeUser })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveRule = async (id: string) => {
    try {
      const res = await fetch("/api/rules/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user: activeUser })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch("/api/rules/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Savings / Financial tracker
  const handleDeposit = async (amount: number, description: string) => {
    try {
      const res = await fetch("/api/savings/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributor: activeUser, amount, description })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetTarget = async (target: number) => {
    try {
      const res = await fetch("/api/savings/set-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Goals
  const handleAddGoal = async (title: string, category: string, targetDate: string, description: string) => {
    try {
      const res = await fetch("/api/goals/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, targetDate, description })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleGoal = async (id: string) => {
    try {
      const res = await fetch("/api/goals/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Updt mood entry
  const handleUpdateMood = async (emoji: string, label: string, text: string) => {
    try {
      const res = await fetch("/api/moods/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: activeUser, emoji, label, text })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reinitialize database to pristine seed
  const handleResetDatabase = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDbState(data.db);
        setActiveTab("memories");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch("/api/security/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: activeUser, type: "Logs Cleared" })
      });
      // Mock clearing in settings
      if (dbState) {
        setDbState({
          ...dbState,
          settings: {
            ...dbState.settings,
            screenshotLog: []
          }
        });
      }
    } catch (err) {}
  };

  // Calculation helper
  const unresolvedRulesCount = dbState ? dbState.rules.filter(r => {
    if (r.status !== 'pending_approval') return false;
    if (activeUser === 'leo') return !r.approvedByLeo;
    if (activeUser === 'luna') return !r.approvedByLuna;
    return false;
  }).length : 0;

  if (!dbState) {
    return (
      <div className="min-h-screen bg-[#060411] text-white flex flex-col justify-center items-center font-sans space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-t-2 border-l-2 border-pink-500 rounded-full animate-spin" />
          <span className="text-xl animate-bounce">🛸</span>
        </div>
        <p className="text-xs text-violet-300 font-mono tracking-widest uppercase animate-pulse">Launching Our Cosmic Subspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05030f] text-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans transition-all duration-500 select-none">
      
      {/* Dynamic Cosmic Backing Particle layout */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-900/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-900/10 rounded-full filter blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Screen Protection simulate Flash modal */}
      {screenshotFlash && (
        <div className="fixed inset-0 bg-red-600/60 z-50 pointer-events-none animate-flash-quick flex items-center justify-center">
          <div className="bg-slate-950/90 border border-red-500 p-6 rounded-2xl text-center shadow-2xl max-w-xs text-xs space-y-2 animate-bounce">
            <ShieldAlert className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
            <h5 className="font-bold text-red-400 font-mono">SCREENSHOT VIOLATION DETECTION</h5>
            <p className="text-slate-300 font-sans">Watermark tags embedded inside session timeline. This coordinate capture is archived.</p>
          </div>
        </div>
      )}

      {/* Persistent log banner warning display */}
      {screenshotLogAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-rose-950 border border-rose-500 text-rose-200 text-xs py-2.5 px-6 rounded-full shadow-2xl font-mono flex items-center gap-2 animate-fade-in whitespace-nowrap">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-spin-slow" />
          {screenshotLogAlert}
        </div>
      )}

      {/* Simulator Device Shell Container */}
      <div className="w-full max-w-[430px] bg-[#0c0926] border border-violet-950/80 rounded-3xl shadow-[0_0_50px_rgba(23,17,66,0.6)] relative overflow-hidden flex flex-col h-[850px]">
        
        {/* Core Locking Overlay */}
        {isLocked ? (
          <BiometricOverlay
            activeUser={activeUser}
            onUnlock={() => setIsLocked(false)}
          />
        ) : (
          <>
            
            {/* Header Area */}
            <Header
              activeUser={activeUser}
              onUserSwitch={(user) => {
                setActiveUser(user);
                setIsLocked(true); // Auto-lock on session toggle for privacy!
              }}
              onLock={() => setIsLocked(true)}
              screenshotBlocked={true}
              onSimulateScreenshot={triggerSimulationScreenshot}
              onSimulateJailbreak={() => setIsJailbrokenSimulated(!isJailbrokenSimulated)}
              unresolvedRulesCount={unresolvedRulesCount}
            />

            {/* Simulated Rooted Jailbroken Overlay Blur Filter */}
            <div className={`flex-1 flex flex-col p-4 overflow-y-auto pb-24 transition duration-500 ${isJailbrokenSimulated ? 'blur-sm pointer-events-none select-none opacity-40' : ''}`}>
              
              {activeTab === "memories" && (
                <MemoriesTab
                  memories={dbState.memories}
                  activeUser={activeUser}
                  onAddMemory={handleAddMemory}
                  onReact={handleReactMemory}
                  onComment={handleCommentMemory}
                />
              )}

              {activeTab === "chat" && (
                <ChatTab
                  messages={dbState.messages}
                  activeUser={activeUser}
                  onSendMessage={handleSendMessage}
                  onTogglePin={handleTogglePin}
                  onClearHistory={handleClearChatHistory}
                  screenshotLogAction={postSecurityViolation}
                />
              )}

              {activeTab === "goals" && (
                <FutureTab
                  goals={dbState.goals}
                  onAddGoal={handleAddGoal}
                  onToggleGoal={handleToggleGoal}
                  anniversaryDate={dbState.settings.anniversaryDate}
                />
              )}

              {activeTab === "rules" && (
                <RulesTab
                  rules={dbState.rules}
                  activeUser={activeUser}
                  onAddRule={handleAddRule}
                  onApproveRule={handleApproveRule}
                  onDeleteRule={handleDeleteRule}
                />
              )}

              {activeTab === "finances" && (
                <FinancesTab
                  finances={dbState.finances}
                  activeUser={activeUser}
                  onDeposit={handleDeposit}
                  onSetTarget={handleSetTarget}
                />
              )}

              {activeTab === "insights" && (
                <AInsightsTab
                  activeUser={activeUser}
                  moods={dbState.moods}
                  onUpdateMood={handleUpdateMood}
                />
              )}

              {activeTab === "security" && (
                <SecurityTab
                  settings={dbState.settings}
                  activeUser={activeUser}
                  isJailbrokenSimulated={isJailbrokenSimulated}
                  onToggleJailbreak={() => setIsJailbrokenSimulated(!isJailbrokenSimulated)}
                  onClearLogs={handleClearLogs}
                  onResetDatabase={handleResetDatabase}
                />
              )}

            </div>

            {/* Root sensor notification blocking content display */}
            {isJailbrokenSimulated && (
              <div className="absolute inset-y-24 inset-x-4 bg-slate-950/90 z-30 flex flex-col justify-center items-center text-center p-6 space-y-4 rounded-2xl border border-rose-500 animate-fade-in select-none">
                <ShieldAlert className="w-16 h-16 text-rose-500 animate-pulse" />
                <h4 className="text-md font-bold text-white uppercase tracking-wider">ENVIRONMENT TAMPER DETECTED</h4>
                <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-sans">
                  The stardust portals have been securely quarantined because this device environment has been flagged as jailbroken, rooted, or hooked.
                </p>
                <button
                  onClick={() => setIsJailbrokenSimulated(false)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Regenerate Device Integrity
                </button>
              </div>
            )}

            {/* Main Interactive Tab Bar navigation footer */}
            <div className="absolute bottom-0 inset-x-0 bg-[#0c0926]/95 border-t border-violet-950/60 p-2 flex justify-around items-center backdrop-blur-md z-20">
              
              <button
                onClick={() => setActiveTab("memories")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "memories" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Memory timeline"
              >
                <Heart className={`w-[18px] h-[18px] ${activeTab === "memories" ? "fill-pink-500" : ""}`} />
                <span className="text-[9px] font-sans font-medium">Memories</span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "chat" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Private E2E Chat"
              >
                <MessageSquare className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-sans font-medium">Subspace</span>
              </button>

              <button
                onClick={() => setActiveTab("goals")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "goals" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Vision Board Goal Countdown"
              >
                <Compass className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-sans font-medium">Future</span>
              </button>

              <button
                onClick={() => setActiveTab("rules")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition relative cursor-pointer ${activeTab === "rules" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Consensual rules approved"
              >
                <BookOpen className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-sans font-medium">Promises</span>
                {unresolvedRulesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("finances")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "finances" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Budget Savings goal tracker"
              >
                <Coins className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-sans font-medium">Savings</span>
              </button>

              <button
                onClick={() => setActiveTab("insights")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "insights" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Sentiment analysis AI Companion"
              >
                <Sparkles className="w-[18px] h-[18px] animate-spin-slow" />
                <span className="text-[9px] font-sans font-medium">Insights</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition cursor-pointer ${activeTab === "security" ? "text-pink-500" : "text-slate-400 hover:text-slate-200"}`}
                title="Screenshot logs and reset options"
              >
                <ShieldAlert className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-sans font-medium">Secure</span>
              </button>

            </div>

          </>
        )}

      </div>

      {/* Deploy instructions floating widget helper (Desktop Right Area) */}
      <div className="hidden lg:flex flex-col w-80 bg-[#0c0926]/90 border border-violet-950/80 p-6 rounded-3xl ml-8 space-y-4 max-h-[850px] overflow-y-auto shadow-2xl relative font-sans">
        <h3 className="text-md font-bold text-white flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
          <span>Our Universe Architect</span>
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed">
          This is a full-stack mockup of <b>Our Universe</b>. It features a private backend synchronized node, live biometric passcode checking (default <b className="text-pink-400 font-mono">1234</b>), reactive dual rules approval tracking, joint budget progress bar charts, and a lazy-loaded emotional <b>Gemini AI</b> relation analyzer model.
        </p>

        <div className="border-t border-violet-950/60 pt-3 space-y-2">
          <h4 className="text-xs font-mono font-bold text-violet-300 uppercase">Interactive simulation cues:</h4>
          <ul className="text-[11px] text-slate-400 space-y-2 list-disc pl-4">
            <li>Choose <b className="text-[#a78bfa]">Leo</b> or <b className="text-pink-400">Luna</b> inside the top header. Changing users locks the safe and prompts for a biometric scan.</li>
            <li>Press <b className="text-rose-400">📸 PrintScr</b> to simulate an OS screenshot violation. System registers a secure log entry.</li>
            <li>Enable <b className="text-rose-400">Simulate Jailbreak Mode</b> in Secure Tab to verify root sandboxing rules that shield viewer uploads.</li>
          </ul>
        </div>

        <div className="border-t border-violet-950/60 pt-3">
          <button
            onClick={() => setShowDeploymentInstructions(!showDeploymentInstructions)}
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] transition flex items-center justify-between px-3 cursor-pointer"
          >
            <span>Deployment Guide & Schema</span>
            <ChevronRight className={`w-4 h-4 transition duration-300 ${showDeploymentInstructions ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Dynamic modal inside helper with real guidelines on flutter native wrapper build directions */}
        {showDeploymentInstructions && (
          <div className="bg-[#120f32]/50 border border-violet-900/40 rounded-xl p-3.5 space-y-3.5 text-xs text-slate-300 font-mono animate-fade-in">
            <div className="space-y-1">
              <span className="text-pink-400 font-bold">1. ANDROID & IOS PORT</span>
              <p className="text-[10px] text-slate-400 font-sans">
                Build this inside a Flutter project's embedded WebView or capacitor native platform wrapper with screenshot prevention.
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-pink-400 font-bold">2. DETECT JAILBREAK (NATIVE)</span>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Use <b className="text-slate-300">flutter_jailbreak_detection</b> on Android/iOS to report device safety indices back to your api routes.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-pink-400 font-bold">3. BLOCK MEDIA SAVE</span>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed text-slate-400">
                Prevent standard photo saving by never generating static absolute image assets directory paths. Keep blobs base64 inside isolated SQLite or secure local databases.
              </p>
            </div>
          </div>
        )}

        <div className="text-[10px] text-slate-500 font-mono text-center">
          Our Universe Private Space System v1.4.1
        </div>
      </div>

    </div>
  );
}
