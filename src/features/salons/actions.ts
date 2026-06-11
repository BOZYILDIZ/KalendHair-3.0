'use server'
import { revalidatePath } from 'next/cache'
import { signIn } from '@/shared/auth/config'
import { registerSchema } from './validations'
import { createSalonWithOwner, isSalonSlugAvailable } from './mutations'
import { actionSuccess, actionError, AppError } from '@/shared/errors'
import type { ActionResult } from '@/shared/errors'
import { requireSalonId } from '@/shared/auth/session'
import { db } from '@/shared/db/client'
import { salons } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import type { z } from 'zod'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

export async function registerSalonAction(raw: z.infer<typeof registerSchema>) {
  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) return actionError(new AppError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides'))

  const { salonName, ownerFirstName, ownerLastName, email, password, phone, city } = parsed.data

  // Générer un slug unique
  let slug = toSlug(salonName)
  if (!(await isSalonSlugAvailable(slug))) {
    slug = `${slug}-${Math.floor(Math.random() * 9000 + 1000)}`
  }

  try {
    await createSalonWithOwner({ salonName, salonSlug: slug, ownerFirstName, ownerLastName, email, password, phone, city })
    return actionSuccess({ slug })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue'
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return actionError(new AppError('CONFLICT', 'Un compte existe déjà avec cet email'))
    }
    return actionError(new AppError('INTERNAL_ERROR', msg))
  }
}

export async function checkSlugAction(salonName: string) {
  const slug = toSlug(salonName)
  const available = await isSalonSlugAvailable(slug)
  return { slug, available }
}

export async function completeOnboardingAction(): Promise<ActionResult<void>> {
  try {
    const salonId = await requireSalonId()
    await db.update(salons).set({ onboardingCompleted: true }).where(eq(salons.id, salonId))
    revalidatePath('/')
    return actionSuccess(undefined)
  } catch (error) {
    return actionError(error instanceof Error ? error : new Error('Erreur inconnue'))
  }
}
