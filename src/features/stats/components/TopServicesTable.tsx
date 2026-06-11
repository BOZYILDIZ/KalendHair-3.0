import type { TopService } from '../queries'

interface Props {
  data: TopService[]
}

const tdStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
  padding: '0.625rem 1rem 0.625rem 0',
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
  ...extra,
})

export function TopServicesTable({ data }: Props) {
  return (
    <div className="kh-card" style={{ padding: '1.25rem' }}>
      <div style={{
        fontFamily: 'var(--font-playfair), serif',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--color-text)',
        marginBottom: '1rem',
      }}>
        Top services ce mois
      </div>

      {data.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Aucun rendez-vous ce mois.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['Service', 'RDV', 'CA généré'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  paddingBottom: '0.5rem',
                  paddingRight: '1rem',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr
                key={s.name}
                style={{ borderBottom: i < data.length - 1 ? '1px solid var(--color-border)' : undefined }}
              >
                <td style={tdStyle({ color: 'var(--color-text)', fontWeight: 500 })}>{s.name}</td>
                <td style={tdStyle()}>{s.count}</td>
                <td style={{ padding: '0.625rem 0', fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 600 }}>
                  {s.revenue.toLocaleString('fr-FR')} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
