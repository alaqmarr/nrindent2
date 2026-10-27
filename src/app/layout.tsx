import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getPublicSettings } from "@/lib/settings";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const logoPath = settings.logoUrl || "/logo.png";
  const ogImageUrl = settings.seoOgImage || settings.logoUrl || "/logo.png";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings.seoDefaultTitle || settings.companyName,
      template: settings.seoTitleTemplate || `%s | ${settings.companyName}`,
    },
    description: settings.seoDefaultDescription || settings.aboutDescription,
    keywords: settings.seoDefaultKeywords
      ? settings.seoDefaultKeywords.split(",").map((k) => k.trim())
      : [
          "NR Industrial Enterprises",
          "House Of Industrial Supplies",
          "industrial products manufacturer",
          "industrial supplier",
        ],
    icons: {
      icon: logoPath,
      shortcut: logoPath,
      apple: logoPath,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: baseUrl,
      siteName: settings.companyName,
      title: settings.seoDefaultTitle || settings.companyName,
      description: settings.seoDefaultDescription || settings.aboutDescription,
      images: [{ url: ogImageUrl, alt: settings.companyName }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoDefaultTitle || settings.companyName,
      description: settings.seoDefaultDescription || settings.aboutDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, categories] = await Promise.all([
    getPublicSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: "asc" },
      take: 8,
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: baseUrl,
    logo: `${baseUrl}${settings.logoUrl || "/logo.png"}`,
    description: settings.aboutDescription,
    foundingDate: settings.establishedYear,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.salesPhone,
      contactType: "sales",
      email: settings.adminEmail,
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${settings.addressLine1} ${settings.addressLine2 || ""}`,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.postalCode,
      addressCountry: settings.country,
    },
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${plusJakarta.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[#F2F0EA] text-[#0B0C0E] selection:bg-[#FF3B00] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AuthProvider>
          <Navbar settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} categories={categories} />
        </AuthProvider>
      </body>
    </html>
  );
}
