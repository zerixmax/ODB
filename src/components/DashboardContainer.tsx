"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "./Header";
import { FocusTimer } from "./FocusTimer";
import { ProjectTile } from "./ProjectTile";
import { ProjectModal } from "./ProjectModal";
import { PipelinePanel } from "./PipelinePanel";
import { 
  Search, 
  Layers, 
  ListFilter,
  Archive
} from "lucide-react";
import { ProjectData, PotentialLeadData } from "@/lib/types";

interface DashboardContainerProps {
  projects: ProjectData[];
  leads: PotentialLeadData[];
}

type SortBy = "PRIORITY" | "PROGRESS" | "PRICE" | "RECENT";

export function DashboardContainer({ projects, leads }: DashboardContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("PRIORITY");
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectData | null>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setProjectToEdit(null);
        setIsProjectModalOpen(true);
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setIsTimerOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter & KPI metrics
  const activeProjects = projects.filter((p) => !p.isArchived);
  const urgentProjects = activeProjects.filter((p) => p.priority === "URGENT");
  const laptopProjects = activeProjects.filter((p) => p.devDevice === "LAPTOP");
  const coolifyProjects = activeProjects.filter((p) => p.hasCicd);
  const vpsProjects = activeProjects.filter((p) => p.hosting === "VPS" || p.isVps);
  const totohostProjects = activeProjects.filter((p) => (p.hosting === "TOTOHOST") || (!p.isVps && p.hosting !== "VPS"));
  const unpaidProjects = activeProjects.filter((p) => !p.isDevPaid || !p.isHostingPaid);
  const inProgressProjects = activeProjects.filter((p) => p.stage === "IN_PROGRESS" || p.stage === "WAITING_VPS" || p.stage === "BACKLOG");
  const productionProjects = activeProjects.filter((p) => p.stage === "PRODUCTION");
  const maintenanceProjects = activeProjects.filter((p) => p.stage === "MAINTENANCE");
  const archivedProjects = projects.filter((p) => p.isArchived);

  const deliveryProjects = activeProjects.filter((p) => p.progress >= 75 && p.devPrice !== null);
  const deliveryBillingPotential = deliveryProjects.reduce((sum, p) => sum + (p.devPrice || 0), 0);

  const totalWeeklyHours = (() => {
    const now = new Date();
    const diffToMonday = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - diffToMonday);

    return projects.reduce((total, p) => {
      return total + p.timeLogs.reduce((sum, log) => sum + (log.createdAt >= monday ? log.hours : 0), 0);
    }, 0);
  })();

  // Filter & Search Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Archive filter
        if (selectedFilter === "ARCHIVE") {
          return p.isArchived;
        }
        if (p.isArchived) return false;

        // Clean Morning Cockpit Filters
        if (selectedFilter === "URGENT") return p.priority === "URGENT";
        if (selectedFilter === "LAPTOP") return p.devDevice === "LAPTOP";
        if (selectedFilter === "COOLIFY") return p.hasCicd;
        if (selectedFilter === "VPS") return p.hosting === "VPS" || p.isVps;
        if (selectedFilter === "TOTOHOST") return p.hosting === "TOTOHOST" || (!p.isVps && p.hosting !== "VPS");
        if (selectedFilter === "UNPAID") return !p.isDevPaid || !p.isHostingPaid;
        if (selectedFilter === "STAGE_IN_PROGRESS") return p.stage === "IN_PROGRESS" || p.stage === "WAITING_VPS" || p.stage === "BACKLOG";
        if (selectedFilter === "STAGE_PRODUCTION") return p.stage === "PRODUCTION";
        if (selectedFilter === "STAGE_MAINTENANCE") return p.stage === "MAINTENANCE";
        return true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.domain.toLowerCase().includes(q) ||
          (p.altDomains && p.altDomains.toLowerCase().includes(q)) ||
          p.client.toLowerCase().includes(q) ||
          p.techStack.toLowerCase().includes(q) ||
          p.currentStatus.toLowerCase().includes(q) ||
          (p.notes && p.notes.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "PRIORITY") {
          const priorityRank: Record<string, number> = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
          return (priorityRank[a.priority] ?? 2) - (priorityRank[b.priority] ?? 2);
        }
        if (sortBy === "PROGRESS") {
          return b.progress - a.progress;
        }
        if (sortBy === "PRICE") {
          return (b.devPrice || 0) - (a.devPrice || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, selectedFilter, searchQuery, sortBy]);

  const handleOpenNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: ProjectData) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f5]">
      
      {/* Top Header with KPI Bar */}
      <Header
        onOpenNewProject={handleOpenNewProject}
        onOpenTimer={() => setIsTimerOpen(true)}
        urgentProjectsCount={urgentProjects.length}
        totalWeeklyHours={totalWeeklyHours}
        deliveryBillingPotential={deliveryBillingPotential}
        vpsProjectsCount={vpsProjects.length}
        totalProjectsCount={activeProjects.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filter & Search Bar - Zero Noise */}
        <div className="cockpit-card rounded-2xl p-4 mb-6 border border-[#e0e8de] bg-white shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7a8e7d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži projekte (npr. marcopolosport, oly, ponta, astro)..."
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white focus:ring-2 focus:ring-[#527a29]/15 rounded-xl pl-9 pr-8 py-2 text-xs text-[#162418] placeholder-[#7c9080] outline-none transition-all font-mono font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7a8e7d] hover:text-[#162418] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#5c7060] font-semibold">
                <ListFilter className="w-3.5 h-3.5 text-[#527a29]" />
                <span>Sortiraj:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="bg-[#f8faf7] border border-[#d6e2d4] rounded-lg px-2.5 py-1 text-xs text-[#162418] font-bold outline-none cursor-pointer hover:bg-white"
                >
                  <option value="PRIORITY">🔴 Po prioritetu (Hitno prvo)</option>
                  <option value="PROGRESS">📊 Po dovršenosti (Najviši %)</option>
                  <option value="PRICE">💶 Po cijeni (€)</option>
                  <option value="RECENT">🕒 Najnoviji</option>
                </select>
              </div>
            </div>

          </div>

          {/* Clean Filter Pills Bar (Morning Cockpit Decision Filters) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3.5 mt-3 border-t border-[#edf2eb] pb-1 scrollbar-none">

            {/* 1. Svi (17) */}
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "ALL"
                  ? "bg-[#527a29] text-white shadow-sm shadow-[#527a29]/30"
                  : "bg-[#f5f8f4] text-[#4a5f4e] hover:bg-[#eaf1e8] hover:text-[#162418] border border-[#d8e4d6]"
              }`}
            >
              Svi ({activeProjects.length})
            </button>

            {/* 2. 🔥 Hitno Danas */}
            <button
              onClick={() => setSelectedFilter("URGENT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "URGENT"
                  ? "bg-rose-700 text-white shadow-sm shadow-rose-900/30"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              🔥 Hitno Danas ({urgentProjects.length})
            </button>

            {/* 3. 💻 Laptop */}
            <button
              onClick={() => setSelectedFilter("LAPTOP")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "LAPTOP"
                  ? "bg-purple-700 text-white shadow-sm shadow-purple-900/30"
                  : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              💻 Laptop ({laptopProjects.length})
            </button>

            {/* 4. 🚀 Coolify CI/CD (single rocket only) */}
            <button
              onClick={() => setSelectedFilter("COOLIFY")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "COOLIFY"
                  ? "bg-sky-700 text-white shadow-sm shadow-sky-900/30"
                  : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200"
              }`}
            >
              🚀 Coolify CI/CD ({coolifyProjects.length})
            </button>

            {/* 5. 📦 VPS */}
            <button
              onClick={() => setSelectedFilter("VPS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "VPS"
                  ? "bg-emerald-700 text-white shadow-sm shadow-emerald-900/30"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              📦 VPS ({vpsProjects.length})
            </button>

            {/* 6. 🌐 Totohost */}
            <button
              onClick={() => setSelectedFilter("TOTOHOST")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "TOTOHOST"
                  ? "bg-blue-700 text-white shadow-sm shadow-blue-900/30"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              🌐 Totohost ({totohostProjects.length})
            </button>

            {/* 7. 💶 Neplaćeno */}
            <button
              onClick={() => setSelectedFilter("UNPAID")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "UNPAID"
                  ? "bg-amber-700 text-white shadow-sm shadow-amber-900/30"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              💶 Neplaćeno ({unpaidProjects.length})
            </button>

            {/* 8. ⚡ U Izradi | ✅ Produkcija | 🛠️ Održavanje */}
            <button
              onClick={() => setSelectedFilter("STAGE_IN_PROGRESS")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "STAGE_IN_PROGRESS"
                  ? "bg-[#527a29] text-white shadow-sm shadow-[#527a29]/30"
                  : "bg-[#f0f5ed] text-[#3b591d] hover:bg-[#e0edd7] border border-[#c4dcbc]"
              }`}
            >
              ⚡ U Izradi ({inProgressProjects.length})
            </button>

            <button
              onClick={() => setSelectedFilter("STAGE_PRODUCTION")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "STAGE_PRODUCTION"
                  ? "bg-emerald-700 text-white shadow-sm shadow-emerald-900/30"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              ✅ Produkcija ({productionProjects.length})
            </button>

            <button
              onClick={() => setSelectedFilter("STAGE_MAINTENANCE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === "STAGE_MAINTENANCE"
                  ? "bg-amber-700 text-white shadow-sm shadow-amber-900/30"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              🛠️ Održavanje ({maintenanceProjects.length})
            </button>

            {/* 9. 📦 Arhiva */}
            <button
              onClick={() => setSelectedFilter("ARCHIVE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ml-auto ${
                selectedFilter === "ARCHIVE"
                  ? "bg-slate-700 text-white"
                  : "bg-[#f5f8f4] text-[#6d8270] hover:bg-[#eaf1e8] hover:text-[#162418] border border-[#d8e4d6]"
              }`}
            >
              <Archive className="w-3 h-3 inline mr-1" />
              Arhiva ({archivedProjects.length})
            </button>

          </div>
        </div>

        {/* Project Tiles Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-[#d2dfd0] rounded-2xl bg-white shadow-xs">
            <Layers className="w-10 h-10 text-[#527a29]/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#162418]">Nema pronađenih projekata</h3>
            <p className="text-xs text-[#6d8270] mt-1">
              Pokušajte prilagoditi pretragu ili odaberite drugi filter.
            </p>
            <button
              onClick={handleOpenNewProject}
              className="mt-4 px-4 py-2 rounded-xl bg-[#527a29] hover:bg-[#5e8c2f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              + Dodaj Novi Projekt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectTile
                key={project.id}
                project={project}
                onEdit={handleEditProject}
              />
            ))}
          </div>
        )}

        {/* Najave mogućih poslova (Pipeline) — na dno sekcija (projekti: Hitno prvi od gore) */}
        <PipelinePanel leads={leads} />

      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2eae0] bg-white py-5 mt-auto shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5c7060]">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-extrabold text-[#162418]">OleaD Board (ODB)</span>
            <span>•</span>
            <span className="font-mono font-bold text-[#a07400]">CODEX NON VERBA</span>
            <span>•</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#eef5eb] text-[#4d7328] border border-[#d2e5ca]">
              v2.5 Cockpit
            </span>
            <span>•</span>
            <a
              href="https://olead.hr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-[#4d7328] hover:text-[#35521b] hover:underline transition-colors"
            >
              code by olead.hr
            </a>
          </div>
          <div className="font-mono text-[11px] text-[#7a8e7d]">
            {activeProjects.length} Aktivnih Servisa • SQLite dev.db • Next.js 16 App Router • MyDataKnox VPS
          </div>
        </div>
      </footer>

      {/* Deep Work Focus Timer Modal */}
      <FocusTimer
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => {
          setIsProjectModalOpen(false);
          setProjectToEdit(null);
        }}
      />

    </div>
  );
}
