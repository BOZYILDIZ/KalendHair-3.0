import { db } from '@/shared/db/client'
import { subscriptions } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import type { CurrentSubscription } from './types'

export async function getSubscription(salonId: number): Promise<CurrentSubscription | null> {
  const row = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.salonId, salonId),
  })

  if (!row) return null

  return {
    id: row.id,
    salonId: row.salonId,
    stripeCustomerId: row.stripeCustomerId ?? null,
    stripeSubscriptionId: row.stripeSubscriptionId ?? null,
    plan: row.plan,
    status: row.status,
    currentPeriodEnd: row.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: row.cancelAtPeriodEnd,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}
