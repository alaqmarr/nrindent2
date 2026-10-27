import nodemailer from "nodemailer";
import { getSiteSettings } from "./settings";

export interface SendInquiryEmailParams {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  quantity?: string;
  productName?: string;
  productSku?: string;
  productUrl?: string;
}

export async function createSmtpTransporter() {
  const settings = await getSiteSettings();

  const host = settings.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(settings.smtpPort || process.env.SMTP_PORT || 587);
  const user = settings.smtpUser || process.env.SMTP_USER || "";
  const pass = settings.smtpPass || process.env.SMTP_PASS || "";
  const secure = settings.smtpSecure || port === 465;

  const isConfigured = Boolean(user && pass);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: isConfigured ? { user, pass } : undefined,
  });

  return {
    transporter,
    isConfigured,
    settings,
    fromAddress: `"${settings.smtpFromName || settings.companyName}" <${
      settings.smtpFromEmail || user || settings.adminEmail
    }>`,
    adminEmail: settings.adminEmail || user || "sales@nrindustrial.com",
  };
}

export async function sendInquiryEmail(params: SendInquiryEmailParams): Promise<{
  sent: boolean;
  error?: string;
}> {
  try {
    const { transporter, isConfigured, settings, fromAddress, adminEmail } =
      await createSmtpTransporter();

    if (!isConfigured) {
      return {
        sent: false,
        error:
          "SMTP credentials (Gmail address & App Password) are not configured yet. Inquiry was saved to the Admin database.",
      };
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 20px 24px; border-bottom: 4px solid #ea580c;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">${settings.companyName}</h2>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">New Industrial Inquiry Notification</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; color: #1e293b;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 16px;">${params.subject}</h3>
          
          ${
            params.productName
              ? `
          <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 6px; font-weight: bold; color: #9a3412;">Product Reference</p>
            <p style="margin: 2px 0; font-size: 14px;"><strong>Product:</strong> ${params.productName}</p>
            ${params.productSku ? `<p style="margin: 2px 0; font-size: 14px;"><strong>SKU:</strong> ${params.productSku}</p>` : ""}
            ${params.quantity ? `<p style="margin: 2px 0; font-size: 14px;"><strong>Required Quantity:</strong> ${params.quantity}</p>` : ""}
            ${params.productUrl ? `<p style="margin: 2px 0; font-size: 14px;"><strong>Product Page:</strong> <a href="${params.productUrl}" style="color: #ea580c;">${params.productUrl}</a></p>` : ""}
          </div>
          `
              : ""
          }

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold; width: 35%;">Customer Name</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${params.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold;">Email Address</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><a href="mailto:${params.email}" style="color: #ea580c;">${params.email}</a></td>
            </tr>
            ${
              params.phone
                ? `<tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold;">Phone / WhatsApp</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${params.phone}</td>
            </tr>`
                : ""
            }
            ${
              params.company
                ? `<tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold;">Company / Organization</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${params.company}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
            <p style="margin: 0 0 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #64748b;">Inquiry Message / Specifications</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${params.message}</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 12px; color: #64748b; text-align: center;">
          Sent via ${settings.companyName} Official Website • Manage inquiries in the Admin Portal
        </div>
      </div>
    `;

    // Send to Admin
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: params.email,
      subject: `[Website Inquiry] ${params.subject}`,
      html: htmlBody,
    });

    // Send polite acknowledgment to customer
    await transporter.sendMail({
      from: fromAddress,
      to: params.email,
      replyTo: adminEmail,
      subject: `We received your inquiry - ${settings.companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; color: #ffffff; padding: 20px 24px; border-bottom: 4px solid #ea580c;">
            <h2 style="margin: 0; font-size: 20px;">${settings.companyName}</h2>
          </div>
          <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
            <p>Dear <strong>${params.name}</strong>,</p>
            <p>Thank you for contacting <strong>${settings.companyName}</strong>. We have received your inquiry regarding <strong>${params.productName || params.subject}</strong>.</p>
            <p>Our technical sales team is reviewing your requirements and will respond shortly with the requested quotation and technical details.</p>
            <p style="margin-top: 20px;">For urgent assistance, you can also reach us directly:</p>
            <ul style="font-size: 14px; color: #334155;">
              <li><strong>Phone:</strong> ${settings.salesPhone}</li>
              <li><strong>WhatsApp:</strong> ${settings.whatsappNumber}</li>
              <li><strong>Email:</strong> ${settings.adminEmail}</li>
            </ul>
            <p style="margin-top: 24px;">Warm regards,<br/><strong>Sales & Engineering Division</strong><br/>${settings.companyName}</p>
          </div>
        </div>
      `,
    });

    return { sent: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send SMTP email";
    console.error("SMTP Error:", message);
    return { sent: false, error: message };
  }
}
