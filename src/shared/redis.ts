import { Redis } from '@upstash/redis'

// Singleton Redis — utilisé pour idempotence webhooks, cache, rate limiting
const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis = globalForRedis.redis ?? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// Helpers idempotence pour les webhooks
export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  const key = `webhook:${eventId}`
  const exists = await redis.exists(key)
  return exists === 1
}

export async function markWebhookProcessed(eventId: string, ttlSeconds = 86_400): Promise<void> {
  await redis.setex(`webhook:${eventId}`, ttlSeconds, '1')
}
