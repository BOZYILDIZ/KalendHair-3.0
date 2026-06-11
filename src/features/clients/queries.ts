import { db } from '@/shared/db/client'
import { salonClients, clientAccounts, appointments } from '@/shared/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import type { ClientWithStats } from './types'

export async function getClients(salonId: number): Promise<ClientWithStats[]> {
  const rows = await db
    .select({
      id: clientAccounts.id,
      email: clientAccounts.email,
      firstName: clientAccounts.firstName,
      lastName: clientAccounts.lastName,
      phone: clientAccounts.phone,
      isActive: clientAccounts.isActive,
      createdAt: clientAccounts.createdAt,
      salonJoinedAt: salonClients.createdAt,
      appointmentCount: sql<number>`cast(count(${appointments.id}) as int)`,
      lastVisitDate: sql<string | null>`max(${appointments.appointmentDate})`,
    })
    .from(salonClients)
    .innerJoin(clientAccounts, eq(salonClients.clientAccountId, clientAccounts.id))
    .leftJoin(
      appointments,
      sql`${appointments.clientAccountId} = ${clientAccounts.id} and ${appointments.salonId} = ${salonClients.salonId}`,
    )
    .where(eq(salonClients.salonId, salonId))
    .groupBy(
      clientAccounts.id,
      clientAccounts.email,
      clientAccounts.firstName,
      clientAccounts.lastName,
      clientAccounts.phone,
      clientAccounts.isActive,
      clientAccounts.createdAt,
      salonClients.createdAt,
    )
    .orderBy(desc(salonClients.createdAt))

  return rows.map(r => ({
    id: r.id,
    email: r.email,
    firstName: r.firstName,
    lastName: r.lastName,
    phone: r.phone,
    isActive: r.isActive,
    createdAt: r.createdAt,
    salonJoinedAt: r.salonJoinedAt,
    appointmentCount: r.appointmentCount ?? 0,
    lastVisitDate: r.lastVisitDate ?? null,
  }))
}
