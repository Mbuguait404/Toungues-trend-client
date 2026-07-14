'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, CreditCard, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const ROLE_LABELS: Record<string, string> = { LEARNER: 'Learner', TEACHER: 'Teacher', ADMIN: 'Administrator' }

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/courses', label: 'Courses', icon: BookOpen },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 md:hidden p-3 bg-gold rounded-full text-navy shadow-lg hover:bg-gold-light transition-all duration-150"
      >
        {isOpen ? <LogOut size={24} /> : <LayoutDashboard size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-navy text-white z-30 transition-transform duration-300 md:relative md:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <Link href="/admin/dashboard" className="mb-8">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                TT Admin
              </span>
              <span className="text-xs font-bold bg-gold text-navy px-2 py-1 rounded-full">
                Admin
              </span>
            </div>
          </Link>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                    active
                      ? 'bg-gold text-navy font-semibold border-l-4 border-gold'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {user && (
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-300 hover:text-gold transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
