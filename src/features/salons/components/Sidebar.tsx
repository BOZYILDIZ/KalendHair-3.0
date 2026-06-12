'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Clock, Users, Scissors,
  UserCircle, BarChart2, Star, Plug, Settings, CreditCard,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard, section: 'dashboard' },
  { label: 'Calendrier', href: '/calendrier', icon: Calendar, section: 'dashboard', badge: null },
  { label: 'Rendez-vous', href: '/rendez-vous', icon: Clock, section: 'dashboard' },
  { label: 'Clients', href: '/clients', icon: Users, section: 'dashboard' },
  { label: 'Employés', href: '/employes', icon: UserCircle, section: 'gestion' },
  { label: 'Services', href: '/services', icon: Scissors, section: 'gestion' },
  { label: 'Statistiques', href: '/statistiques', icon: BarChart2, section: 'gestion' },
  { label: 'Avis', href: '/avis', icon: Star, section: 'gestion' },
  { label: 'Connecteurs', href: '/connecteurs', icon: Plug, section: 'compte' },
  { label: 'Paramètres', href: '/parametres', icon: Settings, section: 'compte' },
  { label: 'Abonnement', href: '/abonnement', icon: CreditCard, section: 'compte' },
] as const

const SECTIONS = ['dashboard', 'gestion', 'compte'] as const
const SECTION_LABELS: Record<string, string> = {
  dashboard: 'Tableau de bord',
  gestion: 'Gestion',
  compte: 'Compte',
}

interface SidebarProps {
  salonName: string
  salonSlug: string
}

export function Sidebar({ salonName, salonSlug }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: 220,
      background: 'var(--color-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid rgba(242,237,228,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--color-primary)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3C9 3 8 9 12 12C16 15 15 21 15 21M12 3L12 5M7 5L9 7M17 5L15 7" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: '1rem', fontWeight: 700, color: '#F2EDE4' }}>
            KalendHair
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflow: 'auto', padding: '0.75rem 0.5rem' }}>
        {SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter(i => i.section === section)
          return (
            <div key={section} style={{ marginBottom: '1rem' }}>
              <div style={{
                fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.8px', color: 'rgba(122,92,68,0.8)',
                padding: '0 0.5rem', marginBottom: '0.25rem',
              }}>
                {SECTION_LABELS[section]}
              </div>
              {items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.5rem 0.625rem', borderRadius: 8, marginBottom: 2,
                    textDecoration: 'none', transition: 'background 0.15s',
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                  }}>
                    <Icon size={16} color={isActive ? '#fff' : 'rgba(242,237,228,0.55)'} />
                    <span style={{
                      fontSize: '0.8125rem',
                      color: isActive ? '#fff' : 'rgba(242,237,228,0.65)',
                      fontWeight: isActive ? 500 : 400,
                    }}>
                      {label}
                    </span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Salon card */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(242,237,228,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0.625rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10,
        }}>
          <div style={{
            width: 32, height: 32, background: 'var(--color-primary)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {salonName.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#F2EDE4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {salonName}
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--color-primary-light)' }}>Plan Pro</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
