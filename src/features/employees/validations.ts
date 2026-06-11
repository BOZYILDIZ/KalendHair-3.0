import { z } from 'zod'

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().optional().or(z.literal('')).transform(v => v || null),
  phone: z.string().optional().or(z.literal('')).transform(v => v || null),
  role: z.enum(['coiffeur', 'manager', 'owner', 'stagiaire', 'apprenti']).default('coiffeur'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial()
