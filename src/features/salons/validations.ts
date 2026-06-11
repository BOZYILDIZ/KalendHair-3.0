import { z } from 'zod'

export const registerSchema = z.object({
  salonName: z.string().min(2).max(100),
  ownerFirstName: z.string().min(1).max(50),
  ownerLastName: z.string().min(1).max(50),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères').max(72),
  phone: z.string().optional(),
  city: z.string().optional(),
})
