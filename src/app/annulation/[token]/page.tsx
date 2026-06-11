import { getAppointmentByToken } from '@/features/appointments/token-queries'
import CancelButton from './CancelButton'

interface Props {
  params: Promise<{ token: string }>
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number) as [number, number, number]
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AnnulationPage({ params }: Props) {
  const { token } = await params
  const result = await getAppointmentByToken(token)

  if (!result) {
    return (
      <Layout>
        <StatusCard
          title="Lien invalide ou expiré"
          message="Ce lien d'annulation n'existe pas ou a expiré. Contactez le salon si vous avez besoin d'aide."
          variant="error"
        />
      </Layout>
    )
  }

  if (result.usedAt !== null || result.appointment.status === 'cancelled') {
    return (
      <Layout>
        <StatusCard
          title="Rendez-vous déjà annulé"
          message="Ce rendez-vous a déjà été annulé. Aucune action supplémentaire n'est nécessaire."
          variant="info"
        />
      </Layout>
    )
  }

  const { appointment } = result

  return (
    <Layout>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-100" style={{ backgroundColor: '#FBF6F1' }}>
          <h1 className="text-xl font-semibold text-stone-800">Annuler votre rendez-vous</h1>
          <p className="text-sm text-stone-500 mt-1">
            Confirmez l&apos;annulation du rendez-vous ci-dessous.
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          <DetailRow label="Service" value={appointment.serviceName} />
          <DetailRow label="Avec" value={appointment.employeeName} />
          <DetailRow label="Date" value={formatDate(appointment.appointmentDate)} />
          <DetailRow label="Heure" value={`${appointment.startTime} – ${appointment.endTime}`} />
          {(appointment.guestFirstName || appointment.guestLastName) && (
            <DetailRow
              label="Client"
              value={`${appointment.guestFirstName ?? ''} ${appointment.guestLastName ?? ''}`.trim()}
            />
          )}
        </div>

        <div className="px-6 pb-6">
          <CancelButton token={token} />
        </div>
      </div>
    </Layout>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      {children}
    </main>
  )
}

function StatusCard({
  title,
  message,
  variant,
}: {
  title: string
  message: string
  variant: 'error' | 'info'
}) {
  const colors =
    variant === 'error'
      ? 'bg-red-50 border-red-200 text-red-800'
      : 'bg-blue-50 border-blue-200 text-blue-800'

  return (
    <div className={`max-w-md w-full rounded-2xl border p-8 text-center ${colors}`}>
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-2 text-sm opacity-80">{message}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="text-stone-800 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}
