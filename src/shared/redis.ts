import { Redis } from '@upstash/redis'

// Singleton Redis — utilisé pour idempotence webhooks, cache, rate limiting
// Gracefully degrade when Upstash is not configured
const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && !process.env.UPSTASH_REDIS_REST_URL.includes('placeholder'))

const globalForRedis = globalThis as unknown as { redis: Redis | null }

export const redis: Redis | null = hasRedis
  ? (globalForRedis.redis ?? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }))
  : null

if (process.env.NODE_ENV !== 'production' && redis) {
  globalForRedis.redis = redis
}

export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  if (!redis) return false
  const exists = await redis.exists(`webhook:${eventId}`)
  return exists === 1
}

export async function markWebhookProcessed(eventId: string, ttlSeconds = 86_400): Promise<void> {
  if (!redis) return
  await redis.setex(`webhook:${eventId}`, ttlSeconds, '1')
}
