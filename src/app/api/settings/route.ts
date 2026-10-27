import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, getPublicSettings } from "@/lib/settings";
import { revalidateSiteContent } from "@/lib/revalidate";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (session) {
      const settings = await getSiteSettings();
      return NextResponse.json({ settings });
    }
    const publicSettings = await getPublicSettings();
    return NextResponse.json({ settings: publicSettings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id: _id, updatedAt: _updatedAt, ...data } = body;

    if (data.smtpPort !== undefined) {
      data.smtpPort = Number(data.smtpPort) || 587;
    }
    if (data.smtpSecure !== undefined) {
      data.smtpSecure = Boolean(data.smtpSecure);
    }
    if (data.statsJson && typeof data.statsJson !== "string") {
      data.statsJson = JSON.stringify(data.statsJson);
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        ...data,
      },
    });

    revalidateSiteContent();

    return NextResponse.json({ success: true, settings });
  } catch (err: unknown) {
    console.error("Settings Update Error:", err);
    const message = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
