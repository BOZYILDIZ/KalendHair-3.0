import { db } from '@/shared/db/client'
import { employees, employeeSchedules } from '@/shared/db/schema'
import { and, eq } from 'drizzle-orm'
import type { CreateEmployeeInput, UpdateEmployeeInput } from './types'

export async function createEmployee(salonId: number, input: CreateEmployeeInput) {
  const { serviceIds: _serviceIds, ...employeeData } = input
  const [emp] = await db.insert(employees)
    .values({ salonId, ...employeeData })
    .returning()
  return emp
}

export async function updateEmployee(id: number, salonId: number, input: UpdateEmployeeInput) {
  const [emp] = await db.update(employees)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(employees.id, id), eq(employees.salonId, salonId)))
    .returning()
  return emp
}

export async function deleteEmployee(id: number, salonId: number) {
  await db.update(employees)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(employees.id, id), eq(employees.salonId, salonId)))
}
