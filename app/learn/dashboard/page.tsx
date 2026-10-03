'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Award, BookOpen, Calendar, CheckCircle2, Loader2, FileText, Clock } from 'lucide-react'
import LearnTopbar from '@/components/learn-topbar'
import { Card, EmptyBlock, EmptyRow, PageHeader, Pill, ProgressBar, StatTile } from '@/components/portal/portal-ui'
import { useAuth } from '@/context/AuthContext'
import {
  getMyEnrollments,
  getEnrollmentCourseName,
  getEnrollmentLanguage,
  type Enrollment,
} from '@/lib/api/enrollments'
import { getMySessions, type Session } from '@/lib/api/sessions'
import { getMaterials, type Material } from '@/lib/api/materials'
import { getMyCertificates } from '@/lib/api/certificates'
import { ApiException } from '@/lib/api'

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function DashboardPage() {
  const { user } = useAuth()

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [certCount, setCertCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true)
    try {
      setError(null)
      const [enrs, sess, mats, certs] = await Promise.all([
        getMyEnrollments(),
        getMySessions(),
        getMaterials(),
        getMyCertificates(),
      ])
      setEnrollments(enrs)
      setSessions(sess)
      setMaterials(mats)
      setCertCount(certs.length)
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => s.status === 'UPCOMING')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [sessions]
  )

  const completedModules = useMemo(
    () => enrollments.reduce((acc, e) => acc + (e.completedModulesCount ?? 0), 0),
    [enrollments]
  )

  const avgProgress = useMemo(() => {
    const withProgress = enrollments.filter((e) => typeof e.progress === 'number')
    if (withProgress.length === 0) return null
    return Math.round(
      withProgress.reduce((acc, e) => acc + (e.progress ?? 0), 0) / withProgress.length
    )
  }, [enrollments])

  const activeEnrollments = enrollments.filter((e) => e.isActive !== false).length
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-mid">
        <Loader2 size={28} className="animate-spin mr-3" />
        Loading your data…
      </div>
    )
  }

  return (
    <>
      <LearnTopbar title="Dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-5 space-y-4">
          <PageHeader
            title="Dashboard"
            subtitle={
              <>
                Welcome back, {firstName} · computed from your live enrolments, sessions and
                certificates
              </>
            }
            onRefresh={() => load(true)}
            refreshing={isRefreshing}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatTile
              label="Enrolled courses"
              value={enrollments.length}
              sub={`${activeEnrollments} active`}
              icon={BookOpen}
              href="/learn/courses"
            />
            <StatTile
              label="Modules completed"
              value={completedModules}
              icon={CheckCircle2}
              accent="text-green-600"
            />
            <StatTile
              label="Upcoming sessions"
              value={upcoming.length}
              sub={upcoming.length ? 'next one below' : 'none booked'}
              icon={Calendar}
              href="/learn/schedule"
            />
            <StatTile
              label="Certificates"
              value={certCount}
              icon={Award}
              accent="text-[#8a5f10]"
              href="/learn/certificates"
            />
            <StatTile
              label="Avg. progress"
              value={avgProgress === null ? '—' : `${avgProgress}%`}
              sub={avgProgress === null ? 'no tracked courses' : undefined}
              icon={Clock}
            />
          </div>

          {/* Courses + sessions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card
              title="My courses"
              className="xl:col-span-2"
              bodyClassName="overflow-x-auto"
              action={
                <Link href="/learn/courses" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                  View all
                </Link>
              }
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Level
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Progress
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.length === 0 ? (
                    <EmptyRow colSpan={4}>
                      No courses yet.{' '}
                      <Link href="/courses" className="text-gold hover:underline font-semibold">
                        Browse courses
                      </Link>{' '}
                      to get started.
                    </EmptyRow>
                  ) : (
                    enrollments.map((e, idx) => {
                      const progress = e.progress ?? 0
                      const done = e.completedModulesCount ?? 0
                      const total = e.totalModules ?? 0
                      return (
                        <tr key={e._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                          <td className="px-4 py-2.5">
                            <Link
                              href={`/learn/enrollments/${e._id}`}
                              className="text-sm font-medium text-navy hover:text-gold transition-colors"
                            >
                              {getEnrollmentCourseName(e)}
                            </Link>
                            <p className="text-[11px] text-gray-mid truncate max-w-[12rem]">
                              {getEnrollmentLanguage(e) || '—'}
                            </p>
                          </td>
                          <td className="px-4 py-2.5 text-sm text-gray-dark whitespace-nowrap">
                            <Pill tone="gray">{e.level ?? '—'}</Pill>
                          </td>
                          <td className="px-4 py-2.5 w-40">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[11px] text-gray-mid tabular-nums">
                                {total > 0 ? `${done}/${total} modules` : '—'}
                              </span>
                              <span className="text-[11px] font-semibold text-navy tabular-nums">
                                {progress}%
                              </span>
                            </div>
                            <ProgressBar value={progress} />
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <Pill tone={progress >= 100 ? 'green' : progress > 0 ? 'blue' : 'gray'}>
                              {progress >= 100 ? 'Complete' : progress > 0 ? 'In progress' : 'Not started'}
                            </Pill>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </Card>

            <Card
              title="Upcoming sessions"
              action={
                <Link href="/learn/schedule" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                  Schedule
                </Link>
              }
            >
              {upcoming.length === 0 ? (
                <EmptyBlock>
                  No upcoming sessions.{' '}
                  <Link href="/learn/schedule" className="text-gold hover:underline font-semibold">
                    Book one
                  </Link>
                  .
                </EmptyBlock>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {upcoming.slice(0, 5).map((s) => (
                    <li key={s._id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-navy font-medium truncate">
                          {s.teacherName ?? 'Teacher'}
                        </p>
                        <p className="text-[11px] text-gray-mid truncate">
                          {s.language ?? 'Session'} · {formatWhen(s.scheduledAt)}
                        </p>
                      </div>
                      {s.zoomLink ? (
                        <a
                          href={s.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-[11px] font-bold uppercase px-2 py-1 rounded-md bg-gold text-navy hover:bg-gold-light transition-colors"
                        >
                          Join
                        </a>
                      ) : (
                        <span className="shrink-0 text-[11px] text-gray-mid italic">Link pending</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Materials */}
          <Card
            title="Recent materials"
            action={
              <Link href="/learn/courses" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                All courses
              </Link>
            }
          >
            {materials.length === 0 ? (
              <EmptyBlock>No materials published yet.</EmptyBlock>
            ) : (
              <ul className="divide-y divide-gray-100">
                {materials.slice(0, 6).map((m) => (
                  <li
                    key={m._id}
                    className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-gray-light/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={15} className="text-gray-mid shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-navy truncate">{m.title}</p>
                        <p className="text-[11px] text-gray-mid">
                          {new Date(m.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      </div>
                    </div>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[11px] font-bold uppercase px-2 py-1 rounded-md bg-gray-100 text-navy hover:bg-gold/20 transition-colors"
                    >
                      Open
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}