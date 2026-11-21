'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Loader2, Search } from 'lucide-react'
import TeachTopbar from '@/components/teach-topbar'
import { Card, EmptyRow, Pill, ProgressBar } from '@/components/portal/portal-ui'
import {
  getLearnerCourseTitle,
  getLearnerEmail,
  getLearnerLanguage,
  getLearnerName,
  getMyLearners,
  type TeacherLearner,
} from '@/lib/api/teacher'

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

export default function TeachLearners() {
  const [searchTerm, setSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [learners, setLearners] = useState<TeacherLearner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyLearners()
      .then(setLearners)
      .catch((err) => setError(err?.message ?? 'Failed to load learners'))
      .finally(() => setIsLoading(false))
  }, [])

  // Options come from the data rather than a hardcoded guess at the course list.
  const languages = useMemo(
    () => Array.from(new Set(learners.map(getLearnerLanguage).filter((l) => l && l !== '—'))).sort(),
    [learners]
  )

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return learners.filter((l) => {
      const haystack = `${getLearnerName(l)} ${getLearnerEmail(l) ?? ''} ${getLearnerCourseTitle(l)}`
      const matchesSearch = !term || haystack.toLowerCase().includes(term)
      const matchesLang =
        languageFilter === 'all' || getLearnerLanguage(l).toLowerCase() === languageFilter.toLowerCase()
      return matchesSearch && matchesLang
    })
  }, [learners, searchTerm, languageFilter])

  return (
    <>
      <TeachTopbar title="My Learners" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-5 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                placeholder="Search by name, email or course…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
            >
              <option value="all">All languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-gray-mid ml-auto tabular-nums">
              {filtered.length} of {learners.length}
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Card title="Enrolled learners" bodyClassName="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-mid">
                <Loader2 size={24} className="animate-spin mr-3" />
                Loading learners…
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Learner
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Progress
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">
                      Enrolled
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <EmptyRow colSpan={4}>No learners match your filters.</EmptyRow>
                  ) : (
                    filtered.map((l, idx) => {
                      const name = getLearnerName(l)
                      const email = getLearnerEmail(l)
                      const enrolledAt = l.startedAt ?? l.createdAt
                      return (
                        <tr key={l._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {initials(name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-navy truncate">{name}</p>
                                {email && <p className="text-[11px] text-gray-mid truncate">{email}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <p className="text-sm text-navy truncate max-w-[12rem]">
                              {getLearnerCourseTitle(l)}
                            </p>
                            <Pill tone="gray">{getLearnerLanguage(l)}</Pill>
                          </td>
                          <td className="px-4 py-2.5 w-40">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[11px] text-gray-mid tabular-nums">
                                {l.progress ?? 0}%
                              </span>
                            </div>
                            <ProgressBar value={l.progress ?? 0} />
                          </td>
                          <td className="px-4 py-2.5 text-[11px] text-gray-mid whitespace-nowrap">
                            {enrolledAt
                              ? new Date(enrolledAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
                              : '—'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}