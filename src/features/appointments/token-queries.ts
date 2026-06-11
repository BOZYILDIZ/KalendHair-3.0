import { db } from '@/shared/db/client'
import { cancellationTokens, appointments, employees, services } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'

export type AppointmentByTokenResult = {
  tokenId: number
  appointmentId: number
  token: string
  expiresAt: Date
  usedAt: Date | null
  appointment: {
    id: number
    status: string
    appointmentDate: string
    startTime: string
    endTime: string
    salonId: number
    guestFirstName: string | null
    guestLastName: string | null
    guestEmail: string | null
    employeeName: string
    serviceName: string
  }
}

export async function getAppointmentByToken(
  token: string
): Promise<AppointmentByTokenResult | null> {
  const rows = await db
    .select({
      tokenId: cancellationTokens.id,
      appointmentId: cancellationTokens.appointmentId,
      token: cancellationTokens.token,
      expiresAt: cancellationTokens.expiresAt,
      usedAt: cancellationTokens.usedAt,
      apptId: appointments.id,
      status: appointments.status,
      appointmentDate: appointments.appointmentDate,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      salonId: appointments.salonId,
      guestFirstName: appointments.guestFirstName,
      guestLastName: appointments.guestLastName,
      guestEmail: appointments.guestEmail,
      employeeFirstName: employees.firstName,
      employeeLastName: employees.lastName,
      serviceName: services.name,
    })
    .from(cancellationTokens)
    .innerJoin(appointments, eq(cancellationTokens.appointmentId, appointments.id))
    .innerJoin(employees, eq(appointments.employeeId, employees.id))
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(eq(cancellationTokens.token, token))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  return {
    tokenId: row.tokenId,
    appointmentId: row.appointmentId,
    token: row.token,
    expiresAt: row.expiresAt,
    usedAt: row.usedAt,
    appointment: {
      id: row.apptId,
      status: row.status,
      appointmentDate: row.appointmentDate,
      startTime: row.startTime,
      endTime: row.endTime,
      salonId: row.salonId,
      guestFirstName: row.guestFirstName,
      guestLastName: row.guestLastName,
      guestEmail: row.guestEmail,
      employeeName: `${row.employeeFirstName} ${row.employeeLastName}`,
      serviceName: row.serviceName,
    },
  }
}
