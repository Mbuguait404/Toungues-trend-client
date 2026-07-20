'use client'

import TeachTopbar from '@/components/teach-topbar'
import { Users, Calendar, FileText, TrendingUp, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getTeacherSessions, getMyLearners, getMyMaterials } from '@/lib/api/teacher'
import type { Session, TeacherLearner } from '@/lib/api/teacher'
import { useAuth } from '@/context/AuthContext'

export default function TeachDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [learners, setLearners] = useState<TeacherLearner[]>([])
  const [materialsCount, setMaterialsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getTeacherSessions(), getMyLearners(), getMyMaterials()])
      .then(([sess, lrns, mats]) => {
        setSessions(sess)
        setLearners(lrns)
        setMaterialsCount(mats.length)
      })
      .catch((err) => setError(err?.message ?? 'Failed to load dashboard data'))
      .finally(() => setIsLoading(false))
  }, [])

  const upcomingSessions = sessions.filter((s) => s.status === 'UPCOMING')
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="bg-navy rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
              Welcome, {firstName}
            </h2>
            <p className="text-gray-300">
              You have {upcomingSessions.length} upcoming session{upcomingSessions.length !== 1 ? 's' : ''}.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin mr-3" />
              Loading dashboard…
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users size={24} className="text-blue-500" />
                  </div>
                  <p className="text-gray-mid text-sm mb-1">Active Learners</p>
                  <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>{learners.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150">
                  <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Calendar size={24} className="text-purple-500" />
                  </div>
                  <p className="text-gray-mid text-sm mb-1">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>{upcomingSessions.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150">
                  <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FileText size={24} className="text-green-500" />
                  </div>
                  <p className="text-gray-mid text-sm mb-1">Materials Uploaded</p>
                  <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>{materialsCount}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150">
                  <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp size={24} className="text-orange-500" />
                  </div>
                  <p className="text-gray-mid text-sm mb-1">Avg. Learner Progress</p>
                  <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>{(learners as any).length > 0 ? Math.round((learners as any).reduce((acc: number, l: any) => acc + (l.progress ?? 0), 0) / (learners as any).length) + '%' : '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Sessions List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>Upcoming Sessions</h3>
                  {upcomingSessions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming sessions.</p>
                  ) : (
                    <div className="space-y-4">
                      {upcomingSessions.slice(0, 5).map((s) => (
                        <div key={s._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gold-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="bg-white w-12 h-12 rounded-full flex flex-col items-center justify-center border border-gray-200">
                              <span className="text-xs font-bold text-navy">{new Date(s.scheduledAt).getHours()}:{new Date(s.scheduledAt).getMinutes().toString().padStart(2, '0')}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-navy text-sm">{s.learnerName ?? 'Learner'}</p>
                              <p className="text-xs text-gray-500">{s.language ?? 'Course'} • {s.level ?? '-'}</p>
                            </div>
                          </div>
                          <button className="text-gold font-semibold text-sm hover:text-gold-light">Join</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* My Learners List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>My Learners</h3>
                  {learners.length === 0 ? (
                    <p className="text-gray-500 text-sm">No learners yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {learners.slice(0, 5).map((l: any) => (
                        <div key={l._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                              {((l.userId?.name || l.name) || '').split(' ').map((n: string)=>n[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-navy text-sm">{l.userId?.name ?? l.name}</p>
                              <p className="text-xs text-gray-500">{l.courseId?.title ?? l.userId?.course ?? l.course ?? 'Enrolled'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-navy mb-1">{l.progress ?? 0}%</p>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gold" style={{ width: `${l.progress ?? 0}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
