import { db } from '@/shared/db/client'
import { appointments, reviews } from '@/shared/db/schema'
import { and, eq, gte, lte, count, avg, sum } from 'drizzle-orm'

export interface StatsToday {
  appointmentsCount: number
  completedCount: number
  cancelledCount: number
  revenueToday: number
  averageRating: number | null
  reviewsCount: number
}

export async function getStatsToday(salonId: number): Promise<StatsToday> {
  const today = new Date().toISOString().split('T')[0]!

  const [apptStats, reviewStats] = await Promise.all([
    db.select({
      total: count(),
      completed: count(appointments.status),
    })
    .from(appointments)
    .where(and(eq(appointments.salonId, salonId), eq(appointments.appointmentDate, today))),

    db.select({
      avg: avg(reviews.rating),
      total: count(),
    })
    .from(reviews)
    .where(and(eq(reviews.salonId, salonId), eq(reviews.isVisible, true))),
  ])

  const appt = apptStats[0]!
  const review = reviewStats[0]!

  return {
    appointmentsCount: Number(appt.total),
    completedCount: 0, // TODO: filter by status
    cancelledCount: 0,
    revenueToday: 0,   // TODO: sum des prix sur RDV terminés
    averageRating: review.avg ? Number(review.avg) : null,
    reviewsCount: Number(review.total),
  }
}
