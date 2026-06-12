import React from 'react'
import { db } from '@/shared/db/client'
import { appointments, cancellationTokens, salons, employees, services } from '@/shared/db/schema'
import { eq, and } from 'drizzle-orm'
import type { CreateAppointmentInput, UpdateAppointmentInput } from './types'
import { AppError } from '@/shared/errors'
import { checkSlotAvailability } from '@/features/calendar/slots'
import { addMinutes, format } from 'date-fns'
import { generateCancellationToken, tokenExpiresAt } from './token'
import { sendEmail } from '@/shared/email/resend'
import AppointmentConfirmation from '@/shared/email/templates/AppointmentConfirmation'

export async function createAppointment(salonId: number, input: CreateAppointmentInput) {
  // 1. Récupérer la durée du service
  const service = await db.query.services.findFirst({
    where: (s, { eq, and }) => and(eq(s.id, input.serviceId), eq(s.salonId, salonId)),
  })
  if (!service) throw new AppError('SERVICE_NOT_FOUND', 'Service introuvable')
  if (!service.isActive) throw new AppError('SERVICE_INACTIVE', 'Service inactif')

  // 2. Calculer l'heure de fin
  const [h, m] = input.startTime.split(':').map(Number) as [number, number]
  const startDate = new Date(2000, 0, 1, h, m)
  const endDate = addMinutes(startDate, service.durationMinutes)
  const endTime = format(endDate, 'HH:mm')

  // 3. Vérifier la disponibilité
  const available = await checkSlotAvailability({
    salonId,
    employeeId: input.employeeId,
    date: input.appointmentDate,
    startTime: input.startTime,
    endTime,
  })
  if (!available) throw new AppError('SLOT_UNAVAILABLE', 'Ce créneau n\'est plus disponible')

  // 4. Créer le RDV
  const [created] = await db.insert(appointments).values({
    salonId,
    employeeId: input.employeeId,
    serviceId: input.serviceId,
    clientAccountId: input.clientAccountId ?? null,
    appointmentDate: input.appointmentDate,
    startTime: input.startTime,
    endTime,
    guestFirstName: input.guestFirstName ?? null,
    guestLastName: input.guestLastName ?? null,
    guestEmail: input.guestEmail ?? null,
    guestPhone: input.guestPhone ?? null,
    notes: input.notes ?? null,
    status: 'confirmed',
  }).returning()

  const token = generateCancellationToken()
  await db.insert(cancellationTokens).values({
    appointmentId: created!.id,
    token,
    expiresAt: tokenExpiresAt(),
  })

  // Send confirmation email to guest (fire-and-forget)
  const recipientEmail = input.guestEmail ?? null
  if (recipientEmail) {
    const clientName = `${input.guestFirstName ?? ''} ${input.guestLastName ?? ''}`.trim() || 'Client'
    const [y, mo, d] = created!.appointmentDate.split('-').map(Number)
    const appointmentDate = new Date(y!, mo! - 1, d!).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
    const cancellationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/annulation/${token}`

    Promise.all([
      db.query.salons.findFirst({ where: eq(salons.id, salonId), columns: { name: true } }),
      db.query.employees.findFirst({ where: eq(employees.id, input.employeeId), columns: { firstName: true, lastName: true } }),
      db.query.services.findFirst({ where: eq(services.id, input.serviceId), columns: { name: true } }),
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
          startTime: created!.startTime.slice(0, 5),
          cancellationUrl,
        }),
      })
    ).catch(() => { /* fire-and-forget */ })
  }

  return { ...created!, cancellationToken: token }
}

export async function updateAppointmentStatus(
  id: number,
  salonId: number,
  input: UpdateAppointmentInput
) {
  const [updated] = await db
    .update(appointments)
    .set({
      status: input.status,
      notes: input.notes,
      cancelReason: input.cancelReason ?? null,
      cancelledAt: input.status === 'cancelled' ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(appointments.id, id), eq(appointments.salonId, salonId)))
    .returning()

  if (!updated) throw new AppError('APPOINTMENT_NOT_FOUND', 'Rendez-vous introuvable')
  return updated
}
