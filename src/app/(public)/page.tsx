import type { Metadata } from 'next'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Pricing } from './components/Pricing'
import { CtaFinal } from './components/CtaFinal'
import { Footer } from './components/Footer'

export const metadata: Metadata = {
  title: 'KalendHair — Réservation en ligne pour salons de coiffure',
  description:
    'Gérez vos rendez-vous, vos équipes et vos clients depuis une seule plateforme. Simple, humain, efficace.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <CtaFinal />
      <Footer />
    </>
  )
}
