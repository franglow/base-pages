// src/utils/resend.ts — Resend email utility with tier-specific templates and i18n

import { Resend } from 'resend';
import type { Language } from '../i18n/config';

// ─── Configuration ──────────────────────────────────────────────────
const FROM_ADDRESS = 'Base Pages <hello@basepages.dev>';
const INTERNAL_TO = 'hello@basepages.dev'; // Internal notification recipient

function getResendClient(): Resend | null {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[RESEND] No API key found — emails will be logged to console only.');
    return null;
  }
  return new Resend(apiKey);
}

// ─── Tier Types ─────────────────────────────────────────────────────
export type Tier = 'starter' | 'growth' | 'scale' | 'partnership';

// ─── Subject Line Mapper (localized) ────────────────────────────────
const SUBJECT_LINES: Record<Tier, Record<Language, string>> = {
  starter: {
    en: 'Thanks for reaching out! — Base Pages',
    de: 'Danke für Ihre Nachricht! — Base Pages',
    es: '¡Gracias por escribirnos! — Base Pages',
  },
  growth: {
    en: "Let's grow your ROI — Base Pages",
    de: 'Steigern Sie Ihren ROI — Base Pages',
    es: 'Haz crecer tu ROI — Base Pages',
  },
  scale: {
    en: 'Your consultation request — Base Pages',
    de: 'Ihre Beratungsanfrage — Base Pages',
    es: 'Tu solicitud de consultoría — Base Pages',
  },
  partnership: {
    en: 'Partnership application received — Base Pages',
    de: 'Partnerschaftsbewerbung erhalten — Base Pages',
    es: 'Solicitud de asociación recibida — Base Pages',
  },
};

const INTERNAL_SUBJECTS: Record<Tier, string> = {
  starter: '🟢 New Starter Lead',
  growth: '🔵 New Growth Lead',
  scale: '🟣 New Scale Lead',
  partnership: '🟠 New Partnership Application',
};

// ─── HTML Email Templates (localized) ───────────────────────────────
function wrapInLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f8f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="padding:40px 32px;">
      ${content}
    </div>
    <div style="padding:24px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="margin:0;font-size:13px;color:#9ca3af;">Base Pages · basepages.dev</p>
    </div>
  </div>
</body>
</html>`;
}

type TemplateData = {
  name: string;
  email: string;
  [key: string]: string | undefined;
};

const CLIENT_TEMPLATES: Record<Tier, Record<Language, (data: TemplateData) => string>> = {
  starter: {
    en: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hi ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">We've received your message and will get back to you within 24 hours.</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">In the meantime, feel free to check out our latest work at <a href="https://basepages.dev/works" style="color:#111827;font-weight:500;">basepages.dev/works</a>.</p>
      <p style="margin:24px 0 0;font-size:16px;color:#374151;">— The Base Pages Team</p>
    `),
    de: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hallo ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">Schauen Sie sich in der Zwischenzeit unsere neuesten Arbeiten an: <a href="https://basepages.dev/de/works" style="color:#111827;font-weight:500;">basepages.dev/de/works</a>.</p>
      <p style="margin:24px 0 0;font-size:16px;color:#374151;">— Das Base Pages Team</p>
    `),
    es: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">¡Hola ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Hemos recibido tu mensaje y te responderemos en un plazo de 24 horas.</p>
      <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">Mientras tanto, echa un vistazo a nuestros últimos proyectos en <a href="https://basepages.dev/es/works" style="color:#111827;font-weight:500;">basepages.dev/es/works</a>.</p>
      <p style="margin:24px 0 0;font-size:16px;color:#374151;">— El equipo de Base Pages</p>
    `),
  },

  growth: {
    en: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hi ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Thanks for sharing your growth goals. We'd love to discuss how we can help you scale your <strong>${d.adsPlatform || 'ad'}</strong> campaigns.</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151;">Book your 20-minute strategy call to get started:</p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://basepages.dev/contact/growth-thanks" style="display:inline-block;background:#111827;color:#ffffff;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:500;text-decoration:none;">Book your 20-min call →</a>
      </div>
      <p style="margin:0;font-size:16px;color:#374151;">— The Base Pages Team</p>
    `),
    de: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hallo ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Vielen Dank, dass Sie Ihre Wachstumsziele mit uns geteilt haben. Wir helfen Ihnen gerne, Ihre <strong>${d.adsPlatform || 'Werbe'}</strong>-Kampagnen zu skalieren.</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151;">Buchen Sie Ihr 20-minütiges Strategiegespräch:</p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://basepages.dev/contact/growth-thanks" style="display:inline-block;background:#111827;color:#ffffff;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:500;text-decoration:none;">20-Min-Gespräch buchen →</a>
      </div>
      <p style="margin:0;font-size:16px;color:#374151;">— Das Base Pages Team</p>
    `),
    es: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">¡Hola ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Gracias por compartir tus objetivos de crecimiento. Nos encantaría ayudarte a escalar tus campañas de <strong>${d.adsPlatform || 'publicidad'}</strong>.</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#374151;">Reserva tu llamada estratégica de 20 minutos:</p>
      <div style="text-align:center;margin:0 0 24px;">
        <a href="https://basepages.dev/contact/growth-thanks" style="display:inline-block;background:#111827;color:#ffffff;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:500;text-decoration:none;">Reservar llamada de 20 min →</a>
      </div>
      <p style="margin:0;font-size:16px;color:#374151;">— El equipo de Base Pages</p>
    `),
  },

  scale: {
    en: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hi ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Thank you for your interest in the Scale package. We've received your technical requirements and will review them carefully.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Next steps:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>Our team reviews your stack requirements</li>
        <li>You'll receive a consultation link within 24h</li>
        <li>60-minute architecture deep-dive call</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— The Base Pages Team</p>
    `),
    de: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hallo ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Vielen Dank für Ihr Interesse am Scale-Paket. Wir haben Ihre technischen Anforderungen erhalten und werden sie sorgfältig prüfen.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Nächste Schritte:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>Unser Team überprüft Ihre Stack-Anforderungen</li>
        <li>Sie erhalten einen Beratungslink innerhalb von 24h</li>
        <li>60-minütiger Architektur-Deep-Dive</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— Das Base Pages Team</p>
    `),
    es: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">¡Hola ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Gracias por tu interés en el paquete Scale. Hemos recibido tus requisitos técnicos y los revisaremos cuidadosamente.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Próximos pasos:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>Nuestro equipo revisa tus requisitos de stack</li>
        <li>Recibirás un enlace de consulta en 24h</li>
        <li>Llamada de arquitectura de 60 minutos</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— El equipo de Base Pages</p>
    `),
  },

  partnership: {
    en: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hi ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">We've received your partnership application and are excited to learn more about your design process.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">What happens next:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>We review your portfolio and Figma workflow</li>
        <li>You'll receive a designer call invite within 48h</li>
        <li>Technical sync to align on collaboration standards</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— The Base Pages Team</p>
    `),
    de: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hallo ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Wir haben Ihre Partnerschaftsbewerbung erhalten und freuen uns, mehr über Ihren Designprozess zu erfahren.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Was als nächstes passiert:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>Wir prüfen Ihr Portfolio und Ihren Figma-Workflow</li>
        <li>Sie erhalten eine Designer-Einladung innerhalb von 48h</li>
        <li>Technischer Sync für Zusammenarbeitsstandards</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— Das Base Pages Team</p>
    `),
    es: (d) => wrapInLayout(`
      <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">¡Hola ${d.name}!</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Hemos recibido tu solicitud de asociación y estamos emocionados de conocer más sobre tu proceso de diseño.</p>
      <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Qué sucede a continuación:</p>
      <ol style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#374151;">
        <li>Revisamos tu portfolio y flujo de Figma</li>
        <li>Recibirás una invitación de diseñador en 48h</li>
        <li>Sincronización técnica de estándares de colaboración</li>
      </ol>
      <p style="margin:0;font-size:16px;color:#374151;">— El equipo de Base Pages</p>
    `),
  },
};

// ─── Internal Notification Template ─────────────────────────────────
function buildInternalHtml(tier: Tier, data: Record<string, string | undefined>): string {
  const rows = Object.entries(data)
    .filter(([_, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;text-transform:capitalize;">${k}</td><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">${v}</td></tr>`)
    .join('');

  return wrapInLayout(`
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:600;color:#166534;">New ${tier.charAt(0).toUpperCase() + tier.slice(1)} Lead</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>
  `);
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Send a tier-specific, localized auto-responder email to the client.
 * Fire-and-forget: errors are caught and logged, never block the redirect.
 */
export function sendClientEmail(
  tier: Tier,
  lang: Language,
  data: TemplateData
): void {
  // Fire-and-forget — do NOT await
  _sendClientEmail(tier, lang, data).catch((err) => {
    console.error(`[RESEND] Failed to send ${tier} client email to ${data.email}:`, err);
  });
}

async function _sendClientEmail(
  tier: Tier,
  lang: Language,
  data: TemplateData
): Promise<void> {
  const subject = SUBJECT_LINES[tier][lang];
  const html = CLIENT_TEMPLATES[tier][lang](data);

  const resend = getResendClient();
  if (!resend) {
    console.log(`[EMAIL STUB] To: ${data.email}, Subject: ${subject}`);
    console.log(`[EMAIL STUB] Body preview: ${html.substring(0, 200)}...`);
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: data.email,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  console.log(`[RESEND] ✓ Sent ${tier} email to ${data.email} (${lang})`);
}

/**
 * Send an internal notification email with all lead data.
 * Fire-and-forget: errors are caught and logged, never block the redirect.
 */
export function sendInternalNotification(
  tier: Tier,
  data: Record<string, string | undefined>
): void {
  // Fire-and-forget — do NOT await
  _sendInternalNotification(tier, data).catch((err) => {
    console.error(`[RESEND] Failed to send ${tier} internal notification:`, err);
  });
}

async function _sendInternalNotification(
  tier: Tier,
  data: Record<string, string | undefined>
): Promise<void> {
  const subject = INTERNAL_SUBJECTS[tier];
  const html = buildInternalHtml(tier, data);

  const resend = getResendClient();
  if (!resend) {
    console.log(`[INTERNAL STUB] Subject: ${subject}`);
    console.log(`[INTERNAL STUB] Data:`, JSON.stringify(data));
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: INTERNAL_TO,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  console.log(`[RESEND] ✓ Internal notification sent for ${tier} lead`);
}
