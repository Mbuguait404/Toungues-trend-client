'use client'

import { Search, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?'
}

interface AdminTopBarProps {
  title: string
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  const { user } = useAuth()

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
        {title}
      </h1>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-gray-light px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-mid" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-48 text-gray-dark placeholder:text-gray-mid"
          />
        </div>

        <button className="p-2 hover:bg-gray-light rounded-lg transition-colors relative">
          <Bell size={20} className="text-navy" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm">
          {user ? getInitials(user.name) : '?'}
        </div>
      </div>
    </div>
  )
}
