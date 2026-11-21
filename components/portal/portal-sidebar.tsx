'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { LogOut, Menu, X, ShieldCheck, ExternalLink } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export interface PortalNavItem {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export interface PortalNavGroup {
  heading: string
  items: PortalNavItem[]
}

export interface PortalSidebarProps {
  /** Unique per portal so aria-controls points at the right element. */
  id: string
  /** Landing route for the brand logo. */
  homeHref: string
  /** Centre label on the mobile bar. */
  mobileTitle: string
  /** Gold chip next to the logo, e.g. "Admin" / "Learner". */
  chipLabel: string
  /** aria-label for the nav landmark. */
  navLabel: string
  /** Small print in the base strip. */
  footerNote: string
  groups: PortalNavGroup[]
}

const ROLE_LABELS: Record<string, string> = {
  LEARNER: 'Learner',
  TEACHER: 'Teacher',
  ADMIN: 'Administrator',
}

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

/** Exact match or a child route — so /admin/users never false-matches a sibling prefix. */
const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export default function PortalSidebar({
  id,
  homeHref,
  mobileTitle,
  chipLabel,
  navLabel,
  footerNote,
  groups,
}: PortalSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Close the drawer on navigation so tapping a link doesn't leave it covering the page.
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Escape to dismiss, and lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Mobile top bar — a real hamburger, not an icon that looks like logout */}
      <div className="md:hidden sticky top-0 z-30 w-full flex items-center justify-between gap-3 px-4 h-14 bg-navy text-white shrink-0">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls={id}
          className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="text-[15px] font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
          {mobileTitle}
        </span>
        <span className="w-9" />
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-navy/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        id={id}
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-navy text-white flex flex-col transition-transform duration-300 ease-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Gold accent */}
        <div className="h-1 w-full bg-gradient-to-r from-gold to-gold-light shrink-0" />

        {/* Brand */}
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-4">
          <Link href={homeHref} className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-9 w-16 shrink-0">
              <Image
                src="/logo.png"
                alt="Tongues Trend"
                fill
                sizes="64px"
                className="object-contain object-left"
              />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-gold/15 text-gold px-2 py-1 rounded-md shrink-0">
              {chipLabel}
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="md:hidden p-1.5 -mr-1.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6" aria-label={navLabel}>
          {groups.map((group) => (
            <div key={group.heading}>
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-white/35">
                {group.heading}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActivePath(pathname, item.href)
                  const badge = item.badge ?? 0
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-colors duration-150 ${
                          active
                            ? 'bg-gold text-navy font-semibold'
                            : 'text-white/65 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {/* Left rail marker — visible on both states, no gold-on-gold */}
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full transition-opacity ${
                            active ? 'bg-navy opacity-100' : 'bg-gold opacity-0 group-hover:opacity-60'
                          }`}
                        />
                        <Icon size={18} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {badge > 0 && (
                          <span
                            className={`ml-auto shrink-0 min-w-[1.25rem] px-1.5 py-0.5 rounded-full text-xs font-bold text-center ${
                              active ? 'bg-navy text-white' : 'bg-gold text-navy'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Account */}
        <div className="border-t border-white/10 p-3 shrink-0">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold truncate">{user.name}</p>
                <p className="text-xs text-white/45 truncate">
                  {ROLE_LABELS[user.role] ?? user.role}
                </p>
              </div>
            </div>
          )}

          <div className="mt-1 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] text-white/55 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={16} className="shrink-0" />
              View site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[15px] text-white/55 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} className="shrink-0" />
              Log out
            </button>
          </div>
        </div>

        {/* Security strip */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2 shrink-0">
          <ShieldCheck size={13} className="text-gold shrink-0" />
          <p className="text-[11px] text-white/30 leading-tight">{footerNote}</p>
        </div>
      </aside>
    </>
  )
}