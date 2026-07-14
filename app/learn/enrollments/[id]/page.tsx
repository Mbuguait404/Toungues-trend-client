'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import LearnTopbar from '@/components/learn-topbar'
import { Loader2, AlertCircle, CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { getEnrollmentById, getEnrollmentCourseName, getEnrollmentLanguage, type Enrollment } from '@/lib/api/enrollments'
import { getModules, type CourseModule } from '@/lib/api/modules'
import { getEnrollmentProgress, type Progress } from '@/lib/api/progress'
import { ApiException } from '@/lib/api'

export default function EnrollmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [modules, setModules] = useState<CourseModule[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const enr = await getEnrollmentById(id)
        setEnrollment(enr)

        const courseId = typeof enr.courseId === 'object' ? enr.courseId._id : enr.courseId

        const [mods, prog] = await Promise.all([
          getModules({ courseId }),
          getEnrollmentProgress(id),
        ])
        setModules(mods)

        const map: Record<string, Progress> = {}
        for (const p of prog) {
          map[p.moduleId] = p
        }
        setProgressMap(map)
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load enrollment')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  if (isLoading) {
    return (
      <>
        <LearnTopbar title="Enrollment" />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          Loading modules…
        </div>
      </>
    )
  }

  if (error || !enrollment) {
    return (
      <>
        <LearnTopbar title="Enrollment" />
        <div className="p-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            {error || 'Enrollment not found'}
          </div>
        </div>
      </>
    )
  }

  const courseName = getEnrollmentCourseName(enrollment)
  const language = getEnrollmentLanguage(enrollment)
  const progress = enrollment.progress ?? 0

  return (
    <>
      <LearnTopbar title={courseName} />
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        <div className="bg-navy rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            {courseName}
          </h2>
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            <span>{language}</span>
            <span>Level: {enrollment.level ?? 'General'}</span>
            <span>{progress}% complete</span>
          </div>
          <div className="mt-3 w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
          Course Modules
        </h3>

        {modules.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
            No modules available for this course yet.
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, idx) => {
              const prog = progressMap[mod._id]
              const isCompleted = prog?.isCompleted ?? false
              return (
                <button
                  key={mod._id}
                  onClick={() => router.push(`/learn/modules/${mod._id}?enrollmentId=${id}`)}
                  className={`w-full bg-white rounded-xl p-4 border text-left transition-all hover:border-gold hover:shadow-sm flex items-center gap-4 ${
                    isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 size={22} className="text-green-500" />
                    ) : (
                      <Circle size={22} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy text-sm">
                      {idx + 1}. {mod.title}
                    </p>
                    {mod.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{mod.description}</p>
                    )}
                  </div>
                  <ArrowRight size={18} className="text-gray-400 flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-10 bg-gray-light rounded-2xl p-6 text-center">
          <h4 className="text-lg font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>
            Want to learn another language?
          </h4>
          <p className="text-sm text-gray-600 mb-4">Browse all our courses and start a new learning journey.</p>
          <button
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-all"
          >
            Browse Courses <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
