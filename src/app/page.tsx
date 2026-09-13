import { prisma } from "@/lib/db";
import { DashboardContainer } from "@/components/DashboardContainer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    include: {
      timeLogs: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [
      { priority: "asc" },
      { updatedAt: "desc" },
    ],
  });

  const leads = await prisma.potentialLead.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return <DashboardContainer projects={projects} leads={leads} />;
}
