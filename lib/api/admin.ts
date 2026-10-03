import { apiFetch } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

export type { AuthUser as User }

// ─── Users ───────────────────────────────────────────────────────────────────

export function getAllUsers(query?: Record<string, string>): Promise<AuthUser[]> {
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  return apiFetch<AuthUser[]>(`/users${qs}`, { auth: true })
}

export function getUserById(id: string): Promise<AuthUser> {
  return apiFetch<AuthUser>(`/users/${id}`, { auth: true })
}

export function createUser(data: Partial<AuthUser> & { password?: string }): Promise<AuthUser> {
  return apiFetch<AuthUser>('/users', { method: 'POST', body: data, auth: true })
}

export function updateUserRole(id: string, role: string): Promise<AuthUser> {
  return apiFetch<AuthUser>(`/users/${id}/role`, { method: 'PATCH', body: { role }, auth: true })
}

export function updateUserStatus(id: string, isActive: boolean): Promise<AuthUser> {
  return apiFetch<AuthUser>(`/users/${id}/status`, { method: 'PATCH', body: { isActive }, auth: true })
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface Payment {
  _id: string
  userId: string | { _id: string; name: string; email: string }
  userName?: string
  courseId?: string | { _id: string; title: string; language: string }
  level?: string
  purchaseType?: string
  amount: number
  currency: string
  method: 'payhero' | 'stripe' | string
  status: 'success' | 'pending' | 'failed'
  createdAt: string
}

export async function getAllPayments(query?: Record<string, string>): Promise<Payment[]> {
  if (query?.page || query?.limit) {
    const qs = '?' + new URLSearchParams(query).toString()
    return apiFetch<Payment[]>(`/payments${qs}`, { auth: true })
  }

  const pageSize = 100
  const payments: Payment[] = []
  for (let page = 1; ; page++) {
    const params = new URLSearchParams(query)
    params.set('page', String(page))
    params.set('limit', String(pageSize))
    const result = await apiFetch<Payment[]>(`/payments?${params.toString()}`, { auth: true })
    payments.push(...result)
    if (result.length < pageSize) return payments
  }
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalLearners: number
  totalTeachers: number
  activeEnrollments: number
  monthlyRevenue: number
  newSignupsThisMonth: number
  certificatesIssued: number
}

/** Derived from users + payments — assembled on frontend from multiple calls */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [users, payments] = await Promise.all([
    getAllUsers(),
    getAllPayments(),
  ])

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const learners = users.filter((u) => u.role === 'LEARNER')
  const teachers = users.filter((u) => u.role === 'TEACHER')
  const newSignups = users.filter((u) => new Date((u as any).createdAt) >= monthStart)
  const monthPayments = payments.filter(
    (p) => p.status === 'success' && p.currency === 'KES' && new Date(p.createdAt) >= monthStart,
  )
  const revenue = monthPayments.reduce((acc, p) => acc + p.amount, 0)

  return {
    totalLearners: learners.length,
    totalTeachers: teachers.length,
    activeEnrollments: learners.length, // approximate
    monthlyRevenue: revenue,
    newSignupsThisMonth: newSignups.length,
    certificatesIssued: 0, // certificates endpoint would provide this
  }
}
