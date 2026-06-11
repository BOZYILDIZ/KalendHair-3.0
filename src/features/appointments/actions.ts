'use server'
import { requireSalonId } from '@/shared/auth/session'
import { createAppointmentSchema, updateAppointmentSchema } from './validations'
import { createAppointment, updateAppointmentStatus } from './mutations'
import { actionSuccess, actionError } from '@/shared/errors'
import { revalidatePath } from 'next/cache'

export async function createAppointmentAction(formData: unknown) {
  try {
    const salonId = await requireSalonId()
    const input = createAppointmentSchema.parse(formData)
    const appointment = await createAppointment(salonId, input)
    revalidatePath('/calendrier')
    revalidatePath('/rendez-vous')
    return actionSuccess(appointment)
  } catch (error) {
    return actionError(error as Error)
  }
}

export async function updateAppointmentAction(formData: unknown) {
  try {
    const salonId = await requireSalonId()
    const input = updateAppointmentSchema.parse(formData)
    const appointment = await updateAppointmentStatus(input.id, salonId, input)
    revalidatePath('/calendrier')
    revalidatePath('/rendez-vous')
    return actionSuccess(appointment)
  } catch (error) {
    return actionError(error as Error)
  }
}

export async function getSlotsAction(
  salonId: number,
  employeeId: number,
  serviceId: number,
  date: string,
): Promise<string[]> {
  const { getAvailableSlots } = await import('@/features/calendar/slots')
  const slots = await getAvailableSlots({ salonId, employeeId, serviceId, date })
  return slots.filter(s => s.available).map(s => s.startTime)
}
