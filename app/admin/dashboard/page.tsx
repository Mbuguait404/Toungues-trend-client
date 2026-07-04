'use client'

import { useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, DollarSign, BookOpen, TrendingUp, Download, Eye } from 'lucide-react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const revenueData = [
  { month: 'Aug', KES: 145000, EUR: 3200, USD: 3800 },
  { month: 'Sep', KES: 158000, EUR: 3500, USD: 4100 },
  { month: 'Oct', KES: 172000, EUR: 3800, USD: 4500 },
  { month: 'Nov', KES: 195000, EUR: 4200, USD: 5000 },
  { month: 'Dec', KES: 218000, EUR: 4600, USD: 5500 },
  { month: 'Jan', KES: 245000, EUR: 5100, USD: 6100 },
]

const enrollmentData = [
  { language: 'French', count: 248, percentage: 28 },
  { language: 'English', count: 312, percentage: 35 },
  { language: 'German', count: 184, percentage: 21 },
  { language: 'Kiswahili', count: 156, percentage: 16 },
]

const recentSignups = [
  { id: 1, avatar: 'AK', name: 'Amara Kipchoge', email: 'amara@example.com', role: 'Learner', date: 'Jan 15, 2025', status: 'Active' },
  { id: 2, avatar: 'SL', name: 'Sophie Laurent', email: 'sophie@example.com', role: 'Teacher', date: 'Jan 14, 2025', status: 'Active' },
  { id: 3, avatar: 'MA', name: 'Mohammed Ahmed', email: 'mohammed@example.com', role: 'Learner', date: 'Jan 13, 2025', status: 'Active' },
  { id: 4, avatar: 'EM', name: 'Elsa Mueller', email: 'elsa@example.com', role: 'Teacher', date: 'Jan 12, 2025', status: 'Active' },
  { id: 5, avatar: 'JK', name: 'James Kariuki', email: 'james@example.com', role: 'Learner', date: 'Jan 11, 2025', status: 'Pending' },
  { id: 6, avatar: 'LN', name: 'Lisa Neumann', email: 'lisa@example.com', role: 'Learner', date: 'Jan 10, 2025', status: 'Active' },
  { id: 7, avatar: 'DK', name: 'David Kipkemboi', email: 'david@example.com', role: 'Teacher', date: 'Jan 9, 2025', status: 'Active' },
  { id: 8, avatar: 'PR', name: 'Pierre Rousseau', email: 'pierre@example.com', role: 'Learner', date: 'Jan 8, 2025', status: 'Active' },
  { id: 9, avatar: 'ZA', name: 'Zainab Ahmed', email: 'zainab@example.com', role: 'Learner', date: 'Jan 7, 2025', status: 'Active' },
  { id: 10, avatar: 'HM', name: 'Hans Mueller', email: 'hans@example.com', role: 'Teacher', date: 'Jan 6, 2025', status: 'Active' },
]

const recentPayments = [
  { id: 1, learner: 'Amara Kipchoge', amount: 3000, currency: 'KES', method: 'M-Pesa', status: 'Success', date: 'Jan 15, 2025' },
  { id: 2, learner: 'Sophie Laurent', amount: 150, currency: 'CHF', method: 'Stripe', status: 'Success', date: 'Jan 14, 2025' },
  { id: 3, learner: 'James Kariuki', amount: 2500, currency: 'KES', method: 'M-Pesa', status: 'Success', date: 'Jan 13, 2025' },
  { id: 4, learner: 'Elsa Mueller', amount: 100, currency: 'EUR', method: 'Stripe', status: 'Pending', date: 'Jan 12, 2025' },
  { id: 5, learner: 'Mohammed Ahmed', amount: 2000, currency: 'KES', method: 'M-Pesa', status: 'Failed', date: 'Jan 11, 2025' },
]

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
      {isPositive ? (
        <ArrowUpRight size={16} className="text-green-500" />
      ) : (
        <ArrowDownRight size={16} className="text-red-500" />
      )}
      <span className={isPositive ? 'text-green-500' : 'text-red-500'} style={{ fontFamily: 'Poppins' }}>
        {Math.abs(change)}% vs last month
      </span>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [currency, setCurrency] = useState('KES')

  const getRevenueValue = (month: any) => {
    if (currency === 'KES') return month.KES
    if (currency === 'EUR') return month.EUR
    return month.USD
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Admin Dashboard" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KPICard icon={Users} label="Total Learners" value={887} change={12} isPositive={true} />
            <KPICard icon={BookOpen} label="Active Enrollments" value={1243} change={8} isPositive={true} />
            <KPICard icon={Users} label="Total Teachers" value={24} change={3} isPositive={true} />
            <KPICard icon={DollarSign} label="Monthly Revenue (KES)" value="245,000" change={15} isPositive={true} />
            <KPICard icon={TrendingUp} label="New Sign-ups This Month" value={118} change={-5} isPositive={false} />
            <KPICard icon={BookOpen} label="Certificates Issued" value={156} change={22} isPositive={true} />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Revenue Trend - Last 6 Months
              </h2>
              <div className="flex gap-2">
                {['KES', 'EUR', 'USD'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      currency === curr
                        ? 'bg-gold text-navy'
                        : 'bg-gray-light text-gray-dark hover:bg-gray-200'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#777777" />
                <YAxis stroke="#777777" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #c9a84c', borderRadius: '8px' }}
                  formatter={(value) => `${currency} ${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey={currency} 
                  stroke="#c9a84c" 
                  strokeWidth={2}
                  dot={{ fill: '#c9a84c', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Enrollment and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Enrollments by Language */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-1">
              <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Enrollments by Language
              </h3>
              <div className="space-y-4">
                {enrollmentData.map((item) => (
                  <div key={item.language}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-navy">{item.language}</span>
                      <span className="text-sm text-gray-mid">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-light rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-mid mt-1">{item.count} learners</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sign-ups and Payments */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Sign-ups Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Recent Sign-ups
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-light border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">User</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSignups.slice(0, 5).map((user, idx) => (
                        <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">
                                {user.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-navy">{user.name}</p>
                                <p className="text-xs text-gray-mid">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              user.role === 'Learner' ? 'bg-blue-100 text-blue-700' : 'bg-gold bg-opacity-20 text-gold'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-dark">{user.date}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-gold hover:text-gold-light text-sm font-semibold transition-colors">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Payments Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Recent Payments
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-light border-b border-gray-100">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Learner</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Amount</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Method</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-dark">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment, idx) => (
                        <tr key={payment.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                          <td className="px-6 py-4 text-sm font-semibold text-navy">{payment.learner}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-navy">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              payment.method === 'M-Pesa' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {payment.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              payment.status === 'Success' ? 'bg-green-100 text-green-700' :
                              payment.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-dark">{payment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
