"use client";

import { useState, useTransition } from "react";
import { Plus, X, Pencil, Trash2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { createLead, updateLead, deleteLead, convertLeadToProject } from "@/lib/actions";
import { PotentialLeadData } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PipelinePanelProps {
  leads: PotentialLeadData[];
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  INQUIRY: { label: "📥 Upit", color: "bg-slate-100 text-slate-700 border-slate-300" },
  PROPOSAL_SENT: { label: "📤 Ponuda poslana", color: "bg-sky-50 text-sky-800 border-sky-300" },
  NEGOTIATION: { label: "🤝 Pregovori", color: "bg-amber-50 text-amber-900 border-amber-300" },
  WON: { label: "🏆 Dobiven", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  LOST: { label: "❌ Izgubljen", color: "bg-rose-50 text-rose-800 border-rose-300" },
};

const probabilityColor = (p: number) =>
  p >= 75 ? "text-[#2d4d14]" : p >= 40 ? "text-[#845b00]" : "text-[#7a8e7d]";

export function PipelinePanel({ leads }: PipelinePanelProps) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<PotentialLeadData | null>(null);

  const openCreate = () => {
    setLeadToEdit(null);
    setModalOpen(true);
  };

  const openEdit = (lead: PotentialLeadData) => {
    setLeadToEdit(lead);
    setModalOpen(true);
  };

  const handleDelete = (lead: PotentialLeadData) => {
    if (confirm(`Želite li obrisati najavu "${lead.title}"?`)) {
      startTransition(async () => {
        await deleteLead(lead.id);
      });
    }
  };

  const handleConvert = (lead: PotentialLeadData) => {
    if (confirm(`Pretvoriti najavu "${lead.title}" u projekt?`)) {
      startTransition(async () => {
        await convertLeadToProject(lead.id);
      });
    }
  };

  return (
    <div className="cockpit-card rounded-2xl p-4 mb-6 border border-[#e0e8de] bg-white shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-[#162418] flex items-center gap-2">
            <span>🥧</span> Najave mogućih poslova (Pipeline)
          </h3>
          <p className="text-[11px] text-[#6d8270] font-mono mt-0.5">
            {leads.length} aktivnih najava • procijenjena vrijednost:{" "}
            <span className="font-bold text-[#2d4d14]">
              {formatCurrency(leads.reduce((s, l) => s + (l.estimatedValue || 0), 0))}
            </span>
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#527a29] to-[#3f5f1f] hover:from-[#5e8c2f] hover:to-[#4a7024] text-white text-xs font-bold shadow-sm shadow-[#527a29]/30 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          + Nova Najava
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-6 text-xs text-[#7a8e7d] border border-dashed border-[#d2dfd0] rounded-xl mt-3">
          Nema najava. Dodajte prvu mogućnost preko gumba &quot;+ Nova Najava&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-[#6d8270] border-b border-[#edf2eb]">
                <th className="py-2 pr-3 font-bold">Naziv ideje / projekta</th>
                <th className="py-2 pr-3 font-bold">Klijent</th>
                <th className="py-2 pr-3 font-bold">Vrijednost (€)</th>
                <th className="py-2 pr-3 font-bold">Vjerojatnost</th>
                <th className="py-2 pr-3 font-bold">Status ponude</th>
                <th className="py-2 pr-3 font-bold">Početak</th>
                <th className="py-2 text-right font-bold">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const meta = STATUS_META[lead.status] || STATUS_META.INQUIRY;
                return (
                  <tr key={lead.id} className="border-b border-[#f0f5ee] last:border-0 hover:bg-[#f8faf7] transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-[#162418]">{lead.title}</td>
                    <td className="py-2.5 pr-3 text-[#4a5f4e]">{lead.clientName}</td>
                    <td className="py-2.5 pr-3 font-extrabold text-[#a07400]">
                      {lead.estimatedValue !== null && lead.estimatedValue > 0 ? formatCurrency(lead.estimatedValue) : "--"}
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-[#edf2eb] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#527a29]"
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>
                        <span className={`font-extrabold ${probabilityColor(lead.probability)}`}>{lead.probability}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#6d8270]">{lead.targetDate ? formatDate(lead.targetDate) : "--"}</td>
                    <td className="py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleConvert(lead)}
                          disabled={isPending || lead.status === "LOST"}
                          title="Pretvori u Projekt"
                          className="p-1.5 rounded-lg text-[#527a29] hover:text-[#38551a] hover:bg-[#eef5eb] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(lead)}
                          title="Uredi najavu"
                          className="p-1.5 rounded-lg text-[#5c7060] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          title="Obriši najavu"
                          className="p-1.5 rounded-lg text-[#5c7060] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <LeadModal
          leadToEdit={leadToEdit}
          isPending={isPending}
          onClose={() => setModalOpen(false)}
          onSubmit={(formData) => {
            startTransition(async () => {
              if (leadToEdit) {
                await updateLead(leadToEdit.id, formData);
              } else {
                await createLead(formData);
              }
              setModalOpen(false);
            });
          }}
        />
      )}
    </div>
  );
}

interface LeadModalProps {
  leadToEdit: PotentialLeadData | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

function LeadModal({ leadToEdit, isPending, onClose, onSubmit }: LeadModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-[#d2dfd0] rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#edf2eb]">
          <div>
            <h3 className="font-extrabold text-[#162418] text-base tracking-tight">
              {leadToEdit ? `Uredi najavu: ${leadToEdit.title}` : "Nova Najava (Potential Lead)"}
            </h3>
            <p className="text-xs text-[#6d8270]">
              {leadToEdit ? "Ažurirajte podatke najave" : "Dodavanje nove poslovne prilike u pipeline"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7a8e7d] hover:text-[#162418] hover:bg-[#f0f5ee] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          action={onSubmit}
          className="mt-4 space-y-3 text-[#162418]"
        >
          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Radni naziv projekta *</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={leadToEdit?.title || ""}
              placeholder="npr. Web shop uljara"
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Klijent / Kontakt *</label>
              <input
                name="clientName"
                type="text"
                required
                defaultValue={leadToEdit?.clientName || ""}
                placeholder="npr. OPG Ivanda"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Procijenjena vrijednost (€)</label>
              <input
                name="estimatedValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={leadToEdit?.estimatedValue ?? ""}
                placeholder="npr. 1200"
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Vjerojatnost (%)</label>
              <input
                name="probability"
                type="number"
                min="0"
                max="100"
                defaultValue={leadToEdit?.probability ?? 50}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono font-bold"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Status ponude</label>
              <select
                name="status"
                defaultValue={leadToEdit?.status || "INQUIRY"}
                className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none cursor-pointer"
              >
                <option value="INQUIRY">📥 Upit (INQUIRY)</option>
                <option value="PROPOSAL_SENT">📤 Ponuda poslana (PROPOSAL_SENT)</option>
                <option value="NEGOTIATION">🤝 Pregovori (NEGOTIATION)</option>
                <option value="WON">🏆 Dobiven (WON)</option>
                <option value="LOST">❌ Izgubljen (LOST)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Očekivani početak radova</label>
            <input
              name="targetDate"
              type="date"
              defaultValue={leadToEdit?.targetDate?.toISOString().slice(0, 10) || ""}
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">Bilješke s inicijalnog razgovora</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={leadToEdit?.notes || ""}
              placeholder="npr. Žele webshop s lokalnom dostavom; dogovorena prva verzija u 4 tjedna..."
              className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] outline-none"
            />
          </div>

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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#527a29] hover:bg-[#5e8c2f] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isPending ? "Spremanje..." : leadToEdit ? "Ažuriraj Najavu" : "Dodaj Najavu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}