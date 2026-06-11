import { db } from '@/shared/db/client'
import { salons, proAccounts, employees, employeeSchedules } from '@/shared/db/schema'
import { hashPassword } from '@/shared/auth/password'

interface CreateSalonInput {
  salonName: string
  salonSlug: string
  ownerFirstName: string
  ownerLastName: string
  email: string
  password: string
  phone?: string
  city?: string
}

// Crée le salon + compte pro + employé (gérant) + horaires par défaut
export async function createSalonWithOwner(input: CreateSalonInput) {
  return db.transaction(async (tx) => {
    // 1. Salon
    const [salon] = await tx.insert(salons)
      .values({
        name: input.salonName,
        slug: input.salonSlug,
        phone: input.phone ?? null,
        city: input.city ?? null,
        isActive: true,
      })
      .returning({ id: salons.id })
    if (!salon) throw new Error('Impossible de créer le salon')

    // 2. Hash password
    const passwordHash = await hashPassword(input.password)

    // 3. Compte Pro
    const [pro] = await tx.insert(proAccounts)
      .values({
        salonId: salon.id,
        email: input.email,
        passwordHash,
        firstName: input.ownerFirstName,
        lastName: input.ownerLastName,
        role: 'owner',
        mustChangePassword: false,
      })
      .returning({ id: proAccounts.id })
    if (!pro) throw new Error('Impossible de créer le compte')

    // 4. Employé (le gérant)
    const [emp] = await tx.insert(employees)
      .values({
        salonId: salon.id,
        firstName: input.ownerFirstName,
        lastName: input.ownerLastName,
        role: 'owner',
        color: '#C17A4A',
        isActive: true,
      })
      .returning({ id: employees.id })
    if (!emp) throw new Error('Impossible de créer l\'employé')

    // 5. Horaires par défaut (Lun–Sam 9h–19h)
    const defaultDays = [1, 2, 3, 4, 5, 6] // Lun–Sam
    await tx.insert(employeeSchedules).values(
      defaultDays.map(dayOfWeek => ({
        employeeId: emp.id,
        dayOfWeek,
        isWorking: true,
        openTime: '09:00',
        closeTime: '19:00',
        lunchStart: '12:30',
        lunchEnd: '14:00',
      }))
    )

    return { salonId: salon.id, proId: pro.id }
  })
}

// Vérifie que le slug est disponible
export async function isSalonSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.query.salons.findFirst({
    where: (s, { eq }) => eq(s.slug, slug),
  })
  return !existing
}
