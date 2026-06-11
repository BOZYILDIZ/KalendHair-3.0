// PBKDF2-SHA512 — compatible avec les mots de passe v5
const ITERATIONS = 310_000
const KEY_LENGTH = 64
const DIGEST = 'SHA-512'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await deriveKey(password, salt)
  const saltHex = Buffer.from(salt).toString('hex')
  const keyHex = Buffer.from(key).toString('hex')
  return `${saltHex}:${keyHex}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, keyHex] = hash.split(':')
  if (!saltHex || !keyHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const key = await deriveKey(password, salt)
  const derived = Buffer.from(key).toString('hex')
  return timingSafeEqual(derived, keyHex)
}

async function deriveKey(password: string, salt: Uint8Array | Buffer): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: DIGEST },
    keyMaterial,
    KEY_LENGTH * 8
  )
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
