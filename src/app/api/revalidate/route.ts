import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { revalidateSiteContent } from "@/lib/revalidate";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidateSiteContent();
    return NextResponse.json({
      success: true,
      revalidatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to revalidate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
