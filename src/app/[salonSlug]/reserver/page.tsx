import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublicSalon, getPublicServices, getPublicEmployees } from '@/features/booking/queries'
import { BookingWizard } from '@/features/booking/components/BookingWizard'

type Props = {
  params: Promise<{ salonSlug: string }>
  searchParams: Promise<{ service?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { salonSlug } = await params
  const salon = await getPublicSalon(salonSlug)
  return { title: salon ? `Réserver — ${salon.name}` : 'Réserver' }
}

export default async function ReserverPage({ params, searchParams }: Props) {
  const { salonSlug } = await params
  const { service: serviceParam } = await searchParams

  const salon = await getPublicSalon(salonSlug)
  if (!salon) notFound()

  const [services, employees] = await Promise.all([
    getPublicServices(salon.id),
    getPublicEmployees(salon.id),
  ])

  const initialServiceId = serviceParam ? parseInt(serviceParam) : undefined

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Mini header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#fff', borderBottom: '1px solid var(--color-border)',
        padding: '0 1.5rem', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href={`/${salonSlug}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'var(--color-primary)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '.9375rem' }}>{salon.name}</span>
        </Link>
        <span style={{ fontSize: '.75rem', color: 'var(--color-text-secondary)' }}>Réservation en ligne</span>
      </header>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1.25rem' }}>
        <BookingWizard
          salonId={salon.id}
          salonSlug={salonSlug}
          salonName={salon.name}
          services={services}
          employees={employees}
          initialServiceId={initialServiceId}
        />
      </div>
    </main>
  )
}
