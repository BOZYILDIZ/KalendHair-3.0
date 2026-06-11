import type { AppointmentWithDetails } from '../types'

interface Props {
  appointments: AppointmentWithDetails[]
}

function getClientName(appt: AppointmentWithDetails): string {
  if (appt.client) return `${appt.client.firstName} ${appt.client.lastName}`
  if (appt.guestFirstName) return `${appt.guestFirstName} ${appt.guestLastName ?? ''}`
  return 'Client invité'
}

export function UpcomingAppointments({ appointments }: Props) {
  return (
    <div className="kh-card" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '0.875rem 1rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Prochains rendez-vous
        </div>
        <a href="/rendez-vous" style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
          Voir tout →
        </a>
      </div>

      {appointments.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Aucun rendez-vous à venir
        </div>
      ) : (
        <div>
          {appointments.map((appt) => (
            <div key={appt.id} style={{
              padding: '0.75rem 1rem',
              display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid rgba(226,213,200,0.5)',
            }}>
              <div style={{
                width: 4, height: 40, borderRadius: 2, flexShrink: 0,
                background: appt.employee.color,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)' }}>
                  {getClientName(appt)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 1 }}>
                  {appt.service.name} · {appt.employee.firstName}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)' }}>
                  {appt.startTime}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                  {appt.appointmentDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
