'use client'

import { useEffect, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getAllUsers, updateUserRole, updateUserStatus } from '@/lib/api/admin'
import type { AuthUser } from '@/lib/auth'

const ROLE_COLORS: Record<string, string> = {
  LEARNER: 'bg-blue-100 text-blue-700',
  TEACHER: 'bg-gold bg-opacity-20 text-gold',
  ADMIN: 'bg-navy bg-opacity-10 text-navy',
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err?.message ?? 'Failed to load users'))
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesSearch
  })

  const handleRoleChange = async (id: string, role: string) => {
    try {
      const updated = await updateUserRole(id, role)
      setUsers((prev) => prev.map((u) => ((u as any)._id === id ? updated : u)))
      setActionMsg(`Role updated to ${role}`)
      setTimeout(() => setActionMsg(null), 3000)
    } catch {
      alert('Failed to update role.')
    }
  }

  const handleStatusToggle = async (id: string, current: boolean) => {
    try {
      const updated = await updateUserStatus(id, !current)
      setUsers((prev) => prev.map((u) => ((u as any)._id === id ? updated : u)))
      setActionMsg(`User ${!current ? 'activated' : 'deactivated'}`)
      setTimeout(() => setActionMsg(null), 3000)
    } catch {
      alert('Failed to update status.')
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Users" />
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {actionMsg && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <CheckCircle2 size={18} />
            {actionMsg}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'LEARNER', 'TEACHER', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${roleFilter === r ? 'bg-gold text-navy' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {r === 'all' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase() + 's'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading users…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
              {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        No users match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user, idx) => {
                      const id = (user as any)._id
                      const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                      return (
                        <tr key={id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">{initials}</div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-navy">{user.name}</p>
                                <p className="text-xs text-gray-mid">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(id, e.target.value)}
                              className="text-xs font-semibold px-2 py-1 rounded-full border-0 bg-transparent focus:ring-2 focus:ring-gold focus:outline-none cursor-pointer"
                              style={{ backgroundColor: 'transparent' }}
                            >
                              {['LEARNER', 'TEACHER', 'ADMIN'].map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleStatusToggle(id, user.isActive)}
                              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-all ${user.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
