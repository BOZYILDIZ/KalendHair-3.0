export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: number
  salonId: number
  employeeId: number
  serviceId: number
  clientAccountId: number | null
  appointmentDate: string   // 'YYYY-MM-DD'
  startTime: string         // 'HH:MM'
  endTime: string           // 'HH:MM'
  status: AppointmentStatus
  notes: string | null
  guestFirstName: string | null
  guestLastName: string | null
  guestEmail: string | null
  guestPhone: string | null
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentWithDetails extends Appointment {
  employee: { id: number; firstName: string; lastName: string; color: string }
  service: { id: number; name: string; durationMinutes: number; price: number | null; color: string }
  client: { id: number; firstName: string; lastName: string; email: string } | null
}

export interface CreateAppointmentInput {
  employeeId: number
  serviceId: number
  appointmentDate: string
  startTime: string
  clientAccountId?: number
  guestFirstName?: string
  guestLastName?: string
  guestEmail?: string
  guestPhone?: string
  notes?: string
}

export interface UpdateAppointmentInput {
  id: number
  status?: AppointmentStatus
  notes?: string
  cancelReason?: string
}
