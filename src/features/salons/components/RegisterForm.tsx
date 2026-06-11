'use client'
import { useState, useTransition, useEffect } from 'react'
import { Eye, EyeOff, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { registerSalonAction, checkSlugAction } from '../actions'
import { registerSchema } from '../validations'
import type { z } from 'zod'

type Fields = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [form, setForm] = useState<Fields & { confirmPassword: string }>({
    salonName: '', ownerFirstName: '', ownerLastName: '',
    email: '', password: '', phone: '', city: '', confirmPassword: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [slugOk, setSlugOk] = useState(true)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Preview du slug en temps réel
  useEffect(() => {
    if (!form.salonName) { setSlug(null); return }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await checkSlugAction(form.salonName)
        setSlug(res.slug)
        setSlugOk(res.available)
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [form.salonName])

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return }
    startTransition(async () => {
      const res = await registerSalonAction(form)
      if (res.success) {
        router.push('/?onboarding=1')
      } else {
        setError(res.error.message)
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '.625rem .875rem', border: '1px solid var(--color-border)',
    borderRadius: 8, fontSize: '.875rem', background: 'var(--color-bg)', outline: 'none',
    transition: 'border-color .15s',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>
          Nom du salon *
        </label>
        <input value={form.salonName} onChange={set('salonName')} placeholder="Ex: Salon Isabelle" style={inputStyle} required />
        {slug && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '.375rem' }}>
            {slugOk
              ? <Check size={12} color="var(--color-success)" />
              : <span style={{ fontSize: '.6875rem', color: 'var(--color-danger)' }}>✕</span>}
            <span style={{ fontSize: '.6875rem', color: slugOk ? 'var(--color-text-muted)' : 'var(--color-danger)' }}>
              kalendhair.fr/<strong>{slug}</strong> — {slugOk ? 'disponible' : 'déjà pris'}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Prénom *</label>
          <input value={form.ownerFirstName} onChange={set('ownerFirstName')} placeholder="Prénom" style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Nom *</label>
          <input value={form.ownerLastName} onChange={set('ownerLastName')} placeholder="Nom" style={inputStyle} required />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Email professionnel *</label>
        <input type="email" value={form.email} onChange={set('email')} placeholder="vous@votresalon.fr" style={inputStyle} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Téléphone</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="06 XX XX XX XX" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Ville</label>
          <input value={form.city} onChange={set('city')} placeholder="Paris" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Mot de passe *</label>
        <div style={{ position: 'relative' }}>
          <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Minimum 8 caractères" style={{ ...inputStyle, paddingRight: '2.5rem' }} required />
          <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '.375rem' }}>Confirmer le mot de passe *</label>
        <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Répétez le mot de passe" style={inputStyle} required />
      </div>

      {error && (
        <div style={{ background: '#C0392B18', color: 'var(--color-danger)', padding: '.625rem .875rem', borderRadius: 8, fontSize: '.8125rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={isPending} style={{
        width: '100%', padding: '.875rem', background: 'var(--color-primary)', color: '#fff',
        border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
        opacity: isPending ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        {isPending ? <><Loader2 size={16} className="animate-spin" /> Création du salon…</> : 'Créer mon salon gratuitement'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--color-text-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
        En créant un compte vous acceptez nos{' '}
        <a href="/cgu" style={{ color: 'var(--color-primary)' }}>CGU</a> et notre{' '}
        <a href="/confidentialite" style={{ color: 'var(--color-primary)' }}>politique de confidentialité</a>.
      </p>
    </form>
  )
}
