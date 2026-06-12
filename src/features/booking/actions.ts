'use server'
import React from 'react'
import { db } from '@/shared/db/client'
import { appointments, cancellationTokens, clientAccounts, salonClients, salons, employees, services } from '@/shared/db/schema'
import { eq, and } from 'drizzle-orm'
import { getAvailableSlots } from '@/features/calendar/slots'
import { actionSuccess, actionError, AppError } from '@/shared/errors'
import { bookingSchema } from './validations'
import { z } from 'zod'
import { generateCancellationToken, tokenExpiresAt } from '@/features/appointments/token'
import { hashPassword } from '@/shared/auth/password'
import { sendEmail } from '@/shared/email/resend'
import AppointmentConfirmation from '@/shared/email/templates/AppointmentConfirmation'

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
      // Create a locked account (random password) — client must use "forgot password" to set their own
      const hash = await hashPassword(generateCancellationToken())
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

  // Generate cancellation token
  const token = generateCancellationToken()
  await db.insert(cancellationTokens).values({
    appointmentId: appt.id,
    token,
    expiresAt: tokenExpiresAt(),
  })

  // Send confirmation email (fire-and-forget)
  const recipientEmail = clientAccountId
    ? (await db.query.clientAccounts.findFirst({ where: eq(clientAccounts.id, clientAccountId), columns: { email: true } }))?.email ?? null
    : (email || null)

  if (recipientEmail) {
    const clientName = `${firstName} ${lastName}`.trim() || 'Client'
    const [y, mo, d] = date.split('-').map(Number)
    const appointmentDate = new Date(y!, mo! - 1, d!).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    const cancellationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/annulation/${token}`

    Promise.all([
      db.query.salons.findFirst({ where: eq(salons.id, salonId), columns: { name: true } }),
      db.query.employees.findFirst({ where: eq(employees.id, employeeId), columns: { firstName: true, lastName: true } }),
      db.query.services.findFirst({ where: eq(services.id, serviceId), columns: { name: true } }),
    ]).then(([salonRow, employeeRow, serviceRow]) =>
      sendEmail({
        to: recipientEmail,
        subject: `Confirmation de votre RDV chez ${salonRow?.name ?? 'le salon'}`,
        react: React.createElement(AppointmentConfirmation, {
          clientName,
          salonName: salonRow?.name ?? 'Le salon',
          serviceName: serviceRow?.name ?? 'Service',
          employeeName: `${employeeRow?.firstName ?? ''} ${employeeRow?.lastName ?? ''}`.trim(),
          appointmentDate,
          startTime: startTime.slice(0, 5),
          cancellationUrl,
        }),
      })
    ).catch(() => { /* fire-and-forget */ })
  }

  return actionSuccess({ appointmentId: appt.id })
}
