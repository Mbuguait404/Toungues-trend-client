'use client'

import { useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { ArrowLeft, Download, RotateCw, Lock, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function UserProfile({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('enrollment')
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const user = {
    avatar: 'AK',
    name: 'Amara Kipchoge',
    email: 'amara@example.com',
    role: 'Learner',
    status: 'Active',
    joined: 'January 15, 2025',
    phone: '+254 729 482 786',
    country: 'Kenya',
    lastLogin: 'Today at 2:30 PM',
    courseEnrolled: 'French',
    level: 'B1 - Intermediate',
    progress: 65,
    startDate: 'January 15, 2025',
  }

  const sessions = [
    { date: 'Jan 14, 2025', teacher: 'Sophie Laurent', duration: '60 min', status: 'Completed' },
    { date: 'Jan 12, 2025', teacher: 'Sophie Laurent', duration: '60 min', status: 'Completed' },
    { date: 'Jan 10, 2025', teacher: 'Sophie Laurent', duration: '60 min', status: 'Completed' },
    { date: 'Jan 8, 2025', teacher: 'Sophie Laurent', duration: '60 min', status: 'Completed' },
    { date: 'Jan 6, 2025', teacher: 'Sophie Laurent', duration: '60 min', status: 'Completed' },
  ]

  const payments = [
    { amount: 3000, currency: 'KES', method: 'M-Pesa', date: 'Jan 15, 2025', status: 'Success' },
    { amount: 3000, currency: 'KES', method: 'M-Pesa', date: 'Dec 15, 2024', status: 'Success' },
    { amount: 3000, currency: 'KES', method: 'M-Pesa', date: 'Nov 15, 2024', status: 'Success' },
  ]

  const certificates = [
    { language: 'French', level: 'A1', date: 'Feb 10, 2025' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title={user.name} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Back Button */}
          <Link href="/admin/users" className="flex items-center gap-2 text-gold hover:text-gold-light mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Users</span>
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gold text-navy flex items-center justify-center text-4xl font-bold">
                  {user.avatar}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                    {user.name}
                  </h1>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">EMAIL</p>
                <p className="text-sm text-navy font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">PHONE</p>
                <p className="text-sm text-navy font-semibold">{user.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">COUNTRY</p>
                <p className="text-sm text-navy font-semibold">{user.country}</p>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">LAST LOGIN</p>
                <p className="text-sm text-navy font-semibold">{user.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Actions */}
            <div className="space-y-6">
              {/* Account Settings Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                  Account Management
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-navy mb-2 block">Change Role</label>
                    <select className="w-full border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>Learner</option>
                      <option>Teacher</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <button className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-2 rounded-lg transition-colors text-sm">
                    Save Changes
                  </button>
                </div>

                <hr className="my-4" />

                <div className="space-y-3">
                  <button className="w-full border border-red-500 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                    <Lock size={16} />
                    Deactivate Account
                  </button>
                  <button
                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                    className="w-full border border-gray-100 text-navy hover:bg-gray-50 font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCw size={16} />
                    Reset Password
                  </button>
                </div>

                {showPasswordReset && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-navy">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          className="w-full border border-gray-100 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-mid"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <button className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-2 rounded-lg transition-colors text-sm mt-3">
                      Reset Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - User Data */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <div className="flex gap-0 border-b border-gray-100">
                {[
                  { label: 'Enrollment', value: 'enrollment' },
                  { label: 'Sessions', value: 'sessions' },
                  { label: 'Payments', value: 'payments' },
                  { label: 'Certificates', value: 'certificates' },
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-6 py-3 font-semibold transition-all text-sm ${
                      activeTab === tab.value
                        ? 'text-gold border-b-2 border-gold'
                        : 'text-gray-mid hover:text-navy'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                {activeTab === 'enrollment' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-mid mb-2">COURSE</h3>
                      <p className="text-lg font-bold text-navy">{user.courseEnrolled}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-mid mb-2">LEVEL</h3>
                      <p className="text-lg font-bold text-navy">{user.level}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-mid mb-2">PROGRESS</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-light rounded-full h-3">
                          <div className="bg-gold h-3 rounded-full" style={{ width: `${user.progress}%` }} />
                        </div>
                        <span className="font-bold text-navy">{user.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-mid mb-2">ENROLLMENT DATE</h3>
                      <p className="text-lg font-bold text-navy">{user.startDate}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div className="space-y-3">
                    {sessions.map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-navy">{session.teacher}</p>
                          <p className="text-xs text-gray-mid">{session.date} • {session.duration}</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {session.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-3">
                    {payments.map((payment, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                        <div>
                          <p className="text-sm font-semibold text-navy">{payment.currency} {payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-mid">{payment.date} • {payment.method}</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'certificates' && (
                  <div className="space-y-3">
                    {certificates.length > 0 ? (
                      certificates.map((cert, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                          <div>
                            <p className="text-sm font-semibold text-navy">{cert.language} - {cert.level}</p>
                            <p className="text-xs text-gray-mid">Issued {cert.date}</p>
                          </div>
                          <button className="text-gold hover:text-gold-light font-semibold text-sm flex items-center gap-2 transition-colors">
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-mid py-8">No certificates earned yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
