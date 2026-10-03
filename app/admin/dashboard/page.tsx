'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Loader2, AlertCircle, RefreshCw, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getAllUsers, getAllPayments, type Payment } from '@/lib/api/admin'
import { getAllEnrollments, type Enrollment } from '@/lib/api/enrollments'
import { getAllInquiries, type Inquiry } from '@/lib/api/inquiries'
import type { AuthUser } from '@/lib/auth'
import {
  buildActivity,
  buildMetrics,
  formatKes,
  languageBreakdown,
  revenueSeries,
  timeAgo,
  type ActivityItem,
  type LanguageSlice,
  type Metric,
} from '@/lib/dashboard'

const KES = (amount: number) => `KES ${formatKes(amount)}`

function DeltaBadge({ delta }: { delta: number | null }) {
  // No baseline month to compare against — say so instead of showing a fake 0%.
  if (delta === null) {
    return <span className="text-[11px] text-gray-mid">no prior month</span>
  }
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gray-mid">
        <Minus size={11} /> 0%
      </span>
    )
  }
  const up = delta > 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
        up ? 'text-green-600' : 'text-red-500'
      }`}
    >
      <Icon size={11} />
      {Math.abs(delta).toFixed(1)}%
    </span>
  )
}

function StatTile({
  label,
  value,
  sub,
  metric,
  accent = 'text-navy',
  icon: Icon,
  href,
}: {
  label: string
  value: string | number
  sub?: string
  metric?: Metric
  accent?: string
  icon: typeof BarChart3
  href?: string
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-mid">{label}</p>
        <Icon size={15} className={accent} />
      </div>
      <p className={`text-[26px] leading-none font-bold ${accent}`} style={{ fontFamily: 'Poppins' }}>
        {value}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {metric && <DeltaBadge delta={metric.delta} />}
        {sub && <span className="text-[11px] text-gray-mid">{sub}</span>}
      </div>
    </>
  )

  const className = 'block bg-white rounded-xl border border-gray-100 p-4'

  return href ? (
    <Link href={href} className={`${className} hover:border-gold hover:shadow-sm transition-all`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

const Card = ({
  title,
  action,
  children,
  className = '',
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) => (
  <section className={`bg-white rounded-xl border border-gray-100 ${className}`}>
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <h2 className="text-sm font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
        {title}
      </h2>
      {action}
    </header>
    {children}
  </section>
)

const EmptyRow = ({ colSpan, children }: { colSpan: number; children: React.ReactNode }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-gray-mid">
      {children}
    </td>
  </tr>
)

const KIND_META: Record<ActivityItem['kind'], { label: string; className: string }> = {
  inquiry: { label: 'Inquiry', className: 'bg-gold/15 text-[#8a5f10]' },
  signup: { label: 'Signup', className: 'bg-blue-100 text-blue-700' },
  payment: { label: 'Payment', className: 'bg-green-100 text-green-700' },
}

function ActivityFeed({ items, loading }: { items: ActivityItem[]; loading: boolean }) {
  return (
    <ul className="divide-y divide-gray-100">
      {loading ? (
        <li className="px-4 py-10 text-center text-sm text-gray-mid">Loading activity…</li>
      ) : items.length === 0 ? (
        <li className="px-4 py-10 text-center text-sm text-gray-mid">No activity recorded yet.</li>
      ) : (
        items.map((item) => (
          <li key={item.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-light/60">
            <span
              className={`shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md ${KIND_META[item.kind].className}`}
            >
              {KIND_META[item.kind].label}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-navy truncate">{item.title}</p>
              <p className="text-[11px] text-gray-mid truncate">{item.detail}</p>
            </div>
            <span className="shrink-0 text-[11px] text-gray-mid">{timeAgo(item.at)}</span>
          </li>
        ))
      )}
    </ul>
  )
}

function LanguageCard({ slices, loading }: { slices: LanguageSlice[]; loading: boolean }) {
  const total = slices.reduce((sum, s) => sum + s.count, 0)
  const chart = slices.filter((s) => s.count > 0).map((s) => ({ name: s.label, value: s.count }))

  return (
    <Card title="Enrollments by language" className="flex flex-col">
      <div className="p-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm text-gray-mid">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : total === 0 ? (
          <div className="h-40 flex items-center justify-center text-sm text-gray-mid text-center px-4">
            No active enrollments yet.
            <br />
            Once learners enrol, the mix by language appears here.
          </div>
        ) : (
          <>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} layout="vertical" margin={{ left: 0, right: 12 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fontSize: 11, fill: '#777' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f5f5f5' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                    {chart.map((entry) => (
                      <Cell key={entry.name} fill={slices.find((s) => s.label === entry.name)?.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-1.5">
              {slices.map((slice) => (
                <li key={slice.key} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: slice.color }} />
                  <span className="text-gray-dark flex-1">{slice.label}</span>
                  <span className="text-gray-mid tabular-nums">{slice.count}</span>
                  <span className="w-11 text-right text-navy font-semibold tabular-nums">
                    {slice.share.toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Card>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true)
    try {
      setError(null)
      const [u, p, e, i] = await Promise.all([
        getAllUsers(),
        getAllPayments(),
        getAllEnrollments({ limit: '500' }),
        getAllInquiries({ limit: '50' }),
      ])
      setUsers(u)
      setPayments(p)
      setEnrollments(e)
      setInquiries(i)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const metrics = useMemo(() => buildMetrics(users, payments, enrollments), [users, payments, enrollments])
  const series = useMemo(() => revenueSeries(payments, 6), [payments])
  const slices = useMemo(() => languageBreakdown(enrollments), [enrollments])
  const activity = useMemo(() => buildActivity(inquiries, users, payments, 9), [inquiries, users, payments])

  const newInquiries = inquiries.filter((i) => i.status === 'NEW').length
  const successPayments = payments.filter((p) => p.status === 'success')
  const pendingPayments = payments.filter((p) => p.status === 'pending')

  const hasChartData = series.some((p) => p.amount > 0)
  const rangeLabel = series.length ? `${series[0].label} – ${series[series.length - 1].label}` : ''

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-mid">
        <Loader2 size={28} className="animate-spin mr-3" />
        Loading live data…
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto p-5 space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
              Dashboard
            </h1>
            <p className="text-xs text-gray-mid mt-0.5">
              {rangeLabel && <>Revenue window {rangeLabel} · </>}
              Revenue charts show KES payments; other currencies remain visible in payment records.
            </p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-100 text-sm font-semibold text-gray-dark hover:border-gold hover:shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatTile
            label="Revenue this month"
            value={KES(metrics.revenue.value)}
            metric={metrics.revenue}
            icon={BarChart3}
            accent="text-navy"
          />
          <StatTile
            label="Active enrollments"
            value={metrics.activeEnrollments.value}
            sub={`${metrics.completedEnrollments} completed`}
            icon={BarChart3}
          />
          <StatTile
            label="New signups"
            value={metrics.signups.value}
            metric={metrics.signups}
            icon={BarChart3}
          />
          <StatTile
            label="Learners"
            value={metrics.learners}
            sub={`${metrics.teachers} teachers`}
            icon={BarChart3}
          />
          <StatTile
            label="Open inquiries"
            value={inquiries.filter((i) => i.status === 'NEW' || i.status === 'IN_PROGRESS').length}
            sub={newInquiries > 0 ? `${newInquiries} unread` : 'all handled'}
            icon={BarChart3}
            href="/admin/inquiries"
          />
          <StatTile
            label="Avg. progress"
            value={`${metrics.avgProgress}%`}
            sub={`${pendingPayments.length} pending payments`}
            icon={BarChart3}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card
            title="Revenue trend"
            className="xl:col-span-2"
            action={
              <span className="text-[11px] text-gray-mid">
                {KES(successPayments.filter((payment) => payment.currency === 'KES').reduce((a, p) => a + p.amount, 0))} all time
              </span>
            }
          >
            <div className="p-4 h-64">
              {hasChartData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ left: 0, right: 8, top: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#777' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#777' }}
                      axisLine={false}
                      tickLine={false}
                      width={58}
                      tickFormatter={(v: number) => formatKes(v)}
                    />
                    <Tooltip
                      formatter={(v) => KES(Number(v))}
                      contentStyle={{ borderRadius: 8, border: '1px solid #e5e5e5', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#1F509A"
                      strokeWidth={2}
                      dot={{ fill: '#FBB23D', stroke: '#1F509A', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-mid text-center">
                  No successful payments in this window yet.
                </div>
              )}
            </div>
          </Card>

          <LanguageCard slices={slices} loading={isLoading} />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card
            title="Recent inquiries"
            action={
              <Link href="/admin/inquiries" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                View all
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">From</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Subject</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length === 0 ? (
                    <EmptyRow colSpan={3}>No inquiries yet.</EmptyRow>
                  ) : (
                    inquiries.slice(0, 6).map((inquiry, idx) => (
                      <tr key={inquiry._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                        <td className="px-4 py-2.5">
                          <p className="text-sm text-navy font-medium truncate max-w-[10rem]">{inquiry.name}</p>
                          <p className="text-[11px] text-gray-mid truncate max-w-[10rem]">{inquiry.email}</p>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-dark max-w-[12rem] truncate">
                          {inquiry.subject}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md whitespace-nowrap ${
                              inquiry.status === 'NEW'
                                ? 'bg-blue-100 text-blue-700'
                                : inquiry.status === 'IN_PROGRESS'
                                  ? 'bg-amber-100 text-amber-700'
                                  : inquiry.status === 'RESOLVED'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {inquiry.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card
            title="Latest payments"
            action={
              <Link href="/admin/payments" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                View all
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Amount</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Method</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Status</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <EmptyRow colSpan={4}>No payments yet.</EmptyRow>
                  ) : (
                    payments.slice(0, 6).map((p, idx) => (
                      <tr key={p._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                        <td className="px-4 py-2.5 text-sm font-semibold text-navy whitespace-nowrap tabular-nums">
                          {p.currency} {p.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              p.method === 'payhero' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {p.method}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                              p.status === 'success'
                                ? 'bg-green-100 text-green-700'
                                : p.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-gray-mid whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Activity */}
        <Card title="Recent activity">
          <ActivityFeed items={activity} loading={isLoading} />
        </Card>
      </div>
    </div>
  )
}