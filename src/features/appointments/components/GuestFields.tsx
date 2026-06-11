'use client'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.625rem',
  fontSize: '0.875rem',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-bg-card)',
  color: 'var(--color-text)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: '0.25rem',
}

interface GuestData {
  guestFirstName: string
  guestLastName: string
  guestEmail: string
  guestPhone: string
}

interface Props {
  clientType: 'existing' | 'guest'
  guestData: GuestData
  onClientTypeChange: (type: 'existing' | 'guest') => void
  onGuestChange: (field: keyof GuestData, value: string) => void
}

export function GuestFields({ clientType, guestData, onClientTypeChange, onGuestChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {(['existing', 'guest'] as const).map(type => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input
              type="radio"
              name="clientType"
              value={type}
              checked={clientType === type}
              onChange={() => onClientTypeChange(type)}
              style={{ accentColor: 'var(--color-primary)' }}
            />
            {type === 'existing' ? 'Client existant' : 'Invité (sans compte)'}
          </label>
        ))}
      </div>

      {clientType === 'existing' ? (
        <div style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-muted)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.625rem 0.75rem',
        }}>
          Recherche client non disponible — RDV créé comme invité
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={labelStyle}>Prénom *</label>
              <input style={inputStyle} value={guestData.guestFirstName} onChange={e => onGuestChange('guestFirstName', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input style={inputStyle} value={guestData.guestLastName} onChange={e => onGuestChange('guestLastName', e.target.value)} required />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} value={guestData.guestEmail} onChange={e => onGuestChange('guestEmail', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input type="tel" style={inputStyle} value={guestData.guestPhone} onChange={e => onGuestChange('guestPhone', e.target.value)} />
          </div>
        </div>
      )}
    </div>
  )
}
