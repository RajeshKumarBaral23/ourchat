import React, { useState, useEffect } from "react";
import { Sparkles, Laugh, Heart, Brain, RefreshCw, MessageSquareHeart, Award, Sun } from "lucide-react";

interface AInsightsTabProps {
  activeUser: "leo" | "luna";
  moods: Record<string, { emoji: string; label: string; timestamp: string; text: string } | null>;
  onUpdateMood: (emoji: string, label: string, text: string) => void;
}

export default function AInsightsTab({
  activeUser,
  moods,
  onUpdateMood
}: AInsightsTabProps) {
  const [moodText, setMoodText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🛸");
  const [selectedLabel, setSelectedLabel] = useState("Celestial");
  const [report, setReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [inspiration, setInspiration] = useState("");
  const [loadingInspiration, setLoadingInspiration] = useState(false);

  const moodPresets = [
    { emoji: "🥰", label: "Deeply Loved" },
    { emoji: "😊", label: "Happy & Warm" },
    { emoji: "😴", label: "Sleepy Space Cadet" },
    { emoji: "🧘", label: "Centered & Calmed" },
    { emoji: "🌌", label: "Dreamy Cosmic" },
    { emoji: "😔", label: "Need a Hug" }
  ];

  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMood(selectedEmoji, selectedLabel, moodText.trim());
    setMoodText("");
  };

  const loadAIInspiration = async () => {
    setLoadingInspiration(true);
    try {
      const res = await fetch("/api/ai/daily-inspiration", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setInspiration(data.inspiration);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInspiration(false);
    }
  };

  const loadAIGrowthReport = async () => {
    setLoadingReport(true);
    setReport("");
    try {
      const res = await fetch("/api/ai/growth-report", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      } else if (data.fallbackData) {
        setReport(data.fallbackData);
      } else if (data.error) {
        setReport(`### ⚠️ Connection Lost in Orbit\n\nUnable to retrieve growth readings from deep space:\n${data.error}`);
      }
    } catch (err) {
      setReport("### ⚠️ Connection Time-out\n\nPlease check server network connectivity or configure API Secrets in the development control panel.");
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    loadAIInspiration();
    loadAIGrowthReport();
  }, []);

  const leoMood = moods.leo;
  const lunaMood = moods.luna;

  return (
    <div className="space-y-6">
      
      {/* 1. Daily Inspiration / Quote Card */}
      <div className="bg-gradient-to-r from-violet-950/30 to-pink-950/20 border border-violet-850 p-4 rounded-2xl relative overflow-hidden shadow-lg">
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={loadAIInspiration}
            disabled={loadingInspiration}
            className="p-1 text-slate-400 hover:text-white transition rounded bg-[#0b0621]/80 hover:bg-[#120831] cursor-pointer"
            title="Fetch new cosmic vibe"
          >
            <RefreshCw className={`w-3 h-3 ${loadingInspiration ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2 items-start max-w-[92%]">
          <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0 mt-0.5 animate-spin-slow" />
          <div className="space-y-1">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#caa5ff]">STARDUST LOVE QUOTE</h4>
            {loadingInspiration ? (
              <p className="text-xs text-slate-500 font-mono italic animate-pulse">Consulting the telemetry stars...</p>
            ) : (
              <p className="text-xs text-slate-100 font-serif leading-relaxed italic">
                "{inspiration || "We are all made of stardust, tracing routes back to meet one another."}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dual Mood Panel Check-in */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mood displays */}
        <div className="bg-[#110e30]/50 border border-violet-900/40 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-beat" /> Mood Check-ins
          </h4>

          <div className="space-y-2">
            {/* Leo */}
            <div className="flex items-center gap-3 bg-[#0d0a27] border border-violet-950/50 p-2.5 rounded-xl">
              <span className="text-2xl animate-pulse">{leoMood ? leoMood.emoji : "🌌"}</span>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-slate-200">
                  👨‍🚀 Leo is feeling: <span className="text-indigo-400 font-sans">{leoMood ? leoMood.label : "Dreamy Orbit"}</span>
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  "{leoMood ? leoMood.text : "Leo hasn't checked in his mood coordinates yet today."}"
                </p>
              </div>
            </div>

            {/* Luna */}
            <div className="flex items-center gap-3 bg-[#0d0a27] border border-violet-950/50 p-2.5 rounded-xl">
              <span className="text-2xl animate-pulse">{lunaMood ? lunaMood.emoji : "🌌"}</span>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-slate-200">
                  👩‍🚀 Luna is feeling: <span className="text-pink-400 font-sans">{lunaMood ? lunaMood.label : "Dreamy Orbit"}</span>
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  "{lunaMood ? lunaMood.text : "Luna hasn't checked in her mood coordinates yet today."}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Update active user mood */}
        <form onSubmit={handleMoodSubmit} className="bg-violet-950/20 border border-violet-900/40 p-4 rounded-2xl space-y-3.5">
          <h4 className="text-xs font-mono font-bold text-pink-300 uppercase tracking-widest">
            LOG YOUR DAILY COORDINATES ({activeUser.toUpperCase()})
          </h4>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {moodPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setSelectedEmoji(preset.emoji);
                  setSelectedLabel(preset.label);
                }}
                className={`py-1 px-1.5 rounded-lg border text-[11px] font-sans flex items-center justify-center gap-1 hover:bg-violet-950/50 transition cursor-pointer ${
                  selectedEmoji === preset.emoji
                    ? "bg-violet-900 border-pink-500/80 text-white font-bold"
                    : "bg-[#110c2c] border-violet-950 text-slate-400"
                }`}
              >
                <span>{preset.emoji}</span>
                <span className="truncate text-[9px]">{preset.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              required
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="How are you breathing today? e.g. Feeling cozy..."
              className="flex-1 bg-[#100d2c] border border-violet-900 text-white text-xs px-3 py-1.5 focus:outline-none focus:border-pink-500 rounded-lg placeholder:text-slate-500 font-sans"
            />
            <button
              type="submit"
              className="py-1.5 px-3 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-lg text-white font-bold text-xs select-none cursor-pointer"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* 3. AI generated summary & insights */}
      <div className="bg-[#100c2a]/95 border border-violet-950/60 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background portal grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="flex justify-between items-center z-10 relative">
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 font-sans">
            <Brain className="w-5 h-5 text-indigo-400 animate-pulse animate-spin-slow" />
            <span>AI Celestial sentiment telemetry</span>
            <span className="px-2 py-0.5 rounded-full bg-violet-950 text-[10px] border border-violet-900 font-mono text-purple-400 tracking-widest">
              GEMINI MODEL
            </span>
          </h3>

          <button
            onClick={loadAIGrowthReport}
            disabled={loadingReport}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold rounded bg-indigo-950/40 border border-indigo-900/40 text-indigo-300 hover:bg-indigo-900/40 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingReport ? 'animate-spin' : ''}`} />
            Recalculate Vibe
          </button>
        </div>

        <div className="border border-violet-500/10 rounded-2xl p-4 bg-violet-950/20 max-h-96 overflow-y-auto selection:bg-pink-600/30">
          {loadingReport ? (
            <div className="py-20 text-center space-y-4">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-t-2 border-l-2 border-indigo-500 rounded-full animate-spin" />
                <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-widest">
                STREAMING EMOTIONAL INSIGHTS FROM DEEP SPACE MATRIX...
              </p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-xs text-slate-200 space-y-4 font-sans leading-relaxed">
              {/* Parse Markdown representation simply */}
              {report.split("\n\n").map((para, pIdx) => {
                if (para.startsWith("###")) {
                  return (
                    <h4 key={pIdx} className="text-sm font-bold text-white tracking-wide border-b border-violet-950 pb-1 mt-4">
                      {para.replace("###", "").trim()}
                    </h4>
                  );
                }
                if (para.startsWith("**")) {
                  return (
                    <p key={pIdx} className="bg-pink-950/10 p-3 rounded-lg border border-pink-500/15 text-pink-200">
                      {para.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                return <p key={pIdx}>{para}</p>;
              })}
            </div>
          )}
        </div>

        {/* Security protection footer warning */}
        <div className="text-[10px] text-slate-500 font-mono text-center">
          🔒 PRIVATE SPACE DATA ENCRYPTED END TO END. TRANSMISSIONS NEVER INDEXED BY OUTSIDE CRAWLERS.
        </div>
      </div>

    </div>
  );
}
