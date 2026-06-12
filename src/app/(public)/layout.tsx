import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250, 247, 242, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
            KalendHair
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
            <Link href="#fonctionnalites" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Fonctionnalités
            </Link>
            <Link href="#tarifs" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Tarifs
            </Link>
            <Link href="#salons" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              Pour les salons
            </Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/connexion" style={{
              fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)',
              textDecoration: 'none', padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              transition: 'background 0.15s',
            }}>
              Se connecter
            </Link>
            <Link href="/inscription" style={{
              fontSize: '0.875rem', fontWeight: 600, color: '#fff',
              textDecoration: 'none', padding: '0.5rem 1.25rem',
              background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
              transition: 'background 0.15s',
            }}>
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}
