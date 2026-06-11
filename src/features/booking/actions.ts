'use server'
import { db } from '@/shared/db/client'
import { appointments, clientAccounts, salonClients } from '@/shared/db/schema'
import { eq, and } from 'drizzle-orm'
import { getAvailableSlots } from '@/features/calendar/slots'
import { actionSuccess, actionError, AppError } from '@/shared/errors'
import { bookingSchema } from './validations'
import { z } from 'zod'

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
      employeeId: input.employeeId,
    })
    return actionSuccess(slots)
  } catch (e) {
    return actionError(new AppError('INTERNAL_ERROR', e instanceof Error ? e.message : 'Erreur inconnue'))
  }
}

export async function createBookingAction(raw: z.infer<typeof bookingSchema>) {
  const parsed = bookingSchema.safeParse(raw)
  if (!parsed.success) return actionError(new AppError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides'))

  const { salonId, serviceId, employeeId, date, startTime, endTime, firstName, lastName, email, phone, notes } = parsed.data

  let clientAccountId: number | null = null
  if (email) {
    const existing = await db.query.clientAccounts.findFirst({
      where: eq(clientAccounts.email, email),
    })
    if (existing) {
      clientAccountId = existing.id
      // Lier au salon si pas encore fait
      const linked = await db.query.salonClients.findFirst({
        where: and(eq(salonClients.salonId, salonId), eq(salonClients.clientAccountId, existing.id)),
      })
      if (!linked) {
        await db.insert(salonClients).values({ salonId, clientAccountId: existing.id })
      }
    } else {
      const hash = Math.random().toString(36).slice(2) // placeholder — remplacer par hashPassword
      const [newClient] = await db.insert(clientAccounts)
        .values({ email, firstName, lastName, phone: phone || null, passwordHash: hash })
        .returning({ id: clientAccounts.id })
      if (newClient) {
        clientAccountId = newClient.id
        await db.insert(salonClients).values({ salonId, clientAccountId: newClient.id })
      }
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

  if (!appt) return actionError(new AppError('INTERNAL_ERROR', 'Impossible de créer le rendez-vous'))
  return actionSuccess({ appointmentId: appt.id })
}
