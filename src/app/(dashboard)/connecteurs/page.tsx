import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getConnectorsWithStatus } from '@/features/connectors/queries'
import { ConnectorMarketplace } from '@/features/connectors/components/ConnectorMarketplace'

export const metadata: Metadata = { title: 'Connecteurs' }

export default async function ConnecteursPage() {
  const salonId = await requireSalonId()
  const connectors = await getConnectorsWithStatus(salonId)

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
          Connecteurs
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Connectez vos outils professionnels pour automatiser votre gestion.
        </p>
      </div>
      <ConnectorMarketplace connectors={connectors} />
    </div>
  )
}
