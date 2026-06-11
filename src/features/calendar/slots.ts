import { db } from '@/shared/db/client'
import { appointments, closedDays, employeeSchedules, salonSchedules, services } from '@/shared/db/schema'
import { and, eq, isNull, or } from 'drizzle-orm'
import type { SlotCheckInput, TimeSlot } from './types'

export async function checkSlotAvailability(input: SlotCheckInput): Promise<boolean> {
  const { salonId, employeeId, date, startTime, endTime } = input
  const dayOfWeek = getDayOfWeek(date)

  const closed = await db.query.closedDays.findFirst({
    where: and(
      eq(closedDays.salonId, salonId),
      eq(closedDays.date, date),
      or(eq(closedDays.employeeId, employeeId), isNull(closedDays.employeeId))
    ),
  })
  if (closed) return false

  const empSchedule = await db.query.employeeSchedules.findFirst({
    where: and(eq(employeeSchedules.employeeId, employeeId), eq(employeeSchedules.dayOfWeek, dayOfWeek)),
  })
  if (empSchedule && !empSchedule.isWorking) return false
  if (empSchedule?.startTime && empSchedule?.endTime) {
    if (startTime < empSchedule.startTime || endTime > empSchedule.endTime) return false
  }

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

export async function getAvailableSlots(input: {
  salonId: number
  employeeId: number | null | undefined
  date: string
  serviceId: number
  slotIntervalMinutes?: number
}): Promise<TimeSlot[]> {
  const { salonId, date, serviceId, slotIntervalMinutes = 15 } = input
  const employeeId = input.employeeId ?? 0

  const service = await db.query.services.findFirst({
    where: eq(services.id, serviceId),
    columns: { durationMinutes: true },
  })
  if (!service) return []

  const dayOfWeek = getDayOfWeek(date)
  const schedule = await db.query.salonSchedules.findFirst({
    where: and(eq(salonSchedules.salonId, salonId), eq(salonSchedules.dayOfWeek, dayOfWeek)),
  })

  if (!schedule?.isOpen || !schedule.openTime || !schedule.closeTime) return []

  const slots: TimeSlot[] = []
  let current = timeToMinutes(schedule.openTime)
  const close = timeToMinutes(schedule.closeTime) - service.durationMinutes

  while (current <= close) {
    const startTime = minutesToTime(current)
    const endTime = minutesToTime(current + service.durationMinutes)

    if (schedule.breakStartTime && schedule.breakEndTime) {
      const breakStart = timeToMinutes(schedule.breakStartTime)
      const breakEnd = timeToMinutes(schedule.breakEndTime)
      if (current >= breakStart && current < breakEnd) {
        current += slotIntervalMinutes
        continue
      }
    }

    const available = employeeId > 0
      ? await checkSlotAvailability({ salonId, employeeId, date, startTime, endTime })
      : true

    slots.push({ startTime, endTime, available })
    current += slotIntervalMinutes
  }

  return slots
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr)
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
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
