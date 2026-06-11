'use server'
import { revalidatePath } from 'next/cache'
import { requireSalonId } from '@/shared/auth/session'
import { salonInfoSchema, schedulesSchema } from './validations'
import { updateSalonInfo, upsertSchedules } from './mutations'
import { actionSuccess, actionError, AppError } from '@/shared/errors'
import type { ScheduleInput } from './types'

export async function updateSalonInfoAction(formData: FormData) {
  try {
    const salonId = await requireSalonId()
    const raw = Object.fromEntries(formData)
    const parsed = salonInfoSchema.safeParse(raw)

    if (!parsed.success) {
      return actionError(
        new AppError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides'),
      )
    }

    await updateSalonInfo(salonId, parsed.data)
    revalidatePath('/parametres')
    return actionSuccess(null)
  } catch (error) {
    return actionError(error instanceof Error ? error : new Error('Erreur inconnue'))
  }
}

export async function updateSchedulesAction(schedules: ScheduleInput[]) {
  try {
    const salonId = await requireSalonId()
    const parsed = schedulesSchema.safeParse(schedules)

    if (!parsed.success) {
      return actionError(
        new AppError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Horaires invalides'),
      )
    }

    await upsertSchedules(salonId, parsed.data)
    revalidatePath('/parametres')
    return actionSuccess(null)
  } catch (error) {
    return actionError(error instanceof Error ? error : new Error('Erreur inconnue'))
  }
}
