import { db } from '@/shared/db/client'
import { reviews } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import { AppError } from '@/shared/errors'

async function assertOwnership(id: number, salonId: number) {
  const review = await db.query.reviews.findFirst({
    where: and(eq(reviews.id, id), eq(reviews.salonId, salonId)),
  })
  if (!review) throw new AppError('NOT_FOUND', 'Avis introuvable')
  return review
}

export async function approveReview(id: number, salonId: number) {
  await assertOwnership(id, salonId)
  const [updated] = await db
    .update(reviews)
    .set({ isApproved: true, isVisible: true })
    .where(and(eq(reviews.id, id), eq(reviews.salonId, salonId)))
    .returning()
  return updated
}

export async function hideReview(id: number, salonId: number) {
  await assertOwnership(id, salonId)
  const [updated] = await db
    .update(reviews)
    .set({ isVisible: false })
    .where(and(eq(reviews.id, id), eq(reviews.salonId, salonId)))
    .returning()
  return updated
}

export async function replyToReview(id: number, salonId: number, reply: string) {
  await assertOwnership(id, salonId)
  const trimmed = reply.trim()
  if (!trimmed) throw new AppError('VALIDATION_ERROR', 'La réponse ne peut pas être vide')
  const [updated] = await db
    .update(reviews)
    .set({ ownerReply: trimmed })
    .where(and(eq(reviews.id, id), eq(reviews.salonId, salonId)))
    .returning()
  return updated
}
