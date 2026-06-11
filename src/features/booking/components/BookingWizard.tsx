'use client'
import { useState, useTransition } from 'react'
import { ChevronLeft, ChevronRight, Check, Clock, User, Calendar, Scissors } from 'lucide-react'
import { format, addDays, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getSlotsAction, createBookingAction } from '../actions'
import type { BookingState, PublicService, PublicEmployee } from '../types'
import type { TimeSlot } from '@/features/calendar/types'

interface Props {
  salonId: number
  salonSlug: string
  salonName: string
  services: PublicService[]
  employees: PublicEmployee[]
  initialServiceId?: number
}

export function BookingWizard({ salonId, salonSlug, salonName, services, employees, initialServiceId }: Props) {
  const [state, setState] = useState<BookingState>({
    step: initialServiceId ? 'employee' : 'service',
    salonId,
    salonSlug,
    serviceId: initialServiceId ?? null,
    employeeId: null,
    date: null,
    startTime: null,
    endTime: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const [isPending, startTransition] = useTransition()
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedService = services.find(s => s.id === state.serviceId)
  const selectedEmployee = employees.find(e => e.id === state.employeeId)

  const STEPS: BookingState['step'][] = ['service', 'employee', 'slot', 'info', 'confirm']
  const stepIndex = STEPS.indexOf(state.step)

  function next(updates: Partial<BookingState> = {}) {
    setState(prev => ({ ...prev, ...updates, step: STEPS[stepIndex + 1] ?? prev.step }))
  }
  function back() {
    setState(prev => ({ ...prev, step: STEPS[stepIndex - 1] ?? prev.step }))
  }

  function loadSlots(date: string) {
    setSelectedDate(date)
    if (!state.serviceId) return
    startTransition(async () => {
      const res = await getSlotsAction({ salonId, date, serviceId: state.serviceId!, employeeId: state.employeeId })
      if (res.success) setSlots(res.data)
    })
  }

  async function submitBooking() {
    if (!state.serviceId || !state.employeeId || !state.date || !state.startTime || !state.endTime) return
    setError(null)
    startTransition(async () => {
      const res = await createBookingAction({
        salonId,
        serviceId: state.serviceId!,
        employeeId: state.employeeId!,
        date: state.date!,
        startTime: state.startTime!,
        endTime: state.endTime!,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        phone: state.phone,
        notes: state.notes,
      })
      if (res.success) {
        setBookingId(res.data.appointmentId)
        setState(prev => ({ ...prev, step: 'confirm' }))
      } else {
        setError(res.error.message)
      }
    })
  }

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (state.step === 'confirm' && bookingId) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2D7A4A18', border: '2px solid #2D7A4A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <Check size={28} color="#2D7A4A" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.375rem', fontWeight: 700, marginBottom: '.5rem', color: 'var(--color-text)' }}>
          Rendez-vous confirmé !
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '.875rem', marginBottom: '1.5rem' }}>
          Nous vous avons envoyé un email de confirmation.
        </p>
        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 12, padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)', marginBottom: '.25rem' }}>{salonName}</div>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedService?.name}</div>
          <div style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)', marginTop: '.375rem' }}>
            {state.date && format(new Date(state.date), 'EEEE d MMMM yyyy', { locale: fr })} à {state.startTime}
          </div>
          {selectedEmployee && <div style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)' }}>avec {selectedEmployee.firstName}</div>}
          <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '.5rem' }}>Réf. #{bookingId}</div>
        </div>
        <a href={`/${salonSlug}`} style={{ fontSize: '.875rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
          ← Retour au salon
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.75rem' }}>
        {['Service', 'Employé', 'Créneau', 'Vos infos'].map((label, i) => {
          const done = i < stepIndex
          const current = i === stepIndex && state.step !== 'confirm'
          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ height: 3, borderRadius: 2, background: done || current ? 'var(--color-primary)' : 'var(--color-border)', transition: 'background .3s' }} />
              <div style={{ fontSize: '.625rem', color: done || current ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: current ? 600 : 400 }}>{label}</div>
            </div>
          )
        })}
      </div>

      {/* STEP 1: Service */}
      {state.step === 'service' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <Scissors size={18} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600 }}>Choisissez votre service</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map(svc => (
              <button key={svc.id} onClick={() => next({ serviceId: svc.id })} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: '#fff', borderRadius: 12,
                border: `1px solid ${state.serviceId === svc.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'border-color .15s', boxShadow: '0 1px 3px rgba(44,26,14,.05)',
              }}>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: '.9375rem' }}>{svc.name}</div>
                  {svc.description && <div style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)', marginTop: '.125rem' }}>{svc.description}</div>}
                  <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '.375rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={10} />{svc.durationMinutes} min
                  </div>
                </div>
                {svc.price && <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem', flexShrink: 0, marginLeft: 12 }}>{Number(svc.price).toFixed(0)}€</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Employee */}
      {state.step === 'employee' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <User size={18} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600 }}>Choisissez un coiffeur</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => {
              const firstEmp = employees[0]
              if (firstEmp) { next({ employeeId: null }) }
              else next({ employeeId: null })
              setTimeout(() => loadSlots(selectedDate), 0)
            }} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '1rem 1.25rem', background: '#fff', borderRadius: 12,
              border: '1px solid var(--color-border)', cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-bg-secondary)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color="var(--color-text-muted)" />
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>Sans préférence</div>
                <div style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)' }}>Premier disponible</div>
              </div>
            </button>
            {employees.map(emp => (
              <button key={emp.id} onClick={() => { next({ employeeId: emp.id }); setTimeout(() => loadSlots(selectedDate), 0) }} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '1rem 1.25rem', background: '#fff', borderRadius: 12,
                border: `1px solid ${state.employeeId === emp.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: emp.color ?? 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.875rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{emp.firstName} {emp.lastName}</div>
                  {emp.bio && <div style={{ fontSize: '.8125rem', color: 'var(--color-text-secondary)' }}>{emp.bio}</div>}
                </div>
              </button>
            ))}
          </div>
          <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '.875rem' }}>
            <ChevronLeft size={14} /> Retour
          </button>
        </div>
      )}

      {/* STEP 3: Slot */}
      {state.step === 'slot' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600 }}>Choisissez un créneau</h2>
          </div>
          {/* Date picker compact */}
          <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: 4 }}>
            {Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)).map(day => {
              const iso = format(day, 'yyyy-MM-dd')
              const isSelected = selectedDate === iso
              return (
                <button key={iso} onClick={() => loadSlots(iso)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: '.5rem .625rem', borderRadius: 10, flexShrink: 0,
                  border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-primary)' : '#fff',
                  cursor: 'pointer', minWidth: 48,
                }}>
                  <span style={{ fontSize: '.625rem', textTransform: 'uppercase', color: isSelected ? 'rgba(255,255,255,.8)' : 'var(--color-text-muted)' }}>
                    {format(day, 'EEE', { locale: fr })}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--color-text)' }}>
                    {format(day, 'd')}
                  </span>
                </button>
              )
            })}
          </div>

          {isPending ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '.875rem' }}>Chargement des créneaux…</div>
          ) : slots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '.875rem' }}>
              Aucun créneau disponible ce jour — essayez une autre date.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {slots.filter(s => s.available).map(slot => (
                <button key={slot.startTime} onClick={() => next({ date: selectedDate, startTime: slot.startTime, endTime: slot.endTime })} style={{
                  padding: '.75rem', borderRadius: 10, border: '1px solid var(--color-border)',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '.9375rem',
                  color: 'var(--color-text)', transition: 'all .15s',
                }}>
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
          <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '.875rem' }}>
            <ChevronLeft size={14} /> Retour
          </button>
        </div>
      )}

      {/* STEP 4: Info client */}
      {state.step === 'info' && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.25rem' }}>Vos coordonnées</h2>
          {/* Récap RDV */}
          <div style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem', fontSize: '.875rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedService?.name}</div>
            <div style={{ color: 'var(--color-text-secondary)', marginTop: '.25rem' }}>
              {state.date && format(new Date(state.date), 'EEEE d MMMM', { locale: fr })} à {state.startTime}
              {selectedEmployee && ` · ${selectedEmployee.firstName}`}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div><label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Prénom *</label>
              <input value={state.firstName} onChange={e => setState(p => ({ ...p, firstName: e.target.value }))} placeholder="Prénom" style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '.875rem', background: '#fff', outline: 'none' }} />
            </div>
            <div><label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Nom *</label>
              <input value={state.lastName} onChange={e => setState(p => ({ ...p, lastName: e.target.value }))} placeholder="Nom" style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '.875rem', background: '#fff', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Email</label>
            <input type="email" value={state.email} onChange={e => setState(p => ({ ...p, email: e.target.value }))} placeholder="votre@email.fr" style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '.875rem', background: '#fff', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Téléphone</label>
            <input type="tel" value={state.phone} onChange={e => setState(p => ({ ...p, phone: e.target.value }))} placeholder="06 XX XX XX XX" style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '.875rem', background: '#fff', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Message (optionnel)</label>
            <textarea value={state.notes} onChange={e => setState(p => ({ ...p, notes: e.target.value }))} placeholder="Une demande particulière ?" rows={2} style={{ width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '.875rem', background: '#fff', outline: 'none', resize: 'vertical' }} />
          </div>
          {error && <div style={{ background: '#C0392B18', color: 'var(--color-danger)', padding: '.625rem .875rem', borderRadius: 8, fontSize: '.8125rem', marginBottom: '1rem' }}>{error}</div>}
          <button onClick={submitBooking} disabled={!state.firstName || !state.lastName || isPending} style={{
            width: '100%', padding: '.875rem', background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 12, fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            opacity: (!state.firstName || !state.lastName || isPending) ? .6 : 1,
          }}>
            {isPending ? 'Confirmation…' : 'Confirmer le rendez-vous'}
          </button>
          <button onClick={back} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '.875rem' }}>
            <ChevronLeft size={14} /> Retour
          </button>
        </div>
      )}
    </div>
  )
}
