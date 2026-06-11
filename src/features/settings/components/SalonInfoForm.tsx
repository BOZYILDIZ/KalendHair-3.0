'use client'
import { useTransition, useState } from 'react'
import { updateSalonInfoAction } from '../actions'
import type { SalonSettings } from '../types'

interface Props {
  salon: SalonSettings
}

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const label: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const input: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid var(--color-border)',
  borderRadius: 6,
  fontSize: '0.875rem',
  color: 'var(--color-text)',
  background: 'var(--color-bg)',
  width: '100%',
  boxSizing: 'border-box',
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
}

export function SalonInfoForm({ salon }: Props) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setMessage(null)

    startTransition(async () => {
      const result = await updateSalonInfoAction(formData)
      if (result.success) {
        setMessage({ type: 'success', text: 'Informations sauvegardées.' })
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={grid}>
        <div style={field}>
          <label style={label}>Nom du salon</label>
          <input style={input} name="name" defaultValue={salon.name} maxLength={100} />
        </div>
        <div style={field}>
          <label style={label}>Email</label>
          <input style={input} type="email" name="email" defaultValue={salon.email ?? ''} />
        </div>
      </div>

      <div style={field}>
        <label style={label}>Description</label>
        <textarea
          name="description"
          defaultValue={salon.description ?? ''}
          rows={3}
          style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={grid}>
        <div style={field}>
          <label style={label}>Téléphone</label>
          <input style={input} name="phone" defaultValue={salon.phone ?? ''} />
        </div>
        <div style={field}>
          <label style={label}>Adresse</label>
          <input style={input} name="address" defaultValue={salon.address ?? ''} />
        </div>
      </div>

      <div style={grid}>
        <div style={field}>
          <label style={label}>Code postal</label>
          <input style={input} name="postalCode" defaultValue={salon.postalCode ?? ''} maxLength={10} />
        </div>
        <div style={field}>
          <label style={label}>Ville</label>
          <input style={input} name="city" defaultValue={salon.city ?? ''} maxLength={100} />
        </div>
      </div>

      {message && (
        <p style={{ fontSize: '0.875rem', color: message.type === 'success' ? 'green' : 'red', margin: 0 }}>
          {message.text}
        </p>
      )}

      <div>
        <button type="submit" className="kh-btn-primary" disabled={pending}>
          {pending ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  )
}
