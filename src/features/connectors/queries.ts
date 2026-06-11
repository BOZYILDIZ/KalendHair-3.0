import { db } from '@/shared/db/client'
import { connectorConfigs } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { CONNECTORS } from './registry'
import type { ConnectorWithStatus } from './types'

export async function getConnectorsWithStatus(salonId: number): Promise<ConnectorWithStatus[]> {
  const configs = await db.query.connectorConfigs.findMany({
    where: eq(connectorConfigs.salonId, salonId),
  })

  return CONNECTORS.map(def => {
    const config = configs.find(c => c.connectorSlug === def.slug) ?? null
    return {
      ...def,
      config: config ? {
        id: config.id,
        salonId: config.salonId,
        connectorSlug: config.connectorSlug as typeof def.slug,
        isActive: config.isActive,
        settings: config.settings as Record<string, unknown> | null,
        lastSyncAt: config.lastSyncAt,
        lastSyncStatus: config.lastSyncStatus as 'success' | 'error' | 'pending' | null,
        lastSyncError: config.lastSyncError,
      } : null,
      isConnected: config?.isActive ?? false,
    }
  })
}
