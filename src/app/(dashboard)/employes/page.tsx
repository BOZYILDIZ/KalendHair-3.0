import type { Metadata } from 'next'
import { requireSalonId } from '@/shared/auth/session'
import { getEmployees } from '@/features/employees/queries'
import { EmployeeList } from '@/features/employees/components/EmployeeList'

export const metadata: Metadata = { title: 'Employés' }

export default async function EmployesPage() {
  const salonId = await requireSalonId()
  const employees = await getEmployees(salonId)

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>
          Équipe
        </h2>
      </div>
      <EmployeeList employees={employees} />
    </div>
  )
}
