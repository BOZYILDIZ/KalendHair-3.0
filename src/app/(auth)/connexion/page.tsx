import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function ConnexionPage() {
  return (
    <main className="auth-page min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #F5EDE2 0%, #FAF7F2 50%, #F0E8DA 100%)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
            <div style={{ width: 44, height: 44, background: 'var(--color-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(193,122,74,0.35)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.625rem', fontWeight: 700, color: 'var(--color-text)' }}>
              KalendHair
            </h1>
          </div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '.25rem' }}>
            Accédez à votre espace salon
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 8px 32px rgba(44,26,14,0.14), 0 2px 8px rgba(44,26,14,0.08)', border: '1px solid rgba(226,213,200,0.6)' }}>
          <LoginForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.875rem', color: 'var(--color-text-secondary)' }}>
          Pas encore de compte ?{' '}
          <a href="/inscription" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Créer mon salon gratuitement
          </a>
        </p>
      </div>
    </main>
  )
}
