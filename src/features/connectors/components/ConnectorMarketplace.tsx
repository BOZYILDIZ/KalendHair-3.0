'use client'
import { useState } from 'react'
import { CheckCircle, AlertCircle, Plug, ExternalLink } from 'lucide-react'
import type { ConnectorWithStatus } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  rh: 'RH & Congés',
  comptabilite: 'Comptabilité',
  agenda: 'Agenda',
  communication: 'Communication',
  caisse: 'Caisse',
}

interface Props { connectors: ConnectorWithStatus[] }

export function ConnectorMarketplace({ connectors }: Props) {
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...new Set(connectors.map(c => c.category))]
  const filtered = filter === 'all' ? connectors : connectors.filter(c => c.category === filter)

  return (
    <div>
      {/* Filtres */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: 20, fontSize: '0.8125rem', cursor: 'pointer',
              border: '1px solid',
              borderColor: filter === cat ? 'var(--color-primary)' : 'var(--color-border)',
              background: filter === cat ? 'var(--color-primary)' : 'transparent',
              color: filter === cat ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all 0.15s',
            }}
          >
            {cat === 'all' ? 'Tous' : CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map(connector => (
          <ConnectorCard key={connector.slug} connector={connector} />
        ))}
      </div>
    </div>
  )
}

function ConnectorCard({ connector }: { connector: ConnectorWithStatus }) {
  const { isConnected, config } = connector
  const hasError = config?.lastSyncStatus === 'error'

  return (
    <div className="kh-card" style={{
      padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: 12,
      opacity: connector.plan === 'business' ? 1 : 1,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: `${connector.logoColor}18`,
            border: `1px solid ${connector.logoColor}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: connector.logoColor,
          }}>
            {connector.logoInitials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>{connector.name}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {CATEGORY_LABELS[connector.category] ?? connector.category}
            </div>
          </div>
        </div>

        {/* Statut */}
        {isConnected && !hasError && (
          <CheckCircle size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
        )}
        {hasError && (
          <AlertCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0 }} />
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
        {connector.description}
      </p>

      {/* Features */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {connector.features.map(f => (
          <span key={f} style={{
            fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
            background: 'var(--color-bg-secondary)', padding: '0.2rem 0.5rem',
            borderRadius: 4, border: '1px solid var(--color-border)',
          }}>
            {f}
          </span>
        ))}
      </div>

      {/* Erreur */}
      {hasError && config?.lastSyncError && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', background: 'var(--color-danger-50)', padding: '0.5rem 0.625rem', borderRadius: 6 }}>
          {config.lastSyncError}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
        {isConnected ? (
          <>
            <button className="kh-btn-ghost" style={{ flex: 1, fontSize: '0.8125rem' }}>
              Configurer
            </button>
            <button style={{
              padding: '0.5rem', background: 'transparent', border: '1px solid var(--color-border)',
              borderRadius: 7, cursor: 'pointer', color: 'var(--color-text-secondary)',
            }}>
              <ExternalLink size={14} />
            </button>
          </>
        ) : (
          <button className="kh-btn-primary" style={{ flex: 1, fontSize: '0.8125rem' }}>
            <Plug size={13} />
            Connecter ({connector.setupMinutes} min)
          </button>
        )}
      </div>
    </div>
  )
}
