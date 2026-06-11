export type BookingStep = 'service' | 'employee' | 'slot' | 'info' | 'confirm'

export interface BookingState {
  step: BookingStep
  salonId: number
  salonSlug: string
  serviceId: number | null
  employeeId: number | null // null = "sans préférence"
  date: string | null        // 'YYYY-MM-DD'
  startTime: string | null   // 'HH:MM'
  endTime: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

export interface PublicSalon {
  id: number
  name: string
  slug: string
  description: string | null
  address: string | null
  city: string | null
  phone: string | null
  email: string | null
  coverUrl: string | null
  averageRating: number | null
  reviewCount: number
}

export interface PublicService {
  id: number
  name: string
  description: string | null
  category: string | null
  durationMinutes: number
  price: string | null
  color: string | null
}

export interface PublicEmployee {
  id: number
  firstName: string
  lastName: string
  color: string | null
  bio: string | null
}
