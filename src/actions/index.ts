import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { sendClientEmail, sendInternalNotification } from '../utils/resend';
import type { Language } from '../i18n/config';

export const server = {
  submitStarter: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      message: z.string().min(10),
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      // Fire-and-forget: client auto-responder
      sendClientEmail('starter', lang, {
        name: input.name,
        email: input.email,
      });

      // Fire-and-forget: internal notification
      sendInternalNotification('starter', {
        name: input.name,
        email: input.email,
        message: input.message,
        lang,
      });

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
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      sendClientEmail('growth', lang, {
        name: input.name,
        email: input.email,
        adsPlatform: input.adsPlatform,
      });

      sendInternalNotification('growth', {
        name: input.name,
        email: input.email,
        adBudget: input.adBudget,
        roiGoals: input.roiGoals,
        adsPlatform: input.adsPlatform,
        lang,
      });

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
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      sendClientEmail('scale', lang, {
        name: input.name,
        email: input.email,
      });

      sendInternalNotification('scale', {
        name: input.name,
        email: input.email,
        cmsPreference: input.cmsPreference,
        integrations: input.integrations,
        timeline: input.timeline,
        lang,
      });

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
      lang: z.enum(['en', 'de', 'es']).default('en'),
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      sendClientEmail('partnership', lang, {
        name: input.name,
        email: input.email,
      });

      sendInternalNotification('partnership', {
        name: input.name,
        email: input.email,
        figmaProcess: input.figmaProcess,
        teamSize: input.teamSize,
        portfolioUrl: input.portfolioUrl,
        lang,
      });

      return { success: true, tier: 'partnership' as const, leadName: input.name, leadEmail: input.email };
    },
  }),
};
