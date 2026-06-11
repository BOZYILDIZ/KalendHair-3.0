export interface Client {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string | null
  isActive: boolean
  createdAt: Date
}

export interface ClientWithStats extends Client {
  appointmentCount: number
  lastVisitDate: string | null
  salonJoinedAt: Date
}
