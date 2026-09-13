"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface FocusTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FocusTimer({ isOpen, onClose }: FocusTimerProps) {
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  const completedRef = useRef(false);

  const switchMode = (newMode: "pomodoro" | "shortBreak" | "longBreak") => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === "pomodoro") setTimeLeft(25 * 60);
    else if (newMode === "shortBreak") setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  useEffect(() => {
    if (!isRunning) return;
    completedRef.current = false;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || timeLeft !== 0 || completedRef.current) return;
    completedRef.current = true;

    const finish = setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#527a29", "#b38600", "#7cae3b"],
        });
      } catch {}
      if (mode === "pomodoro") {
        setSessionsCompleted((prev) => prev + 1);
        setIsRunning(false);
        setMode("shortBreak");
        setTimeLeft(5 * 60);
      } else {
        setIsRunning(false);
      }
    }, 0);

    return () => clearTimeout(finish);
  }, [isRunning, timeLeft, mode]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const totalDuration = mode === "pomodoro" ? 25 * 60 : mode === "shortBreak" ? 5 * 60 : 15 * 60;
  const progressPct = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-[#d2dfd0] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#527a29]/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2eb]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#527a29] pulse-indicator" />
            <h3 className="font-extrabold text-[#162418] text-base tracking-tight flex items-center gap-1.5">
              OleaD Focus Cockpit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7a8e7d] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-1.5 mt-5 p-1 bg-[#f5f8f4] rounded-xl border border-[#d8e4d6]">
          <button
            onClick={() => switchMode("pomodoro")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "pomodoro"
                ? "bg-[#527a29] text-white shadow-sm"
                : "text-[#5c7060] hover:text-[#162418]"
            }`}
          >
            Deep Work (25m)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "shortBreak"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-[#5c7060] hover:text-[#162418]"
            }`}
          >
            Pauza (5m)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "longBreak"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-[#5c7060] hover:text-[#162418]"
            }`}
          >
            Duga Pauza (15m)
          </button>
        </div>

        {/* Timer Display */}
        <div className="my-8 text-center flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-[#e2eae0] flex items-center justify-center bg-[#f8faf7] shadow-inner">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke={mode === "pomodoro" ? "#527a29" : mode === "shortBreak" ? "#0284c7" : "#d97706"}
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * progressPct) / 100}
                strokeLinecap="round"
                className="transition-all duration-500 ease-linear"
              />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="font-mono text-4xl font-black tracking-wider text-[#162418]">
                {formattedTime}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#5c7060] mt-1 uppercase tracking-widest">
                {mode === "pomodoro" ? "Fokus na rad" : "Odmor očiju"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
              isRunning
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20"
                : "bg-[#527a29] hover:bg-[#5e8c2f] text-white shadow-[#527a29]/30 glow-olive"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pauziraj</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Započni Fokus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              switchMode(mode);
            }}
            className="p-2.5 rounded-xl bg-[#f0f5ee] hover:bg-[#e4ede1] border border-[#d2e0cf] text-[#5c7060] hover:text-[#162418] transition-all cursor-pointer"
            title="Resetiraj vrijeme"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Session Count Footer */}
        <div className="mt-6 pt-4 border-t border-[#edf2eb] flex items-center justify-between text-xs text-[#5c7060] font-semibold">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#527a29]" />
            Dovršeno ciklusa danas:
          </span>
          <span className="font-mono font-bold text-[#162418] bg-[#f0f5ee] px-2 py-0.5 rounded border border-[#d2e0cf]">
            {sessionsCompleted}
          </span>
        </div>

      </div>
    </div>
  );
}
