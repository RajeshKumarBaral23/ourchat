import React, { useState } from "react";
import { Landmark, ArrowUpRight, Award, Plus, Calendar, TrendingUp, Sparkles, DollarSign } from "lucide-react";
import { SavingGoal, SavingContribution } from "../types";

interface FinancesTabProps {
  finances: SavingGoal;
  activeUser: "leo" | "luna";
  onDeposit: (amount: number, description: string) => void;
  onSetTarget: (amount: number) => void;
}

export default function FinancesTab({
  finances,
  activeUser,
  onDeposit,
  onSetTarget
}: FinancesTabProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    onDeposit(amount, description.trim() || undefined as any);
    setDepositAmount("");
    setDescription("");
  };

  const handleTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(targetAmount);
    if (!isNaN(targetVal) && targetVal > 0) {
      onSetTarget(targetVal);
      setTargetAmount("");
      setShowConfig(false);
    }
  };

  // Progress calculations
  const totalSaved = finances.currentSavings;
  const target = finances.targetAmount;
  const progressPercent = Math.min(100, Math.floor((totalSaved / target) * 100));

  // Analytics
  const leoTotal = finances.contributions
    .filter(c => c.contributor === "leo")
    .reduce((sum, c) => sum + c.amount, 0);

  const lunaTotal = finances.contributions
    .filter(c => c.contributor === "luna")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalContributions = leoTotal + lunaTotal;
  const leoPercentage = totalContributions > 0 ? Math.floor((leoTotal / totalContributions) * 100) : 50;
  const lunaPercentage = totalContributions > 0 ? Math.floor((lunaTotal / totalContributions) * 100) : 50;

  return (
    <div className="space-y-6">
      
      {/* Target Progress Card */}
      <div className="bg-gradient-to-br from-[#1b0a3c] via-[#0d0928] to-[#040212] border border-violet-800/30 p-5 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full filter blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl" />
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] text-pink-400 font-mono tracking-widest uppercase">Travel Adventure Savings Goal</span>
            <h3 className="text-xl font-bold text-white tracking-wide mt-1">
              ${totalSaved.toLocaleString()} <span className="text-xs text-slate-400 font-normal">saved of ${target.toLocaleString()}</span>
            </h3>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[10px] text-pink-300 font-mono border border-pink-500/20 px-2 py-0.5 rounded bg-pink-950/20 hover:bg-pink-900/40 transition cursor-pointer"
          >
            {showConfig ? "Close Settings" : "Adjust Goal Target"}
          </button>
        </div>

        {/* Change Target Settings */}
        {showConfig && (
          <form onSubmit={handleTargetSubmit} className="bg-violet-950/50 p-3 rounded-xl border border-violet-850 mb-4 flex gap-2">
            <input
              type="number"
              required
              placeholder="e.g. 10000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="flex-1 bg-[#120f36] border border-violet-900 text-white text-xs px-3 py-1.5 focus:outline-none rounded-lg"
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-500 text-white text-xs rounded-lg px-3 py-1.5 font-bold cursor-pointer"
            >
              Update Target
            </button>
          </form>
        )}

        {/* Real Dynamic visual Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Universe Cohesion Bar</span>
            <span className="text-pink-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-violet-950/40 rounded-full overflow-hidden border border-violet-900/30">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgb(219,39,119)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Award indicator badge */}
        {progressPercent >= 100 ? (
          <div className="mt-4 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs p-2.5 rounded-xl font-sans animate-bounce">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Success: Savings Objective Reached! Let's schedule the escape ticket together! ✈️</span>
          </div>
        ) : (
          <div className="mt-4 text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Keep going! Need <span className="text-pink-400 font-bold">${(target - totalSaved).toLocaleString()}</span> to fill the cup.
          </div>
        )}
      </div>

      {/* Analytics Dashboard (Donut/Bar Chart) */}
      <div className="bg-[#120f32]/40 border border-violet-950/40 rounded-2xl p-4 space-y-4">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-pink-400" /> Savings Division Analytics
        </h4>

        {/* Clean visual Chart Component wrapper */}
        <div className="grid grid-cols-2 gap-4 items-center pt-2">
          {/* Pie Chart / visual ledger */}
          <div className="space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-indigo-400 flex items-center gap-1">👨‍🚀 Leo:</span>
                <span className="font-bold text-white">${leoTotal.toLocaleString()} ({leoPercentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-violet-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${leoPercentage}%` }} />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-pink-400 flex items-center gap-1">👩‍🚀 Luna:</span>
                <span className="font-bold text-white">${lunaTotal.toLocaleString()} ({lunaPercentage}%)</span>
              </div>
              <div className="w-full h-1.5 bg-violet-950 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: `${lunaPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* SVG Visual Circular gauge representation */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  className="stroke-violet-950 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  className="stroke-indigo-500 fill-none transition-all duration-700"
                  strokeWidth="8"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * leoPercentage) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Total</span>
                <span className="text-[12px] font-bold text-white">${totalSaved.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send deposit contribution portal */}
      <form onSubmit={handleDepositSubmit} className="bg-violet-950/20 border border-violet-900/30 p-4 rounded-xl space-y-3">
        <h4 className="text-xs font-mono font-bold text-pink-300 uppercase tracking-widest flex items-center gap-1">
          <ArrowUpRight className="w-4 h-4 text-emerald-400" /> Record a Joint Deposit
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 font-mono tracking-wider mb-1">Deposit Amount ($)</label>
            <div className="relative">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="number"
                required
                min="1"
                placeholder="250"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full py-1.5 pl-7 pr-2 bg-[#100d2d] border border-violet-900/80 text-white text-xs focus:outline-none focus:border-pink-500 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 font-mono tracking-wider mb-1">Description / Goal Note</label>
            <input
              type="text"
              required
              placeholder="e.g. Ticket deposits flight ✈️"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#100d2d] border border-violet-900/80 text-white text-xs focus:outline-none focus:border-pink-500 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-bold text-xs rounded-lg transition hover:from-emerald-500 hover:to-indigo-500 cursor-pointer"
        >
          Inject to savings pool securely
        </button>
      </form>

      {/* Ledger history transactions list */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Savings Contributions History Ledger
        </h4>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {finances.contributions.map((item) => (
            <div key={item.id} className="bg-violet-950/15 border border-violet-900/20 hover:border-violet-900/40 p-2.5 rounded-xl flex items-center justify-between text-xs transition duration-300">
              <div className="space-y-0.5">
                <p className="font-semibold text-white">{item.description}</p>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <span className={item.contributor === "leo" ? "text-indigo-400" : "text-pink-400"}>
                    {item.contributor === "leo" ? "👨‍🚀 Leo" : "👩‍🚀 Luna"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{item.date}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                +${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
