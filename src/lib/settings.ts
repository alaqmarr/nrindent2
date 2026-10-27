import prisma from "./prisma";
import { unstable_cache } from "next/cache";

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "default" },
    });
  }

  return settings;
}

export const getCachedSiteSettings = unstable_cache(
  async () => {
    return getSiteSettings();
  },
  ["site-settings"],
  {
    tags: ["site-settings"],
    revalidate: 60,
  }
);

export async function getPublicSettings() {
  const s = await getCachedSiteSettings();
  const {
    smtpPass: _smtpPass,
    smtpUser: _smtpUser,
    r2AccessKeyId: _r2AccessKeyId,
    r2SecretAccessKey: _r2SecretAccessKey,
    ...publicSettings
  } = s;
  return publicSettings;
}

export type PublicSiteSettings = Awaited<ReturnType<typeof getPublicSettings>>;
