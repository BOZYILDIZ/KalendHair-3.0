'use client'

import { useState } from 'react'
import type { ClientWithStats } from '../types'

interface Props { clients: ClientWithStats[] }

function formatDate(value: string | Date | null): string {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ClientList({ clients }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? clients.filter(c => {
        const q = search.toLowerCase()
        return (
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone ?? '').includes(q)
        )
      })
    : clients

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder="Rechercher un client…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 360,
            padding: '0.5rem 0.75rem',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: '0.875rem',
            color: 'var(--color-text)',
            background: 'var(--color-bg)',
            outline: 'none',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="kh-card"
          style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}
        >
          {search ? 'Aucun client ne correspond à cette recherche.' : 'Aucun client pour le moment.'}
        </div>
      ) : (
        <div className="kh-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                {['Nom', 'Email', 'Téléphone', 'RDV', 'Dernière visite', 'Client depuis'].map(h => (
                  <th
                    key={h}
                    style={{
                      padding: '0.625rem 1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--color-primary)', color: '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6875rem', fontWeight: 700,
                      }}>
                        {c.firstName[0]}{c.lastName[0]}
                      </span>
                      {c.firstName} {c.lastName}
                      {!c.isActive && (
                        <span className="kh-badge kh-badge-danger" style={{ fontSize: '0.625rem' }}>Inactif</span>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)' }}>{c.email}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)' }}>{c.phone ?? '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <span className="kh-badge" style={{ minWidth: 28, justifyContent: 'center' }}>
                      {c.appointmentCount}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(c.lastVisitDate)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(c.salonJoinedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
