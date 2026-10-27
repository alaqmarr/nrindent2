import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageBuffer({
      buffer,
      filename: file.name || "cropped-image.webp",
      contentType: file.type || "image/webp",
      folder,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      storage: result.storage,
      key: result.key,
    });
  } catch (err: unknown) {
    console.error("Image Upload Error:", err);
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
