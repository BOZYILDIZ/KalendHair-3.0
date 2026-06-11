'use client'

import { useState, useTransition, useEffect } from 'react'
import { getSlotsAction, createAppointmentAction } from '../actions'
import { SlotPicker } from './SlotPicker'
import { GuestFields } from './GuestFields'

interface Props {
  salonId: number
  employees: Array<{ id: number; firstName: string; lastName: string; color: string }>
  services: Array<{ id: number; name: string; durationMinutes: number; price: number | null }>
  open: boolean
  onClose: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

const FIELD: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.25rem' }
const LABEL: React.CSSProperties = { fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)' }
const INPUT: React.CSSProperties = { width: '100%', padding: '0.5rem 0.625rem', fontSize: '0.875rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-card)', color: 'var(--color-text)' }

export function NewAppointmentModal({ salonId, employees, services, open, onClose }: Props) {
  const [employeeId, setEmployeeId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [date, setDate] = useState(today())
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [clientType, setClientType] = useState<'existing' | 'guest'>('guest')
  const [guest, setGuest] = useState({ guestFirstName: '', guestLastName: '', guestEmail: '', guestPhone: '' })
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [slotsLoading, startSlotsTransition] = useTransition()
  const [submitting, startSubmitTransition] = useTransition()

  useEffect(() => {
    if (!employeeId || !serviceId || !date) { setSlots([]); setSelectedSlot(''); return }
    startSlotsTransition(async () => {
      const result = await getSlotsAction(salonId, Number(employeeId), Number(serviceId), date)
      setSlots(result)
      setSelectedSlot('')
    })
  }, [employeeId, serviceId, date, salonId])

  function handleGuestChange(field: keyof typeof guest, value: string) {
    setGuest(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) { setError('Veuillez sélectionner un créneau horaire.'); return }
    setError('')
    startSubmitTransition(async () => {
      const payload = {
        employeeId: Number(employeeId),
        serviceId: Number(serviceId),
        appointmentDate: date,
        startTime: selectedSlot,
        notes: notes || undefined,
        ...(clientType === 'guest' ? {
          guestFirstName: guest.guestFirstName,
          guestLastName: guest.guestLastName,
          guestEmail: guest.guestEmail || undefined,
          guestPhone: guest.guestPhone || undefined,
        } : {}),
      }
      const result = await createAppointmentAction(payload)
      if (result.success) { onClose() } else { setError(result.error) }
    })
  }

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(44,26,14,0.4)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="kh-card animate-fade-in" style={{ position: 'relative', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', margin: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', margin: 0 }}>Nouveau rendez-vous</h3>
          <button type="button" onClick={onClose} className="kh-btn-ghost" style={{ padding: '0.25rem 0.5rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={FIELD}>
            <label style={LABEL}>Employé *</label>
            <select style={INPUT} value={employeeId} onChange={e => setEmployeeId(e.target.value)} required>
              <option value="">Sélectionner un employé</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>● {emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Prestation *</label>
            <select style={INPUT} value={serviceId} onChange={e => setServiceId(e.target.value)} required>
              <option value="">Sélectionner une prestation</option>
              {services.map(svc => (
                <option key={svc.id} value={svc.id}>{svc.name} — {svc.durationMinutes} min{svc.price ? ` · ${svc.price}€` : ''}</option>
              ))}
            </select>
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Date *</label>
            <input type="date" style={INPUT} value={date} min={today()} onChange={e => setDate(e.target.value)} required />
          </div>

          <div style={FIELD}>
            <label style={LABEL}>Créneau *</label>
            <SlotPicker slots={slots} selected={selectedSlot} loading={slotsLoading} onChange={setSelectedSlot} />
          </div>

          <GuestFields clientType={clientType} guestData={guest} onClientTypeChange={setClientType} onGuestChange={handleGuestChange} />

          <div style={FIELD}>
            <label style={LABEL}>Notes</label>
            <textarea style={{ ...INPUT, resize: 'vertical', minHeight: 64 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Informations complémentaires…" />
          </div>

          {error && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.75rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <button type="button" className="kh-btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="kh-btn-primary" disabled={submitting}>
              {submitting ? 'Création…' : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
