import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getAppointmentsByWeek } from '@/features/appointments/queries'
import { getEmployees } from '@/features/employees/queries'
import { WeekCalendar } from '@/features/calendar/components/WeekCalendar'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const metadata: Metadata = { title: 'Calendrier' }

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ semaine?: string }>
}) {
  const salonId = await requireSalonId()
  const { semaine } = await searchParams

  const weekStart = semaine
    ? new Date(semaine)
    : startOfWeek(new Date(), { weekStartsOn: 1 })

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })

  const [appointments, employees] = await Promise.all([
    getAppointmentsByWeek(salonId, format(weekStart, 'yyyy-MM-dd'), format(weekEnd, 'yyyy-MM-dd')),
    getEmployees(salonId),
  ])

  return (
    <div style={{ height: 'calc(100vh - 60px - 3rem)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Semaine du {format(weekStart, 'd MMMM yyyy', { locale: fr })}
        </h2>
      </div>
      <WeekCalendar
        appointments={appointments}
        employees={employees}
        weekStart={weekStart.toISOString()}
      />
    </div>
  )
}
