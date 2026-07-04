import LearnTopbar from '@/components/learn-topbar'
import Link from 'next/link'
import { Lock, CheckCircle2, Play } from 'lucide-react'

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      language: '🇫🇷 French',
      currentLevel: 'A2 - Elementary',
      modules: [
        { id: 1, level: 'A1', title: 'Greetings & Basic Phrases', status: 'completed' },
        { id: 2, level: 'A1', title: 'Numbers & Time', status: 'completed' },
        { id: 3, level: 'A2', title: 'Everyday Conversations', status: 'in-progress' },
        { id: 4, level: 'A2', title: 'Past Tense Basics', status: 'in-progress' },
        { id: 5, level: 'A2', title: 'Shopping & Dining', status: 'locked' },
        { id: 6, level: 'B1', title: 'Travel Scenarios', status: 'locked' },
      ],
    },
    {
      id: 2,
      language: '🇬🇧 English',
      currentLevel: 'B1 - Intermediate',
      modules: [
        { id: 1, level: 'A1', title: 'Basics for Beginners', status: 'completed' },
        { id: 2, level: 'A2', title: 'Daily Life', status: 'completed' },
        { id: 3, level: 'B1', title: 'Workplace Communication', status: 'in-progress' },
        { id: 4, level: 'B1', title: 'Academic Writing', status: 'locked' },
        { id: 5, level: 'B2', title: 'Business English', status: 'locked' },
      ],
    },
    {
      id: 3,
      language: '🇩🇪 German',
      currentLevel: 'A1 - Beginner',
      modules: [
        { id: 1, level: 'A1', title: 'Introduction to German', status: 'completed' },
        { id: 2, level: 'A1', title: 'Common Phrases', status: 'in-progress' },
        { id: 3, level: 'A1', title: 'Grammar Basics', status: 'locked' },
        { id: 4, level: 'A2', title: 'Conversational German', status: 'locked' },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      'in-progress': { bg: 'bg-gold/10', text: 'text-gold', label: 'In Progress' },
      locked: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Locked' },
    }
    const badge = badges[status as keyof typeof badges]
    return badge
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 size={16} className="text-green-600" />
    if (status === 'locked') return <Lock size={16} className="text-gray-400" />
    return <Play size={16} className="text-gold" />
  }

  return (
    <>
      <LearnTopbar title="My Courses" />
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {courses.map((course) => (
          <div key={course.id}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-navy mb-1">{course.language}</h2>
              <p className="text-sm text-gray-600">Current Level: <span className="font-semibold">{course.currentLevel}</span></p>
            </div>

            <div className="space-y-2">
              {course.modules.map((module) => {
                const badge = getStatusBadge(module.status)
                return (
                  <Link
                    key={module.id}
                    href={`/learn/modules/${module.id}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gold hover:shadow-sm transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {getStatusIcon(module.status)}
                      </div>
                      <div>
                        <p className="font-medium text-navy text-sm">{module.title}</p>
                        <p className="text-xs text-gray-500">{module.level} Level</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      {module.status !== 'locked' && (
                        <button className="text-gold font-semibold text-sm group-hover:text-gold-light transition-colors">
                          {module.status === 'completed' ? 'Review' : 'Continue'}
                        </button>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
