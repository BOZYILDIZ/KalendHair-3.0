import { db } from '@/shared/db/client'
import { appointments, closedDays, employeeSchedules, salonSchedules } from '@/shared/db/schema'
import { and, eq, or } from 'drizzle-orm'
import type { SlotCheckInput, TimeSlot } from './types'

// Vérifie si un créneau est disponible — règle métier centrale
export async function checkSlotAvailability(input: SlotCheckInput): Promise<boolean> {
  const { salonId, employeeId, date, startTime, endTime } = input
  const dayOfWeek = getDayOfWeek(date)

  // 1. Vérifier jour de fermeture
  const closed = await db.query.closedDays.findFirst({
    where: and(
      eq(closedDays.salonId, salonId),
      eq(closedDays.date, date),
      or(eq(closedDays.employeeId, employeeId), eq(closedDays.employeeId, 0))
    ),
  })
  if (closed) return false

  // 2. Vérifier horaires de l'employé ce jour
  const empSchedule = await db.query.employeeSchedules.findFirst({
    where: and(eq(employeeSchedules.employeeId, employeeId), eq(employeeSchedules.dayOfWeek, dayOfWeek)),
  })
  if (empSchedule && !empSchedule.isWorking) return false
  if (empSchedule?.startTime && empSchedule?.endTime) {
    if (startTime < empSchedule.startTime || endTime > empSchedule.endTime) return false
  }

  // 3. Vérifier conflits avec RDV existants
  const conflicts = await db.query.appointments.findMany({
    where: and(
      eq(appointments.salonId, salonId),
      eq(appointments.employeeId, employeeId),
      eq(appointments.appointmentDate, date),
      or(
        eq(appointments.status, 'confirmed'),
        eq(appointments.status, 'pending'),
      ),
    ),
  })

  for (const rdv of conflicts) {
    if (timesOverlap(startTime, endTime, rdv.startTime, rdv.endTime)) {
      return false
    }
  }

  return true
}

// Génère les créneaux disponibles pour un employé/service/date
export async function getAvailableSlots(
  salonId: number,
  employeeId: number,
  date: string,
  durationMinutes: number,
  slotIntervalMinutes = 15,
): Promise<TimeSlot[]> {
  const dayOfWeek = getDayOfWeek(date)

  const schedule = await db.query.salonSchedules.findFirst({
    where: and(eq(salonSchedules.salonId, salonId), eq(salonSchedules.dayOfWeek, dayOfWeek)),
  })

  if (!schedule?.isOpen || !schedule.openTime || !schedule.closeTime) return []

  const slots: TimeSlot[] = []
  let current = timeToMinutes(schedule.openTime)
  const close = timeToMinutes(schedule.closeTime) - durationMinutes

  while (current <= close) {
    const startTime = minutesToTime(current)
    const endTime = minutesToTime(current + durationMinutes)

    // Exclure la pause déjeuner
    if (schedule.breakStartTime && schedule.breakEndTime) {
      const breakStart = timeToMinutes(schedule.breakStartTime)
      const breakEnd = timeToMinutes(schedule.breakEndTime)
      if (current >= breakStart && current < breakEnd) {
        current += slotIntervalMinutes
        continue
      }
    }

    const available = await checkSlotAvailability({ salonId, employeeId, date, startTime, endTime })
    slots.push({ startTime, endTime, available })
    current += slotIntervalMinutes
  }

  return slots
}

// ─── Helpers privés ──────────────────────────────────────────────────────────

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr)
  const day = date.getDay()
  return day === 0 ? 6 : day - 1 // 0=Lundi, 6=Dimanche
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number) as [number, number]
  return h * 60 + m
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function timesOverlap(s1: string, e1: string, s2: string, e2: string): boolean {
  return s1 < e2 && e1 > s2
}
