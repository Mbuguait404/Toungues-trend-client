'use client'

import { useEffect, useState } from 'react'
import LearnTopbar from '@/components/learn-topbar'
import { ChevronLeft, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react'
import { getMySessions, cancelSession, type Session } from '@/lib/api/sessions'
import { ApiException } from '@/lib/api'

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getMySessions()
        setSessions(data.filter((s) => s.status === 'UPCOMING'))
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'Failed to load sessions')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this session?')) return
    setCancellingId(id)
    try {
      await cancelSession(id)
      setSessions((prev) => prev.filter((s) => s._id !== id))
    } catch {
      alert('Failed to cancel session. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDay(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const getSessionForDay = (day: number) =>
    sessions.find((s) => {
      const d = new Date(s.scheduledAt)
      return (
        d.getFullYear() === currentMonth.getFullYear() &&
        d.getMonth() === currentMonth.getMonth() &&
        d.getDate() === day
      )
    })

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
                onClick={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-semibold text-navy min-w-[140px] text-center">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center font-semibold text-gray-600 text-sm py-2">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const session = getSessionForDay(day)
              return (
                <button
                  key={day}
                  title={session ? `${session.language} with ${session.teacherName}` : undefined}
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

          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-400">
              <Loader2 size={28} className="animate-spin mr-2" />
              Loading…
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-500 text-sm">
              No upcoming sessions booked.
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-navy">{s.language ?? 'Session'}</p>
                        <p className="text-gray-600 text-sm">with {s.teacherName ?? 'Teacher'}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(s.scheduledAt).toLocaleString(undefined, {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.zoomLink ? (
                        <a
                          href={s.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all"
                        >
                          Join
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic px-2">Link pending</span>
                      )}
                      <button
                        onClick={() => handleCancel(s._id)}
                        disabled={cancellingId === s._id}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Cancel session"
                      >
                        {cancellingId === s._id ? (
                          <Loader2 size={18} className="animate-spin text-gray-400" />
                        ) : (
                          <X size={18} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
