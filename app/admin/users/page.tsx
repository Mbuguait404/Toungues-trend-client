'use client'

import { useEffect, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { Search, Loader2, AlertCircle, CheckCircle2, Plus, X, Eye, EyeOff } from 'lucide-react'
import { getAllUsers, updateUserRole, updateUserStatus, createUser } from '@/lib/api/admin'
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
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'LEARNER'
  })

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const created = await createUser(newUser)
      setUsers(prev => [created, ...prev])
      setIsCreateModalOpen(false)
      setNewUser({ name: '', email: '', password: '', role: 'LEARNER' })
      setActionMsg(`User ${created.name} created successfully`)
      setTimeout(() => setActionMsg(null), 3000)
    } catch (err: any) {
      alert(err.message || 'Failed to create user')
    } finally {
      setIsCreating(false)
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
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-navy text-white rounded-full text-sm font-semibold hover:bg-[#1a3f7a] transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Create User
            </button>
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

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Create User</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-navy transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-navy transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm bg-white"
                >
                  <option value="LEARNER">Learner</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gold text-navy rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isCreating ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
