import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Phone, Star, Clock } from 'lucide-react'
import { getPublicSalon, getPublicServices, getPublicEmployees } from '@/features/booking/queries'
import { formatServicePrice } from '@/features/services/types'

type Props = { params: Promise<{ salonSlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params
  const salon = await getPublicSalon(salonSlug)
  if (!salon) return { title: 'Salon introuvable' }
  return { title: `${salon.name} — Réserver en ligne`, description: salon.description ?? undefined }
}

export default async function SalonPage({ params }: Props) {
  const { salonSlug } = await params
  const [salon, services, employees] = await Promise.all([
    getPublicSalon(salonSlug),
    getPublicSalon(salonSlug).then(s => s ? getPublicServices(s.id) : []),
    getPublicSalon(salonSlug).then(s => s ? getPublicEmployees(s.id) : []),
  ])

  if (!salon) notFound()

  const byCategory = services.reduce<Record<string, typeof services>>((acc, s) => {
    const cat = s.category ?? 'Services'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', fontFamily: 'var(--font-inter)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2C1A0E 0%, #5C3A1E 100%)',
        padding: '3rem 1.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Logo KalendHair */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
            <div style={{ width: 24, height: 24, background: 'var(--color-primary)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7"/>
              </svg>
            </div>
            <span style={{ fontSize: '.6875rem', color: 'rgba(242,237,228,.5)', letterSpacing: '.5px', textTransform: 'uppercase' }}>
              Réservation via KalendHair
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair), serif', fontSize: '2rem', fontWeight: 700,
            color: '#F2EDE4', marginBottom: '.75rem', lineHeight: 1.2,
          }}>
            {salon.name}
          </h1>

          {salon.averageRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '.75rem' }}>
              <Star size={14} fill="#C17A4A" color="#C17A4A" />
              <span style={{ fontSize: '.875rem', fontWeight: 600, color: '#F2EDE4' }}>{salon.averageRating}</span>
              <span style={{ fontSize: '.8125rem', color: 'rgba(242,237,228,.6)' }}>({salon.reviewCount} avis)</span>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: '2rem' }}>
            {salon.address && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8125rem', color: 'rgba(242,237,228,.7)' }}>
                <MapPin size={13} />{salon.address}{salon.city ? `, ${salon.city}` : ''}
              </span>
            )}
            {salon.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.8125rem', color: 'rgba(242,237,228,.7)' }}>
                <Phone size={13} />{salon.phone}
              </span>
            )}
          </div>

          <Link href={`/${salonSlug}/reserver`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--color-primary)', color: '#fff',
            padding: '.875rem 2rem', borderRadius: 12, fontWeight: 600, fontSize: '1rem',
            textDecoration: 'none', transition: 'background .15s',
          }}>
            <Clock size={18} />
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Services */}
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--color-text-secondary)', marginBottom: '.75rem' }}>
              {cat}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(svc => (
                <Link key={svc.id} href={`/${salonSlug}/reserver?service=${svc.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', background: '#fff', borderRadius: 12,
                  border: '1px solid var(--color-border)', textDecoration: 'none',
                  transition: 'border-color .15s, box-shadow .15s',
                  boxShadow: '0 1px 3px rgba(44,26,14,.06)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '.9375rem' }}>{svc.name}</div>
                    {svc.description && (
                      <div style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)', marginTop: '.25rem' }}>{svc.description}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '.5rem' }}>
                      <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={11} />{svc.durationMinutes} min
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16, flexShrink: 0 }}>
                    {svc.price && <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem' }}>{formatServicePrice(svc.price)}</span>}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Équipe */}
        {employees.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--color-text-secondary)', marginBottom: '.75rem' }}>
              Notre équipe
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {employees.map(emp => (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '.75rem 1rem', background: '#fff', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: emp.color ?? 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  <span style={{ fontSize: '.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{emp.firstName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
