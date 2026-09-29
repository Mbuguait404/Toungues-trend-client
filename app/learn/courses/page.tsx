'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import Link from 'next/link'
import { Lock, CheckCircle2, Play, BookOpen, Loader2, AlertCircle } from 'lucide-react'
import { getMyEnrollments, getEnrollmentCourseName, getEnrollmentLanguage, type Enrollment } from '@/lib/api/enrollments'
import { ApiException } from '@/lib/api'
import { Reveal } from '@/components/motion'

function getStatusBadge(progress: number, total: number, done: number) {
  if (done >= total && total > 0) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: <CheckCircle2 size={16} className="text-green-600" /> }
  if (progress > 0) return { bg: 'bg-gold/10', text: 'text-gold', label: 'In Progress', icon: <Play size={16} className="text-gold" /> }
  return { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Not Started', icon: <Lock size={16} className="text-gray-400" /> }
}

export default function CoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyEnrollments()
      .then(setEnrollments)
      .catch((err) =>
        setError(err instanceof ApiException ? err.message : 'Failed to load courses'),
      )
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <>
      <LearnTopbar title="My Courses" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading your courses…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={64} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No enrollments yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Browse our courses and start your language learning journey!</p>
            <a href="/courses" className="bg-gold text-navy px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
              Browse Courses
            </a>
          </div>
        ) : (
          enrollments.map((enrollment) => {
            const progress = enrollment.progress ?? 0
            const done = enrollment.completedModules ?? 0
            const total = enrollment.totalModules ?? 0
            const badge = getStatusBadge(progress, total, done)

            return (
              <Reveal key={enrollment._id} amount={0.1} duration={0.5} distance={18}>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-navy mb-1">
                    {getEnrollmentCourseName(enrollment)}
                  </h2>
                  {enrollment.level && (
                    <p className="text-sm text-gray-600">
                      Level: <span className="font-semibold">{enrollment.level}</span>
                    </p>
                  )}
                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gold w-12 text-right">{progress}%</span>
                  </div>
                  {total > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{done}/{total} modules completed</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/learn/enrollments/${enrollment._id}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gold hover:shadow-sm transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {badge.icon}
                      </div>
                      <div>
                        <p className="font-medium text-navy text-sm">
                          {getEnrollmentCourseName(enrollment)}
                        </p>
                        <p className="text-xs text-gray-500">{enrollment.level ?? 'View modules'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      <button className="text-gold font-semibold text-sm group-hover:text-gold-light transition-colors">
                        {done >= total && total > 0 ? 'Review' : 'Continue'}
                      </button>
                    </div>
                  </Link>
                </div>
              </Reveal>
            )
          })
        )}
      </div>
    </>
  )
}
