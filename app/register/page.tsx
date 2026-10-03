'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, User, ArrowRight, BookOpen, GraduationCap, ChevronRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { register as apiRegister } from '@/lib/auth'
import { ApiException } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? searchParams.get('next')
  const paidCourseRegistration = Boolean(redirectTo?.includes('checkout='))
  const previewRegistration = Boolean(redirectTo?.includes('preview='))

  const { refresh } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    language: 'English',
    level: 'Beginner',
  })

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await apiRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      await refresh()
      const targetPath = (redirectTo && !redirectTo.startsWith('/login') && !redirectTo.startsWith('/register'))
        ? redirectTo
        : '/learn/dashboard'
      router.push(targetPath)
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]" />

      <Reveal direction="down" distance={18} duration={0.5} className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center mb-6">
          <img src="/logo.png" alt="Tongues Trend" className="h-10" />
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {paidCourseRegistration ? 'Register to get started' : previewRegistration ? 'Register for the free preview' : 'Start your learning journey'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {paidCourseRegistration
            ? 'This is a paid course. The first lesson part is free; complete payment after registration to unlock the full course.'
            : previewRegistration
              ? 'Create your account to access the free first lesson part. The remaining course content is paid.'
              : 'Join thousands of students mastering new languages'}
        </p>
      </Reveal>

      <Reveal delay={0.05} distance={16} duration={0.5} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Stagger stagger={0.08} delay={0.12} className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">

          <StaggerItem duration={0.5} className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm shadow-md transition-colors`}>
                1
              </div>
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-white text-gray-500 border-2 border-gray-200'} font-bold text-sm transition-colors`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
              <span>Account Details</span>
              <span>Learning Goals</span>
            </div>
          </StaggerItem>

          {error && (
            <div className="flex items-start gap-3 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleNext}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors bg-white/50 focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors bg-white/50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-colors bg-white/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What language do you want to learn?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'French', 'German', 'Kiswahili'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => updateFormData('language', lang)}
                      className={`flex items-center gap-2 p-3 border rounded-xl text-left transition-all ${
                        formData.language === lang
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-gray-200 bg-white hover:border-primary/50'
                      }`}
                    >
                      <BookOpen className={`h-4 w-4 ${formData.language === lang ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{lang}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 mt-6">
                  What is your current level?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateFormData('level', level)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl transition-all ${
                        formData.level === level
                          ? 'border-secondary bg-secondary/10 text-secondary ring-1 ring-secondary'
                          : 'border-gray-200 bg-white hover:border-secondary/50'
                      }`}
                    >
                      <GraduationCap className={`h-5 w-5 ${formData.level === level ? 'text-secondary' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium">{level}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-gray-900 bg-[#FDC76F] hover:bg-[#f5bc5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-gray-800/30 border-t-gray-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      {paidCourseRegistration ? 'Create account & continue to payment' : previewRegistration ? 'Create account & open preview' : 'Complete Registration'}
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <StaggerItem duration={0.5} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </StaggerItem>
        </Stagger>
      </Reveal>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
