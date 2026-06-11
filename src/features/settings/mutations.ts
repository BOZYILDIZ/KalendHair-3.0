import { db } from '@/shared/db/client'
import { salons, salonSchedules } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import type { UpdateSalonInfoInput, ScheduleInput } from './types'

export async function updateSalonInfo(
  salonId: number,
  data: UpdateSalonInfoInput,
): Promise<void> {
  await db
    .update(salons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(salons.id, salonId))
}

export async function upsertSchedules(
  salonId: number,
  schedules: ScheduleInput[],
): Promise<void> {
  for (const schedule of schedules) {
    const existing = await db.query.salonSchedules.findFirst({
      where: and(
        eq(salonSchedules.salonId, salonId),
        eq(salonSchedules.dayOfWeek, schedule.dayOfWeek),
      ),
    })

    const values = {
      salonId,
      dayOfWeek: schedule.dayOfWeek,
      isOpen: schedule.isOpen,
      openTime: schedule.openTime ?? null,
      closeTime: schedule.closeTime ?? null,
      breakStartTime: schedule.breakStartTime ?? null,
      breakEndTime: schedule.breakEndTime ?? null,
    }

    if (existing) {
      await db
        .update(salonSchedules)
        .set(values)
        .where(eq(salonSchedules.id, existing.id))
    } else {
      await db.insert(salonSchedules).values(values)
    }
  }
}
