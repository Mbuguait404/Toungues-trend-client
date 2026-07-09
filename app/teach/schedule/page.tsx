'use client'

import TeachTopbar from '@/components/teach-topbar'
import { ChevronLeft, ChevronRight, Plus, X, Loader2, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getTeacherSessions, addSessionNotes, type Session } from '@/lib/api/teacher'
import { cancelSession } from '@/lib/api/sessions'
import { ApiException } from '@/lib/api'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

type DayKey = typeof DAY_KEYS[number]

export default function TeachSchedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAvailabilityPanel, setShowAvailabilityPanel] = useState(false)
  const [addingNotesId, setAddingNotesId] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')

  const [availability, setAvailability] = useState<
    Record<DayKey, { start: string; end: string; enabled: boolean }>
  >({
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '17:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '17:00', enabled: true },
    saturday: { start: '10:00', end: '14:00', enabled: true },
    sunday: { start: '00:00', end: '00:00', enabled: false },
  })

  useEffect(() => {
    getTeacherSessions()
      .then(setSessions)
      .catch((err) => setError(err instanceof ApiException ? err.message : 'Failed to load sessions'))
      .finally(() => setIsLoading(false))
  }, [])

  const getWeekDates = () => {
    const monday = new Date(currentWeek)
    monday.setDate(monday.getDate() - monday.getDay() + 1)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      return d
    })
  }

  const weekDates = getWeekDates()

  const getSessionsForDate = (date: Date) =>
    sessions.filter((s) => {
      const d = new Date(s.scheduledAt)
      return d.toDateString() === date.toDateString()
    })

  const upcoming = sessions.filter((s) => s.status === 'UPCOMING')
  const past = sessions.filter((s) => s.status === 'COMPLETED')

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this session?')) return
    try {
      await cancelSession(id)
      setSessions((prev) => prev.filter((s) => s._id !== id))
    } catch {
      alert('Failed to cancel session.')
    }
  }

  const handleAddNotes = async (id: string) => {
    if (!notesText.trim()) return
    try {
      const updated = await addSessionNotes(id, notesText)
      setSessions((prev) => prev.map((s) => (s._id === id ? updated : s)))
      setAddingNotesId(null)
      setNotesText('')
    } catch {
      alert('Failed to save notes.')
    }
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
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 86400000))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} className="text-navy" />
              </button>
              <h2 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Week of {weekDates[0].toLocaleDateString()} – {weekDates[6].toLocaleDateString()}
              </h2>
              <button
                onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 86400000))}
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

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin mr-3" />
              Loading sessions…
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-7 gap-2">
                      {weekDates.map((date, idx) => {
                        const daySessions = getSessionsForDate(date)
                        return (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3 min-h-40">
                            <p className="font-semibold text-navy text-xs mb-2" style={{ fontFamily: 'Poppins' }}>
                              {DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1].slice(0, 3)} {date.getDate()}
                            </p>
                            <div className="space-y-1">
                              {daySessions.map((s) => (
                                <div key={s._id} className="bg-navy text-white text-xs p-2 rounded">
                                  <p className="text-gold font-semibold">
                                    {new Date(s.scheduledAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                                  </p>
                                  <p className="text-gray-200 truncate">{s.language ?? 'Session'}</p>
                                </div>
                              ))}
                            </div>
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
                      <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Set Availability</h3>
                      <button onClick={() => setShowAvailabilityPanel(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {DAY_KEYS.map((dayKey) => (
                        <div key={dayKey} className="pb-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={availability[dayKey].enabled}
                              onChange={(e) => setAvailability({ ...availability, [dayKey]: { ...availability[dayKey], enabled: e.target.checked } })}
                              className="w-4 h-4 accent-gold"
                            />
                            <label className="text-sm font-semibold text-navy capitalize">{dayKey}</label>
                          </div>
                          {availability[dayKey].enabled && (
                            <div className="space-y-2">
                              <input type="time" value={availability[dayKey].start} onChange={(e) => setAvailability({ ...availability, [dayKey]: { ...availability[dayKey], start: e.target.value } })} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold" />
                              <input type="time" value={availability[dayKey].end} onChange={(e) => setAvailability({ ...availability, [dayKey]: { ...availability[dayKey], end: e.target.value } })} className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold" />
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
                <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>Upcoming Sessions</h3>
                {upcoming.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No upcoming sessions.</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.map((s) => (
                      <div key={s._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                        <div>
                          <p className="font-semibold text-navy">{s.language ?? 'Session'}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(s.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {s.zoomLink && (
                            <a href={s.zoomLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                              Start Zoom
                            </a>
                          )}
                          <button onClick={() => handleCancel(s._id)} className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Sessions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>Past Sessions</h3>
                {past.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">No past sessions.</p>
                ) : (
                  <div className="space-y-3">
                    {past.map((s) => (
                      <div key={s._id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-navy">{s.language ?? 'Session'}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(s.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                        {s.notes ? (
                          <p className="text-sm text-gray-700 italic">{s.notes}</p>
                        ) : (
                          addingNotesId === s._id ? (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                placeholder="Session notes…"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleAddNotes(s._id)} className="px-3 py-1 bg-gold text-navy text-xs font-semibold rounded-full">Save</button>
                                <button onClick={() => setAddingNotesId(null)} className="px-3 py-1 text-gray-500 text-xs">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => { setAddingNotesId(s._id); setNotesText('') }} className="text-xs text-gold hover:underline mt-1">
                              Add notes
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
