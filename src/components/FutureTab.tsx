import React, { useState, useEffect } from "react";
import { Compass, Sparkles, CheckSquare, Square, Calendar, Heart, Clock } from "lucide-react";
import { FutureGoal } from "../types";

interface FutureTabProps {
  goals: FutureGoal[];
  onAddGoal: (title: string, category: string, targetDate: string, description: string) => void;
  onToggleGoal: (id: string) => void;
  anniversaryDate: string;
}

export default function FutureTab({
  goals,
  onAddGoal,
  onToggleGoal,
  anniversaryDate
}: FutureTabProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Dreams");
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Anniversary Countdown
  const [anniversaryDays, setAnniversaryDays] = useState(0);

  useEffect(() => {
    // calculate days until next anniversary
    const calculateCountdown = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      let nextAnniv = new Date(`${currentYear}-02-14`);
      if (today > nextAnniv) {
        nextAnniv = new Date(`${currentYear + 1}-02-14`);
      }
      const diffMs = nextAnniv.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setAnniversaryDays(diffDays);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const defaultDate = targetDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
    onAddGoal(title.trim(), category, defaultDate, description.trim());
    setTitle("");
    setDescription("");
    setTargetDate("");
    setShowForm(false);
  };

  // Find nearest incomplete milestone
  const sortedIncomplete = [...goals]
    .filter(g => !g.isCompleted)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  const nextMainGoal = sortedIncomplete[0];

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffMs = target.getTime() - today.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      
      {/* Planetary Countdown Clocks grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next Wedding Anniversary countdown */}
        <div className="bg-gradient-to-br from-[#1b0a29] to-[#0d041e] border border-violet-500/20 rounded-2xl p-4 shadow-md text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-full filter blur-md" />
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500 mx-auto mb-1 animate-pulse" />
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Anniversary Clock</p>
          <div className="mt-2 text-2xl font-bold font-mono text-white tracking-tight">
            {anniversaryDays} <span className="text-xs text-pink-300">Days</span>
          </div>
          <p className="text-[9px] text-violet-300 mt-1 font-sans">Until next Valentine's Anniversary 💖</p>
        </div>

        {/* Dynamic port-to-nearest-goal countdown */}
        <div className="bg-gradient-to-br from-[#0c0a2c] to-[#04031d] border border-indigo-500/20 rounded-2xl p-4 shadow-md text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-md" />
          <Clock className="w-5 h-5 text-indigo-400 mx-auto mb-1 animate-pulse" />
          <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Next Landmark</p>
          {nextMainGoal ? (
            <>
              <div className="mt-2 text-2xl font-bold font-mono text-white tracking-tight">
                {getDaysUntil(nextMainGoal.targetDate)} <span className="text-xs text-indigo-300">Days</span>
              </div>
              <p className="text-[9px] text-indigo-400 truncate mt-1 max-w-[130px] mx-auto" title={nextMainGoal.title}>
                {nextMainGoal.title}
              </p>
            </>
          ) : (
            <>
              <div className="mt-2 text-md font-bold text-slate-400 py-1 font-mono">
                Pure Starlight
              </div>
              <p className="text-[9px] text-purple-300">All planned goals reached!</p>
            </>
          )}
        </div>
      </div>

      {/* Vision Board Intro */}
      <div className="flex justify-between items-center bg-gradient-to-r from-violet-950/20 via-pink-950/5 to-violet-950/25 border border-violet-900/35 p-3.5 rounded-2xl">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-pink-400 animate-spin-slow" />
            <span>Shared Cosmic Vision Board</span>
          </h2>
          <p className="text-[10px] text-slate-400">Collaboratively manifest your future together.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xs rounded-lg font-bold shadow transition active:scale-95 cursor-pointer"
        >
          {showForm ? "Cancel Goal" : "+ Portal Manifestation"}
        </button>
      </div>

      {/* Add Manifestation Goal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#120f36]/80 p-4 rounded-2xl border border-violet-800/40 space-y-3 shadow-xl">
          <h3 className="text-xs font-mono font-bold text-violet-300 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            Project Future Memory
          </h3>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Goal / Dream Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build our solar-powered cabin in the woods 🌲"
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs focus:outline-none focus:border-pink-500/80"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none"
              >
                <option value="Marriage">Marriage 💍</option>
                <option value="Travel">Travel & Escapes 🚐</option>
                <option value="House/Car">Nest Planning (House/Car) 🏡</option>
                <option value="Dreams">Celestial Dreams 🔭</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Aimed Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none focus:border-pink-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Aspirational Details (Why it matters)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Record the specific smells, colors, and feelings of this completed promise."
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs focus:outline-none focus:border-pink-500/80 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-lg text-white font-bold text-xs shadow-md transition hover:scale-[1.01] cursor-pointer"
          >
            Lock in Our Future Timeline
          </button>
        </form>
      )}

      {/* Grid listing Bucket Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const daysLeft = getDaysUntil(goal.targetDate);
          return (
            <div
              key={goal.id}
              className={`border rounded-2xl p-4 transition duration-300 relative overflow-hidden flex flex-col justify-between ${
                goal.isCompleted
                  ? "bg-emerald-950/10 border-emerald-500/30 shadow-none"
                  : "bg-[#110e31] border-violet-900/40 hover:border-violet-600/30 shadow-md"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-800 text-pink-300 font-mono font-bold">
                    {goal.category}
                  </span>
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {goal.isCompleted ? (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-950/40 p-1 rounded">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="text-slate-400 hover:text-pink-400 text-xs flex items-center gap-1 border border-violet-950 px-2 py-0.5 rounded bg-violet-950/20">
                        ❑ Mark Accomplished
                      </span>
                    )}
                  </button>
                </div>

                <div>
                  <h4 className={`text-xs font-bold text-slate-100 ${goal.isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {goal.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {goal.description || "Manifesting our dream state."}
                  </p>
                </div>
              </div>

              {/* Deadline & days remaining footer bar */}
              <div className="pt-3.5 mt-3 border-t border-violet-950/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Target: {goal.targetDate}
                </span>

                {!goal.isCompleted && (
                  <span className={daysLeft > 0 ? "text-pink-400 font-bold" : "text-rose-500 font-bold"}>
                    {daysLeft > 0 ? `${daysLeft} Days to Manifest` : "Past Target ✨"}
                  </span>
                )}
              </div>

              {/* Decorative faint category icons on background for visual layout punch */}
              <div className="absolute right-3 bottom-8 opacity-[0.03] text-6xl pointer-events-none select-none">
                {goal.category === "Marriage" ? "💍" : goal.category === "Travel" ? "🚐" : "🏡"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
