'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, Calendar, Award, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const ROLE_LABELS: Record<string, string> = { LEARNER: 'Learner', TEACHER: 'Teacher', ADMIN: 'Admin' }

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
}

export default function LearnSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/learn/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/learn/courses', label: 'My Courses', icon: BookOpen },
    { href: '/learn/schedule', label: 'Schedule', icon: Calendar },
    { href: '/learn/certificates', label: 'Certificates', icon: Award },
    { href: '/learn/profile', label: 'Profile', icon: User },
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
        className="fixed bottom-6 right-6 z-40 md:hidden p-3 bg-gold rounded-full text-navy shadow-lg"
      >
        {isOpen ? <LogOut size={24} /> : <LayoutDashboard size={24} />}
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-navy text-white z-30 transition-transform duration-300 md:relative md:z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <Link href="/learn/dashboard" className="mb-8">
            <span className="text-xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
              TT Portal
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
                      ? 'bg-navy border-l-4 border-gold text-gold'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {user && (
            <div className="border-t border-gray-700 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-400 text-xs">{ROLE_LABELS[user.role] ?? user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-gold transition-colors text-sm w-full text-left"
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
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
