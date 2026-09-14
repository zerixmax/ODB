"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Flame, 
  Clock, 
  Coins, 
  Server, 
  Plus, 
  Timer,
  LogOut
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { logout } from "@/lib/auth-actions";

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenTimer: () => void;
  urgentProjectsCount: number;
  totalWeeklyHours: number;
  deliveryBillingPotential: number;
  vpsProjectsCount: number;
  totalProjectsCount: number;
}

export function Header({
  onOpenNewProject,
  onOpenTimer,
  urgentProjectsCount,
  totalWeeklyHours,
  deliveryBillingPotential,
  vpsProjectsCount,
  totalProjectsCount,
}: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("hr-HR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString("hr-HR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-[#e2e8df] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Time */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-3">
              {/* OleaD Logo Image */}
              <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-[#cfded0] shadow-sm flex items-center justify-center bg-white p-1">
                <Image
                  src="/olead_logo.jpg"
                  alt="OleaD Logo"
                  width={128}
                  height={96}
                  className="w-full h-full object-contain rounded-lg"
                  priority
                />
              </div>
            </div>

            {/* Time & Date Display */}
            <div className="hidden sm:flex flex-col items-end lg:items-start pl-4 sm:border-l border-[#e2e8df]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#3f611d]">
                <Clock className="w-3.5 h-3.5 text-[#527a29]" />
                <span className="font-bold text-[#1a281c] tracking-wider">{time || "--:--:--"}</span>
              </div>
              <span className="text-[11px] text-[#6d8270] capitalize">{dateStr || "Danas"}</span>
            </div>
          </div>

          {/* Top KPI Bar (Section 3: Jutarnja Jasnoća) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between lg:justify-end">
            
            {/* KPI 1: Hitni projekti za danas (🔴 URGENT) */}
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
              urgentProjectsCount > 0 
                ? "bg-rose-50 border-rose-200 shadow-xs" 
                : "bg-[#f7faf6] border-[#e0e8de]"
            }`}>
              <Flame className={`w-4 h-4 ${urgentProjectsCount > 0 ? "text-rose-600 animate-pulse" : "text-[#7a8e7d]"}`} />
              <div className="text-left">
                <div className="text-[10px] text-[#6d8270] uppercase font-mono tracking-wider font-semibold">Hitno Danas</div>
                <div className={`text-xs font-extrabold font-mono ${urgentProjectsCount > 0 ? "text-rose-700" : "text-[#1a281c]"}`}>
                  {urgentProjectsCount} projekta
                </div>
              </div>
            </div>

            {/* KPI 2: Ukupno odrađeni sati u tjednu */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-sky-50/70 border border-sky-200/80 shadow-xs">
              <Timer className="w-4 h-4 text-sky-600" />
              <div className="text-left">
                <div className="text-[10px] text-sky-800 uppercase font-mono tracking-wider font-semibold">Sati / Tjedan</div>
                <div className="text-xs font-extrabold text-sky-900 font-mono">
                  {totalWeeklyHours.toFixed(1)}h rada
                </div>
              </div>
            </div>

            {/* KPI 3: Potencijal naplate za fazu isporuke (>75%) */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-xs">
              <Coins className="w-4 h-4 text-amber-600" />
              <div className="text-left">
                <div className="text-[10px] text-amber-800 uppercase font-mono tracking-wider font-semibold">Isporuka (&gt;75%)</div>
                <div className="text-xs font-extrabold text-amber-900 font-mono">
                  {formatCurrency(deliveryBillingPotential)}
                </div>
              </div>
            </div>

            {/* KPI 4: VPS Projekti */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
              <Server className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <div className="text-[10px] text-emerald-800 uppercase font-mono tracking-wider font-semibold">VPS Stog</div>
                <div className="text-xs font-extrabold text-emerald-900 font-mono">
                  {vpsProjectsCount} / {totalProjectsCount}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTimer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f5ed] hover:bg-[#e4ede0] border border-[#cfdecb] text-xs font-bold text-[#35521b] transition-all cursor-pointer shadow-xs active:scale-95"
                title="Deep Work Focus Timer"
              >
                <Timer className="w-4 h-4 text-[#527a29]" />
                <span className="hidden xl:inline">Focus Timer</span>
              </button>

              <button
                onClick={onOpenNewProject}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#527a29] to-[#3f5f1f] hover:from-[#5e8c2f] hover:to-[#4a7024] text-white text-xs font-bold shadow-sm shadow-[#527a29]/30 transition-all cursor-pointer active:scale-95 glow-olive whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Novi Projekt</span>
              </button>

              {/* Logout */}
              <form action={logout}>
                <button
                  type="submit"
                  title="Odjava"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#faf6f5] hover:bg-rose-50 border border-[#ecdad6] text-xs font-bold text-[#9a3b28] hover:text-rose-700 transition-all cursor-pointer active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Odjava</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
