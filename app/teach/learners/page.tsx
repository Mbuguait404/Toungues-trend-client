'use client'

import TeachTopbar from '@/components/teach-topbar'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getMyLearners, type TeacherLearner } from '@/lib/api/teacher'

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

  const filtered = learners.filter((learner) => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLang = languageFilter === 'all' || learner.course?.toLowerCase() === languageFilter.toLowerCase()
    return matchesSearch && matchesLang
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="My Learners" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-64 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search learners by name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Languages</option>
                <option value="french">French</option>
                <option value="english">English</option>
                <option value="german">German</option>
                <option value="kiswahili">Kiswahili</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin mr-3" />
              Loading learners…
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Learner</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Course & Level</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Progress</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No learners found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((learner, idx) => (
                        <tr key={learner._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                                {learner.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-navy text-sm">{learner.name}</p>
                                <p className="text-xs text-gray-500">{learner.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-navy text-sm">{learner.course ?? 'Enrolled'}</p>
                            <p className="text-xs text-gray-500">{learner.level ?? '-'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gold rounded-full" style={{ width: `${learner.progress ?? 0}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-navy">{learner.progress ?? 0}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {learner.lastActive ? new Date(learner.lastActive).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
