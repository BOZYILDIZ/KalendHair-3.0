import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getReviews } from '@/features/reviews/queries'
import { ReviewList } from '@/features/reviews/components/ReviewList'

export const metadata: Metadata = { title: 'Avis clients' }

export default async function AvisPage() {
  const salonId = await requireSalonId()
  const reviews = await getReviews(salonId)

  const total = reviews.length
  const approved = reviews.filter(r => r.isApproved && r.isVisible).length
  const pending = reviews.filter(r => !r.isApproved && r.isVisible).length

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
          Avis clients
        </h2>
        <span className="kh-badge-neutral" style={{ fontSize: '0.75rem' }}>{total}</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="kh-card" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total</span>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text)' }}>{total}</span>
        </div>
        <div className="kh-card" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Approuvés</span>
          <span className="kh-badge-success" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{approved}</span>
        </div>
        <div className="kh-card" style={{ padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>En attente</span>
          <span className="kh-badge-warning" style={{ fontSize: '0.875rem', fontWeight: 700 }}>{pending}</span>
        </div>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  )
}
