import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { getSalonsByCity, getCityBySlug } from './queries'

type Props = { params: Promise<{ ville: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville } = await params
  const city = await getCityBySlug(ville)
  if (!city) return { title: 'Ville introuvable — KalendHair' }
  const cityName = city.name
  return {
    title: `Coiffeur ${cityName} — KalendHair`,
    description: `Trouvez et réservez votre coiffeur à ${cityName} en ligne. Comparez les salons, consultez les avis et prenez rendez-vous facilement avec KalendHair.`,
  }
}

export default async function VillePage({ params }: Props) {
  const { ville } = await params
  const [city, salonList] = await Promise.all([
    getCityBySlug(ville),
    getSalonsByCity(ville),
  ])

  if (!city) notFound()

  const cityName = city.name

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-inter)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #2C1A0E 0%, #5C3A1E 100%)',
        padding: '3rem 1.5rem 2.5rem',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <nav style={{ fontSize: '.8125rem', color: 'rgba(242,237,228,.5)', marginBottom: '1.25rem' }}>
            <Link href="/coiffeur" style={{ color: 'rgba(242,237,228,.5)', textDecoration: 'none' }}>
              Annuaire coiffeurs
            </Link>
            {' / '}
            <span style={{ color: 'rgba(242,237,228,.8)' }}>{cityName}</span>
          </nav>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '2.25rem', fontWeight: 700,
            color: '#F2EDE4', marginBottom: '.75rem', lineHeight: 1.2,
          }}>
            Coiffeurs à {cityName}
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(242,237,228,.7)', maxWidth: 560 }}>
            {salonList.length > 0
              ? `${salonList.length} salon${salonList.length > 1 ? 's' : ''} référencé${salonList.length > 1 ? 's' : ''} — réservation en ligne disponible`
              : 'Réservation en ligne pour les salons de coiffure'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        {salonList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {salonList.map(salon => (
              <Link
                key={salon.id}
                href={`/${salon.slug}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem', background: '#fff', borderRadius: 14,
                  border: '1px solid var(--color-border)', textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(44,26,14,.06)', transition: 'border-color .15s, box-shadow .15s',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)', marginBottom: '.25rem' }}>
                    {salon.name}
                  </div>
                  {salon.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8125rem', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={12} />
                      {salon.address}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16, flexShrink: 0 }}>
                  {salon.averageRating != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill="#C17A4A" color="#C17A4A" />
                      <span style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--color-text)' }}>
                        {salon.averageRating.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '.8125rem', color: 'var(--color-text-muted)' }}>
                        ({salon.reviewCount})
                      </span>
                    </div>
                  )}
                  <span style={{
                    background: 'var(--color-primary)', color: '#fff',
                    padding: '.4375rem 1rem', borderRadius: 8,
                    fontSize: '.8125rem', fontWeight: 600, whiteSpace: 'nowrap',
                  }}>
                    Réserver
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: '#fff', borderRadius: 16,
            border: '1px solid var(--color-border)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✂️</div>
            <p style={{ fontSize: '1.0625rem', color: 'var(--color-text)', fontWeight: 500, marginBottom: '.5rem' }}>
              Aucun salon référencé pour l'instant à {cityName}.
            </p>
            <p style={{ fontSize: '.9375rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
              Vous êtes coiffeur ici ? Rejoignez KalendHair gratuitement.
            </p>
            <Link href="/inscription" style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'var(--color-primary)', color: '#fff',
              padding: '.875rem 2rem', borderRadius: 12,
              fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
            }}>
              Inscrire mon salon
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
