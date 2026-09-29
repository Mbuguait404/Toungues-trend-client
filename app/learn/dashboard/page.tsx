'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import { BookOpen, CheckCircle2, Clock, Award, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getMyEnrollments, getEnrollmentCourseName, type Enrollment } from '@/lib/api/enrollments'
import { getMySessions, type Session } from '@/lib/api/sessions'
import { getMaterials, type Material } from '@/lib/api/materials'
import { getMyCertificates } from '@/lib/api/certificates'
import { ApiException } from '@/lib/api'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
}) {
  return (
    <StaggerItem className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-all" duration={0.5}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <Icon size={20} className={color} />
      </div>
      <p className="text-3xl font-bold text-navy">{value}</p>
    </StaggerItem>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-gray-400">
      <Loader2 size={32} className="animate-spin mr-3" />
      <span>Loading your data…</span>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
      <AlertCircle size={20} />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [certCount, setCertCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [enrs, sess, mats, certs] = await Promise.all([
          getMyEnrollments(),
          getMySessions(),
          getMaterials(),
          getMyCertificates(),
        ])
        setEnrollments(enrs)
        setSessions(sess.filter((s) => s.status === 'UPCOMING'))
        setMaterials(mats.slice(0, 5))
        setCertCount(certs.length)
      } catch (err) {
        const msg = err instanceof ApiException ? err.message : 'Failed to load dashboard data'
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  const completedModules = enrollments.reduce(
    (acc, e) => acc + ((e as any).completedModulesCount ?? (Array.isArray(e.completedModules) ? e.completedModules.length : 0)),
    0,
  )

  const upcomingSessions = sessions.slice(0, 3)

  return (
    <>
      <LearnTopbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <Reveal className="bg-gradient-to-r from-navy to-navy/90 rounded-2xl p-8 text-white shadow-sm" duration={0.5} distance={20}>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            Welcome back, {firstName}!
          </h2>
          <p className="text-gray-200">Continue your language learning journey. You&apos;re making great progress!</p>
        </Reveal>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorBanner message={error} />
        ) : (
          <>
            {/* Stats Row */}
            <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-4" delay={0.05}>
              <StatCard label="Enrolled Courses" value={enrollments.length} icon={BookOpen} color="text-blue-500" />
              <StatCard label="Completed Modules" value={completedModules} icon={CheckCircle2} color="text-green-500" />
              <StatCard label="Upcoming Sessions" value={upcomingSessions.length} icon={Clock} color="text-orange-500" />
              <StatCard label="Certificates Earned" value={certCount} icon={Award} color="text-gold" />
            </Stagger>

            {/* My Courses */}
            <Reveal amount={0.1} duration={0.5} distance={18}>
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                My Courses
              </h3>
              {enrollments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
                  <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No courses yet.</p>
                  <p className="text-sm mt-1">
                    <a href="/courses" className="text-gold hover:underline">Browse courses</a> to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enrollments.map((e) => {
                    const progress = e.progress ?? 0
                    const done = (e as any).completedModulesCount ?? (Array.isArray(e.completedModules) ? e.completedModules.length : 0)
                    const total = (e as any).totalModules ?? 0
                    return (
                      <div key={e._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all">
                        <h4 className="text-lg font-bold text-navy mb-1">
                          {getEnrollmentCourseName(e)}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">{e.level ?? '—'}</p>

                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">Progress</span>
                            <span className="text-sm font-bold text-gold">{progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {total > 0 && (
                          <p className="text-xs text-gray-500 mb-4">{done}/{total} modules completed</p>
                        )}
                        <button
                          onClick={() => window.location.href = `/learn/enrollments/${e._id}`}
                          className="w-full bg-gold text-navy py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all duration-150"
                        >
                          Continue
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </Reveal>

            {/* Upcoming Sessions */}
            <Reveal amount={0.1} duration={0.5} distance={18}>
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Upcoming Sessions
              </h3>
              {upcomingSessions.length === 0 ? (
                <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-500 text-sm">
                  No upcoming sessions. <a href="/learn/schedule" className="text-gold hover:underline">Book one</a>.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingSessions.map((s) => (
                    <div key={s._id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition-all">
                      <div>
                        <p className="font-semibold text-navy">{s.teacherName ?? 'Teacher'}</p>
                        <p className="text-sm text-gray-600">
                          {s.language ?? '—'} •{' '}
                          {new Date(s.scheduledAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                      {s.zoomLink ? (
                        <a
                          href={s.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gold text-navy px-6 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all"
                        >
                          Join
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Link pending</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            {/* Recent Materials */}
            <Reveal amount={0.1} duration={0.5} distance={18}>
              <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Recent Materials
              </h3>
              {materials.length === 0 ? (
                <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-500 text-sm">
                  No materials available yet.
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {materials.map((m, idx) => (
                    <div
                      key={m._id}
                      className="p-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 hover:bg-gray-light transition-colors"
                    >
                      <div>
                        <p className="font-medium text-navy text-sm">{m.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(m.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold font-semibold text-sm hover:text-gold-light"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          </>
        )}
      </div>
    </>
  )
}
