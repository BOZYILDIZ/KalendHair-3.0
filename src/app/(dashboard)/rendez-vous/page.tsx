import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getAppointmentsByDate } from '@/features/appointments/queries'
import { AppointmentList } from '@/features/appointments/components/AppointmentList'
import { NewAppointmentButton } from '@/features/appointments/components/NewAppointmentButton'
import { getEmployees } from '@/features/employees/queries'
import { getServices } from '@/features/services/queries'
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

  const [appointments, employees, services] = await Promise.all([
    getAppointmentsByDate(salonId, selectedDate),
    getEmployees(salonId),
    getServices(salonId),
  ])

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Rendez-vous
        </h2>
        <NewAppointmentButton
          salonId={salonId}
          employees={employees.map(e => ({ id: e.id, firstName: e.firstName, lastName: e.lastName, color: e.color }))}
          services={services.map(s => ({ id: s.id, name: s.name, durationMinutes: s.durationMinutes, price: s.price ?? null }))}
        />
      </div>
      <AppointmentList appointments={appointments} date={selectedDate} />
    </div>
  )
}
