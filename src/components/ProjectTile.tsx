"use client";

import { useTransition } from "react";
import Link from "next/link";
import { 
  Globe, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Archive, 
  Trash2, 
  Cpu, 
  Layers, 
  Laptop, 
  Monitor, 
  GitBranch, 
  Rocket,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  ChevronRight
} from "lucide-react";
import { 
  quickAddTimeLog, 
  updateProjectStage, 
  updateProjectPriority, 
  updateProjectProgress,
  toggleDevDevice,
  toggleCicd,
  toggleHosting,
  toggleDevPayment,
  toggleHostingPayment,
  toggleArchiveProject,
  deleteProject
} from "@/lib/actions";
import { 
  formatCurrency, 
  formatYearOnly, 
  formatRelativeTime, 
  formatDate, 
  daysUntil 
} from "@/lib/utils";
import { ProjectData } from "@/lib/types";
import confetti from "canvas-confetti";

interface ProjectTileProps {
  project: ProjectData;
  onEdit: (project: ProjectData) => void;
}

export function ProjectTile({ project, onEdit }: ProjectTileProps) {
  const [isPending, startTransition] = useTransition();

  const totalLoggedHours = project.timeLogs.reduce((sum, log) => sum + log.hours, 0);

  const handleQuickTime = (hours: number, desc?: string) => {
    startTransition(async () => {
      await quickAddTimeLog(project.id, hours, desc);
    });
  };

  const handleStageChange = (newStage: string) => {
    startTransition(async () => {
      await updateProjectStage(project.id, newStage);
      if (newStage === "PRODUCTION") {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#527a29", "#7cae3b", "#b38600"],
          });
        } catch {}
      }
    });
  };

  const handlePriorityChange = (newPriority: string) => {
    startTransition(async () => {
      await updateProjectPriority(project.id, newPriority);
    });
  };

  const handleProgressChange = (newProgress: number) => {
    startTransition(async () => {
      await updateProjectProgress(project.id, newProgress);
      if (newProgress === 100) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#527a29", "#7cae3b", "#b38600"],
          });
        } catch {}
      }
    });
  };

  const handleToggleDevice = () => {
    startTransition(async () => {
      await toggleDevDevice(project.id, project.devDevice);
    });
  };

  const handleToggleHosting = () => {
    startTransition(async () => {
      await toggleHosting(project.id, project.hosting || (project.isVps ? "VPS" : "TOTOHOST"));
    });
  };

  const handleToggleDevPayment = () => {
    startTransition(async () => {
      await toggleDevPayment(project.id, !project.isDevPaid);
    });
  };

  const handleToggleHostingPayment = () => {
    startTransition(async () => {
      await toggleHostingPayment(project.id, !project.isHostingPaid);
    });
  };

  const handleToggleCicd = () => {
    startTransition(async () => {
      await toggleCicd(project.id, project.hasCicd);
    });
  };

  const handleArchive = () => {
    startTransition(async () => {
      await toggleArchiveProject(project.id, project.isArchived);
    });
  };

  const handleDelete = () => {
    if (confirm(`Jeste li sigurni da želite obrisati projekt "${project.domain}"?`)) {
      startTransition(async () => {
        await deleteProject(project.id);
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return {
          label: "🔴 HITNO",
          badgeClass: "bg-rose-50 text-rose-800 border-rose-300 font-extrabold shadow-xs animate-pulse",
        };
      case "HIGH":
        return {
          label: "🟡 VISOKO",
          badgeClass: "bg-amber-50 text-amber-900 border-amber-300 font-bold",
        };
      case "NORMAL":
        return {
          label: "🟢 NORMALNO",
          badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold",
        };
      case "LOW":
      default:
        return {
          label: "⚪ NISKO",
          badgeClass: "bg-slate-100 text-slate-700 border-slate-300 font-medium",
        };
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "WAITING_VPS":
        return { label: "Čeka VPS / Kontejner 🚀", color: "text-sky-800 bg-sky-50 border-sky-300 font-bold" };
      case "PRODUCTION":
        return { label: "Produkcija Aktivna 🟢", color: "text-emerald-800 bg-emerald-50 border-emerald-300 font-bold" };
      case "MAINTENANCE":
        return { label: "Održavanje 🛠️", color: "text-amber-800 bg-amber-50 border-amber-300 font-bold" };
      case "BACKLOG":
        return { label: "Backlog 📋", color: "text-slate-700 bg-slate-100 border-slate-300 font-semibold" };
      case "IN_PROGRESS":
      default:
        return { label: "U Izradi ⚡", color: "text-[#3b591d] bg-[#edf5e8] border-[#c4dcbc] font-bold" };
    }
  };

  const priorityInfo = getPriorityBadge(project.priority);
  const stageInfo = getStageBadge(project.stage);
  const isLaptop = project.devDevice === "LAPTOP";
  const isVpsHosting = project.hosting === "VPS" || project.isVps;

  return (
    <div
      className={`cockpit-card rounded-2xl p-5 border flex flex-col justify-between transition-all relative overflow-hidden group shadow-xs ${
        project.priority === "URGENT"
          ? "border-rose-300 bg-rose-50/20 hover:border-rose-400"
          : isVpsHosting
          ? "border-[#d0dfce] hover:border-[#96bc8e]"
          : "border-[#e0e8de] hover:border-[#b8ccb4]"
      } ${project.isArchived ? "opacity-50 grayscale bg-slate-50" : "bg-white"}`}
    >
      {/* Top Header: Domain link to /projects/[id], Client, VPS/Hosting & Device Badges */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Dedicated Project Page Link */}
              <Link
                href={`/projects/${project.id}`}
                className="font-mono font-black text-[#162418] text-base hover:text-[#527a29] transition-colors flex items-center gap-1.5 truncate group/link"
                title="Otvori detalje i opaske projekta"
              >
                <Globe className="w-4 h-4 text-[#527a29] flex-shrink-0" />
                <span className="truncate group-hover/link:underline">{project.domain}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7a8e7d] group-hover/link:translate-x-0.5 transition-transform" />
              </Link>

              {/* Direct External Web Link */}
              <a
                href={project.domain.startsWith("http") ? project.domain : `https://${project.domain.split(" / ")[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-[#7a8e7d] hover:text-[#162418] hover:bg-[#edf2eb] transition-colors"
                title="Otvori direktan web link u novoj kartici"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-xs text-[#526655] font-bold mt-0.5 truncate">
              {project.client}
            </div>
          </div>

          {/* Hosting & Device Toggles */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {/* Hosting Toggle Button */}
            <button
              onClick={handleToggleHosting}
              disabled={isPending}
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95 ${
                isVpsHosting
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
              }`}
              title="Klikni za promjenu hostinga [ VPS | TOTOHOST ]"
            >
              {isVpsHosting ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 pulse-indicator" />
                  <span>📦 VPS</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>🌐 Totohost</span>
                </>
              )}
            </button>

            {/* Device Badge (Laptop / Workstation) */}
            <button
              onClick={handleToggleDevice}
              disabled={isPending}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95 ${
                isLaptop
                  ? "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
                  : "bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100"
              }`}
              title="Klikni za promjenu radnog okruženja (Laptop / Radna stanica)"
            >
              {isLaptop ? (
                <>
                  <Laptop className="w-3 h-3 text-purple-700" />
                  <span>💻 Laptop</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3 h-3 text-slate-700" />
                  <span>🖥️ Stanica</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tech Stack, CI/CD, Payment & Doc Link Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-[#eef5eb] text-[#344f1c] border border-[#d2e5ca] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#527a29]" />
            {project.techStack}
          </span>

          {/* Izrada Payment Badge (Clickable Toggle) */}
          <button
            onClick={handleToggleDevPayment}
            disabled={isPending}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              project.isDevPaid
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
            }`}
            title="Klikni za promjenu statusa naplate izrade [ PLAĆENO / NIJE PLAĆENO ]"
          >
            {project.isDevPaid ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Izrada {project.devPrice !== null && project.devPrice > 0 ? `${formatCurrency(project.devPrice)} ` : ""}[ PLAĆENO ]</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Izrada {project.devPrice !== null && project.devPrice > 0 ? `${formatCurrency(project.devPrice)} ` : ""}[ NIJE PLAĆENO ]</span>
              </>
            )}
          </button>

          {/* Hosting Payment Badge (Clickable Toggle) */}
          <button
            onClick={handleToggleHostingPayment}
            disabled={isPending}
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              project.isHostingPaid
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100"
            }`}
            title="Klikni za promjenu statusa naplate hostinga [ PLAĆENO / NIJE PLAĆENO ]"
          >
            {project.isHostingPaid ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Hosting {project.hostingPrice !== null && project.hostingPrice > 0 ? `${formatCurrency(project.hostingPrice)}/god ` : ""}[ PLAĆENO ]</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-orange-600" />
                <span>Hosting {project.hostingPrice !== null && project.hostingPrice > 0 ? `${formatCurrency(project.hostingPrice)}/god ` : ""}[ NIJE PLAĆENO ]</span>
              </>
            )}
          </button>

          {/* Single Clean Rocket: Coolify CI/CD Webhook Badge */}
          {project.hasCicd && (
            <span
              onClick={handleToggleCicd}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-300 flex items-center gap-1 cursor-pointer hover:bg-sky-100"
              title="Coolify Webhook aktivan (Deploy na Git Push)"
            >
              <Rocket className="w-3 h-3 text-sky-600" />
              <span>🚀 Coolify Webhook</span>
            </span>
          )}

          {/* Git Backup Badge */}
          {project.hasGitBackup && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-slate-600" />
              <span>Git</span>
            </span>
          )}

          {/* Spec Doc Link */}
          {project.docUrl && (
            <a
              href={project.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 transition-colors"
              title="Otvori Google Doc / Drive specifikaciju"
            >
              <FileText className="w-3 h-3 text-amber-700" />
              <span>Spec</span>
            </a>
          )}

          {/* Notes indicator link */}
          {project.notes && (
            <Link
              href={`/projects/${project.id}`}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#f3f7f1] text-[#3d5c1f] hover:bg-[#e4edd9] border border-[#cfdeca] flex items-center gap-1 transition-colors"
              title="Otvori tehničke opaske projekta"
            >
              <FileCode2 className="w-3 h-3 text-[#527a29]" />
              <span>Opaske</span>
            </Link>
          )}
        </div>

        {/* Current Status & Action Message Box */}
        <div className="mt-3 p-2.5 rounded-xl bg-[#f7faf6] border border-[#e2eae0] text-xs font-mono flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-[#527a29] mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[#6d8270] text-[10px] block uppercase tracking-wider font-sans font-semibold">
              Trenutni Status & Akcija
            </span>
            <span className="text-[#1a281c] font-bold text-[11px] leading-tight block">
              {project.currentStatus}
            </span>
          </div>
        </div>

        {/* Stage & Priority Selectors Bar */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          {/* Stage Dropdown */}
          <div>
            <label className="text-[10px] font-mono font-bold text-[#5c7060] block mb-1">Status / Faza:</label>
            <select
              value={project.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              disabled={isPending}
              className={`w-full text-xs font-mono font-bold rounded-lg px-2 py-1.5 border outline-none cursor-pointer transition-all ${stageInfo.color}`}
            >
              <option value="BACKLOG">📋 BACKLOG</option>
              <option value="IN_PROGRESS">⚡ IN_PROGRESS</option>
              <option value="WAITING_VPS">🚀 WAITING_VPS</option>
              <option value="PRODUCTION">🟢 PRODUCTION</option>
              <option value="MAINTENANCE">🛠️ MAINTENANCE</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="text-[10px] font-mono font-bold text-[#5c7060] block mb-1">Prioritet:</label>
            <select
              value={project.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              disabled={isPending}
              className={`w-full text-xs font-mono font-extrabold rounded-lg px-2 py-1.5 border outline-none cursor-pointer transition-all ${priorityInfo.badgeClass}`}
            >
              <option value="URGENT">🔴 HITNO</option>
              <option value="HIGH">🟡 VISOKO</option>
              <option value="NORMAL">🟢 NORMALNO</option>
              <option value="LOW">⚪ NISKO</option>
            </select>
          </div>
        </div>

        {/* Progress Bar & Interactive Presets */}
        <div className="mt-4 pt-3 border-t border-[#e8efe6]">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-[#5c7060] font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#527a29]" />
              Dovršenost:
            </span>
            <span className="font-extrabold text-[#162418] font-mono">{project.progress}%</span>
          </div>

          <div className="w-full bg-[#edf2eb] rounded-full h-2.5 overflow-hidden border border-[#d6e2d4]">
            <div
              className="h-full rounded-full transition-all duration-500 phase-active-line"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          {/* Quick Progress Buttons */}
          <div className="grid grid-cols-4 gap-1 mt-2 text-center">
            {[25, 50, 75, 100].map((val) => (
              <button
                key={val}
                onClick={() => handleProgressChange(val)}
                disabled={isPending}
                className={`py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  project.progress === val
                    ? "bg-[#527a29] text-white border-[#527a29] shadow-2xs"
                    : "bg-[#f7faf6] text-[#5c7060] hover:text-[#162418] border-[#dde5db]"
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Price, Quick Time Logging (+15m, +30m, +1h), Edit actions */}
      <div className="mt-4 pt-3 border-t border-[#e8efe6]">
        {/* Lifecycle Row: Setup year, Deadline countdown, Last work */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-[10px] font-mono">
          <div className="min-w-0">
            <span className="text-[#6d8270] text-[9px] block uppercase font-bold">Setup</span>
            {project.setupDate ? (
              <span className="text-[#162418] font-black flex items-center gap-1" title={project.setupDate.toISOString()}>
                🗓️ {formatYearOnly(project.setupDate)}
              </span>
            ) : (
              <span className="text-[#7a8e7d]">🗓️ --</span>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[#6d8270] text-[9px] block uppercase font-bold">Rok</span>
            {project.deadlineDate ? (
              (() => {
                const remaining = daysUntil(project.deadlineDate);
                if (remaining === null) return <span className="text-[#7a8e7d]">Nema</span>;
                return (
                  <span className={`flex items-center gap-1 font-bold ${remaining < 0 ? "text-rose-700" : remaining <= 7 ? "text-amber-700" : "text-[#162418]"}`} title={formatDate(project.deadlineDate)}>
                    ⏳ {formatDate(project.deadlineDate)}
                    {remaining >= 0 ? ` (još ${remaining} dana)` : " (prošao)"}
                  </span>
                );
              })()
            ) : (
              <span className="text-[#7a8e7d]">⏳ --</span>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[#6d8270] text-[9px] block uppercase font-bold">Zadnji rad</span>
            <span className="text-[#162418] font-bold truncate block" title={project.lastUpdateDate.toISOString()}>
              {formatRelativeTime(project.lastUpdateDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Price / Billing Status */}
          <div className="text-xs font-mono">
            <span className="text-[#6d8270] text-[10px] block uppercase font-bold">Naplata</span>
            <div className="flex items-center gap-2">
              <div>
                <span className="text-[#a07400] font-black text-sm">
                  {project.devPrice !== null && project.devPrice > 0 ? formatCurrency(project.devPrice) : "--"}
                </span>
                <span className="text-[#7a8e7d] text-[9px] block">Izrada</span>
              </div>
              {project.hostingPrice !== null && project.hostingPrice > 0 && (
                <>
                  <span className="text-[#7a8e7d]">+</span>
                  <div>
                    <span className="text-[#3b591d] font-extrabold text-sm">
                      {formatCurrency(project.hostingPrice)}
                    </span>
                    <span className="text-[#7a8e7d] text-[9px] block">Hosting /god</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Logged hours indicator */}
          <div className="text-xs font-mono text-right">
            <span className="text-[#6d8270] text-[10px] block uppercase font-bold">Utrošeno</span>
            <span className="text-[#2b4c13] font-extrabold text-xs">
              {totalLoggedHours > 0 ? `${totalLoggedHours}h rada` : "0h"}
            </span>
          </div>
        </div>

        {/* Quick Time Buttons (+15m, +30m, +1h) & Actions */}
        <div className="mt-3 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuickTime(0.25)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-[#eef5eb] hover:bg-[#e0edd9] border border-[#c4dcbc] text-[11px] font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Dodaj 15 minuta rada"
            >
              +15m
            </button>
            <button
              onClick={() => handleQuickTime(0.5)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-[#eef5eb] hover:bg-[#e0edd9] border border-[#c4dcbc] text-[11px] font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Dodaj 30 minuta rada"
            >
              +30m
            </button>
            <button
              onClick={() => handleQuickTime(1.0)}
              disabled={isPending}
              className="px-2.5 py-1 rounded-lg bg-[#eef5eb] hover:bg-[#e0edd9] border border-[#c4dcbc] text-[11px] font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Dodaj 1 sat rada"
            >
              +1h
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* View Project Details */}
            <Link
              href={`/projects/${project.id}`}
              className="p-1.5 rounded-lg text-[#527a29] hover:text-[#38551a] hover:bg-[#eef5eb] transition-colors cursor-pointer"
              title="Otvori stranicu projekta"
            >
              <FileCode2 className="w-3.5 h-3.5" />
            </Link>

            {/* Edit modal */}
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-[#5c7060] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
              title="Uredi projekt"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Archive */}
            <button
              onClick={handleArchive}
              className="p-1.5 rounded-lg text-[#5c7060] hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              title={project.isArchived ? "Vrati iz arhive" : "Arhiviraj projekt"}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-[#5c7060] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Obriši projekt"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
