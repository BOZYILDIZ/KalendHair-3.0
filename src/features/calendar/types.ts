export interface TimeSlot {
  startTime: string   // 'HH:MM'
  endTime: string     // 'HH:MM'
  available: boolean
}

export interface SlotCheckInput {
  salonId: number
  employeeId: number
  date: string        // 'YYYY-MM-DD'
  startTime: string   // 'HH:MM'
  endTime: string     // 'HH:MM'
}

export interface DaySchedule {
  dayOfWeek: number   // 0=Lundi
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  breakStartTime: string | null
  breakEndTime: string | null
}
