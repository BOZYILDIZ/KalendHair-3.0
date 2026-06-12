import Link from 'next/link'

export function CtaFinal() {
  return (
    <section style={{ padding: '5rem 2rem', background: 'var(--color-sidebar)', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(193,122,74,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ fontSize: 'clamp(1.625rem, 4vw, 2.5rem)', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
          Prêt à moderniser votre salon ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.0625rem', marginBottom: '2.25rem', lineHeight: 1.65 }}>
          Rejoignez plus de 500 salons qui font confiance à KalendHair pour leurs réservations en ligne.
          Aucune carte bancaire requise pour démarrer.
        </p>
        <Link href="/inscription" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.9375rem 2.25rem',
          background: 'var(--color-primary)', color: '#fff',
          textDecoration: 'none', borderRadius: 'var(--radius-md)',
          fontWeight: 700, fontSize: '1rem',
          boxShadow: '0 4px 20px rgba(193,122,74,0.45)',
          transition: 'background 0.15s, transform 0.1s',
        }}>
          Commencer gratuitement — c'est 0€
        </Link>
      </div>
    </section>
  )
}
