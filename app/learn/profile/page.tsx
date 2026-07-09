'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import { Upload, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiFetch, ApiException } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

interface UpdateProfileDto {
  name?: string
  phone?: string
  country?: string
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

  // Populate form from auth user on mount
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

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <LearnTopbar title="Profile" />
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        <div className="space-y-8">
          {/* Status messages */}
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

          {/* Avatar */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-navy mb-4">Profile Photo</h3>
            <div className="flex items-center gap-4">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-navy text-3xl font-bold">
                  {initials}
                </div>
              )}
              <button className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
                <Upload size={16} />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-navy mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read-only)</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">Select country…</option>
                  {['Kenya', 'United States', 'Switzerland', 'France', 'Germany', 'United Kingdom', 'Canada', 'Australia'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="w-full flex items-center justify-between text-lg font-bold text-navy hover:text-gold transition-colors"
            >
              <span>Change Password</span>
              <span>{showPasswordFields ? '−' : '+'}</span>
            </button>

            {showPasswordFields && (
              <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                {(['current', 'new', 'confirm'] as const).map((key) => {
                  const labels = { current: 'Current Password', new: 'New Password', confirm: 'Confirm Password' }
                  const names = { current: 'currentPassword', new: 'newPassword', confirm: 'confirmPassword' }
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{labels[key]}</label>
                      <div className="relative">
                        <input
                          type={showPasswords[key] ? 'text' : 'password'}
                          name={names[key]}
                          value={(formData as any)[names[key]]}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords((p) => ({ ...p, [key]: !p[key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gold text-navy py-3 rounded-full font-semibold hover:bg-gold-light transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  )
}
