import { prisma } from "@/lib/db";
import { DashboardContainer } from "@/components/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, rawSettings] = await Promise.all([
    prisma.project.findMany({
      include: {
        timeLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [
        { priority: "asc" },
        { updatedAt: "desc" },
      ],
    }),
    prisma.systemSetting.findMany(),
  ]);

  const systemSettings: Record<string, string> = {};
  rawSettings.forEach((s) => {
    systemSettings[s.key] = s.value;
  });

  return (
    <DashboardContainer
      projects={projects as any}
      systemSettings={systemSettings}
    />
  );
}
