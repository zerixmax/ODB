"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause, 
  Check, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Edit2,
  Server,
  Sparkles
} from "lucide-react";
import { useWorkTimer } from "./WorkTimerContext";
import { formatSecondsToTimer, formatSecondsToReadable } from "@/lib/utils";

const QUICK_PRESETS = [
  "Seljenje na VPS",
  "DNS & cPanel transfer",
  "Coolify / Docker deployment",
  "Nginx & SSL certifikati",
  "Ispravak bugova i testiranje",
  "Astro / Next.js razvoj",
  "Ažuriranje sadržaja i CMS",
];

export function ActiveTimerDock() {
  const { 
    activeTimer, 
    elapsedSeconds, 
    isSaving, 
    pauseTimer, 
    resumeTimer, 
    updateDescription, 
    stopAndSave, 
    discardTimer 
  } = useWorkTimer();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState("");

  if (!activeTimer) return null;

  const handleStartEdit = () => {
    setEditDesc(activeTimer.description);
    setIsEditingDesc(true);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editDesc.trim()) {
      updateDescription(editDesc.trim());
    }
    setIsEditingDesc(false);
  };

  const formattedTimer = formatSecondsToTimer(elapsedSeconds);
  const readableDuration = formatSecondsToReadable(elapsedSeconds);

  // Minimized Compact Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-[#162418] text-white border border-[#527a29]/50 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeTimer.isRunning ? "bg-[#33d17a] animate-pulse" : "bg-amber-400"}`} />
            <span className="font-mono text-xs font-bold text-slate-200 truncate max-w-[120px]">
              {activeTimer.projectDomain}
            </span>
          </div>

          <span className="font-mono text-sm font-extrabold text-[#7cae3b] tracking-wider">
            {formattedTimer}
          </span>

          <div className="flex items-center gap-1">
            {activeTimer.isRunning ? (
              <button
                onClick={pauseTimer}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
                title="Pauziraj"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="p-1 rounded-lg bg-[#527a29] hover:bg-[#629231] text-white cursor-pointer"
                title="Nastavi rad"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            )}

            <button
              onClick={() => stopAndSave()}
              disabled={isSaving}
              className="p-1 rounded-lg bg-[#33d17a] hover:bg-[#2bb86a] text-[#162418] font-bold cursor-pointer"
              title="Završi i spremi"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>

            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer ml-1"
              title="Proširi"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Cockpit Bar
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white/95 backdrop-blur-md border-2 border-[#527a29] rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-40 h-20 bg-[#527a29]/10 blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#edf2eb]">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${activeTimer.isRunning ? "bg-[#527a29] animate-pulse" : "bg-amber-500"}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#527a29]">
              {activeTimer.isRunning ? "Brojač rada aktivan" : "Brojač pauziran"}
            </span>
            <span className="text-[#c0cfbe]">•</span>
            <Link
              href={`/projects/${activeTimer.projectId}`}
              className="font-mono text-xs font-black text-[#162418] hover:text-[#527a29] transition-colors truncate flex items-center gap-1 group"
              title="Otvori detalje projekta"
            >
              <span>{activeTimer.projectDomain}</span>
              <ExternalLink className="w-3 h-3 text-[#7a8e7d] group-hover:text-[#527a29]" />
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-lg text-[#7a8e7d] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
              title="Smanji u kut"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={discardTimer}
              className="p-1 rounded-lg text-[#7a8e7d] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Poništi bez spremanja"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Live Timer & Task Details */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Time digits */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black tracking-tight text-[#162418]">
              {formattedTimer}
            </span>
            <span className="text-xs font-mono font-bold text-[#527a29] bg-[#eef5eb] px-2 py-0.5 rounded-lg border border-[#d2e5ca]">
              {readableDuration}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {activeTimer.isRunning ? (
              <button
                onClick={pauseTimer}
                className="px-3 py-1.5 rounded-xl bg-[#f0f5ee] hover:bg-[#e4ede1] border border-[#d2e0cf] text-xs font-bold text-[#35521b] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pauza</span>
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="px-3 py-1.5 rounded-xl bg-[#527a29] hover:bg-[#5e8c2f] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Nastavi</span>
              </button>
            )}

            <button
              onClick={() => stopAndSave()}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#527a29] to-[#3a581c] hover:from-[#5e8c2f] hover:to-[#466a22] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-[#527a29]/30 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Spremam...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Završi i spremi</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Task Note & Presets */}
        <div className="pt-2 border-t border-[#edf2eb]">
          {isEditingDesc ? (
            <form onSubmit={handleSaveEdit} className="flex gap-2">
              <input
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Zabilježi što radiš (npr. Seljenje na VPS)..."
                autoFocus
                className="flex-1 bg-[#f8faf7] border border-[#527a29] rounded-xl px-2.5 py-1 text-xs text-[#162418] outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-xl bg-[#527a29] text-white text-xs font-bold cursor-pointer"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDesc(false)}
                className="px-2 py-1 rounded-xl bg-[#f0f5ee] text-[#5c7060] text-xs cursor-pointer"
              >
                ✕
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div 
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 text-xs text-[#405644] hover:text-[#162418] cursor-pointer group flex-1 truncate"
                title="Kliknite za promjenu opisa zadatka"
              >
                <span className="font-semibold text-[11px] text-[#7a8e7d]">Zadatak:</span>
                <span className="font-medium text-[#162418] underline decoration-dashed decoration-[#527a29]/40 group-hover:decoration-[#527a29] truncate">
                  {activeTimer.description || "Klikni za dodavanje opisa zadatka..."}
                </span>
                <Edit2 className="w-3 h-3 text-[#7a8e7d] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Quick Presets Dropdown/Toggle */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                {QUICK_PRESETS.slice(0, 3).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => updateDescription(preset)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                      activeTimer.description === preset
                        ? "bg-[#527a29] text-white border-[#527a29]"
                        : "bg-[#f5f8f4] text-[#5c7060] hover:text-[#162418] hover:bg-[#eef5eb] border-[#d8e4d6]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
