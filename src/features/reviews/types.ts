export interface Review {
  id: number
  salonId: number
  clientAccountId: number
  appointmentId: number | null
  rating: number
  comment: string | null
  ownerReply: string | null
  isApproved: boolean
  isVisible: boolean
  createdAt: Date
}

export interface ReviewWithClient extends Review {
  clientFirstName: string
  clientLastName: string
  clientEmail: string
}

export function reviewStatus(review: Pick<Review, 'isApproved' | 'isVisible'>): 'approved' | 'hidden' | 'pending' {
  if (!review.isVisible) return 'hidden'
  if (review.isApproved) return 'approved'
  return 'pending'
}
