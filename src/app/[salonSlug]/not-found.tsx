import Link from 'next/link'

export default function SalonNotFound() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 56, height: 56, background: 'var(--color-primary)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '.75rem' }}>
          Salon introuvable
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '.9375rem' }}>
          Ce salon n'existe pas ou n'est plus actif sur KalendHair.
        </p>
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '.875rem' }}>
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
