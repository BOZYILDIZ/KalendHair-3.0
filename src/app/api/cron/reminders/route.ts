import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/shared/db/client'
import { appointments, clientAccounts, employees, services, salons } from '@/shared/db/schema'
import { sendEmail } from '@/shared/email/resend'
import AppointmentReminder from '@/shared/email/templates/AppointmentReminder'
import React from 'react'

export async function GET(request: NextRequest) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]!

  const rows = await db
    .select({
      id: appointments.id,
      startTime: appointments.startTime,
      guestEmail: appointments.guestEmail,
      guestFirstName: appointments.guestFirstName,
      guestLastName: appointments.guestLastName,
      clientEmail: clientAccounts.email,
      clientFirstName: clientAccounts.firstName,
      clientLastName: clientAccounts.lastName,
      salonName: salons.name,
      serviceName: services.name,
      employeeFirstName: employees.firstName,
      employeeLastName: employees.lastName,
    })
    .from(appointments)
    .leftJoin(clientAccounts, eq(appointments.clientAccountId, clientAccounts.id))
    .innerJoin(employees, eq(appointments.employeeId, employees.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .innerJoin(salons, eq(appointments.salonId, salons.id))
    .where(
      and(
        eq(appointments.appointmentDate, tomorrowStr),
        eq(appointments.reminderSent, false),
        eq(appointments.status, 'confirmed'),
      ),
    )

  let sent = 0

  for (const row of rows) {
    const recipientEmail = row.clientEmail ?? row.guestEmail
    if (!recipientEmail) continue

    const firstName = row.clientFirstName ?? row.guestFirstName ?? ''
    const lastName = row.clientLastName ?? row.guestLastName ?? ''
    const clientName = `${firstName} ${lastName}`.trim()

    const appointmentDate = new Date(tomorrowStr!).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    await sendEmail({
      to: recipientEmail,
      subject: `Rappel — votre RDV demain chez ${row.salonName}`,
      react: React.createElement(AppointmentReminder, {
        clientName,
        salonName: row.salonName,
        serviceName: row.serviceName,
        employeeName: `${row.employeeFirstName} ${row.employeeLastName}`.trim(),
        appointmentDate,
        startTime: row.startTime.slice(0, 5),
      }),
    })

    await db
      .update(appointments)
      .set({ reminderSent: true })
      .where(eq(appointments.id, row.id))

    sent++
  }

  return NextResponse.json({ sent })
}
