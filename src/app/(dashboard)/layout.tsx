import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireSalon } from '@/shared/auth/session'
import { getSalonSettings } from '@/features/settings/queries'
import { Sidebar } from '@/features/salons/components/Sidebar'
import { Topbar } from '@/features/salons/components/Topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, salon } = await requireSalon()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? headersList.get('x-invoke-path') ?? ''
  const isOnboarding = pathname.includes('/onboarding')

  if (!isOnboarding) {
    const settings = await getSalonSettings(salon.id)
    if (settings && !settings.onboardingCompleted) {
      redirect('/onboarding')
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <Sidebar salonName={salon.name} salonSlug={salon.slug ?? ''} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar salonName={salon.name} userEmail={session.user?.email ?? ''} />
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
