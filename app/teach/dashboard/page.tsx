'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  TrendingUp,
  Users,
} from 'lucide-react'
import TeachTopbar from '@/components/teach-topbar'
import { Card, EmptyBlock, EmptyRow, PageHeader, Pill, ProgressBar, StatTile } from '@/components/portal/portal-ui'
import { useAuth } from '@/context/AuthContext'
import {
  getLearnerCourseTitle,
  getLearnerEmail,
  getLearnerLanguage,
  getLearnerName,
  getMyLearners,
  getMyMaterials,
  getTeacherSessions,
  type Session,
  type TeacherLearner,
} from '@/lib/api/teacher'

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function initials(name: string): string {
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

export default function TeachDashboard() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [learners, setLearners] = useState<TeacherLearner[]>([])
  const [materialsCount, setMaterialsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true)
    try {
      setError(null)
      const [sess, lrns, mats] = await Promise.all([
        getTeacherSessions(),
        getMyLearners(),
        getMyMaterials(),
      ])
      setSessions(sess)
      setLearners(lrns)
      setMaterialsCount(mats.length)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to load dashboard data')
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

  const avgProgress = useMemo(() => {
    const withProgress = learners.filter((l) => typeof l.progress === 'number')
    if (withProgress.length === 0) return null
    return Math.round(withProgress.reduce((acc, l) => acc + (l.progress ?? 0), 0) / withProgress.length)
  }, [learners])

  const courses = useMemo(
    () => new Set(learners.map(getLearnerCourseTitle).filter((t) => t && t !== 'Enrolled')).size,
    [learners]
  )

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
      <TeachTopbar title="Dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-5 space-y-4">
          <PageHeader
            title="Dashboard"
            subtitle={
              <>
                Welcome back, {firstName} · computed from your live learners, sessions and materials
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
              label="Active learners"
              value={learners.length}
              sub={`${courses} courses`}
              icon={Users}
              href="/teach/learners"
            />
            <StatTile
              label="Upcoming sessions"
              value={upcoming.length}
              sub={upcoming.length ? 'next one below' : 'none booked'}
              icon={Calendar}
              href="/teach/schedule"
            />
            <StatTile
              label="Materials"
              value={materialsCount}
              icon={FileText}
              href="/teach/materials"
            />
            <StatTile
              label="Avg. learner progress"
              value={avgProgress === null ? '—' : `${avgProgress}%`}
              sub={avgProgress === null ? 'no tracked learners' : undefined}
              icon={TrendingUp}
            />
            <StatTile
              label="Courses taught"
              value={courses}
              icon={Users}
              href="/teach/modules"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Sessions — the session record has no learner name, so we show what is real */}
            <Card
              title="Upcoming sessions"
              action={
                <Link href="/teach/schedule" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                  Schedule
                </Link>
              }
              bodyClassName="overflow-x-auto"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      When
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Language
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Level
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Join
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 ? (
                    <EmptyRow colSpan={4}>No upcoming sessions.</EmptyRow>
                  ) : (
                    upcoming.slice(0, 6).map((s, idx) => (
                      <tr key={s._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                        <td className="px-4 py-2.5 text-sm text-navy whitespace-nowrap">
                          {formatWhen(s.scheduledAt)}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-dark truncate max-w-[10rem]">
                          {s.language ?? '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <Pill tone="gray">{s.level ?? '—'}</Pill>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {s.zoomLink ? (
                            <a
                              href={s.zoomLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-[11px] font-bold uppercase px-2 py-1 rounded-md bg-gold text-navy hover:bg-gold-light transition-colors"
                            >
                              Join
                            </a>
                          ) : (
                            <span className="text-[11px] text-gray-mid italic">Link pending</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>

            {/* Learners */}
            <Card
              title="My learners"
              action={
                <Link href="/teach/learners" className="text-[11px] font-semibold text-gold hover:text-gold-light">
                  View all
                </Link>
              }
            >
              {learners.length === 0 ? (
                <EmptyBlock>
                  No learners yet. Once someone enrols in one of your courses they appear here.
                </EmptyBlock>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {learners.slice(0, 6).map((l) => {
                    const name = getLearnerName(l)
                    const email = getLearnerEmail(l)
                    return (
                      <li key={l._id} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {initials(name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy truncate">{name}</p>
                          <p className="text-[11px] text-gray-mid truncate">
                            {getLearnerCourseTitle(l)} · {getLearnerLanguage(l)}
                          </p>
                        </div>
                        <div className="shrink-0 w-24">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] text-gray-mid">Progress</span>
                            <span className="text-[11px] font-semibold text-navy tabular-nums">
                              {l.progress ?? 0}%
                            </span>
                          </div>
                          <ProgressBar value={l.progress ?? 0} />
                          {email && <p className="text-[11px] text-gray-mid truncate mt-1">{email}</p>}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}