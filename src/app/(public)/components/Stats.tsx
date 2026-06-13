const stats = [
  { value: '500+', label: 'salons actifs' },
  { value: '50 000+', label: 'RDV / mois' },
  { value: '4.9/5', label: 'satisfaction client' },
]

export function Stats() {
  return (
    <section style={{
      background: 'var(--color-sidebar)',
      padding: '2.5rem 2rem',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-playfair), serif', marginBottom: '0.25rem', lineHeight: 1 }}>
              {value}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
