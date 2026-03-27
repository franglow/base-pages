import { z } from 'zod';

export const PartnershipSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  figmaProcess: z.string().min(10, 'Please describe your Figma workflow'),
  teamSize: z.string().min(1, 'Please specify your team size'),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').or(z.literal('')),
});

export type PartnershipFormData = z.infer<typeof PartnershipSchema>;
