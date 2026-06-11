import { auth } from './config'
import { db } from '@/shared/db/client'
import { salons } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { AppError } from '@/shared/errors'

// Retourne la session ou redirige vers /connexion
export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) redirect('/connexion')
  return session
}

// Retourne le salon du pro connecté ou throw
export async function requireSalon() {
  const session = await requireAuth()
  const proAccountId = parseInt(session.user!.id!)

  const salon = await db.query.salons.findFirst({
    where: eq(salons.proAccountId, proAccountId),
  })

  if (!salon) throw new AppError('SALON_NOT_FOUND', 'Salon introuvable')
  return { session, salon }
}

// Retourne uniquement l'ID du salon — plus léger pour les requêtes DB
export async function requireSalonId(): Promise<number> {
  const { salon } = await requireSalon()
  return salon.id
}
