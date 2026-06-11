import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/shared/db/client'
import { appointments } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { isWebhookProcessed, markWebhookProcessed } from '@/shared/redis'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotence
  if (await isWebhookProcessed(`stripe:${event.id}`)) {
    return NextResponse.json({ received: true })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const appointmentId = pi.metadata['appointmentId']
    if (appointmentId) {
      await db.update(appointments)
        .set({
          status: 'confirmed',
          amountPaid: String(pi.amount_received / 100),
          stripePaymentIntentId: pi.id,
        })
        .where(eq(appointments.id, parseInt(appointmentId)))
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    const appointmentId = pi.metadata['appointmentId']
    if (appointmentId) {
      await db.update(appointments)
        .set({ status: 'cancelled' })
        .where(eq(appointments.id, parseInt(appointmentId)))
    }
  }

  await markWebhookProcessed(`stripe:${event.id}`)
  return NextResponse.json({ received: true })
}
