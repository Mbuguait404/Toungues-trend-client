'use client'

import { useState, useEffect } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { ArrowLeft, Download, RotateCw, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getUserById, updateUserRole, updateUserStatus, getAllPayments } from '@/lib/api/admin'
import { apiFetch } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

export default function UserProfile({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('enrollment')
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [payments, setPayments] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  
  const [roleInput, setRoleInput] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await getUserById(params.id)
        setUser(u)
        setRoleInput(u.role)
        
        const [payRes, enrollRes, sessRes] = await Promise.all([
          getAllPayments({ userId: params.id }).catch(() => []),
          apiFetch<any[]>(`/enrollments?userId=${params.id}`, { auth: true }).catch(() => []),
          apiFetch<any[]>(`/sessions?userId=${params.id}`, { auth: true }).catch(() => [])
        ])
        
        setPayments(payRes)
        setEnrollments(enrollRes)
        setSessions(sessRes)
      } catch (err) {
        console.error('Failed to load user data', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleRoleUpdate = async () => {
    if (roleInput === user.role) return
    setIsUpdating(true)
    try {
      const updated = await updateUserRole(params.id, roleInput)
      setUser(updated)
      alert('Role updated successfully')
    } catch (err) {
      alert('Failed to update role')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleStatusToggle = async () => {
    setIsUpdating(true)
    try {
      const updated = await updateUserStatus(params.id, !user.isActive)
      setUser(updated)
      alert(`User ${updated.isActive ? 'activated' : 'deactivated'} successfully`)
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden p-8">
        <h2 className="text-xl text-red-500">User not found</h2>
        <Link href="/admin/users" className="text-blue-500 hover:underline mt-4">Go back</Link>
      </div>
    )
  }

  const initials = user.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const displayRole = user.role.charAt(0) + user.role.slice(1).toLowerCase()
  const displayJoined = new Date(user.createdAt || Date.now()).toLocaleDateString()

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
                  {initials}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
                    {user.name}
                  </h1>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {displayRole}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
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
                <p className="text-sm text-navy font-semibold">{user.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">COUNTRY</p>
                <p className="text-sm text-navy font-semibold">{user.country || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-mid font-semibold mb-1">JOINED</p>
                <p className="text-sm text-navy font-semibold">{displayJoined}</p>
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
                    <select
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="w-full border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="LEARNER">Learner</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <button
                    onClick={handleRoleUpdate}
                    disabled={isUpdating || roleInput === user.role}
                    className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>

                <hr className="my-4" />

                <div className="space-y-3">
                  <button
                    onClick={handleStatusToggle}
                    disabled={isUpdating}
                    className={`w-full font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 ${
                      user.isActive 
                        ? 'border border-red-500 text-red-500 hover:bg-red-50' 
                        : 'border border-green-500 text-green-500 hover:bg-green-50'
                    }`}
                  >
                    <Lock size={16} />
                    {user.isActive ? 'Deactivate Account' : 'Activate Account'}
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
                    {enrollments.length === 0 ? (
                      <p className="text-gray-500">No enrollments found.</p>
                    ) : (
                      enrollments.map((enr, idx) => (
                        <div key={idx} className="bg-gray-light p-4 rounded-xl space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-mid mb-1">COURSE</h3>
                              <p className="text-lg font-bold text-navy">{enr.courseId?.title || 'Unknown'}</p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                              {enr.status}
                            </span>
                          </div>
                          <div className="flex gap-8">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-mid mb-1">LEVEL</h3>
                              <p className="text-md font-bold text-navy">{enr.level}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-mid mb-1">ENROLLED ON</h3>
                              <p className="text-md font-bold text-navy">{new Date(enr.startedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-mid mb-2">PROGRESS</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 bg-white rounded-full h-3 border border-gray-200">
                                <div className="bg-gold h-3 rounded-full" style={{ width: `${enr.progress}%` }} />
                              </div>
                              <span className="font-bold text-navy">{enr.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'sessions' && (
                  <div className="space-y-3">
                    {sessions.length === 0 ? (
                      <p className="text-gray-500">No sessions found.</p>
                    ) : (
                      sessions.map((session, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                          <div>
                            <p className="text-sm font-semibold text-navy">{session.courseId?.title || 'Course'}</p>
                            <p className="text-xs text-gray-mid">{new Date(session.startTime).toLocaleString()} • {session.duration} min</p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                            {session.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-3">
                    {payments.length === 0 ? (
                      <p className="text-gray-500">No payments found.</p>
                    ) : (
                      payments.map((payment, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                          <div>
                            <p className="text-sm font-semibold text-navy">{payment.currency} {payment.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-mid">{new Date(payment.createdAt).toLocaleDateString()} • {payment.method}</p>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {payment.status}
                          </span>
                        </div>
                      ))
                    )}
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
