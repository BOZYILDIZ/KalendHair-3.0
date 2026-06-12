import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limit for booking endpoint (resets per cold start — good enough for Edge)
// Uses a sliding window: IP → [timestamp, ...] — prune entries older than WINDOW_MS
const BOOKING_LIMIT = 10   // max requests
const WINDOW_MS    = 60_000 // per minute

const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = hits.get(ip) ?? []
  const recent = window.filter(t => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > BOOKING_LIMIT
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limit public booking endpoints
  if (pathname.startsWith('/api/booking') || pathname.startsWith('/api/slots')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) {
      return new NextResponse(JSON.stringify({ error: 'Trop de requêtes, réessayez dans une minute.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // Inject pathname for dashboard layout onboarding guard
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
