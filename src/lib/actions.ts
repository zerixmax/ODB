"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

// Quick Time Logging (+15m, +30m, +1h or manual)
export async function quickAddTimeLog(projectId: string, hours: number, description?: string) {
  if (!projectId || hours <= 0) {
    throw new Error("Neispravan projekt ili broj sati");
  }

  const defaultDesc = 
    hours === 0.25 ? "Brzi rad (+15 min)" :
    hours === 0.5 ? "Rad na zadatku (+30 min)" :
    hours === 1.0 ? "Razvoj i konfiguracija (+1 sat)" : "Zabilježeno radno vrijeme";

  await prisma.timeLog.create({
    data: {
      projectId,
      hours,
      description: description?.trim() || defaultDesc,
    },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function deleteTimeLog(id: string, projectId?: string) {
  await prisma.timeLog.delete({
    where: { id },
  });
  revalidatePath("/");
  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }
  return { success: true };
}

// Project Stage Selector
export async function updateProjectStage(id: string, stage: string) {
  let progressUpdate: number | undefined = undefined;
  if (stage === "PRODUCTION" || stage === "MAINTENANCE") {
    progressUpdate = 100;
  } else if (stage === "BACKLOG") {
    progressUpdate = 10;
  }

  await prisma.project.update({
    where: { id },
    data: {
      stage,
      lastUpdateDate: new Date(),
      ...(progressUpdate !== undefined ? { progress: progressUpdate } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Project Priority Selector
export async function updateProjectPriority(id: string, priority: string) {
  await prisma.project.update({
    where: { id },
    data: { priority, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Project Progress Slider / Value
export async function updateProjectProgress(id: string, progress: number) {
  const boundedProgress = Math.min(100, Math.max(0, progress));
  let stageUpdate: string | undefined = undefined;
  if (boundedProgress === 100) {
    stageUpdate = "PRODUCTION";
  }

  await prisma.project.update({
    where: { id },
    data: {
      progress: boundedProgress,
      lastUpdateDate: new Date(),
      ...(stageUpdate ? { stage: stageUpdate } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Toggle Dev Device (LAPTOP <-> WORKSTATION)
export async function toggleDevDevice(id: string, currentDevice: string) {
  const nextDevice = currentDevice === "LAPTOP" ? "WORKSTATION" : "LAPTOP";
  await prisma.project.update({
    where: { id },
    data: { devDevice: nextDevice, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, devDevice: nextDevice };
}

// Toggle Hosting (VPS <-> TOTOHOST)
export async function toggleHosting(id: string, currentHosting: string) {
  const nextHosting = currentHosting === "VPS" ? "TOTOHOST" : "VPS";
  const isVps = nextHosting === "VPS";
  await prisma.project.update({
    where: { id },
    data: { 
      hosting: nextHosting,
      isVps,
      lastUpdateDate: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, hosting: nextHosting };
}

// Toggle Dev Payment (isDevPaid)
export async function toggleDevPayment(id: string, isDevPaid: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isDevPaid, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, isDevPaid };
}

// Toggle Hosting Payment (isHostingPaid)
export async function toggleHostingPayment(id: string, isHostingPaid: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isHostingPaid, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, isHostingPaid };
}

// Update Project Technical Notes
export async function saveProjectNotes(id: string, notes: string) {
  await prisma.project.update({
    where: { id },
    data: { notes, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Common editable basics of a project (used by detail page + edit modal)
export type ProjectBasicsInput = {
  domain?: string;
  altDomains?: string | null;
  client?: string;
  techStack?: string;
  projectType?: string;
  hosting?: string;
  currentStatus?: string;
  stage?: string;
  priority?: string;
  progress?: number;
  devPrice?: number | null;
  hostingPrice?: number | null;
  setupDate?: Date | string | null;
  deadlineDate?: Date | string | null;
  asaId?: string | null;
  asaExplorerUrl?: string | null;
  docUrl?: string | null;
  cpanelUser?: string | null;
  diskUsageMb?: number | null;
  devDevice?: string;
  hasGitBackup?: boolean;
  hasCicd?: boolean;
  notes?: string | null;
  isDevPaid?: boolean;
  isHostingPaid?: boolean;
};

function coerceNullableDate(v: Date | string | null | undefined): Date | null | undefined {
  if (v === null || v === undefined || v === "") return v === "" ? null : v;
  const d = typeof v === "string" ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? null : d;
}

// Update editable basics + lifecycle fields with automatic lastUpdateDate
export async function updateProjectBasics(id: string, data: ProjectBasicsInput) {
  const updateData: Record<string, unknown> = { lastUpdateDate: new Date() };

  const floatFields = ["devPrice", "hostingPrice", "diskUsageMb"] as const;
  const dateFields = ["setupDate", "deadlineDate"] as const;
  const booleanFields = ["hasGitBackup", "hasCicd"] as const;
  const stringFields = [
    "domain", "altDomains", "client", "techStack", "projectType", "hosting",
    "currentStatus", "stage", "priority", "asaId", "asaExplorerUrl", "docUrl",
    "cpanelUser", "devDevice",
  ] as const;

  for (const key of stringFields) {
    if (key in data) {
      const v = data[key as keyof ProjectBasicsInput];
      updateData[key] = v === undefined ? undefined : (v === "" ? null : v);
    }
  }
  for (const key of floatFields) {
    if (key in data) {
      const v = data[key as keyof ProjectBasicsInput];
      updateData[key] = v === undefined ? undefined : (v === null || v === undefined ? null : Number(v));
    }
  }
  if (data.progress !== undefined) {
    updateData.progress = Math.min(100, Math.max(0, Number(data.progress)));
  }
  for (const key of dateFields) {
    if (key in data) {
      updateData[key] = coerceNullableDate(data[key as keyof ProjectBasicsInput] as Date | string | null | undefined);
    }
  }
  for (const key of booleanFields) {
    if (key in data) {
      updateData[key] = Boolean(data[key as keyof ProjectBasicsInput]);
    }
  }
  // isVps follows hosting when hosting changes
  if (typeof updateData.hosting === "string") {
    updateData.isVps = updateData.hosting === "VPS";
  }
  const cleaned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(updateData)) {
    if (v !== undefined) cleaned[k] = v;
  }

  await prisma.project.update({
    where: { id },
    data: cleaned,
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Toggle CI/CD Webhook
export async function toggleCicd(id: string, currentCicd: boolean) {
  await prisma.project.update({
    where: { id },
    data: { hasCicd: !currentCicd, lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Update current status text
export async function updateProjectStatusText(id: string, currentStatus: string) {
  await prisma.project.update({
    where: { id },
    data: { currentStatus: currentStatus.trim(), lastUpdateDate: new Date() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Create new project with V2.5 fields
export async function createProject(formData: FormData) {
  const domain = formData.get("domain") as string;
  const altDomains = (formData.get("altDomains") as string) || null;
  const client = formData.get("client") as string;
  const techStack = formData.get("techStack") as string;
  const projectType = (formData.get("projectType") as string) || "WEB";
  const hosting = (formData.get("hosting") as string) || "VPS";
  const isVps = hosting === "VPS";
  const currentStatus = (formData.get("currentStatus") as string) || "U razvoju";
  const stage = (formData.get("stage") as string) || "IN_PROGRESS";
  const priority = (formData.get("priority") as string) || "NORMAL";
  const progressStr = formData.get("progress") as string;
  const devPriceStr = formData.get("devPrice") as string;
  const hostingPriceStr = formData.get("hostingPrice") as string;
  const isDevPaid = formData.get("isDevPaid") === "true" || formData.get("isDevPaid") === "on";
  const isHostingPaid = formData.get("isHostingPaid") === "true" || formData.get("isHostingPaid") === "on";
  const setupDateStr = formData.get("setupDate") as string;
  const deadlineDateStr = formData.get("deadlineDate") as string;
  const docUrl = (formData.get("docUrl") as string) || null;
  const asaId = (formData.get("asaId") as string) || null;
  const asaExplorerUrl = (formData.get("asaExplorerUrl") as string) || null;
  const cpanelUser = (formData.get("cpanelUser") as string) || null;
  const diskUsageMbStr = formData.get("diskUsageMb") as string;
  const devDevice = (formData.get("devDevice") as string) || "WORKSTATION";
  const hasGitBackup = formData.get("hasGitBackup") === "true" || formData.get("hasGitBackup") === "on";
  const hasCicd = formData.get("hasCicd") === "true" || formData.get("hasCicd") === "on";
  const notes = (formData.get("notes") as string) || null;

  if (!domain || !client || !techStack) {
    throw new Error("Domena, klijent i tehnološki stog su obavezni");
  }

  const progress = progressStr ? parseInt(progressStr, 10) : (stage === "PRODUCTION" ? 100 : 30);
  const devPrice = devPriceStr && devPriceStr.trim() !== "" ? parseFloat(devPriceStr) : null;
  const hostingPrice = hostingPriceStr && hostingPriceStr.trim() !== "" ? parseFloat(hostingPriceStr) : null;
  const diskUsageMb = diskUsageMbStr && diskUsageMbStr.trim() !== "" ? parseInt(diskUsageMbStr, 10) : null;

  await prisma.project.create({
    data: {
      domain: domain.trim(),
      altDomains: altDomains?.trim() || null,
      client: client.trim(),
      techStack: techStack.trim(),
      projectType,
      hosting,
      isVps,
      cpanelUser: cpanelUser?.trim() || null,
      diskUsageMb,
      currentStatus: currentStatus.trim(),
      stage,
      priority,
      progress: isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)),
      devPrice: isNaN(devPrice as number) ? null : devPrice,
      isDevPaid,
      hostingPrice: isNaN(hostingPrice as number) ? null : hostingPrice,
      isHostingPaid,
      setupDate: setupDateStr ? new Date(setupDateStr) : null,
      deadlineDate: deadlineDateStr ? new Date(deadlineDateStr) : null,
      docUrl: docUrl?.trim() || null,
      asaId: asaId?.trim() || null,
      asaExplorerUrl: asaExplorerUrl?.trim() || null,
      devDevice,
      hasGitBackup,
      hasCicd,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// Update existing project with V2.5 fields
export async function updateProject(id: string, formData: FormData) {
  const data: ProjectBasicsInput = {};
  const stringKeys = [
    "domain", "client", "techStack", "projectType", "hosting", "currentStatus",
    "stage", "priority", "docUrl", "asaId", "asaExplorerUrl", "cpanelUser", "devDevice",
  ] as const;
  for (const key of stringKeys) {
    const v = formData.get(key);
    if (v !== null) {
      const val = String(v);
      (data as Record<string, string | null>)[key] = val.trim() || null;
    }
  }
  const alt = formData.get("altDomains");
  if (alt !== null) data.altDomains = String(alt).trim() || null;
  const notes = formData.get("notes");
  if (notes !== null) data.notes = String(notes).trim() || null;

  const progressStr = formData.get("progress");
  if (progressStr !== null) data.progress = parseInt(String(progressStr), 10);
  const devPriceStr = formData.get("devPrice") as string | null;
  if (devPriceStr !== null) data.devPrice = devPriceStr.trim() !== "" ? parseFloat(devPriceStr) : null;
  const hostingPriceStr = formData.get("hostingPrice") as string | null;
  if (hostingPriceStr !== null) data.hostingPrice = hostingPriceStr.trim() !== "" ? parseFloat(hostingPriceStr) : null;
  const diskStr = formData.get("diskUsageMb") as string | null;
  if (diskStr !== null) data.diskUsageMb = diskStr.trim() !== "" ? parseInt(diskStr, 10) : null;
  data.isDevPaid = formData.get("isDevPaid") === "true" || formData.get("isDevPaid") === "on";
  data.isHostingPaid = formData.get("isHostingPaid") === "true" || formData.get("isHostingPaid") === "on";
  data.hasCicd = formData.get("hasCicd") === "true" || formData.get("hasCicd") === "on";
  data.hasGitBackup = formData.get("hasGitBackup") === "true" || formData.get("hasGitBackup") === "on";

  const setupDateStr = formData.get("setupDate") as string | null;
  if (setupDateStr !== null) data.setupDate = setupDateStr.trim() !== "" ? setupDateStr : null;
  const deadlineDateStr = formData.get("deadlineDate") as string | null;
  if (deadlineDateStr !== null) data.deadlineDate = deadlineDateStr.trim() !== "" ? deadlineDateStr : null;

  await updateProjectBasics(id, data);

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Archive project
export async function toggleArchiveProject(id: string, currentArchived: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isArchived: !currentArchived },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Delete project
export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  return { success: true };
}

// ==================== PotentialLead CRUD ====================

// Create a new potential lead
export async function createLead(formData: FormData) {
  const title = formData.get("title") as string;
  const clientName = formData.get("clientName") as string;
  const estimatedValueStr = formData.get("estimatedValue") as string;
  const probabilityStr = formData.get("probability") as string;
  const status = (formData.get("status") as string) || "INQUIRY";
  const notes = (formData.get("notes") as string) || null;
  const targetDateStr = formData.get("targetDate") as string;

  if (!title || !clientName) {
    throw new Error("Naziv najave i klijent su obavezni");
  }

  const estimatedValue = estimatedValueStr && estimatedValueStr.trim() !== "" ? parseFloat(estimatedValueStr) : null;
  const probability = probabilityStr ? parseInt(probabilityStr, 10) : 50;

  await prisma.potentialLead.create({
    data: {
      title: title.trim(),
      clientName: clientName.trim(),
      estimatedValue: isNaN(estimatedValue as number) ? null : estimatedValue,
      probability: isNaN(probability) ? 50 : Math.min(100, Math.max(0, probability)),
      status,
      notes: notes?.trim() || null,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// Update an existing lead
export async function updateLead(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const clientName = formData.get("clientName") as string;
  const estimatedValueStr = formData.get("estimatedValue") as string;
  const probabilityStr = formData.get("probability") as string;
  const status = (formData.get("status") as string) || "INQUIRY";
  const notes = (formData.get("notes") as string) || null;
  const targetDateStr = formData.get("targetDate") as string;

  if (!title || !clientName) {
    throw new Error("Naziv najave i klijent su obavezni");
  }

  const estimatedValue = estimatedValueStr && estimatedValueStr.trim() !== "" ? parseFloat(estimatedValueStr) : null;
  const probability = probabilityStr ? parseInt(probabilityStr, 10) : 50;

  await prisma.potentialLead.update({
    where: { id },
    data: {
      title: title.trim(),
      clientName: clientName.trim(),
      estimatedValue: isNaN(estimatedValue as number) ? null : estimatedValue,
      probability: isNaN(probability) ? 50 : Math.min(100, Math.max(0, probability)),
      status,
      notes: notes?.trim() || null,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// Delete a lead
export async function deleteLead(id: string) {
  await prisma.potentialLead.delete({
    where: { id },
  });

  revalidatePath("/");
  return { success: true };
}

// Convert a PotentialLead into a Project
export async function convertLeadToProject(leadId: string) {
  const lead = await prisma.potentialLead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error("Najava ne postoji");
  }

  // Build a clean domain slug from the lead title
  const domainSlug = lead.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

  const project = await prisma.project.create({
    data: {
      domain: domainSlug || "novi-projekt",
      client: lead.clientName.trim(),
      techStack: "TBD",
      projectType: "WEB",
      hosting: "VPS",
      isVps: true,
      currentStatus: "Nova najava pretvorena u projekt",
      stage: "BACKLOG",
      priority: "NORMAL",
      progress: 5,
      devPrice: lead.estimatedValue,
      isDevPaid: false,
      hostingPrice: 0.0,
      isHostingPaid: false,
      deadlineDate: lead.targetDate,
      notes: lead.notes ? `### Pretvoreno iz najave (PotentialLead)\n${lead.notes}` : null,
    },
  });

  await prisma.potentialLead.delete({
    where: { id: leadId },
  });

  revalidatePath("/");
  return { success: true, projectId: project.id };
}