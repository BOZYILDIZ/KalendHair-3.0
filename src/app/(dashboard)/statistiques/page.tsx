import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getWeeklyStats, getTopServices, getMonthlyComparison } from '@/features/stats/queries'
import { RevenueChart } from '@/features/stats/components/RevenueChart'
import { AppointmentsChart } from '@/features/stats/components/AppointmentsChart'
import { TopServicesTable } from '@/features/stats/components/TopServicesTable'
import { TrendingUp, TrendingDown, Coins, Calendar, Scissors } from 'lucide-react'
import type { ElementType } from 'react'

export const metadata: Metadata = { title: 'Statistiques' }

interface KpiCard {
  label: string
  value: string | number
  icon: ElementType
  badge: 'success' | 'danger' | null
}

export default async function StatistiquesPage() {
  const salonId = await requireSalonId()

  const [weekly, topServices, monthly] = await Promise.all([
    getWeeklyStats(salonId),
    getTopServices(salonId),
    getMonthlyComparison(salonId),
  ])

  const totalApptMonth = weekly.slice(-4).reduce((acc, w) => acc + w.appointments, 0)
  const avgPerAppt = totalApptMonth > 0 ? Math.round(monthly.thisMonth / totalApptMonth) : 0
  const isPos = monthly.growth >= 0

  const kpiCards: KpiCard[] = [
    { label: 'CA ce mois', value: `${monthly.thisMonth.toLocaleString('fr-FR')} €`, icon: Coins, badge: null },
    { label: 'RDV ce mois', value: totalApptMonth, icon: Calendar, badge: null },
    { label: 'CA / RDV moyen', value: `${avgPerAppt} €`, icon: Scissors, badge: null },
    {
      label: 'Croissance vs mois préc.',
      value: `${isPos ? '+' : ''}${monthly.growth} %`,
      icon: isPos ? TrendingUp : TrendingDown,
      badge: isPos ? 'success' : 'danger',
    },
  ]

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}>
          Statistiques
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Analyse de votre activité sur les 8 dernières semaines
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {kpiCards.map(({ label, value, icon: Icon, badge }) => (
          <div key={label} className="kh-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon size={15} color="var(--color-primary)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                {label}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
                {value}
              </div>
              {badge && (
                <span className={badge === 'success' ? 'kh-badge-success' : 'kh-badge-danger'}>
                  {badge === 'success' ? 'hausse' : 'baisse'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <RevenueChart data={weekly} />
        <AppointmentsChart data={weekly} />
      </div>

      {/* Top services */}
      <TopServicesTable data={topServices} />
    </div>
  )
}
