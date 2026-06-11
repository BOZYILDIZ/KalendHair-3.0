import type { Metadata } from 'next'
import { RegisterForm } from '@/features/salons/components/RegisterForm'

export const metadata: Metadata = { title: 'Créer mon salon — KalendHair' }

export default function InscriptionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}>
      <div className="w-full" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
            <div style={{ width: 40, height: 40, background: 'var(--color-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
              KalendHair
            </h1>
          </div>
          <p style={{ fontSize: '.9375rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '.375rem' }}>
            Créez votre espace salon en 2 minutes
          </p>
          <p style={{ fontSize: '.875rem', color: 'var(--color-text-secondary)' }}>
            Gratuit · Sans carte bancaire
          </p>
        </div>

        <div className="kh-card p-6">
          <RegisterForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.8125rem', color: 'var(--color-text-secondary)' }}>
          Déjà un compte ?{' '}
          <a href="/connexion" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Se connecter
          </a>
        </p>
      </div>
    </main>
  )
}
