'use client'

import TeachTopbar from '@/components/teach-topbar'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function TeachLearners() {
  const [searchTerm, setSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const allLearners = [
    {
      id: 1,
      name: 'Amara K.',
      language: 'French',
      level: 'B1',
      progress: 75,
      lastSession: '2024-06-20',
      status: 'active',
      avatar: 'AK',
    },
    {
      id: 2,
      name: 'Marco R.',
      language: 'English',
      level: 'A2',
      progress: 45,
      lastSession: '2024-06-24',
      status: 'active',
      avatar: 'MR',
    },
    {
      id: 3,
      name: 'Sophie L.',
      language: 'German',
      level: 'B2',
      progress: 82,
      lastSession: '2024-06-19',
      status: 'active',
      avatar: 'SL',
    },
    {
      id: 4,
      name: 'Yuki T.',
      language: 'Kiswahili',
      level: 'A1',
      progress: 28,
      lastSession: '2024-06-21',
      status: 'paused',
      avatar: 'YT',
    },
    {
      id: 5,
      name: 'Hassan M.',
      language: 'French',
      level: 'B1',
      progress: 61,
      lastSession: '2024-06-23',
      status: 'active',
      avatar: 'HM',
    },
    {
      id: 6,
      name: 'Anna V.',
      language: 'English',
      level: 'B2',
      progress: 100,
      lastSession: '2024-06-18',
      status: 'completed',
      avatar: 'AV',
    },
    {
      id: 7,
      name: 'Leo F.',
      language: 'German',
      level: 'A1',
      progress: 35,
      lastSession: '2024-06-24',
      status: 'active',
      avatar: 'LF',
    },
    {
      id: 8,
      name: 'Nina S.',
      language: 'French',
      level: 'B2',
      progress: 88,
      lastSession: '2024-06-22',
      status: 'active',
      avatar: 'NS',
    },
  ]

  let filtered = allLearners.filter((learner) => {
    const matchesSearch =
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.language.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = languageFilter === 'all' || learner.language === languageFilter
    const matchesStatus = statusFilter === 'all' || learner.status === statusFilter
    return matchesSearch && matchesLanguage && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedLearners = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700'
      case 'paused':
        return 'bg-amber-50 text-amber-700'
      case 'completed':
        return 'bg-blue-50 text-blue-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="My Learners" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or language"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Language Filter */}
              <select
                value={languageFilter}
                onChange={(e) => {
                  setLanguageFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Languages</option>
                <option value="French">French</option>
                <option value="English">English</option>
                <option value="German">German</option>
                <option value="Kiswahili">Kiswahili</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Learners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLearners.map((learner) => (
              <div
                key={learner.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gold hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-sm">
                      {learner.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
                        {learner.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {learner.language} • {learner.level}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(learner.status)}`}>
                    {learner.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">Progress</p>
                    <p className="text-sm font-semibold text-navy">{learner.progress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gold rounded-full h-2" style={{ width: `${learner.progress}%` }} />
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4">
                  Last session: {new Date(learner.lastSession).toLocaleDateString()}
                </p>

                <Link
                  href={`/teach/learners/${learner.id}`}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gold-50 rounded-lg transition-colors"
                >
                  <span className="text-sm font-semibold text-navy">View Profile</span>
                  <ChevronRight size={16} className="text-gold" />
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-gold text-navy font-semibold'
                      : 'border border-gray-200 hover:border-gold'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
