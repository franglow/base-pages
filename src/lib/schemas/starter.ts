import { z } from 'zod';

// Asegura que el email sea profesional (ej. no acepta @gmail.com)
// Opcional, pero recomendado para el ticket de base-pages
const professionalEmail = z.string()
  .email("Invalid email address")
  .refine(email => {
    const disposableDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !disposableDomains.includes(domain.toLowerCase());
  }, "Please use a professional email address (no disposable domains).");

// Esquema de validación para el Formulario Genérico / Starter
export const starterContactFormSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  email: professionalEmail,

  // Validación rígida del interés: debe coincidir EXACTAMENTE con una de las opciones del JSON
  interest: z.enum([
    "The Starter Package (€890)",
    "The Growth Package (€1,750)",
    "The Scale Website (€3,800)",
    "Partnership / White-label",
    "Other / Custom inquiry"
  ], "Please select a valid service package."),

  // El mensaje es opcional en este nivel de baja fricción, pero lo capturamos
  message: z.string().trim().optional(),

  // El presupuesto es opcional para este formulario
  budget: z.string().trim().optional(),
});

// Inferir el tipo para su uso en TypeScript
export type StarterContactFormValues = z.infer<typeof starterContactFormSchema>;