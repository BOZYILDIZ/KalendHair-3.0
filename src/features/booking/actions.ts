'use server'
import { db } from '@/shared/db/client'
import { appointments, clientAccounts } from '@/shared/db/schema'
import { eq, and } from 'drizzle-orm'
import { getAvailableSlots } from '@/features/calendar/slots'
import { actionSuccess, actionError } from '@/shared/errors'
import { bookingSchema } from './validations'
import { z } from 'zod'

// Récupère les créneaux dispos pour un jour / service / employé
export async function getSlotsAction(input: {
  salonId: number
  date: string
  serviceId: number
  employeeId: number | null
}) {
  try {
    const slots = await getAvailableSlots({
      salonId: input.salonId,
      date: input.date,
      serviceId: input.serviceId,
      employeeId: input.employeeId ?? undefined,
    })
    return actionSuccess(slots)
  } catch (e) {
    return actionError('INTERNAL_ERROR', e instanceof Error ? e.message : 'Erreur inconnue')
  }
}

// Crée le rendez-vous côté client
export async function createBookingAction(raw: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(raw)
  if (!parsed.success) return actionError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides')

  const { salonId, serviceId, employeeId, date, startTime, endTime, firstName, lastName, email, phone, notes } = parsed.data

  // Trouver ou créer un compte client par email
  let clientAccountId: number | null = null
  if (email) {
    const existing = await db.query.clientAccounts.findFirst({
      where: and(eq(clientAccounts.salonId, salonId), eq(clientAccounts.email, email)),
    })
    if (existing) {
      clientAccountId = existing.id
    } else {
      const [newClient] = await db.insert(clientAccounts)
        .values({ salonId, firstName, lastName, email, phone: phone || null })
        .returning({ id: clientAccounts.id })
      clientAccountId = newClient?.id ?? null
    }
  }

  const [appt] = await db.insert(appointments)
    .values({
      salonId,
      serviceId,
      employeeId,
      clientAccountId,
      guestFirstName: clientAccountId ? null : firstName,
      guestLastName: clientAccountId ? null : lastName,
      guestEmail: clientAccountId ? null : (email || null),
      guestPhone: clientAccountId ? null : (phone || null),
      appointmentDate: date,
      startTime,
      endTime,
      status: 'pending',
      notes: notes || null,
    })
    .returning({ id: appointments.id })

  if (!appt) return actionError('INTERNAL_ERROR', 'Impossible de créer le rendez-vous')
  return actionSuccess({ appointmentId: appt.id })
}
