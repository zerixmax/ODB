"use client";

import { useTransition } from "react";
import { X, Plus, Edit3 } from "lucide-react";
import { createProject, updateProject } from "@/lib/actions";
import { ProjectData } from "@/lib/types";

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit: ProjectData | null;
  onClose: () => void;
}

export function ProjectModal({ isOpen, projectToEdit, onClose }: ProjectModalProps) {
  const [isPending, startTransition] = useTransition();

  const isEditing = !!projectToEdit;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#d2dfd0] rounded-2xl p-6 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-10 bg-[#527a29]/10 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2eb]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eef5eb] border border-[#d2e5ca] flex items-center justify-center text-[#527a29]">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            </div>
            <div>
              <h3 className="font-extrabold text-[#162418] text-base tracking-tight">
                {isEditing ? `Uredi projekt: ${projectToEdit.domain}` : "Novi OleaD Projekt (V2.5)"}
              </h3>
              <p className="text-xs text-[#6d8270]">
                {isEditing ? "Ažurirajte tehničke specifikacije, hosting, status naplate i bilješke" : "Dodavanje novog projekta s hostingom i opaskama"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7a8e7d] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          action={(formData) => {
            startTransition(async () => {
              if (isEditing && projectToEdit) {
                await updateProject(projectToEdit.id, formData);
              } else {
                await createProject(formData);
              }
              onClose();
            });
          }}
          className="overflow-y-auto flex-1 pr-1 pb-2 space-y-3.5 mt-4 text-[#162418]"
        >
          {/* Domain & Client */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Domena / Naziv *</label>
              <input
                name="domain"
                type="text"
                required
                defaultValue={projectToEdit?.domain || ""}
                placeholder="npr. marcopolosport.com ili oly-bot"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Klijent / Kategorija *</label>
              <input
                name="client"
                type="text"
                required
                defaultValue={projectToEdit?.client || ""}
                placeholder="npr. Marko Polo Sport / OleaD R&D"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-semibold outline-none"
              />
            </div>
          </div>

          {/* Tech Stack & Hosting Choice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Tehnološki Stog *</label>
              <input
                name="techStack"
                type="text"
                required
                defaultValue={projectToEdit?.techStack || "Astro, Payload CMS"}
                placeholder="npr. Astro, Payload CMS, Python, ROS"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Hosting Okruženje *</label>
              <select
                name="hosting"
                defaultValue={projectToEdit?.hosting || (projectToEdit?.isVps ? "VPS" : "TOTOHOST")}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono cursor-pointer"
              >
                <option value="VPS">📦 VPS (MyDataKnox / Docker / Coolify)</option>
                <option value="TOTOHOST">🌐 TOTOHOST (cPanel / Shared / PHP)</option>
              </select>
            </div>
          </div>

          {/* Device Environment & CI/CD & Git */}
          <div className="p-3 bg-[#f5f8f4] border border-[#d8e4d6] rounded-xl space-y-2">
            <div className="text-[11px] font-mono font-bold text-[#35521b] flex items-center gap-1">
              <span>Operativni V2 Tagovi:</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#5c7060] mb-1">Radno Okruženje:</label>
                <select
                  name="devDevice"
                  defaultValue={projectToEdit?.devDevice || "WORKSTATION"}
                  className="w-full bg-white border border-[#d6e2d4] rounded-lg px-2 py-1 text-xs text-[#162418] font-bold outline-none cursor-pointer"
                >
                  <option value="WORKSTATION">🖥️ Radna stanica</option>
                  <option value="LAPTOP">💻 Laptop (Sync!)</option>
                </select>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-1.5 text-xs text-[#162418] font-bold cursor-pointer">
                  <input
                    name="hasCicd"
                    type="checkbox"
                    defaultChecked={projectToEdit ? projectToEdit.hasCicd : false}
                    className="rounded border-[#d6e2d4] text-[#0284c7] focus:ring-0"
                  />
                  <span>🚀 Coolify Webhook</span>
                </label>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-1.5 text-xs text-[#162418] font-bold cursor-pointer">
                  <input
                    name="hasGitBackup"
                    type="checkbox"
                    defaultChecked={projectToEdit ? projectToEdit.hasGitBackup : true}
                    className="rounded border-[#d6e2d4] text-[#527a29] focus:ring-0"
                  />
                  <span>🐙 Git Backup</span>
                </label>
              </div>
            </div>
          </div>

          {/* Current Status & Action */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Trenutni Status & Akcija *</label>
            <input
              name="currentStatus"
              type="text"
              required
              defaultValue={projectToEdit?.currentStatus || "U izradi; test aktivan na VPS-u"}
              placeholder="npr. Joomla -> Astro/Payload migracija. Funkcionalni test na VPS aktivan."
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-medium outline-none"
            />
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Status / Faza (Stage)</label>
              <select
                name="stage"
                defaultValue={projectToEdit?.stage || "IN_PROGRESS"}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono cursor-pointer"
              >
                <option value="BACKLOG">📋 BACKLOG</option>
                <option value="IN_PROGRESS">⚡ IN_PROGRESS</option>
                <option value="WAITING_VPS">🚀 WAITING_VPS</option>
                <option value="PRODUCTION">🟢 PRODUCTION</option>
                <option value="MAINTENANCE">🛠️ MAINTENANCE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Prioritet</label>
              <select
                name="priority"
                defaultValue={projectToEdit?.priority || "NORMAL"}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono cursor-pointer"
              >
                <option value="URGENT">🔴 HITNO (URGENT)</option>
                <option value="HIGH">🟡 VISOKO (HIGH)</option>
                <option value="NORMAL">🟢 NORMALNO (NORMAL)</option>
                <option value="LOW">⚪ NISKO (LOW)</option>
              </select>
            </div>
          </div>

          {/* Progress, DevPrice & isDevPaid */}
          <div className="grid grid-cols-3 gap-3 items-center">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Dovršenost (%)</label>
              <input
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue={projectToEdit?.progress ?? 50}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Cijena izrade (€)</label>
              <input
                name="devPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={projectToEdit?.devPrice ?? ""}
                placeholder="npr. 650.00"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono font-bold"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs text-[#162418] font-bold cursor-pointer bg-[#f8faf7] border border-[#d6e2d4] p-2 rounded-xl hover:bg-white">
                <input
                  name="isDevPaid"
                  type="checkbox"
                  defaultChecked={projectToEdit ? projectToEdit.isDevPaid : false}
                  className="rounded border-[#d6e2d4] text-emerald-600 focus:ring-0"
                />
                <span className="font-mono text-xs">Izrada Plaćena (DA/NE)</span>
              </label>
            </div>
          </div>

          {/* Hosting Price & Payment */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Godišnji hosting (€/god)</label>
              <input
                name="hostingPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={projectToEdit?.hostingPrice ?? ""}
                placeholder="npr. 120.00"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono font-bold"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs text-[#162418] font-bold cursor-pointer bg-[#f8faf7] border border-[#d6e2d4] p-2 rounded-xl hover:bg-white">
                <input
                  name="isHostingPaid"
                  type="checkbox"
                  defaultChecked={projectToEdit ? projectToEdit.isHostingPaid : false}
                  className="rounded border-[#d6e2d4] text-emerald-600 focus:ring-0"
                />
                <span className="font-mono text-xs">Hosting Plaćen (DA/NE)</span>
              </label>
            </div>
          </div>

          {/* Lifecycle Dates: Setup + Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Setup datum (na serveru)</label>
              <input
                name="setupDate"
                type="datetime-local"
                defaultValue={projectToEdit?.setupDate?.toISOString().slice(0, 16) || ""}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Rok isporuke (deadline)</label>
              <input
                name="deadlineDate"
                type="datetime-local"
                defaultValue={projectToEdit?.deadlineDate?.toISOString().slice(0, 16) || ""}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono"
              />
            </div>
          </div>

          {/* Alt domains */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Alternativne domene (npr. &quot;mokalo.hr / wifi-korcula.com&quot;)</label>
            <input
              name="altDomains"
              type="text"
              defaultValue={projectToEdit?.altDomains || ""}
              placeholder="npr. mokalo.hr / wifi-korcula.com"
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none"
            />
          </div>

          {/* Google Doc / Drive link */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Poveznica na specifikaciju (Google Doc / Drive)</label>
            <input
              name="docUrl"
              type="url"
              defaultValue={projectToEdit?.docUrl || ""}
              placeholder="https://docs.google.com/..."
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none"
            />
          </div>

          {/* Technical Notes Area */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">
              Tehničke opaske & bilješke (portovi, Coolify UUID, deploy upute)
            </label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={projectToEdit?.notes || ""}
              placeholder="npr. Coolify App UUID: clfy-mps-prod-9942, Port: 3008, PostgreSQL 16..."
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#edf2eb] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6d8270] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[#527a29] hover:bg-[#5e8c2f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {isPending ? "Spremanje..." : isEditing ? "Ažuriraj Projekt" : "Dodaj Projekt"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
