import type { AppointmentWithDetails } from '@/features/appointments/types'
import { ConnectorBase } from '../base'

interface GoogleCalendarEvent {
  summary: string
  description: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  attendees?: { email: string }[]
}

export function buildGoogleEvent(appt: AppointmentWithDetails): GoogleCalendarEvent {
  const clientName = appt.client
    ? `${appt.client.firstName} ${appt.client.lastName}`
    : `${appt.guestFirstName ?? ''} ${appt.guestLastName ?? ''}`.trim()

  const dateStr = appt.appointmentDate
  const start = `${dateStr}T${appt.startTime}:00`
  const end = `${dateStr}T${appt.endTime}:00`

  return {
    summary: `${appt.service.name} — ${clientName}`,
    description: [
      `Client : ${clientName}`,
      `Service : ${appt.service.name}`,
      `Employé : ${appt.employee.firstName} ${appt.employee.lastName}`,
      appt.client?.phone ? `Tél : ${appt.client.phone}` : '',
      `RDV KalendHair #${appt.id}`,
    ].filter(Boolean).join('\n'),
    start: { dateTime: start, timeZone: 'Europe/Paris' },
    end: { dateTime: end, timeZone: 'Europe/Paris' },
    attendees: appt.client?.email ? [{ email: appt.client.email }] : [],
  }
}

// Crée un événement dans Google Calendar via l'API
export async function createGoogleEvent(
  accessToken: string,
  calendarId: string,
  event: GoogleCalendarEvent
): Promise<{ id: string }> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Google Calendar API error: ${res.status} — ${err}`)
  }

  return res.json() as Promise<{ id: string }>
}

class GoogleCalendarConnector extends ConnectorBase {
  readonly slug = 'google-calendar' as const

  async sync(_salonId: number): Promise<void> {
    // Sync bidirectionnelle — implémentée via Trigger.dev jobs
    // Voir: src/jobs/google-calendar-sync.ts
  }

  async handleWebhook(_salonId: number, _payload: unknown): Promise<void> {
    // Google Calendar push notifications
    // Voir: src/app/api/webhooks/google-calendar/route.ts
  }
}

export const googleCalendarConnector = new GoogleCalendarConnector()
