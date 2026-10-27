import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createSmtpTransporter } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { transporter, isConfigured, settings, fromAddress, adminEmail } =
      await createSmtpTransporter();

    if (!isConfigured) {
      return NextResponse.json(
        {
          error:
            "SMTP User (Gmail address) and SMTP App Password are not set. Please save your SMTP credentials first.",
        },
        { status: 400 }
      );
    }

    const targetEmail = body.toEmail || adminEmail;

    await transporter.verify();

    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: `[SMTP Test] ${settings.companyName} Email Configuration Verified`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #0f172a; color: #fff; padding: 18px 24px; border-bottom: 4px solid #ea580c;">
            <h2 style="margin: 0; font-size: 18px;">${settings.companyName} — SMTP Verification</h2>
          </div>
          <div style="padding: 24px; color: #1e293b;">
            <p>Your Nodemailer + Gmail SMTP configuration is active and working properly!</p>
            <p style="font-size: 13px; color: #64748b;">
              Host: ${settings.smtpHost}:${settings.smtpPort}<br/>
              Admin Recipient: ${targetEmail}
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${targetEmail}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "SMTP verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
