import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Vercel serverless: disable persistent connections, use transaction pooler
const isServerless = process.env.VERCEL === '1'

const createDb = () =>
  drizzle(
    postgres(process.env.DATABASE_URL!, {
      max: isServerless ? 1 : 10,
      idle_timeout: isServerless ? 0 : 20,
      connect_timeout: 10,
      prepare: false, // required for pgBouncer / Supabase transaction pooler
    }),
    { schema },
  )

type Db = ReturnType<typeof createDb>
const globalForDb = globalThis as unknown as { db: Db }

export const db: Db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
