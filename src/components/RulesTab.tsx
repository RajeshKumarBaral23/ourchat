import React, { useState } from "react";
import { Check, X, Shield, Plus, Heart, HelpCircle, History, Sparkles } from "lucide-react";
import { Rule } from "../types";

interface RulesTabProps {
  rules: Rule[];
  activeUser: "leo" | "luna";
  onAddRule: (text: string, category: string) => void;
  onApproveRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export default function RulesTab({
  rules,
  activeUser,
  onAddRule,
  onApproveRule,
  onDeleteRule
}: RulesTabProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Emotional Commitment");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddRule(text.trim(), category);
    setText("");
    setShowForm(false);
  };

  const pendingRules = rules.filter(r => r.status === "pending_approval");
  const approvedRules = rules.filter(r => r.status === "approved");

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="bg-gradient-to-r from-violet-950/40 via-[#100827] to-pink-950/20 border border-violet-500/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-pink-500" />
          <h3 className="font-bold text-sm text-white font-sans tracking-wide">Our Universe Promises & Rules</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This isn't a restrictive block—it is an authentic record of our commitments, playful promises, and core relationship pillars.
          <b className="text-pink-400"> Both partners must approve a newly proposed commitment</b> to lock it as an official universe guideline.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 font-sans">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>The Covenant Portal</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xs rounded-lg font-bold shadow transition active:scale-95 cursor-pointer"
        >
          {showForm ? "Cancel Proposal" : "+ Propose Promise"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#120f35]/80 p-4 rounded-2xl border border-violet-800/40 space-y-3.5 shadow-xl">
          <h4 className="text-xs font-mono font-bold text-violet-300 uppercase tracking-widest">PROPOSE A RELATIONSHIP PROMISE</h4>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">Covenant Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-2 text-white text-xs focus:outline-none"
            >
              <option value="Emotional Commitment">Emotional Commitment ❤️</option>
              <option value="Quality Time">Quality Time 🌌</option>
              <option value="Respect & Space">Respect & Space 🧘</option>
              <option value="Conflict Resolution">Conflict Resolution 🕊️</option>
              <option value="Adventure Hobbies">Adventure & Learning 🔭</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">The Promise Statement</label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write the promise collaboratively in first-person plural, e.g. 'We promise to take at least one vacation each season and capture...' "
              className="w-full bg-[#110e31] border border-violet-900/50 rounded-lg py-1.5 px-3 text-white text-xs focus:outline-none focus:border-pink-500/80 resize-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-lg text-white font-bold text-xs shadow-md transition hover:scale-[1.01] cursor-pointer"
          >
            Submit for Partner Approval
          </button>
        </form>
      )}

      {/* SECTION 1: Pending rule approval checklist */}
      {pendingRules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            PENDING DUAL AGREEMENT ({pendingRules.length})
          </h3>

          <div className="space-y-3">
            {pendingRules.map((rule) => {
              const needsLeoAppr = !rule.approvedByLeo;
              const needsLunaAppr = !rule.approvedByLuna;
              const userNeedsToApprove = (activeUser === "leo" && needsLeoAppr) || (activeUser === "luna" && needsLunaAppr);

              return (
                <div key={rule.id} className="bg-gradient-to-r from-amber-500/5 to-pink-500/5 border border-amber-500/25 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/20 text-amber-300 font-mono">
                      {rule.category}
                    </span>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-[10px] text-[#ff4b4b] font-mono hover:text-white bg-rose-950/20 border border-rose-950/30 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      Discard Proposal
                    </button>
                  </div>

                  <p className="text-xs text-slate-100 font-sans italic font-medium">"{rule.text}"</p>

                  {/* Dual approval status nodes */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-violet-950/40">
                    <div className="flex gap-4 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        Leo: {rule.approvedByLeo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-white" />}
                      </span>
                      <span className="flex items-center gap-1">
                        Luna: {rule.approvedByLuna ? <Check className="w-3.5 h-3.5 text-pink-400" /> : <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-white" />}
                      </span>
                    </div>

                    {userNeedsToApprove ? (
                      <button
                        onClick={() => onApproveRule(rule.id)}
                        className="py-1 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-sans text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Commitment
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono italic">Waiting for Partner Approval...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Approved / Sealed rule books */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
          <History className="w-4 h-4 text-pink-500" />
          SEALED UNIVERSE COMMITTED COVENANTS ({approvedRules.length})
        </h3>

        {approvedRules.length === 0 ? (
          <div className="text-center p-6 bg-violet-950/10 border border-violet-900/25 rounded-2xl">
            <p className="text-xs text-slate-500 italic">No approved promises yet. Propose one and approve together to begin sealing your covenants!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedRules.map((rule) => {
              return (
                <div key={rule.id} className="bg-gradient-to-b from-[#130f35] to-[#0a0721] border border-violet-800/30 rounded-2xl p-4 space-y-2 hover:border-violet-500/35 transition">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-violet-950 border border-violet-800 text-pink-300 font-mono">
                      {rule.category}
                    </span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse" /> SEALED & ENFORCED
                    </span>
                  </div>

                  <p className="text-xs text-pink-100 font-medium font-sans leading-relaxed">
                    "{rule.text}"
                  </p>

                  <div className="pt-2 border-t border-violet-950/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span>Proposed by: {rule.createdBy === "leo" ? "Leo" : "Luna"}</span>
                    <span>Last Consolidated: {new Date(rule.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
