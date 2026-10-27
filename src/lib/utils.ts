import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

export function buildWhatsAppInquiryUrl(params: {
  whatsappNumber: string;
  companyName?: string;
  productName?: string;
  productSku?: string | null;
  categoryName?: string;
  productUrl?: string;
  customMessage?: string;
}): string {
  const cleanPhone = (params.whatsappNumber || "").replace(/[^\d]/g, "");
  const company = params.companyName || "NR Industrial Enterprises";

  let text = "";
  if (params.productName) {
    text = [
      `Hello *${company}*,`,
      ``,
      `I would like to enquire about this product:`,
      `• *Product:* ${params.productName}`,
      params.categoryName ? `• *Category:* ${params.categoryName}` : null,
      params.productUrl ? `• *Link:* ${params.productUrl}` : null,
      ``,
      `Please share the available sizes, stock status, and best price.`,
    ]
      .filter(Boolean)
      .join("\n");
  } else {
    text =
      params.customMessage ||
      `Hello *${company}*, I would like to enquire about your hoses, rubber sheets, and industrial products.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildEmailPrefillData(params: {
  companyName?: string;
  productName?: string;
  productSku?: string | null;
  categoryName?: string;
  minOrderQty?: string | null;
  productUrl?: string;
}) {
  const company = params.companyName || "NR Industrial Enterprises";
  if (params.productName) {
    const subject = `Product Inquiry: ${params.productName} - ${company}`;
    const message = [
      `Hello ${company} Team,`,
      ``,
      `I am interested in buying the following product and would like to know the price and availability:`,
      ``,
      `• Product: ${params.productName}`,
      params.categoryName ? `• Category: ${params.categoryName}` : null,
      params.minOrderQty ? `• Minimum Order: ${params.minOrderQty}` : null,
      params.productUrl ? `• Product Link: ${params.productUrl}` : null,
      ``,
      `Please share the best rate and delivery details.`,
      ``,
      `Thank you,`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    return { subject, message };
  }

  return {
    subject: `Product Inquiry - ${company}`,
    message: `Hello ${company} Team,\n\nI would like to enquire about your products. Please get in touch with me.\n\nThank you,`,
  };
}
