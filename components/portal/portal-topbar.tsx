'use client'

import Image from 'next/image'
import { Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
}

export interface PortalTopbarProps {
  title: string
  /**
   * Optional working search control. Deliberately not built in — the old
   * topbars shipped an input with no handler, which read as a broken feature.
   */
  search?: React.ReactNode
}

export default function PortalTopbar({ title, search }: PortalTopbarProps) {
  const { user } = useAuth()

  return (
    <div className="bg-white border-b border-gray-100 px-5 md:px-8 py-3.5 md:py-4 flex items-center justify-between gap-4 shrink-0">
      <h1 className="text-lg md:text-2xl font-bold text-navy truncate" style={{ fontFamily: 'Poppins' }}>
        {title}
      </h1>

      <div className="flex items-center gap-4 md:gap-6 shrink-0">
        {search}

        <button aria-label="Notifications" className="p-2 hover:bg-gray-light rounded-lg transition-colors">
          <Bell size={20} className="text-navy" />
        </button>

        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm shrink-0">
            {user ? getInitials(user.name) : '?'}
          </div>
        )}
      </div>
    </div>
  )
}