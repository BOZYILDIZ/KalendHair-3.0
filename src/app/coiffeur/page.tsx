import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Annuaire coiffeurs en France — KalendHair',
  description: 'Trouvez un coiffeur près de chez vous et réservez en ligne. Parcourez notre annuaire des meilleurs salons de coiffure dans toute la France.',
}

const TOP_CITIES = [
  { name: 'Paris', slug: 'paris' },
  { name: 'Lyon', slug: 'lyon' },
  { name: 'Marseille', slug: 'marseille' },
  { name: 'Toulouse', slug: 'toulouse' },
  { name: 'Nice', slug: 'nice' },
  { name: 'Nantes', slug: 'nantes' },
  { name: 'Strasbourg', slug: 'strasbourg' },
  { name: 'Bordeaux', slug: 'bordeaux' },
  { name: 'Lille', slug: 'lille' },
  { name: 'Rennes', slug: 'rennes' },
  { name: 'Reims', slug: 'reims' },
  { name: 'Saint-Étienne', slug: 'saint-etienne' },
  { name: 'Toulon', slug: 'toulon' },
  { name: 'Grenoble', slug: 'grenoble' },
  { name: 'Dijon', slug: 'dijon' },
]

export default function CoiffeurIndexPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-inter)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #2C1A0E 0%, #5C3A1E 100%)',
        padding: '3rem 1.5rem 2.5rem',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '2.25rem', fontWeight: 700,
            color: '#F2EDE4', marginBottom: '.75rem', lineHeight: 1.2,
          }}>
            Trouvez votre coiffeur en France
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(242,237,228,.7)', maxWidth: 520 }}>
            Réservez en ligne dans les meilleurs salons de coiffure partout en France.
          </p>
        </div>
      </div>

      {/* City grid */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h2 style={{
          fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '.7px', color: 'var(--color-text-secondary)', marginBottom: '1.25rem',
        }}>
          Villes populaires
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 10,
        }}>
          {TOP_CITIES.map(city => (
            <Link
              key={city.slug}
              href={`/coiffeur/${city.slug}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: '#fff', borderRadius: 12,
                border: '1px solid var(--color-border)', textDecoration: 'none',
                fontWeight: 500, fontSize: '.9375rem', color: 'var(--color-text)',
                boxShadow: '0 1px 3px rgba(44,26,14,.05)', transition: 'border-color .15s',
              }}
            >
              {city.name}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* CTA for hairdressers */}
        <div style={{
          marginTop: '3rem', padding: '2rem', background: '#fff',
          borderRadius: 16, border: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '.25rem' }}>
              Vous êtes coiffeur ?
            </div>
            <div style={{ fontSize: '.9rem', color: 'var(--color-text-secondary)' }}>
              Inscrivez votre salon gratuitement et recevez des réservations en ligne.
            </div>
          </div>
          <Link href="/inscription" style={{
            background: 'var(--color-primary)', color: '#fff',
            padding: '.75rem 1.5rem', borderRadius: 10,
            fontWeight: 600, fontSize: '.9375rem', textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Inscrire mon salon
          </Link>
        </div>
      </div>
    </main>
  )
}
