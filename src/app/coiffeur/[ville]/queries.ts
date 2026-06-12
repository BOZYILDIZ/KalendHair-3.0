import { db } from '@/shared/db/client'
import { salons, frenchCities } from '@/shared/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getSalonsByCity(citySlug: string) {
  return db
    .select({
      id: salons.id,
      name: salons.name,
      slug: salons.slug,
      address: salons.address,
      city: salons.city,
      averageRating: salons.averageRating,
      reviewCount: salons.reviewCount,
    })
    .from(salons)
    .where(and(eq(salons.citySlug, citySlug), eq(salons.isActive, true)))
    .limit(20)
}

export async function getCityBySlug(slug: string) {
  return db.query.frenchCities.findFirst({
    where: eq(frenchCities.slug, slug),
  })
}
