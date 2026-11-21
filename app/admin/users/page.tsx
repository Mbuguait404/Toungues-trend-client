'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import AdminTopBar from '@/components/admin-topbar'
import { Card, EmptyRow, PageHeader, Pill, StatTile } from '@/components/portal/portal-ui'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { getAllUsers, updateUserRole, updateUserStatus, createUser } from '@/lib/api/admin'
import type { AuthUser } from '@/lib/auth'

const ROLES: AuthUser['role'][] = ['LEARNER', 'TEACHER', 'ADMIN']

const ROLE_TONE: Record<AuthUser['role'], 'blue' | 'gold' | 'navy'> = {
  LEARNER: 'blue',
  TEACHER: 'gold',
  ADMIN: 'navy',
}

function initials(name: string) {
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

export default function AdminUsers() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [busyUserId, setBusyUserId] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | AuthUser['role']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'LEARNER' as AuthUser['role'],
  })

  const load = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true)
    try {
      setError(null)
      setUsers(await getAllUsers())
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to load users')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function toast(msg: string) {
    setNotice(msg)
    setTimeout(() => setNotice(null), 3000)
  }

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((u) => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter
      const matchesStatus =
        statusFilter === 'all' || (statusFilter === 'active' ? u.isActive : !u.isActive)
      const matchesTerm =
        !term || `${u.name} ${u.email} ${u.country ?? ''}`.toLowerCase().includes(term)
      return matchesRole && matchesStatus && matchesTerm
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const learners = users.filter((u) => u.role === 'LEARNER').length
  const teachers = users.filter((u) => u.role === 'TEACHER').length
  const admins = users.filter((u) => u.role === 'ADMIN').length
  const suspended = users.filter((u) => !u.isActive).length

  const handleRoleChange = async (id: string, role: AuthUser['role']) => {
    setBusyUserId(id)
    setError(null)
    try {
      const updated = await updateUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...updated } : u)))
      toast(`Role updated to ${role.toLowerCase()}`)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to update role')
    } finally {
      setBusyUserId(null)
    }
  }

  const handleStatusToggle = async (user: AuthUser) => {
    setBusyUserId(user._id)
    setError(null)
    try {
      const updated = await updateUserStatus(user._id, !user.isActive)
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...updated } : u)))
      toast(`${user.name} ${user.isActive ? 'deactivated' : 'activated'}`)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to update status')
    } finally {
      setBusyUserId(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setFormError(null)
    try {
      const created = await createUser(newUser)
      setUsers((prev) => [created, ...prev])
      setIsCreateModalOpen(false)
      setNewUser({ name: '', email: '', password: '', role: 'LEARNER' })
      toast(`${created.name} created`)
    } catch (err) {
      setFormError(err instanceof Error && err.message ? err.message : 'Failed to create user')
    } finally {
      setIsCreating(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white'
  const labelClass = 'block text-[11px] font-semibold uppercase tracking-wide text-gray-mid mb-1'

  return (
    <>
      <AdminTopBar title="Users" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-5 space-y-4">
          <PageHeader
            title="Users"
            subtitle={
              users.length
                ? `${users.length} accounts · ${learners} learners · ${teachers} teachers · ${admins} admins`
                : 'No accounts loaded'
            }
            onRefresh={() => load(true)}
            refreshing={isRefreshing}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFormError(null)
                setIsCreateModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gold text-navy text-sm font-bold hover:bg-gold-light transition-colors"
            >
              <Plus size={15} />
              Add user
            </button>
          </div>

          {notice && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle2 size={16} />
              {notice}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatTile label="Total users" value={users.length} icon={Users} />
            <StatTile label="Learners" value={learners} icon={Users} accent="text-blue-600" />
            <StatTile label="Teachers" value={teachers} icon={UserCheck} accent="text-[#8a5f10]" />
            <StatTile label="Admins" value={admins} icon={ShieldCheck} />
            <StatTile
              label="Deactivated"
              value={suspended}
              sub={suspended ? 'cannot sign in' : 'all accounts live'}
              icon={AlertCircle}
              accent={suspended ? 'text-red-500' : 'text-navy'}
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                placeholder="Search name, email or country…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | AuthUser['role'])}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
              }
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">Deactivated only</option>
            </select>
            <span className="text-[11px] text-gray-mid ml-auto tabular-nums">
              {filtered.length} of {users.length}
            </span>
          </div>

          <Card title="Accounts" bodyClassName="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-mid text-sm">
                <Loader2 size={22} className="animate-spin mr-3" />
                Loading users…
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      User
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Country
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <EmptyRow colSpan={5}>No users match your filters.</EmptyRow>
                  ) : (
                    filtered.map((user, idx) => {
                      const busy = busyUserId === user._id
                      return (
                        <tr key={user._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              {user.avatarUrl ? (
                                <Image
                                  src={user.avatarUrl}
                                  alt={user.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0">
                                  {initials(user.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-navy truncate max-w-[14rem]">
                                  {user.name}
                                </p>
                                <p className="text-[11px] text-gray-mid truncate max-w-[14rem]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-sm text-gray-dark">
                            {user.country ?? '—'}
                          </td>
                          <td className="px-4 py-2.5">
                            <select
                              value={user.role}
                              disabled={busy}
                              aria-label={`Role for ${user.name}`}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value as AuthUser['role'])
                              }
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-gold cursor-pointer disabled:opacity-50"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <Pill tone={user.isActive ? 'green' : 'red'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Pill>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              onClick={() => handleStatusToggle(user)}
                              disabled={busy}
                              className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border transition-colors disabled:opacity-50 ${
                                user.isActive
                                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                                  : 'border-green-200 text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {busy ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : user.isActive ? (
                                'Deactivate'
                              ) : (
                                'Activate'
                              )}
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
              <h3 className="text-base font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Create user
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Close"
                className="text-gray-mid hover:text-navy transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 overflow-auto">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={15} />
                  {formError}
                </div>
              )}
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className={`${inputClass} pr-10`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-gray-mid hover:text-navy transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as AuthUser['role'] })
                  }
                  className={inputClass}
                >
                  <option value="LEARNER">Learner</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-dark rounded-lg font-semibold text-sm hover:bg-gray-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating && <Loader2 size={15} className="animate-spin" />}
                  Create user
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
