import { db } from '@/shared/db/client'
import { services } from '@/shared/db/schema'
import { and, eq, asc } from 'drizzle-orm'
import type { Service } from './types'

export async function getServices(salonId: number): Promise<Service[]> {
  return db.query.services.findMany({
    where: and(eq(services.salonId, salonId), eq(services.isActive, true)),
    orderBy: [asc(services.position), asc(services.name)],
  }) as Service[]
}

export async function getServiceById(id: number, salonId: number) {
  return db.query.services.findFirst({
    where: and(eq(services.id, id), eq(services.salonId, salonId)),
  })
}

export async function getServicesByEmployee(employeeId: number, salonId: number): Promise<Service[]> {
  const result = await db.query.employeeServices.findMany({
    where: (es, { eq }) => eq(es.employeeId, employeeId),
    with: {
      service: true,
    },
  })
  return result
    .map(r => r.service)
    .filter(s => s.salonId === salonId && s.isActive) as Service[]
}
