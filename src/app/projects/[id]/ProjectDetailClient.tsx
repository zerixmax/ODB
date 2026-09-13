"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Globe, 
  ExternalLink, 
  FileText, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Layers,
  Laptop,
  Monitor,
  Rocket,
  GitBranch,
  Save,
  Server,
  Receipt,
  FileCode2,
  Calendar,
  Sparkles,
  Terminal,
  Database,
  ExternalLinkIcon
} from "lucide-react";
import { 
  quickAddTimeLog, 
  deleteTimeLog, 
  updateProjectNotes, 
  togglePaymentStatus, 
  toggleHosting, 
  toggleDevDevice, 
  toggleCicd,
  updateProjectStage,
  updateProjectPriority,
  updateProjectProgress,
  updateProjectStatusText
} from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";

export interface ProjectDetailData {
  id: string;
  domain: string;
  client: string;
  techStack: string;
  hosting: string;
  isVps: boolean;
  currentStatus: string;
  stage: string;
  priority: string;
  progress: number;
  price: number | null;
  isPaid: boolean;
  docUrl: string | null;
  devDevice: string;
  hasGitBackup: boolean;
  hasCicd: boolean;
  notes: string | null;
  isArchived: boolean;
  timeLogs: { id: string; hours: number; description: string | null; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectDetailClientProps {
  project: ProjectDetailData;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(project.notes || "");
  const [notesSaved, setNotesSaved] = useState(false);
  
  // Quick manual log form state
  const [manualHours, setManualHours] = useState("");
  const [manualDesc, setManualDesc] = useState("");

  // Status text editing state
  const [statusText, setStatusText] = useState(project.currentStatus);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const totalLoggedHours = project.timeLogs.reduce((sum, log) => sum + log.hours, 0);
  const isLaptop = project.devDevice === "LAPTOP";
  const isVpsHosting = project.hosting === "VPS" || project.isVps;

  // Save Notes handler
  const handleSaveNotes = () => {
    startTransition(async () => {
      await updateProjectNotes(project.id, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    });
  };

  // Quick insert snippet into notes
  const handleInsertSnippet = (snippet: string) => {
    setNotes((prev) => (prev ? `${prev}\n${snippet}` : snippet));
  };

  // Toggle Hosting
  const handleToggleHosting = () => {
    startTransition(async () => {
      await toggleHosting(project.id, project.hosting || (project.isVps ? "VPS" : "TOTOHOST"));
    });
  };

  // Toggle Payment
  const handleTogglePayment = () => {
    startTransition(async () => {
      await togglePaymentStatus(project.id, !project.isPaid);
    });
  };

  // Toggle Dev Device
  const handleToggleDevice = () => {
    startTransition(async () => {
      await toggleDevDevice(project.id, project.devDevice);
    });
  };

  // Toggle CI/CD
  const handleToggleCicd = () => {
    startTransition(async () => {
      await toggleCicd(project.id, project.hasCicd);
    });
  };

  // Change Stage
  const handleStageChange = (newStage: string) => {
    startTransition(async () => {
      await updateProjectStage(project.id, newStage);
      if (newStage === "PRODUCTION") {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#527a29", "#7cae3b", "#b38600"],
          });
        } catch (e) {}
      }
    });
  };

  // Change Priority
  const handlePriorityChange = (newPriority: string) => {
    startTransition(async () => {
      await updateProjectPriority(project.id, newPriority);
    });
  };

  // Change Progress
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
        } catch (e) {}
      }
    });
  };

  // Quick Time Log
  const handleQuickTime = (hours: number, desc?: string) => {
    startTransition(async () => {
      await quickAddTimeLog(project.id, hours, desc);
    });
  };

  // Manual Time Log
  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoursNum = parseFloat(manualHours);
    if (isNaN(hoursNum) || hoursNum <= 0) return;

    startTransition(async () => {
      await quickAddTimeLog(project.id, hoursNum, manualDesc);
      setManualHours("");
      setManualDesc("");
    });
  };

  // Delete Time Log
  const handleDeleteTimeLog = (logId: string) => {
    if (confirm("Želite li obrisati ovaj unos radnog vremena?")) {
      startTransition(async () => {
        await deleteTimeLog(logId, project.id);
      });
    }
  };

  // Save Status Text
  const handleSaveStatusText = () => {
    if (statusText.trim()) {
      startTransition(async () => {
        await updateProjectStatusText(project.id, statusText);
        setIsEditingStatus(false);
      });
    }
  };

  const cleanDomain = project.domain.split(" / ")[0];
  const webUrl = cleanDomain.startsWith("http") ? cleanDomain : `https://${cleanDomain}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f5]">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-[#e2e8df] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#35521b] bg-[#f0f5ed] hover:bg-[#e2edd8] px-3 py-1.5 rounded-xl border border-[#cfdecb] transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#527a29]" />
            <span>← Natrag na Cockpit</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#6d8270]">
              OleaD Board • Projektna Konzola
            </span>
            <span className="font-mono text-xs font-bold text-[#a07400]">
              CODEX NON VERBA
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 1. HEADER S BRZIM STATUSOM I PREKIDAČIMA */}
        <div className="cockpit-card rounded-2xl p-6 bg-white border border-[#d2dfd0] shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Project Identity */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black font-mono tracking-tight text-[#162418] flex items-center gap-2">
                  <Globe className="w-6 h-6 text-[#527a29]" />
                  <span>{project.domain}</span>
                </h1>
                
                {/* Tech Stack Pill */}
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#eef5eb] text-[#344f1c] border border-[#d2e5ca] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#527a29]" />
                  {project.techStack}
                </span>

                {/* Direct Live Site Button */}
                <a
                  href={webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-[#527a29] hover:bg-[#edf5e8] border border-[#d6e5d2] flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Posjeti Web</span>
                </a>
              </div>

              <p className="text-sm font-bold text-[#526655] mt-1">
                Klijent / Organizacija: <span className="text-[#162418]">{project.client}</span>
              </p>
            </div>

            {/* Quick Status Toggles (Section 3: Header s brzim statusom) */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Prekidač [ VPS | TOTOHOST ] */}
              <button
                onClick={handleToggleHosting}
                disabled={isPending}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
                  isVpsHosting
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
                }`}
                title="Klikni za prebacivanje [ VPS | TOTOHOST ]"
              >
                <Server className="w-4 h-4 text-current" />
                <span>Hosting: {isVpsHosting ? "📦 VPS (Coolify)" : "🌐 TOTOHOST"}</span>
              </button>

              {/* Prekidač [ PLAĆENO / NIJE PLAĆENO ] + Iznos u € */}
              <button
                onClick={handleTogglePayment}
                disabled={isPending}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
                  project.isPaid
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                }`}
                title="Klikni za promjenu statusa plaćanja"
              >
                <Receipt className="w-4 h-4 text-current" />
                <span>
                  {project.isPaid ? "✅ PLAĆENO" : "⚠️ NIJE PLAĆENO"}
                  {project.price !== null && ` (${formatCurrency(project.price)})`}
                </span>
              </button>

              {/* Prekidač radnog mjesta [ 💻 Laptop | 🖥️ Radna stanica ] */}
              <button
                onClick={handleToggleDevice}
                disabled={isPending}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
                  isLaptop
                    ? "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
                    : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
                }`}
                title="Klikni za promjenu radnog uređaja [ Laptop / Radna stanica ]"
              >
                {isLaptop ? (
                  <>
                    <Laptop className="w-4 h-4 text-purple-700" />
                    <span>💻 Laptop (Sync!)</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-4 h-4 text-slate-700" />
                    <span>🖥️ Radna stanica</span>
                  </>
                )}
              </button>

              {/* CI/CD Webhook Toggle */}
              <button
                onClick={handleToggleCicd}
                disabled={isPending}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
                  project.hasCicd
                    ? "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
                title="Klikni za uključivanje/isključivanje CI/CD Webhooka"
              >
                <Rocket className={`w-4 h-4 ${project.hasCicd ? "text-sky-600" : "text-slate-400"}`} />
                <span>{project.hasCicd ? "🚀 CI/CD Aktivan" : "🚀 CI/CD Isključen"}</span>
              </button>

            </div>

          </div>

          {/* Quick Status Bar & Priority Selectors */}
          <div className="mt-6 pt-5 border-t border-[#edf2eb] grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Status / Stage Dropdown */}
            <div>
              <label className="text-xs font-mono font-bold text-[#5c7060] block mb-1.5">
                Faza Projekta:
              </label>
              <select
                value={project.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                disabled={isPending}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#162418] outline-none cursor-pointer hover:bg-white"
              >
                <option value="BACKLOG">📋 BACKLOG (Planiranje)</option>
                <option value="IN_PROGRESS">⚡ IN_PROGRESS (U Izradi)</option>
                <option value="WAITING_VPS">🚀 WAITING_VPS (Čeka VPS / Kontejner)</option>
                <option value="PRODUCTION">🟢 PRODUCTION (Produkcija Aktivna)</option>
                <option value="MAINTENANCE">🛠️ MAINTENANCE (Održavanje)</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label className="text-xs font-mono font-bold text-[#5c7060] block mb-1.5">
                Prioritet Rada:
              </label>
              <select
                value={project.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                disabled={isPending}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-extrabold outline-none cursor-pointer ${
                  project.priority === "URGENT"
                    ? "bg-rose-50 text-rose-800 border-rose-300"
                    : project.priority === "HIGH"
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "bg-[#f8faf7] text-[#162418] border-[#d6e2d4]"
                }`}
              >
                <option value="URGENT">🔴 HITNO (URGENT)</option>
                <option value="HIGH">🟡 VISOKO (HIGH)</option>
                <option value="NORMAL">🟢 NORMALNO (NORMAL)</option>
                <option value="LOW">⚪ NISKO (LOW)</option>
              </select>
            </div>

            {/* Progress % presets */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                <span className="text-[#5c7060]">Dovršenost:</span>
                <span className="text-[#162418]">{project.progress}%</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleProgressChange(val)}
                    disabled={isPending}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                      project.progress === val
                        ? "bg-[#527a29] text-white border-[#527a29] shadow-2xs"
                        : "bg-[#f8faf7] text-[#5c7060] hover:bg-white border-[#dde5db]"
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Current Status Box (Editable) */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#f7faf6] border border-[#e2eae0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#527a29] mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-[#6d8270] block uppercase tracking-wider font-semibold">
                  Trenutna radna akcija:
                </span>
                {isEditingStatus ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={statusText}
                      onChange={(e) => setStatusText(e.target.value)}
                      className="w-full bg-white border border-[#527a29] rounded-lg px-2.5 py-1 text-xs font-bold text-[#162418] outline-none"
                    />
                    <button
                      onClick={handleSaveStatusText}
                      className="px-3 py-1 rounded-lg bg-[#527a29] text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      Spremi
                    </button>
                    <button
                      onClick={() => setIsEditingStatus(false)}
                      className="px-2 py-1 text-xs text-[#6d8270] hover:text-[#162418] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#162418] mt-0.5">{project.currentStatus}</p>
                )}
              </div>
            </div>
            {!isEditingStatus && (
              <button
                onClick={() => setIsEditingStatus(true)}
                className="text-xs font-mono font-bold text-[#527a29] hover:underline self-end sm:self-auto cursor-pointer"
              >
                Uredi status
              </button>
            )}
          </div>

        </div>

        {/* 2-COLUMN GRID: 2. TECHNICAL NOTES & 3. TIME TRACKING + QUICK LINKS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: 2. PODRUČJE ZA OPASKE (TECHNICAL NOTES) (7 Cols) */}
          <div className="lg:col-span-7 cockpit-card rounded-2xl p-6 bg-white border border-[#d2dfd0] shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf2eb]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#eef5eb] border border-[#d2e5ca] flex items-center justify-center text-[#527a29]">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#162418]">Tehničke Opaske & Bilješke</h2>
                  <p className="text-[11px] text-[#6d8270]">
                    Portovi, Coolify UUID, deploy upute, baze podataka, bilješke sa sastanka
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveNotes}
                disabled={isPending}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                  notesSaved
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-[#527a29] hover:bg-[#5e8c2f] text-white shadow-[#527a29]/30"
                }`}
              >
                {notesSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Spremljeno!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isPending ? "Spremanje..." : "Spremi Opaske"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Snippet Insert Buttons */}
            <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none text-[10px] font-mono">
              <span className="text-[#6d8270] font-bold mr-1">Umetni:</span>
              <button
                onClick={() => handleInsertSnippet("- **Coolify App UUID:** `clfy-`")}
                className="px-2 py-1 rounded-md bg-[#f5f8f4] hover:bg-[#eaf1e8] text-[#3b591d] border border-[#d6e5d3] cursor-pointer"
              >
                + Coolify UUID
              </button>
              <button
                onClick={() => handleInsertSnippet("- **Interni Port:** `300`")}
                className="px-2 py-1 rounded-md bg-[#f5f8f4] hover:bg-[#eaf1e8] text-[#3b591d] border border-[#d6e5d3] cursor-pointer"
              >
                + Port
              </button>
              <button
                onClick={() => handleInsertSnippet("- **Baza Podataka:** PostgreSQL 16 (baza: `...`)")}
                className="px-2 py-1 rounded-md bg-[#f5f8f4] hover:bg-[#eaf1e8] text-[#3b591d] border border-[#d6e5d3] cursor-pointer"
              >
                + PostgreSQL / SQLite
              </button>
              <button
                onClick={() => handleInsertSnippet("- **Deploy Koraci:** `git push origin main` -> webhook")}
                className="px-2 py-1 rounded-md bg-[#f5f8f4] hover:bg-[#eaf1e8] text-[#3b591d] border border-[#d6e5d3] cursor-pointer"
              >
                + Deploy Koraci
              </button>
            </div>

            {/* Notes Textarea */}
            <div className="flex-1 mt-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Unesite sve tehničke detalje, portove kontejnera, Coolify UUID, posebne konfiguracijske varijable, SSL podatke..."
                rows={14}
                className="w-full h-full min-h-[300px] bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl p-3.5 text-xs text-[#162418] font-mono font-medium outline-none transition-all leading-relaxed resize-y"
              />
            </div>
            <div className="text-[11px] text-[#7a8e7d] mt-2 flex justify-between">
              <span>Markdown podržan (naslovi, liste, code blokovi)</span>
              <span>{notes.length} znakova</span>
            </div>
          </div>

          {/* RIGHT: 3. LOGIRANI SATI & BRZI LINKOVI (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Quick Links Card */}
            <div className="cockpit-card rounded-2xl p-5 bg-white border border-[#d2dfd0] shadow-sm">
              <h3 className="text-sm font-bold text-[#162418] flex items-center gap-2 mb-3">
                <ExternalLinkIcon className="w-4 h-4 text-[#527a29]" />
                <span>Brzi Linkovi Projekta</span>
              </h3>

              <div className="space-y-2 text-xs font-mono">
                {/* Live / Test Site */}
                <a
                  href={webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf7] hover:bg-[#eef5eb] border border-[#d6e2d4] text-[#162418] transition-colors"
                >
                  <span className="flex items-center gap-2 font-bold truncate">
                    <Globe className="w-4 h-4 text-[#527a29]" />
                    <span>Live / Test Stranica</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#7a8e7d]" />
                </a>

                {/* Google Doc Spec */}
                {project.docUrl ? (
                  <a
                    href={project.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-amber-950 transition-colors"
                  >
                    <span className="flex items-center gap-2 font-bold truncate">
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span>Google Doc / Drive Spec</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  </a>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8faf7] border border-[#e4ebe2] text-[#7a8e7d]">
                    <span className="flex items-center gap-2 font-medium">
                      <FileText className="w-4 h-4" />
                      <span>Nema Google Doc poveznice</span>
                    </span>
                  </div>
                )}

                {/* Coolify VPS Console */}
                {isVpsHosting && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/60 border border-sky-200 text-sky-950">
                    <span className="flex items-center gap-2 font-bold">
                      <Server className="w-4 h-4 text-sky-600" />
                      <span>Coolify VPS MyDataKnox</span>
                    </span>
                    <span className="text-[10px] bg-sky-200/70 text-sky-900 px-2 py-0.5 rounded-md font-extrabold">
                      Port {project.techStack.includes("300") ? "300x" : "Active"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Time Tracking Card */}
            <div className="cockpit-card rounded-2xl p-5 bg-white border border-[#d2dfd0] shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#edf2eb]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#eef5eb] border border-[#d2e5ca] flex items-center justify-center text-[#527a29]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#162418]">Evidencija Radnih Sati</h3>
                    <p className="text-[10px] text-[#6d8270]">Utrošeno ukupno: <span className="font-bold text-[#2d4d14]">{totalLoggedHours.toFixed(1)}h</span></p>
                  </div>
                </div>
              </div>

              {/* Quick Add Sati (+15m, +30m, +1h) */}
              <div className="mt-3">
                <span className="text-[10px] font-mono font-bold text-[#5c7060] uppercase block mb-1.5">Brzi unos:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickTime(0.25)}
                    disabled={isPending}
                    className="py-1.5 rounded-xl bg-[#eef5eb] hover:bg-[#dfedd7] border border-[#c4dcbc] text-xs font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    +15 min
                  </button>
                  <button
                    onClick={() => handleQuickTime(0.5)}
                    disabled={isPending}
                    className="py-1.5 rounded-xl bg-[#eef5eb] hover:bg-[#dfedd7] border border-[#c4dcbc] text-xs font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    +30 min
                  </button>
                  <button
                    onClick={() => handleQuickTime(1.0)}
                    disabled={isPending}
                    className="py-1.5 rounded-xl bg-[#eef5eb] hover:bg-[#dfedd7] border border-[#c4dcbc] text-xs font-mono font-bold text-[#35521b] transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    +1 sat
                  </button>
                </div>
              </div>

              {/* Manual Add Sati Form */}
              <form onSubmit={handleManualTimeSubmit} className="mt-3 pt-3 border-t border-[#edf2eb] space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#5c7060] uppercase block">Detaljni unos:</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.1"
                    placeholder="Sati (1.5)"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    className="w-24 bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-[#162418] outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Opis zadatka..."
                    value={manualDesc}
                    onChange={(e) => setManualDesc(e.target.value)}
                    className="flex-1 bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-2.5 py-1.5 text-xs text-[#162418] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-xl bg-[#527a29] hover:bg-[#5e8c2f] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>
              </form>

              {/* Time Logs List */}
              <div className="mt-4 pt-3 border-t border-[#edf2eb] flex-1">
                <span className="text-[10px] font-mono font-bold text-[#5c7060] uppercase block mb-2">
                  Povijest rada ({project.timeLogs.length}):
                </span>
                
                {project.timeLogs.length === 0 ? (
                  <p className="text-xs text-[#7a8e7d] py-4 text-center">Nema unesenih sati za ovaj projekt.</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {project.timeLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-[#f8faf7] border border-[#e4ece2] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-[#2a4a13] bg-[#eef5eb] px-1.5 py-0.5 rounded border border-[#d6e5d2]">
                              +{log.hours}h
                            </span>
                            <span className="font-medium text-[#162418] truncate">
                              {log.description || "Rad na projektu"}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#7a8e7d] font-mono mt-0.5 block">
                            {new Date(log.createdAt).toLocaleDateString("hr-HR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTimeLog(log.id)}
                          className="p-1 rounded-md text-[#7a8e7d] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Obriši unos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2eae0] bg-white py-4 mt-auto shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-[#5c7060]">
          <div>
            <span className="font-extrabold text-[#162418]">OleaD Board (ODB)</span> • <span>Ivo Cetinić</span>
          </div>
          <div className="font-mono text-[11px] text-[#7a8e7d]">
            Projekt: {project.domain} • ID: {project.id}
          </div>
        </div>
      </footer>

    </div>
  );
}
