import { redirect } from 'next/navigation'
import { requireSalonId } from '@/shared/auth/session'
import { getSalonSettings } from '@/features/settings/queries'
import { OnboardingWizard } from './OnboardingWizard'

export default async function OnboardingPage() {
  const salonId = await requireSalonId()
  const settings = await getSalonSettings(salonId)

  if (settings?.onboardingCompleted) {
    redirect('/dashboard')
  }

  return <OnboardingWizard salonId={salonId} />
}
