import { db } from '@/shared/db/client'
import { salons, proAccounts, employees, employeeSchedules, salonSchedules } from '@/shared/db/schema'
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

export async function createSalonWithOwner(input: CreateSalonInput) {
  return db.transaction(async (tx) => {
    const passwordHash = await hashPassword(input.password)

    // 1. Compte Pro (email + hash uniquement)
    const [pro] = await tx.insert(proAccounts)
      .values({ email: input.email, passwordHash, mustChangePassword: false })
      .returning({ id: proAccounts.id })
    if (!pro) throw new Error('Impossible de créer le compte')

    // 2. Salon avec proAccountId
    const [salon] = await tx.insert(salons)
      .values({
        proAccountId: pro.id,
        name: input.salonName,
        slug: input.salonSlug,
        phone: input.phone ?? null,
        city: input.city ?? null,
        isActive: true,
      })
      .returning({ id: salons.id })
    if (!salon) throw new Error('Impossible de créer le salon')

    // 3. Employé gérant
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
    if (!emp) throw new Error("Impossible de créer l'employé")

    // 4. Horaires employé — Lun–Sam 9h–19h (pause 12h30–14h)
    const workingDays = [1, 2, 3, 4, 5, 6]
    await tx.insert(employeeSchedules).values(
      workingDays.map(dayOfWeek => ({
        employeeId: emp.id,
        dayOfWeek,
        isWorking: true,
        startTime: '09:00',
        endTime: '19:00',
        breakStartTime: '12:30',
        breakEndTime: '14:00',
      }))
    )

    // 5. Horaires salon — Lun–Sam 9h–19h, dimanche fermé
    await tx.insert(salonSchedules).values([
      ...workingDays.map(dayOfWeek => ({
        salonId: salon.id,
        dayOfWeek,
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
        breakStartTime: '12:30',
        breakEndTime: '14:00',
      })),
      { salonId: salon.id, dayOfWeek: 0, isOpen: false },
    ])

    return { salonId: salon.id, proId: pro.id }
  })
}

export async function isSalonSlugAvailable(slug: string): Promise<boolean> {
  const existing = await db.query.salons.findFirst({
    where: (s, { eq }) => eq(s.slug, slug),
  })
  return !existing
}
