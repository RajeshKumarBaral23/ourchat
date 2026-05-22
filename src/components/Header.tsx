import { Heart, Lock, Users, ShieldAlert, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeUser: "leo" | "luna";
  onUserSwitch: (user: "leo" | "luna") => void;
  onLock: () => void;
  screenshotBlocked: boolean;
  onSimulateScreenshot: () => void;
  onSimulateJailbreak: () => void;
  unresolvedRulesCount: number;
}

export default function Header({
  activeUser,
  onUserSwitch,
  onLock,
  screenshotBlocked,
  onSimulateScreenshot,
  onSimulateJailbreak,
  unresolvedRulesCount
}: HeaderProps) {
  return (
    <div className="bg-[#100c2a]/95 border-b border-violet-950/60 p-4 sticky top-0 z-40 backdrop-blur-md rounded-t-3xl flex flex-col gap-3">
      {/* Dynamic Status / System Details */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ESTABLISHED: 2025-02-14</span>
        </div>
        <div className="text-violet-400 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-beat" />
          <span>DAYS TOGETHER: 462</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Title Logo */}
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide font-sans flex items-center gap-1">
            Our Universe <span className="text-pink-500 text-sm">🌌</span>
          </h1>
          <p className="text-[10px] text-violet-400/80 font-sans tracking-wide">
            Private Celestial Couple Space
          </p>
        </div>

        {/* Lock and Mode Configuration Controls */}
        <div className="flex items-center gap-2">
          {/* Simulate Action buttons (for tester ease) */}
          <button
            onClick={onSimulateScreenshot}
            className="px-2 py-1 text-[10px] font-semibold font-mono rounded bg-rose-950/30 border border-rose-900/40 text-rose-300 hover:bg-rose-900/40 transition active:scale-95 cursor-pointer title='Simulate Screenshot block Alert'"
          >
            📸 PrintScr
          </button>

          <button
            onClick={onLock}
            className="p-2 rounded bg-violet-950/40 border border-violet-900/60 text-violet-300 hover:bg-violet-900/60 transition hover:text-white active:scale-95 cursor-pointer"
            title="Lock App Instantly"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Switcher Area & Security Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-violet-950/40">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Logged in as:</span>
          {/* Active Partner Picker */}
          <div className="flex bg-violet-950/50 p-0.5 rounded-lg border border-violet-900/40">
            <button
              onClick={() => onUserSwitch("leo")}
              className={`px-2.5 py-1 rounded text-xs transition duration-300 flex items-center gap-1 cursor-pointer font-sans font-medium ${
                activeUser === "leo"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-[0_0_8px_rgba(124,58,237,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👨‍🚀 Leo
            </button>
            <button
              onClick={() => onUserSwitch("luna")}
              className={`px-2.5 py-1 rounded text-xs transition duration-300 flex items-center gap-1 cursor-pointer font-sans font-medium ${
                activeUser === "luna"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-[0_0_8px_rgba(219,39,119,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👩‍🚀 Luna
            </button>
          </div>
        </div>

        {/* Unresolved rule approvals alert tag */}
        {unresolvedRulesCount > 0 && (
          <div className="animate-pulse bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{unresolvedRulesCount} Rule Pending Approval</span>
          </div>
        )}
      </div>
    </div>
  );
}
