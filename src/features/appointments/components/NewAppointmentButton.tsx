'use client'

import { useState } from 'react'
import { NewAppointmentModal } from './NewAppointmentModal'

interface Props {
  salonId: number
  employees: Array<{ id: number; firstName: string; lastName: string; color: string }>
  services: Array<{ id: number; name: string; durationMinutes: number; price: number | null }>
}

export function NewAppointmentButton({ salonId, employees, services }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="kh-btn-primary" onClick={() => setOpen(true)}>
        + Nouveau RDV
      </button>
      <NewAppointmentModal
        salonId={salonId}
        employees={employees}
        services={services}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
