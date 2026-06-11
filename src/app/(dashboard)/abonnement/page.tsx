import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getSubscription } from '@/features/subscription/queries'
import { PlanCard } from '@/features/subscription/components/PlanCard'
import { PLANS } from '@/features/subscription/types'
import type { SubscriptionPlan } from '@/features/subscription/types'

export const metadata: Metadata = { title: 'Mon abonnement' }

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  trialing: 'Essai gratuit',
  past_due: 'Paiement en retard',
  canceled: 'Résilié',
}

const STATUS_BADGE: Record<string, string> = {
  active: 'kh-badge kh-badge-success',
  trialing: 'kh-badge kh-badge-primary',
  past_due: 'kh-badge kh-badge-warning',
  canceled: 'kh-badge kh-badge-danger',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export default async function AbonnementPage() {
  const salonId = await requireSalonId()
  const subscription = await getSubscription(salonId)

  const currentPlan: SubscriptionPlan = subscription?.plan ?? 'free'

  return (
    <div style={{ maxWidth: 980 }}>
      {/* Page header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)', margin: 0, marginBottom: '0.375rem' }}>
          Mon abonnement
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Gérez votre plan et accédez aux fonctionnalités avancées.
        </p>
      </div>

      {/* Current subscription status card */}
      {subscription && (
        <div
          className="kh-card"
          style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>
              Plan {PLANS.find(p => p.id === subscription.plan)?.name ?? subscription.plan}
            </span>
            <span className={STATUS_BADGE[subscription.status] ?? 'kh-badge kh-badge-neutral'}>
              {STATUS_LABELS[subscription.status] ?? subscription.status}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
            {subscription.currentPeriodEnd && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                Renouvellement le {formatDate(subscription.currentPeriodEnd)}
              </span>
            )}
            {subscription.cancelAtPeriodEnd && (
              <span
                className="kh-badge kh-badge-warning"
                style={{ fontSize: '0.75rem' }}
              >
                Résiliation programmée en fin de période
              </span>
            )}
          </div>
        </div>
      )}

      {/* Plan grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={currentPlan === plan.id}
            recommended={plan.recommended}
          />
        ))}
      </div>

      {/* Stripe notice */}
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        padding: '0.75rem',
        background: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-md)',
        margin: 0,
      }}>
        Les paiements Stripe seront disponibles prochainement.
      </p>
    </div>
  )
}
