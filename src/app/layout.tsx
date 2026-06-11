import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'KalendHair', template: '%s | KalendHair' },
  description: 'La plateforme de réservation pour salons de coiffure français',
  keywords: ['coiffeur', 'réservation', 'salon', 'coiffure', 'france'],
  authors: [{ name: 'KalendHair' }],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'KalendHair' },
}

export const viewport: Viewport = {
  themeColor: '#C17A4A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FAF7F2',
              border: '1px solid #E2D5C8',
              color: '#2C1A0E',
            },
          }}
        />
      </body>
    </html>
  )
}
