import { db } from '@/shared/db/client'
import { reviews, clientAccounts } from '@/shared/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { ReviewWithClient } from './types'

export async function getReviews(salonId: number): Promise<ReviewWithClient[]> {
  const rows = await db
    .select({
      id: reviews.id,
      salonId: reviews.salonId,
      clientAccountId: reviews.clientAccountId,
      appointmentId: reviews.appointmentId,
      rating: reviews.rating,
      comment: reviews.comment,
      ownerReply: reviews.ownerReply,
      isApproved: reviews.isApproved,
      isVisible: reviews.isVisible,
      createdAt: reviews.createdAt,
      clientFirstName: clientAccounts.firstName,
      clientLastName: clientAccounts.lastName,
      clientEmail: clientAccounts.email,
    })
    .from(reviews)
    .innerJoin(clientAccounts, eq(reviews.clientAccountId, clientAccounts.id))
    .where(eq(reviews.salonId, salonId))
    .orderBy(desc(reviews.createdAt))

  return rows as ReviewWithClient[]
}
