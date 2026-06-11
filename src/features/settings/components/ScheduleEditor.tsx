'use client'
import { useTransition, useState } from 'react'
import { updateSchedulesAction } from '../actions'
import type { SalonSchedule } from '../types'
import { DAY_LABELS } from '../types'

interface Props {
  schedules: SalonSchedule[]
}

type RowState = Omit<SalonSchedule, 'id' | 'salonId'>

function buildInitialRows(schedules: SalonSchedule[]): RowState[] {
  return Array.from({ length: 7 }, (_, i) => {
    const existing = schedules.find(s => s.dayOfWeek === i)
    return existing
      ? { dayOfWeek: i, isOpen: existing.isOpen, openTime: existing.openTime, closeTime: existing.closeTime, breakStartTime: existing.breakStartTime, breakEndTime: existing.breakEndTime }
      : { dayOfWeek: i, isOpen: false, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null }
  })
}

const timeInput: React.CSSProperties = {
  padding: '0.375rem 0.5rem',
  border: '1px solid var(--color-border)',
  borderRadius: 6,
  fontSize: '0.8125rem',
  color: 'var(--color-text)',
  background: 'var(--color-bg)',
  width: 90,
}

export function ScheduleEditor({ schedules }: Props) {
  const [rows, setRows] = useState<RowState[]>(() => buildInitialRows(schedules))
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function update(dayOfWeek: number, patch: Partial<RowState>) {
    setRows(prev => prev.map(r => r.dayOfWeek === dayOfWeek ? { ...r, ...patch } : r))
  }

  function handleSave() {
    setMessage(null)
    startTransition(async () => {
      const result = await updateSchedulesAction(rows)
      if (result.success) {
        setMessage({ type: 'success', text: 'Horaires sauvegardés.' })
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {rows.map(row => (
        <div
          key={row.dayOfWeek}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0.625rem 0', borderBottom: '1px solid var(--color-border)' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
            <input
              type="checkbox"
              checked={row.isOpen}
              onChange={e => update(row.dayOfWeek, { isOpen: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: row.isOpen ? 600 : 400, color: 'var(--color-text)' }}>
              {DAY_LABELS[row.dayOfWeek]}
            </span>
          </label>

          {row.isOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <input type="time" style={timeInput} value={row.openTime ?? ''} onChange={e => update(row.dayOfWeek, { openTime: e.target.value || null })} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>–</span>
              <input type="time" style={timeInput} value={row.closeTime ?? ''} onChange={e => update(row.dayOfWeek, { closeTime: e.target.value || null })} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 8 }}>Pause</span>
              <input type="time" style={timeInput} value={row.breakStartTime ?? ''} onChange={e => update(row.dayOfWeek, { breakStartTime: e.target.value || null })} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>–</span>
              <input type="time" style={timeInput} value={row.breakEndTime ?? ''} onChange={e => update(row.dayOfWeek, { breakEndTime: e.target.value || null })} />
            </div>
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Fermé</span>
          )}
        </div>
      ))}

      {message && (
        <p style={{ fontSize: '0.875rem', color: message.type === 'success' ? 'green' : 'red', margin: 0 }}>
          {message.text}
        </p>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <button className="kh-btn-primary" onClick={handleSave} disabled={pending} type="button">
          {pending ? 'Sauvegarde...' : 'Sauvegarder les horaires'}
        </button>
      </div>
    </div>
  )
}
