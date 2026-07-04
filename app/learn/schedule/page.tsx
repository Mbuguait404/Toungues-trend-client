'use client'

import LearnTopbar from '@/components/learn-topbar'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, CheckCircle2 } from 'lucide-react'

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0))

  const bookedSessions = [
    { date: 3, teacher: 'Marie Dubois', language: 'French', time: '3:00 PM' },
    { date: 5, teacher: 'Michael Chen', language: 'English', time: '5:30 PM' },
    { date: 10, teacher: 'Hans Mueller', language: 'German', time: '2:00 PM' },
    { date: 15, teacher: 'Marie Dubois', language: 'French', time: '3:00 PM' },
    { date: 18, teacher: 'Michael Chen', language: 'English', time: '5:30 PM' },
    { date: 22, teacher: 'Hans Mueller', language: 'German', time: '2:00 PM' },
  ]

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDay(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const getSessionForDate = (date: number) => {
    return bookedSessions.find((s) => s.date === date)
  }

  const upcomingBookings = [
    {
      id: 1,
      teacher: 'Marie Dubois',
      language: '🇫🇷 French',
      date: 'Today',
      time: '3:00 PM',
      status: 'booked',
    },
    {
      id: 2,
      teacher: 'Michael Chen',
      language: '🇬🇧 English',
      date: 'January 5, 2024',
      time: '5:30 PM',
      status: 'booked',
    },
    {
      id: 3,
      teacher: 'Hans Mueller',
      language: '🇩🇪 German',
      date: 'January 10, 2024',
      time: '2:00 PM',
      status: 'booked',
    },
  ]

  return (
    <>
      <LearnTopbar title="Schedule" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-navy">Calendar</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-navy min-w-[120px] text-center">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const session = getSessionForDate(day)
              return (
                <button
                  key={day}
                  className={`aspect-square rounded-lg border-2 transition-all text-sm font-semibold flex items-center justify-center ${
                    session
                      ? 'bg-gold border-gold text-navy hover:bg-gold-light'
                      : 'border-gray-200 text-gray-700 hover:border-gold hover:bg-gold/5'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h3 className="text-xl font-bold text-navy mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcomingBookings.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-navy">{session.language}</p>
                      <p className="text-gray-600 text-sm">with {session.teacher}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {session.date} at {session.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all">
                      Join
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X size={18} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
