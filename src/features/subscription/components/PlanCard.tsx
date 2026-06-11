import type { PlanDefinition, SubscriptionPlan } from '../types'

interface Props {
  plan: PlanDefinition
  isCurrent: boolean
  currentPlan?: SubscriptionPlan
  recommended?: boolean
}

export function PlanCard({ plan, isCurrent, recommended }: Props) {
  const borderStyle = recommended
    ? '2px solid var(--color-warning)'
    : '1px solid var(--color-border)'

  return (
    <div
      className="kh-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        border: borderStyle,
        boxShadow: recommended ? '0 4px 16px rgba(212, 133, 90, 0.15)' : undefined,
      }}
    >
      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 22 }}>
        {isCurrent && (
          <span className="kh-badge kh-badge-success">Plan actuel</span>
        )}
        {recommended && (
          <span
            className="kh-badge"
            style={{
              background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
            }}
          >
            Recommandé
          </span>
        )}
      </div>

      {/* Name & price */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            margin: 0,
            marginBottom: '0.25rem',
          }}
        >
          {plan.name}
        </h3>
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: recommended ? 'var(--color-warning)' : 'var(--color-primary)',
          }}
        >
          {plan.price}
        </div>
      </div>

      {/* Feature list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {plan.features.map((feature) => (
          <li
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div style={{ marginTop: 'auto' }}>
        {isCurrent ? (
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: 'var(--color-success)',
              fontWeight: 500,
              padding: '0.5rem',
            }}
          >
            Votre plan actuel
          </div>
        ) : (
          <a
            href="/abonnement/checkout"
            className="kh-btn-primary"
            style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', opacity: 0.6, pointerEvents: 'none' }}
            aria-disabled="true"
            tabIndex={-1}
          >
            Passer à ce plan
          </a>
        )}
      </div>
    </div>
  )
}
