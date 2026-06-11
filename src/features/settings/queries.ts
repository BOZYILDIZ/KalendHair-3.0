import { db } from '@/shared/db/client'
import { salons, salonSchedules } from '@/shared/db/schema'
import { eq, asc } from 'drizzle-orm'
import type { SalonSettings, SalonSchedule } from './types'

export async function getSalonSettings(salonId: number): Promise<SalonSettings | null> {
  const salon = await db.query.salons.findFirst({
    where: eq(salons.id, salonId),
    columns: {
      id: true,
      name: true,
      description: true,
      phone: true,
      address: true,
      postalCode: true,
      city: true,
      email: true,
      logoUrl: true,
      coverUrl: true,
      isActive: true,
      onboardingCompleted: true,
    },
  })

  return salon ?? null
}

export async function getSalonSchedules(salonId: number): Promise<SalonSchedule[]> {
  const rows = await db
    .select()
    .from(salonSchedules)
    .where(eq(salonSchedules.salonId, salonId))
    .orderBy(asc(salonSchedules.dayOfWeek))

  return rows as SalonSchedule[]
}
