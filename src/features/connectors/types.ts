export type ConnectorSlug = 'silae' | 'pennylane' | 'odoo' | 'google-calendar' | 'whatsapp' | 'factorial'
export type ConnectorCategory = 'rh' | 'comptabilite' | 'agenda' | 'communication' | 'caisse'
export type SyncStatus = 'success' | 'error' | 'pending'

export interface ConnectorDefinition {
  slug: ConnectorSlug
  name: string
  description: string
  category: ConnectorCategory
  logoColor: string
  logoInitials: string
  authType: 'oauth' | 'api_key'
  features: string[]
  setupMinutes: number
  plan: 'free' | 'pro' | 'business' // Plan minimum requis
}

export interface ConnectorConfig {
  id: number
  salonId: number
  connectorSlug: ConnectorSlug
  isActive: boolean
  settings: Record<string, unknown> | null
  lastSyncAt: Date | null
  lastSyncStatus: SyncStatus | null
  lastSyncError: string | null
}

export interface ConnectorWithStatus extends ConnectorDefinition {
  config: ConnectorConfig | null
  isConnected: boolean
}
