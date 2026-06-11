import { db } from '@/shared/db/client'
import { services } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import type { CreateServiceInput } from './types'

export async function createService(salonId: number, input: CreateServiceInput) {
  const [svc] = await db.insert(services)
    .values({ salonId, ...input })
    .returning()
  return svc
}

export async function updateService(id: number, salonId: number, input: Partial<CreateServiceInput>) {
  const [svc] = await db.update(services)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(services.id, id), eq(services.salonId, salonId)))
    .returning()
  return svc
}

export async function deleteService(id: number, salonId: number) {
  await db.update(services)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(services.id, id), eq(services.salonId, salonId)))
}
