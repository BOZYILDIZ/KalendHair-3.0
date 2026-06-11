'use client'
import { addDays, format, parseISO, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { AppointmentWithDetails } from '@/features/appointments/types'
import type { Employee } from '@/features/employees/types'

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8h → 20h
const SLOT_HEIGHT = 56 // px par heure

interface Props {
  appointments: AppointmentWithDetails[]
  employees: Employee[]
  weekStart: string
}

export function WeekCalendar({ appointments, employees, weekStart }: Props) {
  const start = parseISO(weekStart)
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', gap: 0, background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
      {/* Colonne heures */}
      <div style={{ width: 52, flexShrink: 0, borderRight: '1px solid var(--color-border)' }}>
        <div style={{ height: 44, borderBottom: '1px solid var(--color-border)' }} />
        {HOURS.map(h => (
          <div key={h} style={{
            height: SLOT_HEIGHT, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4,
          }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{h}:00</span>
          </div>
        ))}
      </div>

      {/* Colonnes jours */}
      {days.map(day => {
        const dayAppts = appointments.filter(a => a.appointmentDate === format(day, 'yyyy-MM-dd'))
        const isToday = isSameDay(day, new Date())

        return (
          <div key={day.toISOString()} style={{ flex: 1, borderRight: '1px solid var(--color-border)', minWidth: 100 }}>
            {/* En-tête jour */}
            <div style={{
              height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', borderBottom: '1px solid var(--color-border)',
              background: isToday ? 'var(--color-primary-50)' : 'transparent',
            }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {format(day, 'EEE', { locale: fr })}
              </span>
              <span style={{
                fontSize: '0.9375rem', fontWeight: isToday ? 700 : 500,
                color: isToday ? 'var(--color-primary)' : 'var(--color-text)',
              }}>
                {format(day, 'd')}
              </span>
            </div>

            {/* Grille */}
            <div style={{ position: 'relative' }}>
              {HOURS.map(h => (
                <div key={h} style={{ height: SLOT_HEIGHT, borderBottom: '1px solid var(--color-border-light)' }} />
              ))}

              {/* RDV */}
              {dayAppts.map(appt => {
                const [sh, sm] = appt.startTime.split(':').map(Number)
                const [eh, em] = appt.endTime.split(':').map(Number)
                const top = ((sh! - 8) + sm! / 60) * SLOT_HEIGHT
                const height = Math.max(((eh! - sh!) * 60 + (em! - sm!)) / 60 * SLOT_HEIGHT - 2, 24)
                const color = appt.employee.color ?? '#C17A4A'

                return (
                  <div key={appt.id} style={{
                    position: 'absolute', left: 2, right: 2,
                    top, height, borderRadius: 6,
                    background: `${color}22`,
                    borderLeft: `3px solid ${color}`,
                    padding: '2px 4px', overflow: 'hidden', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {appt.service.name}
                    </div>
                    {height > 32 && (
                      <div style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {appt.client ? `${appt.client.firstName} ${appt.client.lastName}` : appt.guestFirstName}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
