import { db } from '@/shared/db/client'
import { connectorConfigs, connectorLogs } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import { isWebhookProcessed, markWebhookProcessed } from '@/shared/redis'
import type { ConnectorSlug } from './types'

// Classe de base — chaque connecteur hérite de cette classe
export abstract class ConnectorBase {
  abstract readonly slug: ConnectorSlug

  // À implémenter par chaque connecteur
  abstract sync(salonId: number): Promise<void>
  abstract handleWebhook(salonId: number, payload: unknown): Promise<void>

  // Récupère la config du connecteur pour un salon
  protected async getConfig(salonId: number) {
    return db.query.connectorConfigs.findFirst({
      where: and(
        eq(connectorConfigs.salonId, salonId),
        eq(connectorConfigs.connectorSlug, this.slug),
        eq(connectorConfigs.isActive, true),
      ),
    })
  }

  // Idempotence — retourne true si l'event a déjà été traité
  protected async isAlreadyProcessed(eventId: string): Promise<boolean> {
    return isWebhookProcessed(`${this.slug}:${eventId}`)
  }

  // Marque l'event comme traité
  protected async markProcessed(eventId: string): Promise<void> {
    await markWebhookProcessed(`${this.slug}:${eventId}`)
  }

  // Log une action du connecteur
  protected async log(
    salonId: number,
    eventType: 'webhook_received' | 'job_started' | 'job_success' | 'job_failed',
    status: 'success' | 'error' | 'skipped',
    options: { payload?: unknown; errorMessage?: string; durationMs?: number } = {}
  ) {
    await db.insert(connectorLogs).values({
      salonId,
      connectorSlug: this.slug,
      eventType,
      status,
      payload: options.payload ? (options.payload as Record<string, unknown>) : null,
      errorMessage: options.errorMessage ?? null,
      durationMs: options.durationMs ?? null,
    })
  }

  // Exécute le sync avec gestion des erreurs et logs
  async safeSync(salonId: number): Promise<void> {
    const start = Date.now()
    try {
      await this.log(salonId, 'job_started', 'success')
      await this.sync(salonId)
      await this.log(salonId, 'job_success', 'success', { durationMs: Date.now() - start })
      await db.update(connectorConfigs)
        .set({ lastSyncAt: new Date(), lastSyncStatus: 'success', lastSyncError: null })
        .where(and(eq(connectorConfigs.salonId, salonId), eq(connectorConfigs.connectorSlug, this.slug)))
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erreur inconnue'
      await this.log(salonId, 'job_failed', 'error', { errorMessage: msg, durationMs: Date.now() - start })
      await db.update(connectorConfigs)
        .set({ lastSyncAt: new Date(), lastSyncStatus: 'error', lastSyncError: msg })
        .where(and(eq(connectorConfigs.salonId, salonId), eq(connectorConfigs.connectorSlug, this.slug)))
    }
  }
}
