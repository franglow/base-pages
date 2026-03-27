import { z } from 'zod';

export const ScaleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  cmsPreference: z.string().min(1, 'Please select your preferred CMS'),
  integrations: z.string().min(1, 'Please describe required integrations'),
  timeline: z.string().min(1, 'Please specify your project timeline'),
});

export type ScaleFormData = z.infer<typeof ScaleSchema>;
