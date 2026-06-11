import type { Service } from '../types'
import { formatServicePrice } from '../types'

interface Props { services: Service[] }

export function ServiceList({ services }: Props) {
  if (services.length === 0) {
    return (
      <div className="kh-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Aucun service — ajoutez vos prestations
      </div>
    )
  }

  const byCategory = services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category ?? 'Autres'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            {category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {items.map(service => (
              <div key={service.id} className="kh-card" style={{
                padding: '0.875rem 1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '0.875rem' }}>{service.name}</div>
                  {service.description && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{service.description}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 16 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{service.durationMinutes} min</span>
                  {service.price && (
                    <span style={{
                      fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)',
                      background: 'var(--color-primary-50)', padding: '0.25rem 0.625rem', borderRadius: 6,
                    }}>
                      {formatServicePrice(service.price)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
