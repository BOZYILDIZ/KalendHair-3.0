import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getSalonSettings, getSalonSchedules } from '@/features/settings/queries'
import { SalonInfoForm } from '@/features/settings/components/SalonInfoForm'
import { ScheduleEditor } from '@/features/settings/components/ScheduleEditor'

export const metadata: Metadata = { title: 'Paramètres' }

const card: React.CSSProperties = {
  padding: '1.5rem',
  marginBottom: '1.5rem',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), serif',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '1.25rem',
}

export default async function ParametresPage() {
  const salonId = await requireSalonId()
  const [salon, schedules] = await Promise.all([
    getSalonSettings(salonId),
    getSalonSchedules(salonId),
  ])

  if (!salon) {
    return (
      <div className="kh-card" style={{ padding: '2rem', textAlign: 'center' }}>
        Salon introuvable.
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
        Paramètres
      </h2>

      <div className="kh-card" style={card}>
        <h3 style={sectionTitle}>Informations du salon</h3>
        <SalonInfoForm salon={salon} />
      </div>

      <div className="kh-card" style={card}>
        <h3 style={sectionTitle}>Horaires d&apos;ouverture</h3>
        <ScheduleEditor schedules={schedules} />
      </div>
    </div>
  )
}
