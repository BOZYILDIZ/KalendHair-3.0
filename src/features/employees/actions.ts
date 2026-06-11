'use server'
import { revalidatePath } from 'next/cache'
import { requireSalonId } from '@/shared/auth/session'
import { createEmployeeSchema } from './validations'
import { createEmployee, deleteEmployee } from './mutations'
import { actionSuccess, actionError, AppError } from '@/shared/errors'

export async function createEmployeeAction(formData: FormData) {
  const salonId = await requireSalonId()
  const parsed = createEmployeeSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return actionError(new AppError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides'))

  const emp = await createEmployee(salonId, parsed.data)
  revalidatePath('/employes')
  return actionSuccess(emp)
}

export async function deleteEmployeeAction(id: number) {
  const salonId = await requireSalonId()
  await deleteEmployee(id, salonId)
  revalidatePath('/employes')
  return actionSuccess(null)
}
