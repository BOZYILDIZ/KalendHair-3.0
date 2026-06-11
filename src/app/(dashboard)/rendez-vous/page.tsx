import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getAppointmentsByDate } from '@/features/appointments/queries'
import { AppointmentList } from '@/features/appointments/components/AppointmentList'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Rendez-vous' }

export default async function RendezVousPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const salonId = await requireSalonId()
  const { date } = await searchParams
  const selectedDate = date ?? format(new Date(), 'yyyy-MM-dd')

  const appointments = await getAppointmentsByDate(salonId, selectedDate)

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Rendez-vous
        </h2>
      </div>
      <AppointmentList appointments={appointments} date={selectedDate} />
    </div>
  )
}
