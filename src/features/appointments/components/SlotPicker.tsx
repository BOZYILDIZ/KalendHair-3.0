'use client'

interface Props {
  slots: string[]
  selected: string
  loading: boolean
  onChange: (slot: string) => void
}

export function SlotPicker({ slots, selected, loading, onChange }: Props) {
  if (loading) {
    return (
      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', padding: '0.75rem 0' }}>
        Chargement des créneaux…
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div style={{
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem',
        textAlign: 'center',
      }}>
        Aucun créneau disponible pour cette sélection
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
      gap: '0.375rem',
      maxHeight: 160,
      overflowY: 'auto',
      paddingRight: 2,
    }}>
      {slots.map(slot => (
        <button
          key={slot}
          type="button"
          onClick={() => onChange(slot)}
          style={{
            padding: '0.375rem 0',
            fontSize: '0.8125rem',
            fontWeight: selected === slot ? 600 : 400,
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${selected === slot ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: selected === slot ? 'var(--color-primary)' : 'var(--color-bg-card)',
            color: selected === slot ? '#fff' : 'var(--color-text)',
            cursor: 'pointer',
            transition: 'all 0.1s',
          }}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}
