import type { Employee } from '../types'

interface Props { employees: Employee[] }

export function EmployeeList({ employees }: Props) {
  if (employees.length === 0) {
    return (
      <div className="kh-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Aucun employé — ajoutez votre équipe
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {employees.map(emp => (
        <div key={emp.id} className="kh-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: emp.color ?? 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 700, color: '#fff',
          }}>
            {emp.firstName[0]}{emp.lastName[0]}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {emp.firstName} {emp.lastName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{emp.role}</div>
            {emp.email && <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{emp.email}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
