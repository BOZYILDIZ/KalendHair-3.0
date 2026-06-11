'use server'
import { revalidatePath } from 'next/cache'
import { requireSalonId } from '@/shared/auth/session'
import { actionSuccess, actionError } from '@/shared/errors'
import { approveReview, hideReview, replyToReview } from './mutations'

export async function approveReviewAction(id: number) {
  try {
    const salonId = await requireSalonId()
    const review = await approveReview(id, salonId)
    revalidatePath('/avis')
    return actionSuccess(review)
  } catch (error) {
    return actionError(error as Error)
  }
}

export async function hideReviewAction(id: number) {
  try {
    const salonId = await requireSalonId()
    const review = await hideReview(id, salonId)
    revalidatePath('/avis')
    return actionSuccess(review)
  } catch (error) {
    return actionError(error as Error)
  }
}

export async function replyToReviewAction(id: number, reply: string) {
  try {
    const salonId = await requireSalonId()
    const review = await replyToReview(id, salonId, reply)
    revalidatePath('/avis')
    return actionSuccess(review)
  } catch (error) {
    return actionError(error as Error)
  }
}
