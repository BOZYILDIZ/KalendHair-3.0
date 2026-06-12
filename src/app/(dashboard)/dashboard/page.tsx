import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getStatsToday } from '@/features/stats/queries'
import { getUpcomingAppointments } from '@/features/appointments/queries'
import { DashboardStats } from '@/features/stats/components/DashboardStats'
import { UpcomingAppointments } from '@/features/appointments/components/UpcomingAppointments'

export const metadata: Metadata = { title: 'Tableau de bord' }

export default async function DashboardPage() {
  const salonId = await requireSalonId()

  const [stats, upcoming] = await Promise.all([
    getStatsToday(salonId),
    getUpcomingAppointments(salonId, 5),
  ])

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          Bonjour 👋
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Voici un résumé de votre journée
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', marginTop: '1.5rem' }}>
        <UpcomingAppointments appointments={upcoming} />
        {/* WeekCalendarMini sera ajouté ici */}
        <div className="kh-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Calendrier semaine
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Vue calendrier en cours de développement
          </p>
        </div>
      </div>
    </div>
  )
}
