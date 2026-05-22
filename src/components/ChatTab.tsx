import React, { useState, useRef, useEffect } from "react";
import { Send, Pin, Sparkles, Trash2, ShieldAlert, Phone, Video, Eye, EyeOff, X, Flame } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatTabProps {
  messages: ChatMessage[];
  activeUser: "leo" | "luna";
  onSendMessage: (text: string, isDisappearing: boolean) => void;
  onTogglePin: (id: string) => void;
  onClearHistory: () => void;
  screenshotLogAction: (eventText: string) => void;
}

export default function ChatTab({
  messages,
  activeUser,
  onSendMessage,
  onTogglePin,
  onClearHistory,
  screenshotLogAction,
}: ChatTabProps) {
  const [text, setText] = useState("");
  const [isDisappearingMode, setIsDisappearingMode] = useState(false);
  const [callState, setCallState] = useState<{ active: boolean; type: "audio" | "video" | null; isMuted: boolean; timer: number }>({
    active: false,
    type: null,
    isMuted: false,
    timer: 0
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, callState.active]);

  // Video call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState.active) {
      interval = setInterval(() => {
        setCallState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.active]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), isDisappearingMode);
    setText("");
  };

  const startCall = (type: "audio" | "video") => {
    setCallState({
      active: true,
      type,
      isMuted: false,
      timer: 0
    });
  };

  const endCall = () => {
    setCallState({ active: false, type: null, isMuted: false, timer: 0 });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  // Guard text copy attempts by popping alert (screenshot simulation logs)
  const handleCopyWarning = (e: React.ClipboardEvent) => {
    e.preventDefault();
    screenshotLogAction("Copy/Paste attempt blocked on secure message");
    alert("🌌 Security Shield: Copy-pasting sensitive couple conversation is strictly prevented.");
  };

  const pinnedMessages = messages.filter(m => m.isPinned);

  return (
    <div className="flex flex-col h-[650px] relative">
      
      {/* Pinned Messages Header Shelf */}
      {pinnedMessages.length > 0 && (
        <div className="bg-violet-950/40 border border-violet-800/30 rounded-xl p-2.5 mb-2.5 space-y-1.5 max-h-24 overflow-y-auto">
          <p className="text-[10px] font-mono font-bold text-pink-300 flex items-center gap-1">
            <Pin className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            PINNED STARLIGHT MESSAGES ({pinnedMessages.length})
          </p>
          {pinnedMessages.map(msg => (
            <div key={msg.id} className="flex justify-between items-center text-[11px] bg-violet-950/60 p-1.5 rounded border border-violet-900/30">
              <span className="truncate text-slate-200">
                <b>{msg.sender === "leo" ? "Leo" : "Luna"}:</b> {msg.text}
              </span>
              <button
                onClick={() => onTogglePin(msg.id)}
                className="text-[9px] text-pink-400 font-mono hover:text-white pointer-events-auto cursor-pointer"
              >
                Unpin
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Real-time calling screen overlay if call is active */}
      {callState.active && (
        <div className="absolute inset-0 bg-[#0a071d]/95 z-50 flex flex-col justify-between items-center p-6 border border-violet-500/20 rounded-2xl animate-fade-in text-center font-sans">
          
          <div className="mt-8">
            <div className="inline-block bg-pink-500/10 text-pink-400 font-mono text-[10px] uppercase tracking-widest border border-pink-500/20 px-2.5 py-1 rounded-full animate-bounce">
              E2E SECURED COSMIC CONNECTION
            </div>
            <h2 className="text-xl font-bold text-white mt-4">
              {callState.type === "video" ? "🌌 Video Communication Setup" : "📞 Secure Laser Audio Dial"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Talking with {activeUser === "leo" ? "Luna 👩‍🚀" : "Leo 👨‍🚀"}</p>
          </div>

          <div className="relative flex items-center justify-center my-4 h-64 w-full max-w-xs bg-slate-950/40 rounded-2xl border border-violet-900/40 overflow-hidden">
            {callState.type === "video" ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-[#130d35] to-pink-950/80 flex items-center justify-center">
                <div className="text-center p-4">
                  {/* Local video feed placeholder */}
                  <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-3xl mx-auto mb-2 animate-pulse">
                    {activeUser === "leo" ? "👨‍🚀" : "👩‍🚀"}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Self Stream (Encrypted)</div>
                  
                  {/* Remote feed placeholder with simulated glowing dots */}
                  <div className="mt-4 text-xs font-semibold text-pink-300 animate-pulse">
                    🎥 Receiving Partner Stream...
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-4">
                <div className="flex justify-center gap-1.5">
                  <span className="w-2 h-8 bg-pink-500 rounded-full animate-wave-tall" />
                  <span className="w-2 h-14 bg-violet-400 rounded-full animate-wave-medium" />
                  <span className="w-2 h-10 bg-indigo-500 rounded-full animate-wave-short" />
                  <span className="w-2 h-14 bg-violet-400 rounded-full animate-wave-medium" />
                  <span className="w-2 h-8 bg-pink-500 rounded-full animate-wave-tall" />
                </div>
                <div className="text-[11px] text-violet-300 font-mono">Laser Hologram Voice Sync</div>
              </div>
            )}
            {/* Watermark security overlay */}
            <div className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-mono">
              E2EE • {activeUser.toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="text-md text-white font-mono font-semibold tracking-wider">
              {formatTimer(callState.timer)}
            </div>

            <div className="flex gap-4 justify-center items-center pb-8">
              <button
                onClick={() => setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                className={`p-3 rounded-full border transition cursor-pointer text-xs ${
                  callState.isMuted 
                    ? "bg-amber-600/30 border-amber-500 text-amber-300"
                    : "bg-violet-950/40 border-violet-800 text-violet-300 hover:text-white"
                }`}
              >
                {callState.isMuted ? "Unmute Mic" : "Mute Mic"}
              </button>

              <button
                onClick={endCall}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-95 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Messages Panel Scroll Box */}
      <div 
        className="flex-1 bg-[#09071c]/40 border border-violet-950/50 rounded-2xl p-4 overflow-y-auto space-y-3.5 select-text"
        onCopy={handleCopyWarning}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-2">
            <span className="text-3xl">🌌</span>
            <p className="text-xs text-slate-400 max-w-xs font-sans">
              Welcome to the private subspace. Every message here is stored securely within Our Universe.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.sender === activeUser;
            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble box */}
                <div className="max-w-[85%] relative group">
                  
                  {/* Disappearing Flame Tag */}
                  {msg.isDisappearing && (
                    <div className="flex items-center gap-0.5 text-[8px] font-mono text-pink-400 absolute -top-3.5 right-1 bg-pink-950/40 border border-pink-500/10 px-1 py-0.2 rounded-full animate-bounce">
                      <Flame className="w-2.5 h-2.5 fill-pink-500 text-pink-500" /> Disappearing Item
                    </div>
                  )}

                  {/* Bubble wrapper */}
                  <div className={`p-3 rounded-2xl relative border ${
                    isSelf 
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-violet-500/30 rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.15)]'
                      : 'bg-gradient-to-b from-slate-900 to-[#120e36] text-pink-100 border-violet-900/40 rounded-tl-none shadow-[0_4px_12px_rgba(30,27,75,0.2)]'
                  }`}>
                    
                    {/* Copy/Paste Protection Visual Layer with viewer watermark */}
                    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.03] overflow-hidden rotate-12">
                      <div className="text-[10px] font-mono text-white tracking-widest whitespace-nowrap">
                        🔒 ONLY 2 VIEWERS • CONFIDENTIAL
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed break-words font-sans selection:bg-transparent">{msg.text}</p>
                    
                    {/* Hover Pin trigger for saving rules/memories */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition duration-300">
                      <button
                        onClick={() => onTogglePin(msg.id)}
                        className="p-1 rounded bg-[#0b0821]/80 border border-violet-900 text-slate-400 hover:text-white pointer-events-auto cursor-pointer"
                        title="Pin this memory prompt"
                      >
                        <Pin className={`w-2.5 h-2.5 ${msg.isPinned ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </button>
                    </div>

                  </div>

                  {/* Timestamp / Details below */}
                  <div className={`flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-mono ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <span>
                      {msg.sender === "leo" ? "Leo" : "Luna"} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.isPinned && (
                      <span className="text-pink-400 font-bold flex items-center gap-0.5">
                        • <Pin className="w-2.5 h-2.5 fill-pink-500 text-pink-500" /> Pinned
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Disappearing mode notification banner */}
      {isDisappearingMode && (
        <div className="bg-pink-950/25 border border-pink-500/20 text-pink-300 text-[10px] font-mono p-1 px-3 mt-1.5 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-1.5 animate-pulse">
            💥 Disappearing Mode: Sent messages expire automatically!
          </span>
          <button 
            onClick={() => setIsDisappearingMode(false)}
            className="hover:text-white uppercase font-bold text-[9px]"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Chat sending tools */}
      <form onSubmit={handleSend} className="mt-2.5 flex gap-2">
        
        {/* Disappearing Flame Toggle */}
        <button
          type="button"
          onClick={() => setIsDisappearingMode(!isDisappearingMode)}
          className={`p-2 rounded-xl transition shadow-md border cursor-pointer ${
            isDisappearingMode 
              ? "bg-pink-600 text-white border-pink-500 animate-pulse shadow-[0_0_10px_rgba(219,39,119,0.4)]"
              : "bg-violet-950/40 border-violet-900/60 text-slate-400 hover:text-white"
          }`}
          title="Disappearing messages toggle"
        >
          <Flame className="w-4 h-4" />
        </button>

        {/* Call options */}
        <button
          type="button"
          onClick={() => startCall("audio")}
          className="p-2 bg-violet-950/40 border border-violet-900/60 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          title="Simulate Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => startCall("video")}
          className="p-2 bg-violet-950/40 border border-violet-900/60 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
          title="Simulate Video stream Call"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* Input box */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Whisper privately to ${activeUser === "leo" ? "Luna" : "Leo"}...`}
          className="flex-1 bg-[#0f0c2c] border border-violet-900/60 rounded-xl px-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500/80 font-sans shadow-inner selection:bg-pink-600/30"
        />

        {/* Clear portal chat logs (tester utility) */}
        {messages.length > 5 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="p-2 bg-rose-950/30 border border-rose-900/40 text-rose-300 hover:bg-rose-900/65 rounded-xl transition cursor-pointer"
            title="Clear Chat Timelines"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-4 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-md active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
