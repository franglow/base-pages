// src/utils/resend.ts — Resend email utility with localized auto-responder

import { Resend } from 'resend';
import type { Language } from '../i18n/config';

// ─── Configuration ──────────────────────────────────────────────────
const FROM_ADDRESS = 'Base Pages <hello@base-pages.com>';
const LEAD_RADAR_FROM = 'Base-Pages Lead Radar <hello@base-pages.com>';
const INTERNAL_TO = 'fran+leads@base-pages.com';

function getResendClient(): Resend {
  // Vercel injects env vars into process.env at runtime.
  // import.meta.env works at Vite build-time but can be empty in
  // Vercel's Node serverless functions. Try both, prefer process.env.
  const apiKey =
    (typeof process !== 'undefined' && process.env?.RESEND_API_KEY) ||
    import.meta.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 're_PASTE_YOUR_KEY_HERE') {
    const msg = '[RESEND] ❌ RESEND_API_KEY is missing or placeholder. '
      + 'Set it in .env (local) or Vercel Environment Variables (production).';
    console.error(msg);
    throw new Error(msg);
  }

  console.log(`[RESEND] ✓ API key loaded (${apiKey.substring(0, 6)}…)`);
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
      <p style="margin:0;font-size:13px;color:#9ca3af;">Base Pages · base-pages.com</p>
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
    <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">In the meantime, feel free to check out our latest work at <a href="https://base-pages.com/works" style="color:#111827;font-weight:500;">base-pages.com/works</a>.</p>
    <p style="margin:24px 0 0;font-size:16px;color:#374151;">— The Base Pages Team</p>
  `),
  de: (d) => wrapInLayout(`
    <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">Hallo ${d.name}!</h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.</p>
    <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">Schauen Sie sich in der Zwischenzeit unsere neuesten Arbeiten an: <a href="https://base-pages.com/de/works" style="color:#111827;font-weight:500;">base-pages.com/de/works</a>.</p>
    <p style="margin:24px 0 0;font-size:16px;color:#374151;">— Das Base Pages Team</p>
  `),
  es: (d) => wrapInLayout(`
    <h2 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#111827;">¡Hola ${d.name}!</h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Hemos recibido tu mensaje y te responderemos en un plazo de 24 horas.</p>
    <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">Mientras tanto, echá un vistazo a nuestros últimos proyectos en <a href="https://base-pages.com/es/works" style="color:#111827;font-weight:500;">base-pages.com/es/works</a>.</p>
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
 * Now AWAITED — errors propagate to the action handler.
 */
export async function sendClientEmail(lang: Language, data: ClientData): Promise<void> {
  const subject = SUBJECT_LINES[lang];
  const html = CLIENT_TEMPLATES[lang](data);

  const resend = getResendClient();

  console.log(`[RESEND] Sending auto-responder to ${data.email} (${lang})…`);
  const { data: result, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: data.email,
    subject,
    html,
  });

  if (error) {
    console.error(`[RESEND] ❌ Client email failed:`, JSON.stringify(error));
    throw new Error(`Resend API error (client email): ${JSON.stringify(error)}`);
  }

  console.log(`[RESEND] ✓ Sent auto-responder to ${data.email} (${lang}), id=${result?.id}`);
}

/**
 * Send an internal notification email with all lead data.
 * Now AWAITED — errors propagate to the action handler.
 */
export async function sendInternalNotification(data: Record<string, string | undefined>): Promise<void> {
  const leadName = data.name || 'Unknown';
  const subject = getLeadRadarSubject(data.interest, leadName);
  const html = buildInternalHtml(data);

  const resend = getResendClient();

  console.log(`[RESEND] Sending Lead Radar notification: ${subject}…`);
  const { data: result, error } = await resend.emails.send({
    from: LEAD_RADAR_FROM,
    to: INTERNAL_TO,
    replyTo: data.email,
    subject,
    html,
  });

  if (error) {
    console.error(`[RESEND] ❌ Internal notification failed:`, JSON.stringify(error));
    throw new Error(`Resend API error (internal notification): ${JSON.stringify(error)}`);
  }

  console.log(`[RESEND] ✓ Lead Radar notification sent → ${subject}, id=${result?.id}`);
}

// ─── Lead Radar: Dynamic Subject Line Formula ──────────────────────
// Maps the incoming "interest" (package/tier) to an instantly
// identifiable subject line in the founder's inbox.
function getLeadRadarSubject(interest: string | undefined, name: string): string {
  const val = (interest || '').toLowerCase();

  // Premium "Machine" — the €3,800 flagship (matches "scale" or "premium")
  if (val.includes('scale') || val.includes('premium'))
    return `[🔥 PREMIUM - €3,800] New Lead: ${name}`;

  // Growth Package
  if (val.includes('growth'))
    return `[⚡ GROWTH] New Lead: ${name}`;

  // Starter Package
  if (val.includes('starter'))
    return `[🌱 STARTER] New Lead: ${name}`;

  // Continuous Care retainer
  if (val.includes('care') || val.includes('cuidado') || val.includes('betreuung'))
    return `[🛠️ CARE] New Lead: ${name}`;

  // Partnership / White-label
  if (val.includes('partnership') || val.includes('white-label') || val.includes('marca blanca') || val.includes('partnerschaft'))
    return `[🤝 PARTNERSHIP] New Lead: ${name}`;

  // Catch-all: General inquiry
  return `[📩 GENERAL] New Lead: ${name}`;
}
