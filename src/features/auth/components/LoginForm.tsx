'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/')
  }

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: 8, fontSize: '0.875rem',
    background: 'var(--color-bg)', color: 'var(--color-text)',
    outline: 'none',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="votre@email.fr" required autoComplete="email"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: 6 }}>
          Mot de passe
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password"
            style={{ ...inputStyle, paddingRight: '2.5rem' }}
          />
          <button
            type="button" onClick={() => setShowPassword(v => !v)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <a href="/mot-de-passe-oublie" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)' }}>
          Mot de passe oublié ?
        </a>
      </div>

      {error && (
        <div style={{ padding: '0.625rem 0.75rem', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: 8, fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="kh-btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', opacity: loading ? 0.7 : 1 }}
      >
        <LogIn size={16} />
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
