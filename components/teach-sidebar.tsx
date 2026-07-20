'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Calendar, BookOpen, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const ROLE_LABELS: Record<string, string> = { LEARNER: 'Learner', TEACHER: 'Teacher', ADMIN: 'Admin' }

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
}

export default function TeachSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/teach/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teach/learners', label: 'My Learners', icon: Users },
    { href: '/teach/modules', label: 'Modules', icon: BookOpen },
    { href: '/teach/materials', label: 'Materials', icon: FileText },
    { href: '/teach/schedule', label: 'Schedule', icon: Calendar },
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
          <Link href="/teach/dashboard" className="mb-8">
            <span className="text-xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
              TT Teach
            </span>
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
                      ? 'bg-gray-800 border-l-4 border-gold text-gold'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span style={{ fontFamily: 'Poppins' }}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {user && (
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: 'Poppins' }}>
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 text-sm hover:text-gold transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
