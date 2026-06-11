import { db } from '@/shared/db/client'
import { closedDays } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'

interface SilaeLeave {
  id: string
  employeeExternalId: string
  startDate: string  // 'YYYY-MM-DD'
  endDate: string    // 'YYYY-MM-DD'
  type: string
  status: 'approved' | 'pending' | 'rejected'
}

// Convertit un congé Silae en fermetures par jour dans KalendHair
export async function syncSilaeLeaves(salonId: number, leaves: SilaeLeave[]): Promise<void> {
  const approvedLeaves = leaves.filter(l => l.status === 'approved')

  for (const leave of approvedLeaves) {
    const dates = getDatesInRange(leave.startDate, leave.endDate)

    for (const date of dates) {
      // ON CONFLICT DO NOTHING — idempotent
      await db.insert(closedDays)
        .values({
          salonId,
          date,
          reason: `Congé Silae (${leave.type})`,
          source: 'silae',
          externalId: `${leave.id}:${date}`,
        })
        .onConflictDoNothing()
    }
  }
}

// Supprime les fermetures liées à un congé annulé
export async function removeSilaeLeave(salonId: number, leaveId: string): Promise<void> {
  // Supprime toutes les closed_days avec source='silae' et externalId commençant par leaveId
  const existingDays = await db.query.closedDays.findMany({
    where: and(eq(closedDays.salonId, salonId), eq(closedDays.source, 'silae')),
  })

  const toDelete = existingDays.filter(d => d.externalId?.startsWith(`${leaveId}:`))
  for (const day of toDelete) {
    await db.delete(closedDays).where(eq(closedDays.id, day.id))
  }
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0]!)
    current.setDate(current.getDate() + 1)
  }
  return dates
}
