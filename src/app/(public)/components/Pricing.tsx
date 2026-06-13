import Link from 'next/link'

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Pour démarrer sans engagement.',
    features: ["Jusqu'à 50 RDV/mois", '1 employé', 'Page publique de réservation', 'Support par email'],
    cta: 'Commencer gratuitement',
    href: '/inscription',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '29€',
    period: '/mois',
    description: 'Pour les salons en croissance.',
    features: ['RDV illimités', "Jusqu'à 10 employés", 'Rappels email automatiques', 'Statistiques avancées', 'Support prioritaire'],
    cta: 'Essayer Pro',
    href: '/inscription?plan=pro',
    highlight: true,
  },
  {
    name: 'Business',
    price: '79€',
    period: '/mois',
    description: 'Pour les groupes multi-salons.',
    features: ['Tout le plan Pro', 'Multi-salons', 'Connecteurs RH (Silae, Factorial)', 'API & webhooks', 'Compte manager dédié'],
    cta: 'Contacter les ventes',
    href: '/contact',
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section id="tarifs" style={{ padding: '5rem 2rem', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontFamily: 'var(--font-playfair), serif', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Des tarifs clairs, sans surprise
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Commencez gratuitement, évoluez quand vous en avez besoin.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {plans.map(({ name, price, period, description, features, cta, href, highlight }) => (
            <div key={name} className="kh-card" style={{
              padding: '2rem',
              border: highlight ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              position: 'relative',
              transform: highlight ? 'scale(1.02)' : 'none',
            }}>
              {highlight && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.875rem', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                  LE PLUS POPULAIRE
                </div>
              )}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: highlight ? 'var(--color-primary)' : 'var(--color-text)', fontFamily: 'var(--font-playfair), serif' }}>{price}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{period}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{description}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={href} style={{
                display: 'block', textAlign: 'center', padding: '0.75rem',
                background: highlight ? 'var(--color-primary)' : 'transparent',
                color: highlight ? '#fff' : 'var(--color-primary)',
                border: highlight ? 'none' : '1.5px solid var(--color-primary)',
                borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none', transition: 'background 0.15s',
              }}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
