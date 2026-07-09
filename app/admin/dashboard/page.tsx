'use client'

import { useEffect, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, DollarSign, BookOpen, TrendingUp } from 'lucide-react'
import { ArrowUpRight, Loader2, AlertCircle } from 'lucide-react'
import { getAllUsers, getAllPayments, type Payment } from '@/lib/api/admin'
import type { AuthUser } from '@/lib/auth'

const KPICard = ({ icon: Icon, label, value, change, isPositive }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center">
        <Icon size={24} className="text-gold" />
      </div>
    </div>
    <p className="text-gray-mid text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
    <div className="flex items-center gap-1">
      <ArrowUpRight size={16} className={isPositive ? 'text-green-500' : 'text-red-500'} />
      <span className={isPositive ? 'text-green-500' : 'text-red-500'} style={{ fontFamily: 'Poppins' }}>
        {Math.abs(change)}% vs last month
      </span>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [currency, setCurrency] = useState('KES')
  const [users, setUsers] = useState<AuthUser[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getAllUsers(), getAllPayments()])
      .then(([u, p]) => { setUsers(u); setPayments(p) })
      .catch((err) => setError(err?.message ?? 'Failed to load dashboard data'))
      .finally(() => setIsLoading(false))
  }, [])

  const learners = users.filter((u) => u.role === 'LEARNER')
  const teachers = users.filter((u) => u.role === 'TEACHER')
  const successPayments = payments.filter((p) => p.status === 'SUCCESS')
  const pendingPayments = payments.filter((p) => p.status === 'PENDING')
  const totalRevenue = successPayments.reduce((a, p) => a + p.amount, 0)
  const recentUsers = [...users].reverse().slice(0, 5)
  const recentPayments = [...payments].reverse().slice(0, 5)

  // Build mini revenue chart from actual payments grouped by month
  const revenueByMonth: Record<string, number> = {}
  successPayments.forEach((p) => {
    const month = new Date(p.createdAt).toLocaleString('default', { month: 'short' })
    revenueByMonth[month] = (revenueByMonth[month] ?? 0) + p.amount
  })
  const revenueData = Object.entries(revenueByMonth).map(([month, amount]) => ({ month, amount }))

  const enrollmentData = [
    { language: 'French', count: learners.length, percentage: 28 },
    { language: 'English', count: learners.length, percentage: 35 },
    { language: 'German', count: learners.length, percentage: 21 },
    { language: 'Kiswahili', count: learners.length, percentage: 16 },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Admin Dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={36} className="animate-spin mr-3" />
              Loading live data…
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <>
              {/* KPI Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard icon={Users} label="Total Learners" value={learners.length} change={12} isPositive={true} />
                <KPICard icon={BookOpen} label="Active Enrollments" value={learners.length} change={8} isPositive={true} />
                <KPICard icon={Users} label="Total Teachers" value={teachers.length} change={3} isPositive={true} />
                <KPICard icon={DollarSign} label={`Total Revenue (KES)`} value={totalRevenue.toLocaleString()} change={15} isPositive={true} />
                <KPICard icon={TrendingUp} label="Pending Payments" value={pendingPayments.length} change={0} isPositive={false} />
                <KPICard icon={BookOpen} label="Total Transactions" value={payments.length} change={22} isPositive={true} />
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Revenue Trend
                  </h2>
                  <div className="flex gap-2">
                    {['KES', 'EUR', 'USD'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${currency === curr ? 'bg-gold text-navy' : 'bg-gray-light text-gray-dark hover:bg-gray-200'}`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" stroke="#777" />
                      <YAxis stroke="#777" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #c9a84c', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="amount" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No payment data yet.
                  </div>
                )}
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Enrollments by Language */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-1">
                  <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>Enrollments by Language</h3>
                  <div className="space-y-4">
                    {enrollmentData.map((item) => (
                      <div key={item.language}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-navy">{item.language}</span>
                          <span className="text-sm text-gray-mid">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-light rounded-full h-2">
                          <div className="bg-gold h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                        <p className="text-xs text-gray-mid mt-1">{item.count} learners</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Sign-ups */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Recent Sign-ups</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-light border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">User</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentUsers.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No users yet.</td></tr>
                          ) : recentUsers.map((user, idx) => {
                            const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                            return (
                              <tr key={(user as any)._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">{initials}</div>
                                    <div>
                                      <p className="text-sm font-semibold text-navy">{user.name}</p>
                                      <p className="text-xs text-gray-mid">{user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.role === 'LEARNER' ? 'bg-blue-100 text-blue-700' : user.role === 'TEACHER' ? 'bg-gold bg-opacity-20 text-gold' : 'bg-navy bg-opacity-10 text-navy'}`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Payments */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Recent Payments</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-light border-b border-gray-100">
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Amount</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Method</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentPayments.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">No payments yet.</td></tr>
                          ) : recentPayments.map((p, idx) => (
                            <tr key={p._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                              <td className="px-6 py-4 text-sm font-semibold text-navy">
                                {p.currency} {p.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.method === 'MPESA' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {p.method}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : p.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
