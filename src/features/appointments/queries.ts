import { db } from '@/shared/db/client'
import { appointments, employees, services, clientAccounts } from '@/shared/db/schema'
import { eq, and, gte, lte, desc, asc } from 'drizzle-orm'
import type { AppointmentWithDetails } from './types'

// Rendez-vous du jour pour un salon
export async function getTodayAppointments(salonId: number): Promise<AppointmentWithDetails[]> {
  const today = new Date().toISOString().split('T')[0]!
  return getAppointmentsByDate(salonId, today)
}

// Rendez-vous pour une date donnée
export async function getAppointmentsByDate(salonId: number, date: string): Promise<AppointmentWithDetails[]> {
  return db.query.appointments.findMany({
    where: and(eq(appointments.salonId, salonId), eq(appointments.appointmentDate, date)),
    with: {
      employee: { columns: { id: true, firstName: true, lastName: true, color: true } },
      service: { columns: { id: true, name: true, durationMinutes: true, price: true, color: true } },
      client: { columns: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: asc(appointments.startTime),
  }) as AppointmentWithDetails[]
}

// Rendez-vous pour une semaine
export async function getAppointmentsByWeek(salonId: number, weekStart: string, weekEnd: string): Promise<AppointmentWithDetails[]> {
  return db.query.appointments.findMany({
    where: and(
      eq(appointments.salonId, salonId),
      gte(appointments.appointmentDate, weekStart),
      lte(appointments.appointmentDate, weekEnd),
    ),
    with: {
      employee: { columns: { id: true, firstName: true, lastName: true, color: true } },
      service: { columns: { id: true, name: true, durationMinutes: true, price: true, color: true } },
      client: { columns: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: [asc(appointments.appointmentDate), asc(appointments.startTime)],
  }) as AppointmentWithDetails[]
}

// Prochains N rendez-vous (pour le dashboard)
export async function getUpcomingAppointments(salonId: number, limit = 5): Promise<AppointmentWithDetails[]> {
  const today = new Date().toISOString().split('T')[0]!
  return db.query.appointments.findMany({
    where: and(
      eq(appointments.salonId, salonId),
      gte(appointments.appointmentDate, today),
      eq(appointments.status, 'confirmed'),
    ),
    with: {
      employee: { columns: { id: true, firstName: true, lastName: true, color: true } },
      service: { columns: { id: true, name: true, durationMinutes: true, price: true, color: true } },
      client: { columns: { id: true, firstName: true, lastName: true, email: true } },
    },
    orderBy: [asc(appointments.appointmentDate), asc(appointments.startTime)],
    limit,
  }) as AppointmentWithDetails[]
}

// Rendez-vous par ID (avec vérification salonId pour sécurité)
export async function getAppointmentById(id: number, salonId: number) {
  return db.query.appointments.findFirst({
    where: and(eq(appointments.id, id), eq(appointments.salonId, salonId)),
    with: {
      employee: true,
      service: true,
      client: true,
    },
  })
}
