import { useState, useEffect } from "react";
import { ShieldAlert, Fingerprint, Lock, ShieldCheck, Moon } from "lucide-react";

interface BiometricOverlayProps {
  onUnlock: () => void;
  activeUser: "leo" | "luna";
}

export default function BiometricOverlay({ onUnlock, activeUser }: BiometricOverlayProps) {
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "invalid">("idle");
  const userName = activeUser === "leo" ? "Leo 👨‍🚀" : "Luna 👩‍🚀";

  const handleKeyPress = (num: string) => {
    if (status === "scanning" || status === "success") return;
    setStatus("idle");
    const newPasscode = passcode + num;
    if (newPasscode.length <= 4) {
      setPasscode(newPasscode);
    }
    if (newPasscode.length === 4) {
      if (newPasscode === "1234") {
        setStatus("success");
        setTimeout(() => {
          onUnlock();
        }, 800);
      } else {
        setStatus("invalid");
        setTimeout(() => {
          setPasscode("");
          setStatus("idle");
        }, 1200);
      }
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  const startScanning = () => {
    setStatus("scanning");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onUnlock();
      }, 700);
    }, 1500);
  };

  // Auto-scan on launch for cooler effect
  useEffect(() => {
    const timer = setTimeout(() => {
      startScanning();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeUser]);

  return (
    <div className="absolute inset-0 bg-[#0a071b]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-between p-6 select-none border border-violet-500/10 rounded-3xl">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping [animation-delay:1s]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-pink-500 rounded-full opacity-30 blur-sm"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-purple-600/10 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-600/10 rounded-full filter blur-xl"></div>
      </div>

      {/* Header Info */}
      <div className="text-center mt-10 z-10 w-full px-4">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-3xl animate-pulse">
            🛸
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 font-sans">Our Universe</h1>
        <p className="text-xs text-violet-300 font-mono tracking-wider">
          {activeUser === "leo" ? "LEO'S SECURE DOCK" : "LUNA'S SECURE DOCK"}
        </p>
        <div className="mt-2 text-violet-400/70 text-[10px] flex items-center justify-center gap-1 bg-violet-950/40 py-1 px-2.5 rounded-full border border-violet-900/40 w-fit mx-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Screenshot Block Active
        </div>
      </div>

      {/* Biometric Interactive Scan Core */}
      <div className="flex flex-col items-center justify-center my-6 z-10">
        <button
          onClick={startScanning}
          disabled={status === "scanning" || status === "success"}
          className={`relative group w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 cursor-pointer ${
            status === "scanning"
              ? "border-pink-500 bg-pink-500/10 scale-105 shadow-[0_0_25px_rgba(219,39,119,0.3)]"
              : status === "success"
              ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              : status === "invalid"
              ? "border-rose-500 bg-rose-500/10 animate-shake"
              : "border-violet-500/40 bg-violet-950/20 hover:border-violet-400/80 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
          }`}
        >
          {status === "scanning" ? (
            <div className="absolute inset-0 rounded-full border-t-2 border-pink-500 animate-spin"></div>
          ) : null}

          <div className="z-10 flex flex-col items-center">
            {status === "success" ? (
              <ShieldCheck className="w-10 h-10 text-emerald-400 animate-bounce" />
            ) : status === "scanning" ? (
              <Fingerprint className="w-10 h-10 text-pink-400 animate-pulse" />
            ) : (
              <Fingerprint className="w-10 h-10 text-violet-400 group-hover:text-violet-300 transition-colors" />
            )}
          </div>
        </button>

        <p className="text-xs text-slate-400 mt-4 text-center font-sans">
          {status === "scanning" ? (
            <span className="text-pink-400 font-mono tracking-widest animate-pulse">BIOMETRIC SCAN IN PROGRESS...</span>
          ) : status === "success" ? (
            <span className="text-emerald-400 font-mono font-bold tracking-widest">ENCRYPTION SECURE. UNLOCKED!</span>
          ) : status === "invalid" ? (
            <span className="text-rose-400 font-bold">PASSCODE INVALID. RETRYing.</span>
          ) : (
            <span className="text-violet-400 py-1 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5" onClick={startScanning}>
              Tap to Scan Biometrics
            </span>
          )}
        </p>
      </div>

      {/* Numeric Passcode Fallback */}
      <div className="w-full max-w-xs flex flex-col items-center bg-violet-950/10 border border-violet-900/10 rounded-2xl p-4 mb-6 z-10 backdrop-blur-md">
        <div className="flex gap-4 mb-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border border-violet-500/40 transition-all duration-300 ${
                passcode.length > idx
                  ? status === "invalid"
                    ? "bg-rose-500 border-rose-500"
                    : status === "success"
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-pink-500 border-pink-500 shadow-[0_0_8px_rgb(219,39,119)]"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-2.5 text-white text-center w-full">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-2.5 rounded-xl bg-violet-950/20 active:bg-violet-900/40 hover:bg-violet-950/40 border border-violet-900/20 text-md font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPasscode("")}
            className="text-xs font-mono text-violet-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="py-2.5 rounded-xl bg-violet-950/20 active:bg-violet-900/40 border border-violet-900/20 text-md font-semibold transition-all cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="text-xs text-violet-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            Del
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2.5 text-center font-mono">
          TEST KEY: <span className="text-pink-500 font-semibold font-mono">1234</span>
        </p>
      </div>
    </div>
  );
}
