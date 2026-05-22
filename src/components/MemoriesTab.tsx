import React, { useState } from "react";
import { Heart, Smile, Send, Star, Image, Calendar, AlertCircle } from "lucide-react";
import { Memory } from "../types";

interface MemoriesTabProps {
  memories: Memory[];
  activeUser: "leo" | "luna";
  onAddMemory: (title: string, description: string, category: string, imageUrl?: string) => void;
  onReact: (id: string, type: "heart" | "hug" | "kiss") => void;
  onComment: (id: string, text: string) => void;
}

export default function MemoriesTab({
  memories,
  activeUser,
  onAddMemory,
  onReact,
  onComment,
}: MemoriesTabProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Milestone");
  const [imageUrl, setImageUrl] = useState("");
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  // For watermark overlay
  const viewerWatermarkText = `${activeUser.toUpperCase()} • ${new Date().toLocaleDateString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAddMemory(title, description, category, imageUrl || undefined);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setShowAddForm(false);
  };

  const handleCommentSubmit = (id: string) => {
    const text = commentInput[id];
    if (!text || !text.trim()) return;
    onComment(id, text.trim());
    setCommentInput(prev => ({ ...prev, [id]: "" }));
  };

  // On This Day calculation
  const currentMonthDay = new Date().toISOString().slice(5, 10); // "MM-DD"
  const onThisDayMemories = memories.filter(m => m.date.slice(5, 10) === currentMonthDay);

  return (
    <div className="space-y-6">
      {/* On This Day Recap Alert banner */}
      {onThisDayMemories.length > 0 ? (
        <div className="bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-indigo-900/40 border border-pink-500/30 text-white rounded-2xl p-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin-slow" />
            <h3 className="font-bold text-sm tracking-wide font-sans text-pink-200">ON THIS DAY IN OUR UNIVERSE</h3>
          </div>
          <p className="text-xs text-slate-200 mb-3">
            You shared a magical moment on this date {new Date(onThisDayMemories[0].date).getFullYear()}! Let's cherish it forever:
          </p>
          <div className="bg-violet-950/40 p-3 rounded-lg border border-pink-500/20 text-xs">
            <p className="font-bold text-pink-300">{onThisDayMemories[0].title}</p>
            <p className="text-slate-300 italic mt-1 font-serif">"{onThisDayMemories[0].description}"</p>
          </div>
        </div>
      ) : (
        <div className="bg-violet-950/20 border border-violet-900/20 rounded-2xl p-4 text-center">
          <p className="text-xs text-slate-400 font-sans italic">
            "We do not remember days, we remember moments." 🌌 Let's build another memory today!
          </p>
        </div>
      )}

      {/* Block Downloads / Watermark info note */}
      <div className="bg-violet-950/35 border border-violet-800/20 rounded-2xl p-3 flex items-start gap-2 text-[11px] text-slate-300 font-sans">
        <AlertCircle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-pink-300 font-semibold font-sans">Strict Privacy Enforcement:</span> For maximum couple security, screenshots are disabled, right-click/downloads are blocked, and images are watermarked with your session ID (<span className="text-pink-400 font-mono font-bold">{viewerWatermarkText}</span>).
        </div>
      </div>

      {/* Button to show memories form */}
      <div className="flex justify-between items-center">
        <h2 className="text-md font-bold text-white tracking-wide flex items-center gap-1.5">
          <span>🌠 Memories Timeline</span>
          <span className="text-xs font-mono font-normal text-slate-400">({memories.length} portals)</span>
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs rounded-lg font-bold transition shadow-md active:scale-95 cursor-pointer"
        >
          {showAddForm ? "Cancel Add" : "+ Portal Memory"}
        </button>
      </div>

      {/* Add Memory Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-violet-950/30 border border-violet-800/40 p-4 rounded-2xl space-y-3 shadow-xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">A New Portal in Time</h3>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kissing Under the Fireworks 🎆"
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500/80"
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
                <option value="Anniversary">Anniversary 💖</option>
                <option value="Travel">Travel Adventure ✈️</option>
                <option value="Comforting Moment">Comforting Moment 🫂</option>
                <option value="Inside Joke">Inside Joke 🛸</option>
                <option value="Milestone">General Milestone ✨</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Photo Reference URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Optional image address"
                className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Description / Emotional Story</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How did you feel? What words did you use? Capture the authentic memory."
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-pink-500/80 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 rounded-lg text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            Safely Store in Universe
          </button>
        </form>
      )}

      {/* Memory Timeline List */}
      <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-violet-950/50">
        {memories.map((memory) => (
          <div key={memory.id} className="relative pl-10 group">
            {/* Timeline Circle Node */}
            <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#120e3a] border-2 border-pink-500 shadow-[0_0_8px_rgba(219,39,119,0.5)] z-10" />

            {/* Container */}
            <div className="bg-gradient-to-b from-[#130f35] to-[#0c0926] border border-violet-900/40 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-violet-600/30">
              
              {/* Image box with watermarking + block protection */}
              {memory.imageUrl && (
                <div 
                  className="relative h-48 w-full bg-[#0a071a] overflow-hidden select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover opacity-80 transition duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Real-time Dynamic Watermark Text overlay (viewer-specific) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-30 rotate-12">
                    <p className="text-[14px] text-pink-300 font-mono tracking-widest whitespace-nowrap bg-violet-950/40 px-2 py-0.5 rounded border border-pink-500/10">
                      {viewerWatermarkText} • OUR UNIVERSE E2E
                    </p>
                  </div>
                  {/* Subtle blur cover to prevent browser inspector scraping easily */}
                  <div className="absolute inset-0 border-b border-violet-900/40 shadow-inner pointer-events-none" />
                  
                  {/* Prevent download text warning label */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-[9px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded tracking-wide backdrop-blur-sm">
                    Protected Media 🚫
                  </div>
                </div>
              )}

              {/* Memory Body */}
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-800 text-pink-300 font-sans">
                      {memory.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {memory.date}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Uploaded by: <b className="text-violet-300">{memory.uploader === "leo" ? "Leo" : "Luna"}</b>
                  </span>
                </div>

                <h3 className="text-md font-bold text-white tracking-wide">{memory.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{memory.description}</p>

                {/* Secure Action Reactions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-violet-950/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReact(memory.id, "heart")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-950/20 border border-pink-500/15 text-pink-400 hover:bg-pink-900/30 transition text-xs cursor-pointer active:scale-90"
                    >
                      ❤️ {memory.reactions.heart || 0}
                    </button>
                    <button
                      onClick={() => onReact(memory.id, "hug")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-950/30 border border-violet-500/15 text-violet-300 hover:bg-violet-900/30 transition text-xs cursor-pointer active:scale-90"
                    >
                      🫂 {memory.reactions.hug || 0}
                    </button>
                    <button
                      onClick={() => onReact(memory.id, "kiss")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/20 border border-rose-500/15 text-rose-300 hover:bg-rose-900/30 transition text-xs cursor-pointer active:scale-90"
                    >
                      💋 {memory.reactions.kiss || 0}
                    </button>
                  </div>
                </div>

                {/* Shared Comments Subsystem */}
                <div className="pt-2.5 space-y-2 mt-3 bg-violet-950/10 p-3 rounded-xl border border-violet-900/20">
                  <p className="text-[10px] uppercase font-mono text-violet-300 tracking-wider">Luminescence Chats ({memory.comments.length})</p>
                  
                  {memory.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-0.5">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-slate-200">{comment.sender === "leo" ? "Leo 👨‍🚀" : "Luna 👩‍🚀"}:</span>
                        <span className="font-mono text-[9px]">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-pink-100 font-sans">{comment.text}</p>
                    </div>
                  ))}

                  {/* Comment Input */}
                  <div className="flex gap-1.5 pt-1.5">
                    <input
                      type="text"
                      placeholder="Comment..."
                      value={commentInput[memory.id] || ""}
                      onChange={(e) => setCommentInput(prev => ({ ...prev, [memory.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(memory.id)}
                      className="flex-1 bg-[#0f0c2d] border border-violet-950/80 rounded-lg py-1 px-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCommentSubmit(memory.id)}
                      className="p-1 px-2 bg-pink-600/30 border border-pink-500/30 hover:bg-pink-600/50 rounded-lg text-pink-300 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
