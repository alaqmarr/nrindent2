import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { sendInquiryEmail } from "@/lib/mailer";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      include: {
        product: {
          select: { id: true, name: true, slug: true, sku: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch inquiries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = "PRODUCT_EMAIL",
      name,
      email,
      phone,
      company,
      subject,
      message,
      quantity,
      productId,
      productName,
      productSku,
      productUrl,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const finalSubject =
      subject ||
      (productName
        ? `Product Inquiry: ${productName}${productSku ? ` (${productSku})` : ""}`
        : `General Inquiry from ${name}`);

    // Send email via Nodemailer + Gmail SMTP
    const mailResult = await sendInquiryEmail({
      name,
      email,
      phone,
      company,
      subject: finalSubject,
      message,
      quantity,
      productName,
      productSku,
      productUrl,
    });

    // Record inquiry in SQLite database
    const inquiry = await prisma.inquiry.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: finalSubject,
        message,
        quantity: quantity || null,
        productId: productId || null,
        productName: productName || null,
        productSku: productSku || null,
        status: "NEW",
        emailSent: mailResult.sent,
      },
    });

    return NextResponse.json({
      success: true,
      inquiry,
      emailSent: mailResult.sent,
      emailNotice: mailResult.error || null,
    });
  } catch (err: unknown) {
    console.error("Create Inquiry Error:", err);
    const message = err instanceof Error ? err.message : "Failed to submit inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
