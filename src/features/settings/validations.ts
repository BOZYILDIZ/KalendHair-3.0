import { z } from 'zod'

const optionalString = z.string().optional().or(z.literal('')).transform(v => v || null)

export const salonInfoSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100).optional(),
  description: optionalString,
  phone: optionalString,
  address: optionalString,
  postalCode: optionalString,
  city: optionalString,
  email: z.union([
    z.string().email('Email invalide'),
    z.literal(''),
    z.undefined(),
  ]).transform(v => v || null),
})

export type SalonInfoFormValues = z.infer<typeof salonInfoSchema>

const scheduleItemSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  openTime: optionalString,
  closeTime: optionalString,
  breakStartTime: optionalString,
  breakEndTime: optionalString,
})

export const schedulesSchema = z.array(scheduleItemSchema)
  .min(1, 'Au moins un horaire requis')
  .max(7)

export type ScheduleFormValues = z.infer<typeof schedulesSchema>
