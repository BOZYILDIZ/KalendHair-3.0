import { db } from '@/shared/db/client'
import { salons, services, employees } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import type { PublicSalon, PublicService, PublicEmployee } from './types'

export async function getPublicSalon(slug: string): Promise<PublicSalon | null> {
  const salon = await db.query.salons.findFirst({
    where: and(eq(salons.slug, slug), eq(salons.isActive, true)),
    columns: {
      id: true, name: true, slug: true, description: true,
      address: true, city: true, phone: true, email: true,
      coverUrl: true, averageRating: true, reviewCount: true,
    },
  })
  return (salon ?? null) as unknown as PublicSalon | null
}

export async function getPublicServices(salonId: number): Promise<PublicService[]> {
  return db.query.services.findMany({
    where: and(eq(services.salonId, salonId), eq(services.isActive, true)),
    columns: {
      id: true, name: true, description: true, category: true,
      durationMinutes: true, price: true, priceMin: true, priceMax: true, priceOnQuote: true, color: true,
    },
    orderBy: (s, { asc }) => [asc(s.category), asc(s.name)],
  })
}

export async function getPublicEmployees(salonId: number): Promise<PublicEmployee[]> {
  return db.query.employees.findMany({
    where: and(eq(employees.salonId, salonId), eq(employees.isActive, true)),
    columns: { id: true, firstName: true, lastName: true, color: true, bio: true },
    orderBy: (e, { asc }) => [asc(e.firstName)],
  })
}
