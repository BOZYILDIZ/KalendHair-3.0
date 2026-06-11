import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/shared/db/client'
import { connectorConfigs } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import { silaeConnector } from '@/features/connectors/silae/webhook'
import { redis } from '@/shared/redis'

// Vérifie la signature HMAC-SHA256 du webhook Silae
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )
  const sigBytes = Buffer.from(signature.replace('sha256=', ''), 'hex')
  return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload))
}

export async function POST(req: NextRequest) {
  // Identifier le salon via le header X-Silae-Salon-Id
  const salonId = req.headers.get('x-silae-salon-id')
  const signature = req.headers.get('x-silae-signature') ?? ''

  if (!salonId) {
    return NextResponse.json({ error: 'Missing X-Silae-Salon-Id header' }, { status: 400 })
  }

  const rawBody = await req.text()

  // Récupérer les credentials du connecteur pour vérifier la signature
  const config = await db.query.connectorConfigs.findFirst({
    where: and(
      eq(connectorConfigs.salonId, parseInt(salonId)),
      eq(connectorConfigs.connectorSlug, 'silae'),
      eq(connectorConfigs.isActive, true),
    ),
  })

  if (!config?.credentials) {
    return NextResponse.json({ error: 'Connector not found or disabled' }, { status: 404 })
  }

  const creds = config.credentials as { apiKey: string; webhookSecret: string }
  if (!(await verifySignature(rawBody, signature, creds.webhookSecret))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(rawBody)
    await silaeConnector.handleWebhook(parseInt(salonId), payload)
    return NextResponse.json({ received: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
