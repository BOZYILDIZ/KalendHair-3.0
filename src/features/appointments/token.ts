import crypto from 'node:crypto'

export function generateCancellationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function tokenExpiresAt(): Date {
  return new Date(Date.now() + 48 * 60 * 60 * 1000)
}
