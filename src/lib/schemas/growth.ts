import { z } from 'zod';

export const GrowthSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  adBudget: z.string().min(1, 'Please specify your monthly ad budget'),
  roiGoals: z.string().min(10, 'Please describe your ROI goals'),
  adsPlatform: z.string().min(1, 'Please select your primary ads platform'),
});

export type GrowthFormData = z.infer<typeof GrowthSchema>;
