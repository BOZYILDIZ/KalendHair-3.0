import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const createDb = () =>
  drizzle(
    postgres(process.env.DATABASE_URL!, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    }),
    { schema },
  )

type Db = ReturnType<typeof createDb>
const globalForDb = globalThis as unknown as { db: Db }

export const db: Db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
