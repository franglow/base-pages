import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { sendClientEmail, sendInternalNotification } from '../utils/resend';
import type { Language } from '../i18n/config';

export const server = {
  submitContact: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      interest: z.string().min(1, 'Please select an interest'),
      budget: z.string().optional(),
      message: z.string().min(10, 'Message must be at least 10 characters'),
      lang: z.enum(['en', 'de', 'es']).default('en'),
      // Growth Package qualification fields (optional — only present when Growth is selected)
      websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable().transform(v => v ?? undefined),
      adSpend: z.string().optional(),
      channels: z.string().optional(),
      conversionGoal: z.string().optional(),
      // Scale Package briefing fields (optional — only present when Scale is selected)
      cmsPreference: z.string().optional(),
      pageScope: z.string().optional(),
      scaleFeatures: z.string().optional(),
      launchTimeline: z.string().optional(),
      // Partnership vetting fields (optional — only present when Partnership is selected)
      portfolioUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable().transform(v => v ?? undefined),
      designTool: z.string().optional(),
      projectVolume: z.string().optional(),
      figmaSample: z.string().optional(),
      // Continuous Care fields (optional — only present when Care is selected)
      careWebsiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable().transform(v => v ?? undefined),
      carePlatform: z.string().optional(),
      carePriority: z.string().optional(),
      careOrigin: z.string().optional(),
    }),
    handler: async (input) => {
      console.log('[ACTION] ✦ submitContact triggered', JSON.stringify({
        name: input.name,
        email: input.email,
        interest: input.interest,
        lang: input.lang,
      }));

      const lang = input.lang as Language;

      // ── Lead Radar: Tier detection ──────────────────────────────────
      const interestLower = input.interest.toLowerCase();
      const isPremium = interestLower.includes('scale') || interestLower.includes('premium');
      const isGrowthLead = interestLower.includes('growth');
      const isStarterLead = interestLower.includes('starter');
      const isPartnershipLead = interestLower.includes('partnership') || interestLower.includes('white-label') || interestLower.includes('marca blanca') || interestLower.includes('partnerschaft');
      const isCareLead = interestLower.includes('care') || interestLower.includes('cuidado') || interestLower.includes('betreuung');

      const tier = isPremium ? 'premium'
          : isGrowthLead ? 'growth'
          : isStarterLead ? 'starter'
          : isPartnershipLead ? 'partnership'
          : isCareLead ? 'care'
          : 'general';

      // ── Send emails — AWAITED, errors surface ─────────────────────
      try {
        // Send client auto-responder (localized)
        await sendClientEmail(lang, {
          name: input.name,
          email: input.email,
        });
        console.log('[ACTION] ✓ Client auto-responder sent');
      } catch (err) {
        console.error('[ACTION] ❌ Client auto-responder failed:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send confirmation email: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      try {
        // Send internal Lead Radar notification
        await sendInternalNotification({
          name: input.name,
          email: input.email,
          interest: input.interest,
          budget: input.budget,
          message: input.message,
          lang,
          // Growth-specific fields (only included when present)
          ...(isGrowthLead && {
            websiteUrl: input.websiteUrl,
            adSpend: input.adSpend,
            channels: input.channels,
            conversionGoal: input.conversionGoal,
          }),
          // Premium/Scale-specific fields (only included when present)
          ...(isPremium && {
            cmsPreference: input.cmsPreference,
            pageScope: input.pageScope,
            scaleFeatures: input.scaleFeatures,
            launchTimeline: input.launchTimeline,
          }),
          // Partnership-specific fields (only included when present)
          ...(isPartnershipLead && {
            portfolioUrl: input.portfolioUrl,
            designTool: input.designTool,
            projectVolume: input.projectVolume,
            figmaSample: input.figmaSample,
          }),
          // Care-specific fields (only included when present)
          ...(isCareLead && {
            careWebsiteUrl: input.careWebsiteUrl,
            carePlatform: input.carePlatform,
            carePriority: input.carePriority,
            careOrigin: input.careOrigin,
          }),
        });
        console.log('[ACTION] ✓ Internal Lead Radar notification sent');
      } catch (err) {
        // Internal notification failure is non-critical — log but don't block
        console.error('[ACTION] ⚠ Internal notification failed (non-blocking):', err);
      }

      // Map tier to Cal.com embed type (only scale and partnership get embeds)
      const calType = isPremium ? 'scale' : isPartnershipLead ? 'partnership' : null;

      console.log(`[ACTION] ✓ submitContact complete — tier=${tier}, calType=${calType}`);
      return { success: true, tier, calType, leadName: input.name, leadEmail: input.email };
    },
  }),

  // ── Scale Package: dedicated landing page action ────────────────
  submitScale: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      cmsPreference: z.string().min(1, 'Please select a CMS preference'),
      integrations: z.string().min(5, 'Please describe your integrations'),
      timeline: z.string().min(1, 'Please select a timeline'),
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      console.log('[ACTION] ✦ submitScale triggered', JSON.stringify({
        name: input.name, email: input.email,
      }));

      const lang = input.lang as Language;

      try {
        await sendClientEmail(lang, { name: input.name, email: input.email });
        console.log('[ACTION] ✓ Scale client auto-responder sent');
      } catch (err) {
        console.error('[ACTION] ❌ Scale client email failed:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send confirmation email: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      try {
        await sendInternalNotification({
          name: input.name,
          email: input.email,
          interest: 'Scale Package — Landing Page',
          message: `CMS: ${input.cmsPreference}\nIntegrations: ${input.integrations}\nTimeline: ${input.timeline}`,
          lang,
        });
        console.log('[ACTION] ✓ Scale internal notification sent');
      } catch (err) {
        console.error('[ACTION] ⚠ Scale internal notification failed (non-blocking):', err);
      }

      return { success: true, leadName: input.name, leadEmail: input.email };
    },
  }),

  // ── Partnership: dedicated landing page action ──────────────────
  submitPartnership: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      figmaProcess: z.string().min(10, 'Please describe your design workflow'),
      teamSize: z.string().min(1, 'Please select a team size'),
      portfolioUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')).nullable().transform(v => v ?? undefined),
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      console.log('[ACTION] ✦ submitPartnership triggered', JSON.stringify({
        name: input.name, email: input.email,
      }));

      const lang = input.lang as Language;

      try {
        await sendClientEmail(lang, { name: input.name, email: input.email });
        console.log('[ACTION] ✓ Partnership client auto-responder sent');
      } catch (err) {
        console.error('[ACTION] ❌ Partnership client email failed:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send confirmation email: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      try {
        await sendInternalNotification({
          name: input.name,
          email: input.email,
          interest: 'Partnership — Landing Page',
          message: `Figma Process: ${input.figmaProcess}\nTeam Size: ${input.teamSize}\nPortfolio: ${input.portfolioUrl || 'Not provided'}`,
          lang,
        });
        console.log('[ACTION] ✓ Partnership internal notification sent');
      } catch (err) {
        console.error('[ACTION] ⚠ Partnership internal notification failed (non-blocking):', err);
      }

      return { success: true, leadName: input.name, leadEmail: input.email };
    },
  }),
};
