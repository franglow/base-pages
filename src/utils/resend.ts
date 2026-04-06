// src/utils/resend.ts — Resend email utility with localized auto-responder

import { Resend } from 'resend';
import type { Language } from '../i18n/config';

// ─── Configuration ──────────────────────────────────────────────────
const FROM_ADDRESS = 'Base Pages <hello@basepages.dev>';
const INTERNAL_TO = 'elfrancortez@gmail.com';

function getResendClient(): Resend | null {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_PASTE_YOUR_KEY_HERE') {
    console.warn('[RESEND] No API key found — emails will be logged to console only.');
    return null;
  }
  return new Resend(apiKey);
}

// ─── Email Layout ───────────────────────────────────────────────────
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

// ─── Localized Subject Lines ────────────────────────────────────────
const SUBJECT_LINES: Record<Language, string> = {
  en: 'Thanks for reaching out! — Base Pages',
  de: 'Danke für Ihre Nachricht! — Base Pages',
  es: '¡Gracias por escribirnos! — Base Pages',
};

// ─── Localized Client Auto-Responder Templates ─────────────────────
type ClientData = { name: string; email: string };

const CLIENT_TEMPLATES: Record<Language, (d: ClientData) => string> = {
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
    <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">Mientras tanto, echá un vistazo a nuestros últimos proyectos en <a href="https://basepages.dev/es/works" style="color:#111827;font-weight:500;">basepages.dev/es/works</a>.</p>
    <p style="margin:24px 0 0;font-size:16px;color:#374151;">— El equipo de Base Pages</p>
  `),
};

// ─── Internal Notification Template ─────────────────────────────────
function buildInternalHtml(data: Record<string, string | undefined>): string {
  const rows = Object.entries(data)
    .filter(([_, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;text-transform:capitalize;">${k}</td><td style="padding:8px 12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">${v}</td></tr>`)
    .join('');

  return wrapInLayout(`
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:600;color:#166534;">📩 New Contact Form Submission</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>
  `);
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Send a localized auto-responder email to the client.
 * Fire-and-forget: errors are caught and logged, never block the redirect.
 */
export function sendClientEmail(lang: Language, data: ClientData): void {
  _sendClientEmail(lang, data).catch((err) => {
    console.error(`[RESEND] Failed to send client email to ${data.email}:`, err);
  });
}

async function _sendClientEmail(lang: Language, data: ClientData): Promise<void> {
  const subject = SUBJECT_LINES[lang];
  const html = CLIENT_TEMPLATES[lang](data);

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

  console.log(`[RESEND] ✓ Sent auto-responder to ${data.email} (${lang})`);
}

/**
 * Send an internal notification email with all lead data.
 * Fire-and-forget: errors are caught and logged, never block the redirect.
 */
export function sendInternalNotification(data: Record<string, string | undefined>): void {
  _sendInternalNotification(data).catch((err) => {
    console.error('[RESEND] Failed to send internal notification:', err);
  });
}

async function _sendInternalNotification(data: Record<string, string | undefined>): Promise<void> {
  const interestLower = data.interest?.toLowerCase() || '';
  const isGrowth = interestLower.includes('growth');
  const isScale = interestLower.includes('scale');
  const isPartnership = interestLower.includes('partnership') || interestLower.includes('white-label') || interestLower.includes('marca blanca');
  const subject = isPartnership
    ? `🤝 Partnership Lead: ${data.name || 'Contact Form'}`
    : isScale
      ? `🏗️ Scale Lead: ${data.name || 'Contact Form'}`
      : isGrowth
        ? `🚀 Growth Lead: ${data.name || 'Contact Form'}`
        : `📩 New Lead: ${data.interest || 'Contact Form'}`;
  const html = buildInternalHtml(data);

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

  console.log(`[RESEND] ✓ Internal notification sent`);
}
