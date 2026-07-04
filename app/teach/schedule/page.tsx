'use client'

import TeachTopbar from '@/components/teach-topbar'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { useState } from 'react'

export default function TeachSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [showAvailabilityPanel, setShowAvailabilityPanel] = useState(false)
  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '17:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '17:00', enabled: true },
    saturday: { start: '10:00', end: '14:00', enabled: true },
    sunday: { start: '00:00', end: '00:00', enabled: false },
  })

  const bookedSessions = [
    { id: 1, date: '2024-06-24', time: '10:00', learner: 'Amara K.', language: 'French', level: 'B1' },
    { id: 2, date: '2024-06-24', time: '11:30', learner: 'Marco R.', language: 'English', level: 'A2' },
    { id: 3, date: '2024-06-25', time: '14:00', learner: 'Sophie L.', language: 'German', level: 'B2' },
    { id: 4, date: '2024-06-26', time: '09:00', learner: 'Hassan M.', language: 'French', level: 'B1' },
    { id: 5, date: '2024-06-27', time: '15:30', learner: 'Yuki T.', language: 'Kiswahili', level: 'A1' },
  ]

  const upcomingSessions = [
    { id: 1, learner: 'Amara K.', language: 'French', level: 'B1', dateTime: '2024-06-24 10:00' },
    { id: 2, learner: 'Marco R.', language: 'English', level: 'A2', dateTime: '2024-06-24 11:30' },
    { id: 3, learner: 'Sophie L.', language: 'German', level: 'B2', dateTime: '2024-06-25 14:00' },
  ]

  const pastSessions = [
    { id: 1, learner: 'Nina S.', language: 'French', level: 'B2', dateTime: '2024-06-22 16:00', notes: 'Good progress on verb conjugation' },
    { id: 2, learner: 'Leo F.', language: 'German', level: 'A1', dateTime: '2024-06-20 10:00', notes: 'Needs more practice with pronunciation' },
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

  const getWeekDates = () => {
    const monday = new Date(currentWeek)
    monday.setDate(monday.getDate() - monday.getDay() + 1)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(date.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getWeekDates()

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookedSessions.filter((session) => session.date === dateStr)
  }

  const getAvailableSlots = (date: Date) => {
    const dayIndex = date.getDay()
    const dayKey = dayKeys[dayIndex === 0 ? 6 : dayIndex - 1]
    const dayAvail = availability[dayKey]

    if (!dayAvail.enabled) return []

    const slots = []
    const [startHour, startMin] = dayAvail.start.split(':').map(Number)
    const [endHour, endMin] = dayAvail.end.split(':').map(Number)

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === endHour - 1 && min >= endMin) break
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
        const isBooked = bookedSessions.some(
          (s) => s.date === date.toISOString().split('T')[0] && s.time === timeStr
        )
        if (!isBooked) slots.push(timeStr)
      }
    }
    return slots
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Schedule" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} className="text-navy" />
              </button>
              <h2 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
              </h2>
              <button
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={24} className="text-navy" />
              </button>
            </div>
            <button
              onClick={() => setShowAvailabilityPanel(!showAvailabilityPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150"
            >
              <Plus size={20} />
              Set Availability
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="grid grid-cols-7 gap-4">
                  {weekDates.map((date, idx) => {
                    const sessions = getSessionsForDate(date)
                    const availableSlots = getAvailableSlots(date)

                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 min-h-96">
                        <p className="font-semibold text-navy mb-3" style={{ fontFamily: 'Poppins' }}>
                          {days[date.getDay() === 0 ? 6 : date.getDay() - 1]} {date.getDate()}
                        </p>

                        <div className="space-y-2 mb-4">
                          {sessions.map((session) => (
                            <div
                              key={session.id}
                              className="bg-navy text-white text-xs p-2 rounded font-semibold"
                            >
                              <p className="mb-1">{session.time}</p>
                              <p className="text-gold">{session.learner}</p>
                              <p className="text-gray-300">{session.language} • {session.level}</p>
                            </div>
                          ))}
                        </div>

                        {availableSlots.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600 font-semibold mb-2">Available slots:</p>
                            {availableSlots.slice(0, 3).map((slot) => (
                              <div
                                key={slot}
                                className="text-xs p-2 border-2 border-dashed border-gold rounded text-center text-gray-600 hover:bg-gold-50 cursor-pointer transition-colors"
                              >
                                {slot}
                              </div>
                            ))}
                            {availableSlots.length > 3 && (
                              <p className="text-xs text-gray-600 text-center">+{availableSlots.length - 3} more</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Availability Panel */}
            {showAvailabilityPanel && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    Set Availability
                  </h3>
                  <button
                    onClick={() => setShowAvailabilityPanel(false)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {dayKeys.map((dayKey, idx) => (
                    <div key={dayKey} className="pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={availability[dayKey].enabled}
                          onChange={(e) =>
                            setAvailability({
                              ...availability,
                              [dayKey]: { ...availability[dayKey], enabled: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-gold"
                        />
                        <label className="text-sm font-semibold text-navy capitalize">
                          {dayKey}
                        </label>
                      </div>

                      {availability[dayKey].enabled && (
                        <div className="space-y-2">
                          <input
                            type="time"
                            value={availability[dayKey].start}
                            onChange={(e) =>
                              setAvailability({
                                ...availability,
                                [dayKey]: { ...availability[dayKey], start: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                          />
                          <input
                            type="time"
                            value={availability[dayKey].end}
                            onChange={(e) =>
                              setAvailability({
                                ...availability,
                                [dayKey]: { ...availability[dayKey], end: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                  Save Availability
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Upcoming Sessions
            </h3>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-navy">{session.learner}</p>
                    <p className="text-sm text-gray-600">
                      {session.language} • {session.level} • {new Date(session.dateTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                      Start Zoom
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Sessions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Past Sessions
            </h3>
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div key={session.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-navy">{session.learner}</p>
                    <p className="text-xs text-gray-600">{new Date(session.dateTime).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {session.language} • {session.level}
                  </p>
                  <p className="text-sm text-gray-700 italic">Notes: {session.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
