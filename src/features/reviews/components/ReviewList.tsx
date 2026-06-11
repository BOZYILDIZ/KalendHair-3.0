'use client'
import { useState, useTransition } from 'react'
import type { ReviewWithClient } from '../types'
import { reviewStatus } from '../types'
import { approveReviewAction, hideReviewAction, replyToReviewAction } from '../actions'

interface Props { reviews: ReviewWithClient[] }

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: 'var(--color-primary)', fontSize: '1rem', letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

function ReviewCard({ review }: { review: ReviewWithClient }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState(review.ownerReply ?? '')
  const [pending, startTransition] = useTransition()

  const status = reviewStatus(review)
  const borderColor = status === 'approved'
    ? 'var(--color-success)'
    : status === 'hidden'
      ? '#aaa'
      : 'var(--color-warning)'

  const date = new Date(review.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  function handleApprove() {
    startTransition(async () => { await approveReviewAction(review.id) })
  }
  function handleHide() {
    startTransition(async () => { await hideReviewAction(review.id) })
  }
  function handleReply() {
    startTransition(async () => {
      const res = await replyToReviewAction(review.id, replyText)
      if (res.success) setReplyOpen(false)
    })
  }

  return (
    <div className="kh-card" style={{ borderLeft: `3px solid ${borderColor}`, padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Stars rating={review.rating} />
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>
              {review.clientFirstName} {review.clientLastName}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{date}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {status !== 'approved' && (
            <button className="kh-btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={handleApprove} disabled={pending}>
              Approuver
            </button>
          )}
          {status !== 'hidden' && (
            <button className="kh-btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={handleHide} disabled={pending}>
              Masquer
            </button>
          )}
          <button className="kh-btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
            onClick={() => setReplyOpen(v => !v)} disabled={pending}>
            Répondre
          </button>
        </div>
      </div>

      {review.comment && (
        <p style={{ margin: '0.625rem 0 0', fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
          {review.comment}
        </p>
      )}

      {review.ownerReply && !replyOpen && (
        <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.875rem', background: 'var(--color-bg-subtle, #f8f5f2)', borderRadius: 6, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          <strong>Votre réponse :</strong> {review.ownerReply}
        </div>
      )}

      {replyOpen && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={3}
            placeholder="Votre réponse publique..."
            style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="kh-btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.875rem' }}
              onClick={handleReply} disabled={pending || !replyText.trim()}>
              {pending ? 'Envoi…' : 'Enregistrer'}
            </button>
            <button className="kh-btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setReplyOpen(false)} disabled={pending}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="kh-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Aucun avis pour l'instant
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
    </div>
  )
}
