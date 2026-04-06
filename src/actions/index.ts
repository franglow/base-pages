import { defineAction } from 'astro:actions';
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
      websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
      adSpend: z.string().optional(),
      channels: z.string().optional(),
      conversionGoal: z.string().optional(),
      // Scale Package briefing fields (optional — only present when Scale is selected)
      cmsPreference: z.string().optional(),
      pageScope: z.string().optional(),
      scaleFeatures: z.string().optional(),
      launchTimeline: z.string().optional(),
      // Partnership vetting fields (optional — only present when Partnership is selected)
      portfolioUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
      designTool: z.string().optional(),
      projectVolume: z.string().optional(),
      figmaSample: z.string().optional(),
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      // Fire-and-forget: client auto-responder (localized)
      sendClientEmail(lang, {
        name: input.name,
        email: input.email,
      });

      // Determine lead tier
      const interestLower = input.interest.toLowerCase();
      const isGrowthLead = interestLower.includes('growth');
      const isScaleLead = interestLower.includes('scale');
      const isPartnershipLead = interestLower.includes('partnership') || interestLower.includes('white-label') || interestLower.includes('marca blanca') || interestLower.includes('white-label');

      // Fire-and-forget: internal lead notification
      sendInternalNotification({
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
        // Scale-specific fields (only included when present)
        ...(isScaleLead && {
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
      });

      return { success: true, isScale: isScaleLead, isPartnership: isPartnershipLead };
    },
  }),
};
