import { z } from 'zod'

export const createAppointmentSchema = z.object({
  employeeId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM requis'),
  clientAccountId: z.number().int().positive().optional(),
  guestFirstName: z.string().min(1).max(100).optional(),
  guestLastName: z.string().min(1).max(100).optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
}).refine(
  (d) => d.clientAccountId || (d.guestFirstName && d.guestLastName),
  { message: 'Un compte client ou des infos invité sont requis' }
)

export const updateAppointmentSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
  notes: z.string().max(1000).optional(),
  cancelReason: z.string().max(500).optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
