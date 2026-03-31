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
    }),
    handler: async (input) => {
      const lang = input.lang as Language;

      // Fire-and-forget: client auto-responder (localized)
      sendClientEmail(lang, {
        name: input.name,
        email: input.email,
      });

      // Fire-and-forget: internal lead notification
      sendInternalNotification({
        name: input.name,
        email: input.email,
        interest: input.interest,
        budget: input.budget,
        message: input.message,
        lang,
      });

      return { success: true };
    },
  }),
};
