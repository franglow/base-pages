import { z } from 'zod';

export const StarterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please describe your project briefly (min 10 characters)'),
});

export type StarterFormData = z.infer<typeof StarterSchema>;
