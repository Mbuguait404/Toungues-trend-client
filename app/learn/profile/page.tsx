'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Shield,
  Camera,
  ChevronDown,
  ChevronUp,
  Calendar,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiFetch, ApiException } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

interface UpdateProfileDto {
  name?: string
  phone?: string
  country?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getMemberSince(id: string): string {
  try {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000
    return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  } catch {
    return 'N/A'
  }
}

export default function ProfilePage() {
  const { user, refresh } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        country: user.country ?? '',
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSuccessMsg(null)
    setErrorMsg(null)
    setIsSaving(true)
    try {
      const dto: UpdateProfileDto = {
        name: formData.name,
        phone: formData.phone || undefined,
        country: formData.country || undefined,
      }
      await apiFetch<AuthUser>('/users/me', { method: 'PUT', body: dto, auth: true })
      await refresh()
      setSuccessMsg('Profile updated successfully!')
    } catch (err) {
      setErrorMsg(err instanceof ApiException ? err.message : 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  const initials = getInitials(user.name)
  const memberSince = getMemberSince(user._id)

  return (
    <>
      <LearnTopbar title="Profile" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {successMsg && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle2 size={18} />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <div className="bg-gradient-to-r from-navy to-navy/90 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="relative group">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-navy text-4xl font-bold border-4 border-white/30">
                    {initials}
                  </div>
                )}
                <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Camera size={22} className="text-white" />
                </button>
              </div>
              <div className="min-w-0">
                <h2 className="text-3xl font-bold truncate" style={{ fontFamily: 'Poppins' }}>
                  {user.name}
                </h2>
                <p className="text-gray-200 flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="text-gray-300 text-sm mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Shield size={14} />
                  <span>{user.role} account</span>
                  <span className="text-gray-500">•</span>
                  <Calendar size={14} />
                  <span>Member since {memberSince}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <User size={20} className="text-gold" />
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all appearance-none bg-white"
                      >
                        <option value="">Select country&hellip;</option>
                        {[
                          'Kenya',
                          'United States',
                          'Switzerland',
                          'France',
                          'Germany',
                          'United Kingdom',
                          'Canada',
                          'Australia',
                        ].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Shield size={20} className="text-gold" />
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Account
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="text-sm font-semibold text-navy bg-gold/10 px-3 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-semibold text-navy">{memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="w-full flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Lock size={20} className="text-gold" />
                    <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                      Password
                    </h3>
                  </div>
                  {showPasswordFields ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {showPasswordFields && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                    {(['current', 'new', 'confirm'] as const).map((key) => {
                      const labels = {
                        current: 'Current Password',
                        new: 'New Password',
                        confirm: 'Confirm Password',
                      }
                      const names = {
                        current: 'currentPassword',
                        new: 'newPassword',
                        confirm: 'confirmPassword',
                      }
                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {labels[key]}
                          </label>
                          <div className="relative">
                            <Lock
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                              type={showPasswords[key] ? 'text' : 'password'}
                              name={names[key]}
                              value={(formData as any)[names[key]]}
                              onChange={handleChange}
                              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((p) => ({ ...p, [key]: !p[key] }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showPasswords[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gold text-navy py-2.5 rounded-lg font-semibold hover:bg-gold-light transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSaving ? 'Saving&hellip;' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
