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
    data: { priority },
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
    data: { devDevice: nextDevice },
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
    },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, hosting: nextHosting };
}

// Toggle Payment Status (isPaid)
export async function togglePaymentStatus(id: string, isPaid: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isPaid },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true, isPaid };
}

// Update Project Technical Notes
export async function updateProjectNotes(id: string, notes: string) {
  await prisma.project.update({
    where: { id },
    data: { notes },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Toggle CI/CD Webhook
export async function toggleCicd(id: string, currentCicd: boolean) {
  await prisma.project.update({
    where: { id },
    data: { hasCicd: !currentCicd },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Update current status text
export async function updateProjectStatusText(id: string, currentStatus: string) {
  await prisma.project.update({
    where: { id },
    data: { currentStatus: currentStatus.trim() },
  });

  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  return { success: true };
}

// Create new project with V2.1 fields
export async function createProject(formData: FormData) {
  const domain = formData.get("domain") as string;
  const client = formData.get("client") as string;
  const techStack = formData.get("techStack") as string;
  const hosting = (formData.get("hosting") as string) || "VPS";
  const isVps = hosting === "VPS";
  const currentStatus = (formData.get("currentStatus") as string) || "U razvoju";
  const stage = (formData.get("stage") as string) || "IN_PROGRESS";
  const priority = (formData.get("priority") as string) || "NORMAL";
  const progressStr = formData.get("progress") as string;
  const priceStr = formData.get("price") as string;
  const isPaid = formData.get("isPaid") === "true" || formData.get("isPaid") === "on";
  const docUrl = (formData.get("docUrl") as string) || null;
  const devDevice = (formData.get("devDevice") as string) || "WORKSTATION";
  const hasGitBackup = formData.get("hasGitBackup") === "true" || formData.get("hasGitBackup") === "on";
  const hasCicd = formData.get("hasCicd") === "true" || formData.get("hasCicd") === "on";
  const notes = (formData.get("notes") as string) || null;

  if (!domain || !client || !techStack) {
    throw new Error("Domena, klijent i tehnološki stog su obavezni");
  }

  const progress = progressStr ? parseInt(progressStr, 10) : (stage === "PRODUCTION" ? 100 : 30);
  const price = priceStr && priceStr.trim() !== "" ? parseFloat(priceStr) : null;

  await prisma.project.create({
    data: {
      domain: domain.trim(),
      client: client.trim(),
      techStack: techStack.trim(),
      hosting,
      isVps,
      currentStatus: currentStatus.trim(),
      stage,
      priority,
      progress: isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)),
      price: isNaN(price as number) ? null : price,
      isPaid,
      docUrl: docUrl?.trim() || null,
      devDevice,
      hasGitBackup,
      hasCicd,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath("/");
  return { success: true };
}

// Update existing project with V2.1 fields
export async function updateProject(id: string, formData: FormData) {
  const domain = formData.get("domain") as string;
  const client = formData.get("client") as string;
  const techStack = formData.get("techStack") as string;
  const hosting = (formData.get("hosting") as string) || "VPS";
  const isVps = hosting === "VPS";
  const currentStatus = formData.get("currentStatus") as string;
  const stage = formData.get("stage") as string;
  const priority = formData.get("priority") as string;
  const progressStr = formData.get("progress") as string;
  const priceStr = formData.get("price") as string;
  const isPaid = formData.get("isPaid") === "true" || formData.get("isPaid") === "on";
  const docUrl = (formData.get("docUrl") as string) || null;
  const devDevice = (formData.get("devDevice") as string) || "WORKSTATION";
  const hasGitBackup = formData.get("hasGitBackup") === "true" || formData.get("hasGitBackup") === "on";
  const hasCicd = formData.get("hasCicd") === "true" || formData.get("hasCicd") === "on";
  const notes = (formData.get("notes") as string) || null;

  const progress = progressStr ? parseInt(progressStr, 10) : 0;
  const price = priceStr && priceStr.trim() !== "" ? parseFloat(priceStr) : null;

  await prisma.project.update({
    where: { id },
    data: {
      domain: domain.trim(),
      client: client.trim(),
      techStack: techStack.trim(),
      hosting,
      isVps,
      currentStatus: currentStatus.trim(),
      stage,
      priority,
      progress: isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)),
      price: isNaN(price as number) ? null : price,
      isPaid,
      docUrl: docUrl?.trim() || null,
      devDevice,
      hasGitBackup,
      hasCicd,
      notes: notes?.trim() || null,
    },
  });

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
