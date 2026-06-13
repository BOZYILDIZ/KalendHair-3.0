import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)', padding: '3rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ maxWidth: '280px' }}>
            <p style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.625rem' }}>
              KalendHair
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              La plateforme de réservation en ligne pensée pour les salons de coiffure français.
            </p>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Produit</p>
              <Link href="#fonctionnalites" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Fonctionnalités</Link>
              <Link href="#tarifs" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Tarifs</Link>
              <Link href="#salons" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Pour les salons</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Légal</p>
              <Link href="/mentions-legales" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Mentions légales</Link>
              <Link href="/cgu" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>CGU</Link>
              <Link href="/contact" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </nav>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} KalendHair. Tous droits réservés.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
            Fait avec soin en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  )
}
