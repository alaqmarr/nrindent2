import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSiteSettings } from "./settings";
import fs from "fs/promises";
import path from "path";

export async function uploadImageBuffer(params: {
  buffer: Buffer;
  filename: string;
  contentType: string;
  folder?: string;
}): Promise<{
  url: string;
  storage: "cloudflare-r2" | "local-fallback";
  key: string;
}> {
  const settings = await getSiteSettings();

  const accountId = settings.r2AccountId || process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = settings.r2AccessKeyId || process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey =
    settings.r2SecretAccessKey || process.env.R2_SECRET_ACCESS_KEY || "";
  const bucketName =
    settings.r2BucketName || process.env.R2_BUCKET_NAME || "projects-bucket";
  const publicUrl = (
    settings.r2PublicUrl ||
    process.env.R2_PUBLIC_URL ||
    ""
  ).replace(/\/$/, "");

  const endpoint =
    process.env.R2_S3_API ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "");

  const safeName = params.filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
  const folder = params.folder || "products";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const objectKey = `nr-industrial/${folder}/${uniqueName}`;

  if (endpoint && accessKeyId && secretAccessKey && bucketName) {
    const s3 = new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: params.buffer,
        ContentType: params.contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const finalUrl = publicUrl
      ? `${publicUrl}/${objectKey}`
      : `${endpoint}/${bucketName}/${objectKey}`;

    return {
      url: finalUrl,
      storage: "cloudflare-r2",
      key: objectKey,
    };
  }

  // Fallback to local public/uploads directory if R2 credentials are not set yet
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, params.buffer);

  return {
    url: `/uploads/${folder}/${uniqueName}`,
    storage: "local-fallback",
    key: objectKey,
  };
}
