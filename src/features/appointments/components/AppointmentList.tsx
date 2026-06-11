import type { AppointmentWithDetails } from '../types'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'En attente',  color: 'var(--color-warning)' },
  confirmed: { label: 'Confirmé',    color: 'var(--color-success)' },
  completed: { label: 'Terminé',     color: 'var(--color-text-muted)' },
  cancelled: { label: 'Annulé',      color: 'var(--color-danger)' },
  no_show:   { label: 'Absent',      color: 'var(--color-danger)' },
}

interface Props {
  appointments: AppointmentWithDetails[]
  date: string
}

export function AppointmentList({ appointments, date }: Props) {
  const formatted = format(parseISO(date), 'd MMMM yyyy', { locale: fr })

  return (
    <div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        {appointments.length} rendez-vous · {formatted}
      </div>

      {appointments.length === 0 ? (
        <div className="kh-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Aucun rendez-vous ce jour
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {appointments.map(appt => {
            const clientName = appt.client
              ? `${appt.client.firstName} ${appt.client.lastName}`
              : `${appt.guestFirstName ?? ''} ${appt.guestLastName ?? ''}`.trim()
            const statusStyle = STATUS_LABEL[appt.status] ?? STATUS_LABEL['pending']!

            return (
              <div key={appt.id} className="kh-card" style={{
                padding: '0.875rem 1rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                borderLeft: `3px solid ${appt.employee.color ?? 'var(--color-primary)'}`,
              }}>
                <div style={{ minWidth: 52, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>{appt.startTime}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{appt.endTime}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem' }}>{clientName}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {appt.service.name} · {appt.employee.firstName}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem', fontWeight: 500, color: statusStyle.color,
                  background: `${statusStyle.color}18`,
                  padding: '0.25rem 0.625rem', borderRadius: 6,
                }}>
                  {statusStyle.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
