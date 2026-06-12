import type { MetadataRoute } from 'next'
import { db } from '@/shared/db/client'
import { salons } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kalendhair.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/connexion`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/inscription`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/coiffeur`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const activeSalons = await db
    .select({ slug: salons.slug, citySlug: salons.citySlug })
    .from(salons)
    .where(eq(salons.isActive, true))

  const salonRoutes: MetadataRoute.Sitemap = activeSalons
    .filter(s => s.slug != null)
    .map(s => ({
      url: `${BASE_URL}/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  const seenCitySlugs = new Set<string>()
  const cityRoutes: MetadataRoute.Sitemap = []
  for (const s of activeSalons) {
    if (s.citySlug && !seenCitySlugs.has(s.citySlug)) {
      seenCitySlugs.add(s.citySlug)
      cityRoutes.push({
        url: `${BASE_URL}/coiffeur/${s.citySlug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  return [...staticRoutes, ...salonRoutes, ...cityRoutes]
}
