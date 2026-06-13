import Link from 'next/link'

export function Hero() {
  return (
    <section style={{ position: 'relative', padding: '6rem 2rem 5rem', overflow: 'hidden', background: 'var(--color-bg)' }}>
      {/* Decorative blob */}
      <div aria-hidden style={{
        position: 'absolute', top: '-80px', right: '-100px',
        width: '520px', height: '520px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,122,74,0.12) 0%, rgba(193,122,74,0.04) 60%, transparent 80%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: '-60px', left: '-80px',
        width: '340px', height: '340px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,168,124,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.375rem 0.875rem', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(193,122,74,0.25)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>Nouveau — KalendHair V6</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontFamily: 'var(--font-playfair), serif', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
            La réservation en ligne pour les{' '}
            <span style={{ color: 'var(--color-primary)' }}>salons de coiffure</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2.25rem', maxWidth: '560px' }}>
            Gérez vos rendez-vous, vos équipes et vos clients depuis une seule plateforme.
            Simple, humain, efficace.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/inscription" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.75rem', background: 'var(--color-primary)',
              color: '#fff', textDecoration: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 600, fontSize: '0.9375rem', boxShadow: '0 4px 14px rgba(193,122,74,0.35)',
              transition: 'background 0.15s, transform 0.1s',
            }}>
              Commencer gratuitement
            </Link>
            <Link href="#demo" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              border: '1.5px solid var(--color-border-strong)',
              color: 'var(--color-text)', textDecoration: 'none', borderRadius: 'var(--radius-md)',
              fontWeight: 500, fontSize: '0.9375rem', background: 'transparent',
            }}>
              ▶ Voir une démo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
