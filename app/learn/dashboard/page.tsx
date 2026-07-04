import LearnTopbar from '@/components/learn-topbar'
import { BookOpen, CheckCircle2, Clock, Award } from 'lucide-react'

export default function DashboardPage() {
  const userName = 'Alex'

  const stats = [
    { label: 'Enrolled Courses', value: 3, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Completed Modules', value: 24, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Upcoming Sessions', value: 2, icon: Clock, color: 'text-orange-500' },
    { label: 'Certificates Earned', value: 1, icon: Award, color: 'text-gold' },
  ]

  const courses = [
    {
      id: 1,
      language: '🇫🇷 French',
      level: 'A2 - Elementary',
      progress: 65,
      modules: '8/12 completed',
    },
    {
      id: 2,
      language: '🇬🇧 English',
      level: 'B1 - Intermediate',
      progress: 45,
      modules: '5/11 completed',
    },
    {
      id: 3,
      language: '🇩🇪 German',
      level: 'A1 - Beginner',
      progress: 25,
      modules: '3/13 completed',
    },
  ]

  const upcomingSessions = [
    {
      id: 1,
      teacher: 'Marie Dubois',
      language: 'French',
      date: 'Today, 3:00 PM',
      type: 'Live Lesson',
    },
    {
      id: 2,
      teacher: 'Michael Chen',
      language: 'English',
      date: 'Tomorrow, 5:30 PM',
      type: 'Live Lesson',
    },
  ]

  const materials = [
    { name: 'French A2 - Unit 5 Vocabulary.pdf', date: 'Jan 15' },
    { name: 'English B1 - Grammar Rules.pdf', date: 'Jan 14' },
    { name: 'German A1 - Pronunciation Guide.mp3', date: 'Jan 12' },
  ]

  return (
    <>
      <LearnTopbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy to-navy/90 rounded-2xl p-8 text-white shadow-sm">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
            Welcome back, {userName}!
          </h2>
          <p className="text-gray-200">Continue your language learning journey. You're making great progress!</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <Icon size={20} className={stat.color} />
                </div>
                <p className="text-3xl font-bold text-navy">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* My Courses Section */}
        <div>
          <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            My Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all">
                <h4 className="text-lg font-bold text-navy mb-2">{course.language}</h4>
                <p className="text-sm text-gray-600 mb-4">{course.level}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gold">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4">{course.modules}</p>
                <button className="w-full bg-gold text-navy py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all duration-150">
                  Continue
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition-all">
                <div>
                  <p className="font-semibold text-navy">{session.teacher}</p>
                  <p className="text-sm text-gray-600">{session.language} • {session.date}</p>
                </div>
                <button className="bg-gold text-navy px-6 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Materials */}
        <div>
          <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
            Recent Materials
          </h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {materials.map((material, idx) => (
              <div
                key={idx}
                className="p-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 hover:bg-gray-light transition-colors"
              >
                <div>
                  <p className="font-medium text-navy text-sm">{material.name}</p>
                  <p className="text-xs text-gray-500">{material.date}</p>
                </div>
                <button className="text-gold font-semibold text-sm hover:text-gold-light">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
