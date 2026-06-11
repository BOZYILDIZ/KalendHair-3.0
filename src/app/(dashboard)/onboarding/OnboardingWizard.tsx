'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSalonInfoAction } from '@/features/settings/actions'
import { createServiceAction } from '@/features/services/actions'
import { completeOnboardingAction } from '@/features/salons/actions'

const TC = '#C17A4A'
const btn: React.CSSProperties = { background: TC, color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 2rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1.5rem' }
const inp: React.CSSProperties = { width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1.5px solid #e0d4c8', fontSize: '1rem', marginTop: '0.25rem', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { fontWeight: 600, color: '#4a3728', fontSize: '0.9rem' }
const h2s: React.CSSProperties = { fontSize: '1.4rem', fontWeight: 700, color: '#2d1a0e', marginBottom: '1.5rem' }

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={lbl}>{label}</label>
      <input name={name} required={required} type={type} min={type === 'number' ? 0 : undefined} style={inp} />
    </div>
  )
}

function Dots({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', background: n === current ? TC : n < current ? '#e8d5c4' : '#f3ebe3', color: n === current ? '#fff' : n < current ? TC : '#999', border: `2px solid ${n <= current ? TC : '#e0d4c8'}` }}>{n}</div>
      ))}
    </div>
  )
}

export function OnboardingWizard({ salonId: _salonId }: { salonId: number }) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction(action: () => Promise<{ success: boolean; error?: string }>, next: number) {
    setError(null)
    setLoading(true)
    const result = await action()
    setLoading(false)
    if (!result.success) { setError(result.error ?? 'Erreur'); return }
    setStep(next)
  }

  return (
    <div style={{ maxWidth: 520, margin: '3rem auto', padding: '2.5rem', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Dots current={step} />

      {step === 1 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2d1a0e', marginBottom: '0.75rem' }}>Bienvenue sur KalendHair</h1>
          <p style={{ color: '#7a5c44', lineHeight: 1.6 }}>Votre espace pro est prêt. Configurons ensemble votre salon en quelques étapes pour que vos clients puissent vous réserver facilement.</p>
          <button style={btn} onClick={() => setStep(2)}>Commencer</button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); handleAction(() => updateSalonInfoAction(new FormData(e.currentTarget)), 3) }}>
          <h2 style={h2s}>Votre salon</h2>
          <Field label="Nom du salon *" name="name" required />
          <Field label="Téléphone" name="phone" />
          <Field label="Adresse" name="address" />
          <Field label="Ville" name="city" />
          {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>{loading ? 'Enregistrement…' : 'Continuer'}</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={(e) => { e.preventDefault(); handleAction(() => createServiceAction(new FormData(e.currentTarget)), 4) }}>
          <h2 style={h2s}>Votre premier service</h2>
          <Field label="Nom du service *" name="name" required />
          <Field label="Durée (minutes) *" name="durationMinutes" type="number" required />
          <Field label="Prix (€)" name="price" type="number" />
          {error && <p style={{ color: '#c0392b', fontSize: '0.875rem' }}>{error}</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>{loading ? 'Enregistrement…' : 'Continuer'}</button>
            <button type="button" onClick={() => setStep(4)} style={{ background: 'none', border: 'none', color: TC, cursor: 'pointer', fontWeight: 600, marginTop: '1.5rem' }}>Passer cette étape →</button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2d1a0e', marginBottom: '0.75rem' }}>C&apos;est prêt !</h2>
          <p style={{ color: '#7a5c44', lineHeight: 1.6 }}>Votre salon est configuré. Vous pouvez maintenant gérer vos réservations, vos employés et vos services depuis votre tableau de bord.</p>
          <button disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }} onClick={async () => { setLoading(true); await completeOnboardingAction(); router.push('/') }}>
            {loading ? 'Chargement…' : 'Accéder au tableau de bord'}
          </button>
        </div>
      )}
    </div>
  )
}
