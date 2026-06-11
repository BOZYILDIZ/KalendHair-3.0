import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional().or(z.literal('')).transform(v => v || null),
  category: z.string().optional().or(z.literal('')).transform(v => v || null),
  durationMinutes: z.coerce.number().min(5).max(480),
  price: z.coerce.number().min(0).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
})
