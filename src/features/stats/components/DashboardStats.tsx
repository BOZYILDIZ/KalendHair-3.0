import { Calendar, Coins, Star, TrendingUp } from 'lucide-react'
import type { StatsToday } from '../queries'

interface Props {
  stats: StatsToday
}

export function DashboardStats({ stats }: Props) {
  const cards = [
    {
      label: 'RDV aujourd\'hui',
      value: stats.appointmentsCount,
      icon: Calendar,
      trend: null,
    },
    {
      label: 'CA du jour',
      value: `${stats.revenueToday}€`,
      icon: Coins,
      trend: null,
    },
    {
      label: 'Note moyenne',
      value: stats.averageRating ? stats.averageRating.toFixed(1) : '—',
      icon: Star,
      trend: `${stats.reviewsCount} avis`,
    },
    {
      label: 'Taux remplissage',
      value: '—',
      icon: TrendingUp,
      trend: null,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
      {cards.map(({ label, value, icon: Icon, trend }) => (
        <div key={label} className="kh-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon size={15} color="var(--color-primary)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {label}
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
            {value}
          </div>
          {trend && (
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              {trend}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
