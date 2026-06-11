'use client'
import { Bell, Plus, ChevronDown } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface TopbarProps {
  salonName: string
  userEmail: string
}

export function Topbar({ salonName, userEmail }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      padding: '0 1.5rem',
      height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--color-bg-card)',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
    }}>
      {/* Titre dynamique — sera surchargé par les pages via next/navigation */}
      <div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
          {salonName}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Nouveau RDV */}
        <button className="kh-btn-primary" style={{ fontSize: '0.8125rem' }}>
          <Plus size={15} />
          Nouveau RDV
        </button>

        {/* Notifications */}
        <button className="kh-btn-ghost" style={{ padding: '0.5rem' }} aria-label="Notifications">
          <Bell size={17} />
        </button>

        {/* Avatar menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: '1px solid var(--color-border)',
              borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--color-primary-50)', border: '2px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-primary)',
            }}>
              {userEmail.slice(0, 1).toUpperCase()}
            </div>
            <ChevronDown size={14} color="var(--color-text-secondary)" />
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
              borderRadius: 10, boxShadow: 'var(--shadow-md)', minWidth: 180,
              zIndex: 50, padding: '0.25rem',
            }}>
              <div style={{ padding: '0.625rem 0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text)' }}>{userEmail}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/connexion' })}
                style={{
                  width: '100%', padding: '0.5rem 0.75rem', background: 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.8125rem', color: 'var(--color-danger)', borderRadius: 7,
                }}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
