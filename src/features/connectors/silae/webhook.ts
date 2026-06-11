import { ConnectorBase } from '../base'
import { syncSilaeLeaves, removeSilaeLeave } from './sync'
import { AppError } from '@/shared/errors'

interface SilaeWebhookPayload {
  eventId: string
  eventType: 'leave.approved' | 'leave.rejected' | 'leave.cancelled'
  leaveId: string
  employeeId: string
  startDate: string
  endDate: string
  leaveType: string
}

class SilaeConnector extends ConnectorBase {
  readonly slug = 'silae' as const

  async sync(salonId: number): Promise<void> {
    const config = await this.getConfig(salonId)
    if (!config?.credentials) throw new AppError('CONNECTOR_AUTH_FAILED', 'Clé API Silae manquante')
    // TODO: appeler l'API Silae pour récupérer tous les congés des 3 prochains mois
    // const leaves = await fetchSilaeLeaves(config.credentials as { apiKey: string })
    // await syncSilaeLeaves(salonId, leaves)
  }

  async handleWebhook(salonId: number, payload: unknown): Promise<void> {
    const data = payload as SilaeWebhookPayload

    // Idempotence — ignorer si déjà traité
    if (await this.isAlreadyProcessed(data.eventId)) {
      await this.log(salonId, 'webhook_received', 'skipped', { payload })
      return
    }

    if (data.eventType === 'leave.approved') {
      await syncSilaeLeaves(salonId, [{
        id: data.leaveId,
        employeeExternalId: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.leaveType,
        status: 'approved',
      }])
    } else if (data.eventType === 'leave.cancelled' || data.eventType === 'leave.rejected') {
      await removeSilaeLeave(salonId, data.leaveId)
    }

    await this.markProcessed(data.eventId)
    await this.log(salonId, 'webhook_received', 'success', { payload })
  }
}

export const silaeConnector = new SilaeConnector()
