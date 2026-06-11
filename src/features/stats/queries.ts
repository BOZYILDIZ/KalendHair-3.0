import { db } from '@/shared/db/client'
import { appointments, reviews, services } from '@/shared/db/schema'
import { and, eq, gte, lte, count, avg, sum, sql } from 'drizzle-orm'

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

// ─── Weekly stats (last 8 weeks) ─────────────────────────────────────────────

export interface WeeklyStats {
  week: string
  revenue: number
  appointments: number
}

export async function getWeeklyStats(salonId: number): Promise<WeeklyStats[]> {
  const eightWeeksAgo = new Date()
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)
  const since = eightWeeksAgo.toISOString().split('T')[0]!

  const rows = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${appointments.appointmentDate}::date), 'YYYY-MM-DD')`,
      revenue: sum(appointments.amountPaid),
      appointments: count(),
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.salonId, salonId),
        gte(appointments.appointmentDate, since),
      ),
    )
    .groupBy(sql`date_trunc('week', ${appointments.appointmentDate}::date)`)
    .orderBy(sql`date_trunc('week', ${appointments.appointmentDate}::date)`)

  return rows.map((r) => ({
    week: r.week ?? '',
    revenue: Number(r.revenue ?? 0),
    appointments: Number(r.appointments),
  }))
}

// ─── Top services this month ──────────────────────────────────────────────────

export interface TopService {
  name: string
  count: number
  revenue: number
}

export async function getTopServices(salonId: number): Promise<TopService[]> {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]!
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]!

  const rows = await db
    .select({
      name: services.name,
      count: count(),
      revenue: sum(appointments.amountPaid),
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .where(
      and(
        eq(appointments.salonId, salonId),
        gte(appointments.appointmentDate, firstDay),
        lte(appointments.appointmentDate, lastDay),
      ),
    )
    .groupBy(services.id, services.name)
    .orderBy(sql`count(*) desc`)
    .limit(5)

  return rows.map((r) => ({
    name: r.name,
    count: Number(r.count),
    revenue: Number(r.revenue ?? 0),
  }))
}

// ─── Monthly comparison ───────────────────────────────────────────────────────

export interface MonthlyComparison {
  thisMonth: number
  lastMonth: number
  growth: number
}

export async function getMonthlyComparison(salonId: number): Promise<MonthlyComparison> {
  const now = new Date()
  const thisStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]!
  const thisEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]!
  const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]!
  const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]!

  const [thisRows, lastRows] = await Promise.all([
    db.select({ revenue: sum(appointments.amountPaid), total: count() })
      .from(appointments)
      .where(and(eq(appointments.salonId, salonId), gte(appointments.appointmentDate, thisStart), lte(appointments.appointmentDate, thisEnd))),
    db.select({ revenue: sum(appointments.amountPaid), total: count() })
      .from(appointments)
      .where(and(eq(appointments.salonId, salonId), gte(appointments.appointmentDate, lastStart), lte(appointments.appointmentDate, lastEnd))),
  ])

  const thisMonth = Number(thisRows[0]?.revenue ?? 0)
  const lastMonth = Number(lastRows[0]?.revenue ?? 0)
  const growth = lastMonth === 0 ? 0 : Math.round(((thisMonth - lastMonth) / lastMonth) * 100)

  return { thisMonth, lastMonth, growth }
}
