export type EmployeeRole = 'coiffeur' | 'manager' | 'owner' | 'stagiaire' | 'apprenti'


export interface Employee {
  id: number
  salonId: number
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  role: EmployeeRole
  color: string
  avatarUrl: string | null
  isActive: boolean
  createdAt: Date
}

export interface EmployeeWithServices extends Employee {
  services: Array<{ id: number; name: string; color: string }>
}

export interface CreateEmployeeInput {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  role: EmployeeRole
  color?: string
  serviceIds?: number[]
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  id: number
  isActive?: boolean
}
