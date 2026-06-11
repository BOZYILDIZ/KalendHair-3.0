import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata: Metadata = { title: 'Connexion' }

export default function ConnexionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div style={{
              width: 40, height: 40,
              background: 'var(--color-primary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
              KalendHair
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Accédez à votre espace salon
          </p>
        </div>

        {/* Card */}
        <div className="kh-card p-6">
          <LoginForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Pas encore de compte ?{' '}
          <a href="/inscription" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Créer mon salon
          </a>
        </p>
      </div>
    </main>
  )
}
