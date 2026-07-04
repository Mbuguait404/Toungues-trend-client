'use client'

import { Search, Bell, User } from 'lucide-react'

interface AdminTopBarProps {
  title: string
}

export default function AdminTopBar({ title }: AdminTopBarProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
        {title}
      </h1>
      
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-light px-4 py-2 rounded-full">
          <Search size={18} className="text-gray-mid" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-48 text-gray-dark placeholder:text-gray-mid"
          />
        </div>

        {/* Notification Bell */}
        <button className="p-2 hover:bg-gray-light rounded-lg transition-colors relative">
          <Bell size={20} className="text-navy" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Admin Avatar */}
        <button className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold hover:bg-gold-light transition-colors">
          <User size={18} />
        </button>
      </div>
    </div>
  )
}
