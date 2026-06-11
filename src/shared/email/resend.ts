import { Resend } from 'resend'
import type React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailPayload {
  to: string
  subject: string
  react: React.ReactElement
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { error } = await resend.emails.send({
    from: 'KalendHair <noreply@kalendhair.fr>',
    to: payload.to,
    subject: payload.subject,
    react: payload.react,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
