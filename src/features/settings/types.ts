// Types for the settings feature

export interface SalonSettings {
  id: number
  name: string
  description: string | null
  phone: string | null
  address: string | null
  postalCode: string | null
  city: string | null
  email: string | null
  logoUrl: string | null
  coverUrl: string | null
  isActive: boolean
  onboardingCompleted: boolean
}

export interface SalonSchedule {
  id: number
  salonId: number
  dayOfWeek: number // 0=Lundi, 6=Dimanche
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
}

export interface UpdateSalonInfoInput {
  name?: string
  description?: string | null
  phone?: string | null
  address?: string | null
  postalCode?: string | null
  city?: string | null
  email?: string | null
}

export interface ScheduleInput {
  dayOfWeek: number
  isOpen: boolean
  openTime?: string | null
  closeTime?: string | null
  breakStartTime?: string | null
  breakEndTime?: string | null
}

export const DAY_LABELS: Record<number, string> = {
  0: 'Lundi',
  1: 'Mardi',
  2: 'Mercredi',
  3: 'Jeudi',
  4: 'Vendredi',
  5: 'Samedi',
  6: 'Dimanche',
}
