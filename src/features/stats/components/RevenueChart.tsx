'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { WeeklyStats } from '../queries'

interface Props {
  data: WeeklyStats[]
}

function formatWeekLabel(isoDate: string): string {
  if (!isoDate) return ''
  const d = new Date(isoDate)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function formatEuro(value: number): string {
  return `${value.toLocaleString('fr-FR')} €`
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      padding: '0.5rem 0.75rem',
      fontSize: '0.8125rem',
    }}>
      <div style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>
        Sem. {label}
      </div>
      <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>
        {formatEuro(payload[0]?.value ?? 0)}
      </div>
    </div>
  )
}

export function RevenueChart({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatWeekLabel(d.week),
  }))

  return (
    <div className="kh-card" style={{ padding: '1.25rem' }}>
      <div style={{
        fontFamily: 'var(--font-playfair), serif',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '1rem',
      }}>
        CA hebdomadaire
      </div>

      {chartData.length === 0 ? (
        <div style={{
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}>
          Aucune donnée disponible
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={24} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(193,122,74,0.08)' }} />
            <Bar dataKey="revenue" fill="#C17A4A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
