"use client";

import { useState, useEffect } from "react";
import { Play, X, Clock, Sparkles } from "lucide-react";
import { useWorkTimer } from "./WorkTimerContext";

const PRESET_TASKS = [
  "Seljenje na VPS",
  "DNS & cPanel transfer",
  "Coolify / Docker konfiguracija",
  "Nginx proxy i SSL certifikati",
  "Optimizacija baze i SQLite migracija",
  "Ispravak bugova i testiranje",
  "Astro / Next.js razvoj novih modula",
  "Redizajn sučelja i CSS dorađivanje",
  "Ažuriranje sadržaja i klijentska podrška",
];

export function StartTimerModal() {
  const { startModalProject, closeStartModal, startTimer, activeTimer } = useWorkTimer();
  const [taskDesc, setTaskDesc] = useState("Seljenje na VPS");

  useEffect(() => {
    if (startModalProject) {
      if (startModalProject.desc) {
        setTaskDesc(startModalProject.desc);
      } else {
        // default based on domain or preset
        if (startModalProject.domain.includes("ponta")) {
          setTaskDesc("Seljenje na VPS");
        } else {
          setTaskDesc("Rad na projektu");
        }
      }
    }
  }, [startModalProject]);

  if (!startModalProject) return null;

  const handleStart = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTimer(startModalProject.id, startModalProject.domain, taskDesc.trim() || "Rad na projektu");
    closeStartModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white border border-[#d2dfd0] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#527a29]/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2eb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#eef5eb] border border-[#d2e5ca] flex items-center justify-center text-[#527a29]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#162418] text-base tracking-tight">
                Pokreni brojač radnog vremena
              </h3>
              <p className="text-xs text-[#5c7060] font-mono font-bold">
                {startModalProject.domain}
              </p>
            </div>
          </div>
          <button
            onClick={closeStartModal}
            className="p-1.5 rounded-lg text-[#7a8e7d] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if another timer is running */}
        {activeTimer && activeTimer.projectId !== startModalProject.id && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <span className="font-bold">⚠️ Napomena:</span>
            <span>
              Trenutno je aktivan brojač za <strong>{activeTimer.projectDomain}</strong>. Pokretanjem ovog brojača zamijenit ćete trenutnu sesiju.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleStart} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#162418] block mb-1.5">
              Što trenutno radite na ovom projektu?
            </label>
            <input
              type="text"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="npr. Seljenje na VPS, konfiguracija Nginxa..."
              autoFocus
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white focus:ring-2 focus:ring-[#527a29]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#162418] outline-none font-medium transition-all"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-mono font-bold text-[#5c7060] uppercase block mb-2">
              Brzi odabir zadatka:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_TASKS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setTaskDesc(preset)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    taskDesc === preset
                      ? "bg-[#527a29] text-white border-[#527a29] shadow-xs"
                      : "bg-[#f5f8f4] text-[#425746] hover:bg-[#eef5eb] hover:text-[#162418] border-[#d8e4d6]"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeStartModal}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c7060] hover:text-[#162418] hover:bg-[#f0f5ee] transition-all cursor-pointer"
            >
              Odustani
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#527a29] to-[#3a581c] hover:from-[#5e8c2f] hover:to-[#466a22] text-white text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#527a29]/30 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Pokreni brojač vremena</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
