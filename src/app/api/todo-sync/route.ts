import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { domain, progress, stateJson } = await req.json();

    const project = await prisma.project.updateMany({
      where: { domain: { contains: domain } },
      data: {
        progress: Number(progress),
        todoState: JSON.stringify(stateJson),
        lastUpdateDate: new Date(),
      },
    });

    revalidatePath("/");
    return NextResponse.json({ ok: true, updated: project.count });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
