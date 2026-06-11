import { db } from '@/shared/db/client'
import { employees } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import type { EmployeeWithServices } from './types'

export async function getEmployees(salonId: number): Promise<EmployeeWithServices[]> {
  return db.query.employees.findMany({
    where: and(eq(employees.salonId, salonId), eq(employees.isActive, true)),
    with: {
      services: {
        with: {
          service: { columns: { id: true, name: true, color: true } },
        },
      },
    },
    orderBy: employees.firstName,
  }).then(rows => rows.map(e => ({
    ...e,
    services: e.services.map(es => es.service),
  }))) as unknown as EmployeeWithServices[]
}

export async function getEmployeeById(id: number, salonId: number) {
  return db.query.employees.findFirst({
    where: and(eq(employees.id, id), eq(employees.salonId, salonId)),
    with: {
      services: { with: { service: true } },
      schedules: true,
    },
  })
}
