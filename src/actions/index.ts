import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

// Note: Resend integration is stubbed — replace with actual API calls when ready
async function sendEmail(to: string, subject: string, html: string) {
  // TODO: Wire up Resend when API key is available
  // import { Resend } from 'resend';
  // const resend = new Resend(import.meta.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'hello@basepages.dev', to, subject, html });
  console.log(`[EMAIL STUB] To: ${to}, Subject: ${subject}`);
}

async function sendInternalNotification(tier: string, data: Record<string, string>) {
  // TODO: Wire up Resend for internal notifications
  console.log(`[INTERNAL NOTIFICATION] Tier: ${tier}`, data);
}

export const server = {
  submitStarter: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      // Send auto-responder to client
      await sendEmail(
        input.email,
        'Thanks for reaching out! — Base Pages',
        `<h2>Hi ${input.name}!</h2><p>We've received your message and will get back to you within 24 hours.</p><p>— The Base Pages Team</p>`
      );

      // Internal notification
      await sendInternalNotification('starter', input);

      return { success: true, tier: 'starter' as const };
    },
  }),

  submitGrowth: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      adBudget: z.string().min(1),
      roiGoals: z.string().min(10),
      adsPlatform: z.string().min(1),
    }),
    handler: async (input) => {
      // Send qualification email
      await sendEmail(
        input.email,
        "Let's grow your ROI — Base Pages",
        `<h2>Hi ${input.name}!</h2><p>Thanks for sharing your growth goals. We'd love to discuss how we can help you scale your ${input.adsPlatform} campaigns.</p><p>Book your 20-minute strategy call to get started.</p><p>— The Base Pages Team</p>`
      );

      await sendInternalNotification('growth', input);

      return { success: true, tier: 'growth' as const, leadName: input.name, leadEmail: input.email };
    },
  }),

  submitScale: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      cmsPreference: z.string().min(1),
      integrations: z.string().min(1),
      timeline: z.string().min(1),
    }),
    handler: async (input) => {
      // Internal notification only (no auto-responder — they'll book a call)
      await sendInternalNotification('scale', input);

      return { success: true, tier: 'scale' as const, leadName: input.name, leadEmail: input.email };
    },
  }),

  submitPartnership: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      figmaProcess: z.string().min(10),
      teamSize: z.string().min(1),
      portfolioUrl: z.string().optional(),
    }),
    handler: async (input) => {
      await sendInternalNotification('partnership', input);

      return { success: true, tier: 'partnership' as const, leadName: input.name, leadEmail: input.email };
    },
  }),
};
