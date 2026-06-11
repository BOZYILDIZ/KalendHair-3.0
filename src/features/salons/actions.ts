'use server'
import { signIn } from '@/shared/auth/config'
import { registerSchema } from './validations'
import { createSalonWithOwner, isSalonSlugAvailable } from './mutations'
import { actionSuccess, actionError } from '@/shared/errors'
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
  if (!parsed.success) return actionError('VALIDATION_ERROR', parsed.error.errors[0]?.message ?? 'Données invalides')

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
      return actionError('CONFLICT', 'Un compte existe déjà avec cet email')
    }
    return actionError('INTERNAL_ERROR', msg)
  }
}

export async function checkSlugAction(salonName: string) {
  const slug = toSlug(salonName)
  const available = await isSalonSlugAvailable(slug)
  return { slug, available }
}
