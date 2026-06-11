import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getClients } from '@/features/clients/queries'
import { ClientList } from '@/features/clients/components/ClientList'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const salonId = await requireSalonId()
  const clients = await getClients(salonId)

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: 0,
        }}>
          Clients
        </h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </span>
      </div>
      <ClientList clients={clients} />
    </div>
  )
}
