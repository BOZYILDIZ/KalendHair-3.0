import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getServices } from '@/features/services/queries'
import { ServiceList } from '@/features/services/components/ServiceList'

export const metadata: Metadata = { title: 'Services' }

export default async function ServicesPage() {
  const salonId = await requireSalonId()
  const services = await getServices(salonId)

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Services & prestations
        </h2>
      </div>
      <ServiceList services={services} />
    </div>
  )
}
