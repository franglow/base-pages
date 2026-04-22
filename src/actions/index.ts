import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { sendClientEmail, sendInternalNotification, sendOnePagerEmail } from '../utils/resend';
import type { Language } from '../i18n/config';

const SITE_URL = 'https://base-pages.com';
const VALID_TIERS = ['starter', 'growth', 'scale', 'care', 'partnership'] as const;
type Tier = (typeof VALID_TIERS)[number];

export const server = {
  submitContact: defineAction({
    accept: 'form',
    input: z.object({
      // Two-step marker: '1' = lead capture only (name/email/interest),
      // '2' = full qualification payload including tier-specific fields.
      // Kept informational for analytics; single-request UX preserved.
      step: z.enum(['1', '2']).default('2'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      interest: z.string().min(1, 'Please select an interest'),
      budget: z.string().optional(),
      // Message is optional so step-1-only submissions are valid. When
      // present we still expect something meaningful; clients that fill
      // step 2 keep their free-form message intact.
      message: z.string().optional().default(''),
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
      try {
        console.log('[ACTION] ✦ submitContact triggered', JSON.stringify({
          step: input.step,
          name: input.name,
          email: input.email,
          interest: input.interest,
          lang: input.lang,
        }));

        const lang = input.lang as Language;

        // ── Lead Radar: Tier detection (defensive — Zod validates, but never crash) ─
        const interestLower = input.interest?.toLowerCase() ?? '';
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

        // ── Send client auto-responder (blocking; failure = user-visible error) ─
        try {
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

        // ── Send internal Lead Radar notification (non-blocking) ──────
        const messageForNotification =
          input.message?.trim() ||
          (input.step === '1'
            ? '[Step 1 lead — qualification not completed. Cal booking expected.]'
            : '');

        try {
          await sendInternalNotification({
            name: input.name,
            email: input.email,
            interest: input.interest,
            budget: input.budget,
            message: messageForNotification,
            lang,
            step: input.step,
            ...(isGrowthLead && {
              websiteUrl: input.websiteUrl,
              adSpend: input.adSpend,
              channels: input.channels,
              conversionGoal: input.conversionGoal,
            }),
            ...(isPremium && {
              cmsPreference: input.cmsPreference,
              pageScope: input.pageScope,
              scaleFeatures: input.scaleFeatures,
              launchTimeline: input.launchTimeline,
            }),
            ...(isPartnershipLead && {
              portfolioUrl: input.portfolioUrl,
              designTool: input.designTool,
              projectVolume: input.projectVolume,
              figmaSample: input.figmaSample,
            }),
            ...(isCareLead && {
              careWebsiteUrl: input.careWebsiteUrl,
              carePlatform: input.carePlatform,
              carePriority: input.carePriority,
              careOrigin: input.careOrigin,
            }),
          });
          console.log('[ACTION] ✓ Internal Lead Radar notification sent');
        } catch (err) {
          console.error('[ACTION] ⚠ Internal notification failed (non-blocking):', err);
        }

        const calType = isPremium ? 'scale' : isPartnershipLead ? 'partnership' : null;

        console.log(`[ACTION] ✓ submitContact complete — tier=${tier}, calType=${calType}`);
        return { success: true, tier, calType, leadName: input.name, leadEmail: input.email };
      } catch (err) {
        // Re-throw known ActionErrors so Astro surfaces them cleanly to the form.
        if (err instanceof ActionError) throw err;
        // Any other runtime throw → graceful ActionError instead of HTTP 500.
        console.error('[ACTION] ❌ submitContact unexpected failure:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong processing your request. Please try again in a moment.',
        });
      }
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

  // ── Soft CTA: email the tier one-pager PDF ─────────────────────
  captureEmail: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email('Please enter a valid email'),
      tier: z.enum(VALID_TIERS).default('starter'),
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      console.log('[ACTION] ✦ captureEmail triggered', JSON.stringify({
        email: input.email, tier: input.tier, lang: input.lang,
      }));

      const lang = input.lang as Language;
      const tier = input.tier as Tier;
      const pdfUrl = `${SITE_URL}/one-pagers/${tier}.pdf`;

      try {
        await sendOnePagerEmail(lang, { email: input.email, tier, pdfUrl });
        console.log('[ACTION] ✓ One-pager email sent');
      } catch (err) {
        console.error('[ACTION] ❌ One-pager send failed:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send the one-pager: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      try {
        await sendInternalNotification({
          name: 'PDF download',
          email: input.email,
          interest: `${tier} — one-pager requested`,
          message: `Soft CTA lead — requested ${pdfUrl}`,
          lang,
        });
        console.log('[ACTION] ✓ Soft CTA internal notification sent');
      } catch (err) {
        console.error('[ACTION] ⚠ Soft CTA internal notification failed (non-blocking):', err);
      }

      return { success: true, email: input.email, tier, pdfUrl };
    },
  }),
};
