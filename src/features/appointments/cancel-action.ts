'use server'
import { db } from '@/shared/db/client'
import { appointments, cancellationTokens } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { AppError, actionSuccess, actionError } from '@/shared/errors'
import { getAppointmentByToken } from './token-queries'

export async function cancelByTokenAction(token: string) {
  try {
    const result = await getAppointmentByToken(token)

    if (!result) {
      throw new AppError('TOKEN_INVALID', 'Ce lien d\'annulation est invalide.')
    }

    if (result.usedAt !== null) {
      throw new AppError('TOKEN_USED', 'Ce rendez-vous a déjà été annulé.')
    }

    if (result.expiresAt < new Date()) {
      throw new AppError('TOKEN_EXPIRED', 'Ce lien d\'annulation a expiré.')
    }

    if (result.appointment.status === 'cancelled') {
      throw new AppError('TOKEN_USED', 'Ce rendez-vous a déjà été annulé.')
    }

    await db.transaction(async (tx) => {
      await tx
        .update(appointments)
        .set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date() })
        .where(eq(appointments.id, result.appointmentId))

      await tx
        .update(cancellationTokens)
        .set({ usedAt: new Date() })
        .where(eq(cancellationTokens.id, result.tokenId))
    })

    return actionSuccess({ appointmentId: result.appointmentId })
  } catch (e) {
    return actionError(e instanceof Error ? e : new AppError('INTERNAL_ERROR', 'Erreur inattendue'))
  }
}
