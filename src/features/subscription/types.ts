export type SubscriptionPlan = 'free' | 'pro' | 'business'

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing'

export interface CurrentSubscription {
  id: number
  salonId: number
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PlanDefinition {
  id: SubscriptionPlan
  name: string
  price: string
  features: string[]
  recommended?: boolean
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0€',
    features: [
      '1 employé',
      '50 RDV/mois',
      'Page salon publique',
      'Support email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29€/mois',
    features: [
      '5 employés',
      'RDV illimités',
      'Rappels SMS',
      'Connecteurs (Google Cal, Silae)',
      'Statistiques avancées',
      'Support prioritaire',
    ],
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '79€/mois',
    features: [
      'Employés illimités',
      'RDV illimités',
      'Multi-salon',
      'API accès',
      'Facturation Pennylane',
      'Account manager dédié',
    ],
  },
]
