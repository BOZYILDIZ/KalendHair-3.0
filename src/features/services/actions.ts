'use server'
import { revalidatePath } from 'next/cache'
import { requireSalonId } from '@/shared/auth/session'
import { createServiceSchema } from './validations'
import { createService, deleteService } from './mutations'
import { actionSuccess, actionError } from '@/shared/errors'

export async function createServiceAction(formData: FormData) {
  const salonId = await requireSalonId()
  const parsed = createServiceSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return actionError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides')

  const svc = await createService(salonId, parsed.data)
  revalidatePath('/services')
  return actionSuccess(svc)
}

export async function deleteServiceAction(id: number) {
  const salonId = await requireSalonId()
  await deleteService(id, salonId)
  revalidatePath('/services')
  return actionSuccess(null)
}
