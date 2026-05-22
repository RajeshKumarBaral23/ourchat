import { useState } from "react";
import { ShieldCheck, ShieldAlert, Wifi, Key, Database, RefreshCw, Trash2, HelpCircle, HardDrive } from "lucide-react";
import { CoupleSettings } from "../types";

interface SecurityTabProps {
  settings: CoupleSettings;
  activeUser: "leo" | "luna";
  isJailbrokenSimulated: boolean;
  onToggleJailbreak: () => void;
  onClearLogs: () => void;
  onResetDatabase: () => void;
}

export default function SecurityTab({
  settings,
  activeUser,
  isJailbrokenSimulated,
  onToggleJailbreak,
  onClearLogs,
  onResetDatabase
}: SecurityTabProps) {
  const [showWipeModal, setShowWipeModal] = useState(false);

  const handleReset = () => {
    onResetDatabase();
    setShowWipeModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Jailbreak Detector simulation card */}
      <div className={`p-4 rounded-2xl border transition duration-300 ${
        isJailbrokenSimulated 
          ? "bg-rose-950/40 border-rose-500 text-rose-200 animate-pulse" 
          : "bg-emerald-950/10 border-emerald-500/30 text-emerald-300"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isJailbrokenSimulated ? (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest">
                JAILBREAK/ROOT INTELLIGENCE SENSOR
              </h4>
              <p className="text-[10px] text-slate-400 font-sans">
                {isJailbrokenSimulated 
                  ? "DEVICE INTEGRITY COMPROMISED! WATERMARK WATER LEVEL CRITICAL!" 
                  : "Device environment determined to be 100% genuine and pristine."}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleJailbreak}
            className={`px-3 py-1 text-[10px] font-mono rounded font-bold transition active:scale-95 cursor-pointer ${
              isJailbrokenSimulated 
                ? "bg-rose-500 text-white" 
                : "bg-slate-900 border border-violet-900/50 text-rose-300 hover:bg-slate-950"
            }`}
          >
            {isJailbrokenSimulated ? "Simulate Secure State" : "Simulate Jailbroken state"}
          </button>
        </div>

        {isJailbrokenSimulated && (
          <div className="mt-3 text-[10px] bg-rose-950/60 p-2 rounded border border-rose-500/20 leading-relaxed font-sans text-rose-300">
            ⚠️ <b>System Lockdown advisory:</b> Our core safety module noticed active root privileges or emulator hooks.
            All photo viewer drawers are blurred to ensure no clipboard or scraper malware extracts images.
          </div>
        )}
      </div>

      {/* Authorized Universe pair details */}
      <div className="bg-[#110e30]/50 border border-violet-900/40 rounded-2xl p-4 space-y-3.5">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <Key className="w-4 h-4 text-pink-400" /> Cryptographic Key & Certificate
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0b0821] p-3 rounded-xl border border-violet-950">
            <span className="text-[10px] font-mono text-slate-500">PARTNER A SECURITY KEY</span>
            <p className="font-bold text-white mt-1">👨‍🚀 Leo (Admin)</p>
            <p className="text-[10px] text-pink-400 font-mono mt-1 select-none">SHA256: 4b27...c19a</p>
          </div>
          <div className="bg-[#0b0821] p-3 rounded-xl border border-violet-950">
            <span className="text-[10px] font-mono text-slate-500">PARTNER B SECURITY KEY</span>
            <p className="font-bold text-white mt-1">👩‍🚀 Luna (Admin)</p>
            <p className="text-[10px] text-pink-400 font-mono mt-1 select-none">SHA256: 9e3c...71be</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 text-center font-mono">
          Only these two approved certificates have access to the stardust portals.
        </p>
      </div>

      {/* Screenshot protection telemetry report logs panel */}
      <div className="bg-gradient-to-b from-[#130f35] to-[#0a0721] border border-violet-900/40 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <h4 className="font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-pink-500" /> screenshot & telemetry logs
          </h4>
          {settings.screenshotLog.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-[10px] text-rose-400 font-mono hover:text-white cursor-pointer"
            >
              Clear Log History
            </button>
          )}
        </div>

        {settings.screenshotLog.length === 0 ? (
          <div className="bg-violet-950/10 border border-violet-950 p-4 text-center rounded-xl">
            <p className="text-xs text-slate-500 font-sans italic">All systems protected. No security violations reported.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 font-mono">
            {settings.screenshotLog.map((log, idx) => (
              <div key={idx} className="bg-rose-950/10 border border-rose-950/20 text-xs p-2.5 rounded-xl flex justify-between items-center text-rose-300 font-mono">
                <div>
                  <p className="font-bold text-white tracking-wide">{log.type}</p>
                  <p className="text-[10px] text-slate-400">Triggered by: <b className="text-pink-400 font-sans">{log.user.toUpperCase()}</b></p>
                </div>
                <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: reset state db */}
      <div className="bg-rose-950/10 border border-rose-950/30 p-4 rounded-2xl space-y-3 shadow-lg">
        <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
          <Database className="w-4 h-4" /> DANGER SYSTEM PORTALS WIPE
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Permanently clear user-entered stardust timeline, covenant rules, goal parameters, and re-initialize back to Leo and Luna's default 2025 starting state.
        </p>

        {showWipeModal ? (
          <div className="p-3 bg-rose-950/45 rounded-xl border border-rose-500/20 text-xs space-y-3">
            <p className="text-rose-200 font-bold">⚠️ ABSOLUTE CONFIRMATION REQUIRED:</p>
            <p className="text-slate-300">This action breaks E2E portals. Are you both absolutely sure you want to initialize back to stardust?</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="py-1 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer text-xs"
              >
                Yes, Wipe Universe
              </button>
              <button
                onClick={() => setShowWipeModal(false)}
                className="py-1 px-3 bg-slate-900 border border-violet-900 text-slate-300 rounded cursor-pointer text-xs hover:text-white"
              >
                Cancel Wipe
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowWipeModal(true)}
            className="py-1.5 px-4 bg-rose-950/60 hover:bg-rose-950 text-rose-300 hover:text-white border border-rose-900/60 rounded-xl font-bold font-sans text-xs flex items-center gap-1 cursor-pointer transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wipe and Re-seed portals
          </button>
        )}
      </div>

    </div>
  );
}
