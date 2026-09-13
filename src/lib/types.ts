export interface ProjectTimeLog {
  id: string;
  hours: number;
  description: string | null;
  createdAt: Date;
}

export interface ProjectData {
  id: string;
  domain: string;
  altDomains: string | null;
  client: string;
  techStack: string;
  projectType: string;
  hosting: string;
  isVps: boolean;
  cpanelUser: string | null;
  diskUsageMb: number | null;
  currentStatus: string;
  stage: string;
  priority: string;
  progress: number;
  devPrice: number | null;
  isDevPaid: boolean;
  hostingPrice: number | null;
  isHostingPaid: boolean;
  setupDate: Date | null;
  deadlineDate: Date | null;
  lastUpdateDate: Date;
  docUrl: string | null;
  notes: string | null;
  asaId: string | null;
  asaExplorerUrl: string | null;
  devDevice: string;
  hasGitBackup: boolean;
  hasCicd: boolean;
  isArchived: boolean;
  timeLogs: ProjectTimeLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PotentialLeadData {
  id: string;
  title: string;
  clientName: string;
  estimatedValue: number | null;
  probability: number;
  status: string;
  notes: string | null;
  targetDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}