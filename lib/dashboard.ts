import type { AuthUser } from '@/lib/auth'
import type { Payment } from '@/lib/api/admin'
import type { Enrollment } from '@/lib/api/enrollments'
import type { Inquiry } from '@/lib/api/inquiries'

export const LANGUAGE_LABELS: Record<string, string> = {
  french: 'French',
  english: 'English',
  german: 'German',
  kiswahili: 'Kiswahili',
}

/** Colours reused across the language bars and legend so they stay in sync. */
export const LANGUAGE_COLORS: Record<string, string> = {
  french: '#1F509A',
  english: '#FBB23D',
  german: '#10B981',
  kiswahili: '#777777',
}

export interface Metric {
  value: number
  delta: number | null
  previous: number
}

export interface LanguageSlice {
  key: string
  label: string
  count: number
  share: number
  color: string
}

export interface RevenuePoint {
  /** YYYY-MM bucket key — keeps years distinct, unlike grouping on month name */
  key: string
  label: string
  amount: number
  payments: number
}

export interface ActivityItem {
  id: string
  kind: 'inquiry' | 'signup' | 'payment'
  title: string
  detail: string
  at: string
  amount?: number
  status?: string
}

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

const monthLabel = (d: Date) =>
  d.toLocaleString('default', { month: 'short' }) + " '" + String(d.getFullYear()).slice(2)

/**
 * Month-over-month change. Returns null when there is no baseline to compare
 * against (first month of data), so the UI can say "—" instead of inventing 0%.
 */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

function monthRange(offset: number): { start: Date; end: Date } {
  const now = new Date()
  return {
    start: new Date(now.getFullYear(), now.getMonth() + offset, 1),
    end: new Date(now.getFullYear(), now.getMonth() + offset + 1, 1),
  }
}

const within = (d: Date, start: Date, end: Date) => d >= start && d < end

export function revenueFor(payments: Payment[], offset: number): number {
  const { start, end } = monthRange(offset)
  return payments
    .filter((p) => p.status === 'success' && p.currency === 'KES' && within(new Date(p.createdAt), start, end))
    .reduce((sum, p) => sum + p.amount, 0)
}

/** Buckets successful revenue by YYYY-MM across the trailing `months` window. */
export function revenueSeries(payments: Payment[], months = 6): RevenuePoint[] {
  const now = new Date()
  const buckets: RevenuePoint[] = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const start = new Date(d.getFullYear(), d.getMonth(), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const inBucket = payments.filter(
      (p) => p.status === 'success' && p.currency === 'KES' && within(new Date(p.createdAt), start, end),
    )
    buckets.push({
      key: monthKey(d),
      label: monthLabel(d),
      amount: inBucket.reduce((sum, p) => sum + p.amount, 0),
      payments: inBucket.length,
    })
  }

  return buckets
}

/** True language mix, derived from each enrollment's populated course. */
export function languageBreakdown(enrollments: Enrollment[]): LanguageSlice[] {
  const counts = new Map<string, number>()

  for (const e of enrollments) {
    if (e.status === 'completed') continue
    const course = e.courseId
    const language =
      typeof course === 'object' && course !== null
        ? course.language
        : (e.language ?? '').toLowerCase()
    if (!language) continue
    counts.set(language, (counts.get(language) ?? 0) + 1)
  }

  const total = [...counts.values()].reduce((a, b) => a + b, 0)

  return Object.keys(LANGUAGE_LABELS)
    .map((key) => ({
      key,
      label: LANGUAGE_LABELS[key],
      count: counts.get(key) ?? 0,
      share: total === 0 ? 0 : ((counts.get(key) ?? 0) / total) * 100,
      color: LANGUAGE_COLORS[key],
    }))
    .sort((a, b) => b.count - a.count)
}

export function buildMetrics(users: AuthUser[], payments: Payment[], enrollments: Enrollment[]) {
  const learners = users.filter((u) => u.role === 'LEARNER')
  const teachers = users.filter((u) => u.role === 'TEACHER')

  const createdAt = (u: AuthUser) => new Date((u as { createdAt?: string }).createdAt ?? 0)
  const thisMonth = monthRange(0)
  const lastMonth = monthRange(-1)

  const signupsThisMonth = learners.filter((u) => within(createdAt(u), thisMonth.start, thisMonth.end))
  const signupsLastMonth = learners.filter((u) => within(createdAt(u), lastMonth.start, lastMonth.end))

  const activeEnrollments = enrollments.filter((e) => e.status === 'active')
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed')

  const thisMonthRevenue = revenueFor(payments, 0)
  const lastMonthRevenue = revenueFor(payments, -1)

  return {
    learners: learners.length,
    teachers: teachers.length,
    totalUsers: users.length,
    signups: {
      value: signupsThisMonth.length,
      previous: signupsLastMonth.length,
      delta: delta(signupsThisMonth.length, signupsLastMonth.length),
    } satisfies Metric,
    activeEnrollments: {
      value: activeEnrollments.length,
      previous: 0,
      delta: null,
    } satisfies Metric,
    revenue: {
      value: thisMonthRevenue,
      previous: lastMonthRevenue,
      delta: delta(thisMonthRevenue, lastMonthRevenue),
    } satisfies Metric,
    completedEnrollments: completedEnrollments.length,
    avgProgress:
      activeEnrollments.length === 0
        ? 0
        : Math.round(
            activeEnrollments.reduce((sum, e) => sum + (e.progress ?? 0), 0) /
              activeEnrollments.length,
          ),
  }
}

/** Interleaves the three event streams into one reverse-chronological feed. */
export function buildActivity(
  inquiries: Inquiry[],
  users: AuthUser[],
  payments: Payment[],
  limit = 8,
): ActivityItem[] {
  const items: ActivityItem[] = []

  for (const i of inquiries) {
    items.push({
      id: `inq-${i._id}`,
      kind: 'inquiry',
      title: i.subject,
      detail: i.name,
      at: i.createdAt,
      status: i.status,
    })
  }

  for (const u of users) {
    const at = (u as { createdAt?: string }).createdAt
    if (!at) continue
    items.push({
      id: `usr-${(u as { _id?: string })._id ?? u.email}`,
      kind: 'signup',
      title: `${u.name} joined as ${u.role.toLowerCase()}`,
      detail: u.email,
      at,
    })
  }

  for (const p of payments) {
    items.push({
      id: `pay-${p._id}`,
      kind: 'payment',
      title: `${p.currency} ${p.amount.toLocaleString()}`,
      detail: `${p.method} · ${p.status.toLowerCase()}`,
      at: p.createdAt,
      amount: p.amount,
      status: p.status,
    })
  }

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit)
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

export const formatKes = (amount: number) =>
  amount.toLocaleString(undefined, { maximumFractionDigits: 0 })