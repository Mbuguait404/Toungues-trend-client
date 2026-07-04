'use client'

import TeachTopbar from '@/components/teach-topbar'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function LearnerProfile({ params }: { params: { id: string } }) {
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<{ [key: number]: string }>({})

  const learner = {
    id: parseInt(params.id),
    name: 'Amara K.',
    email: 'amara@example.com',
    country: 'Kenya',
    course: 'French',
    level: 'B1',
    enrolledDate: '2024-03-15',
    avatar: 'AK',
  }

  const progressOverview = {
    overallProgress: 75,
    modulesCompleted: 8,
    modulesTotal: 12,
    sessionsAttended: 24,
    certificatesEarned: 1,
  }

  const modules = [
    { id: 1, name: 'A1 - Beginner Basics', status: 'completed', completedDate: '2024-04-10' },
    { id: 2, name: 'A2 - Elementary Conversations', status: 'completed', completedDate: '2024-05-05' },
    { id: 3, name: 'B1 - Intermediate Skills', status: 'in-progress', completedDate: null },
    { id: 4, name: 'B2 - Advanced Topics', status: 'not-started', completedDate: null },
    { id: 5, name: 'C1 - Academic French', status: 'not-started', completedDate: null },
    { id: 6, name: 'C2 - Mastery Level', status: 'not-started', completedDate: null },
  ]

  const sessions = [
    {
      id: 1,
      date: '2024-06-20',
      duration: '60 min',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-06-18',
      duration: '45 min',
      status: 'completed',
    },
    {
      id: 3,
      date: '2024-06-15',
      duration: '60 min',
      status: 'completed',
    },
  ]

  const materials = [
    { id: 1, title: 'B1 Vocabulary List', type: 'PDF', viewed: true, date: '2024-06-10' },
    { id: 2, title: 'Conversation Exercises', type: 'Audio', viewed: true, date: '2024-06-08' },
    { id: 3, title: 'B1 Grammar Review', type: 'PDF', viewed: false, date: '2024-06-15' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />
      case 'in-progress':
        return <Clock size={20} className="text-blue-600" />
      case 'not-started':
        return <AlertCircle size={20} className="text-gray-400" />
      default:
        return null
    }
  }

  const handleAddNote = (sessionId: number) => {
    setEditingNote(sessionId)
    setNoteText(notes[sessionId] || '')
    setShowNoteModal(true)
  }

  const handleSaveNote = () => {
    if (editingNote !== null) {
      setNotes({ ...notes, [editingNote]: noteText })
      setShowNoteModal(false)
      setEditingNote(null)
      setNoteText('')
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Learner Profile" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl">
          {/* Back Button */}
          <Link
            href="/teach/learners"
            className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            <span>Back to Learners</span>
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-navy font-bold text-2xl">
                  {learner.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-1" style={{ fontFamily: 'Poppins' }}>
                    {learner.name}
                  </h2>
                  <p className="text-gray-600">{learner.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Country</p>
                <p className="font-semibold text-navy">{learner.country}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Course</p>
                <p className="font-semibold text-navy">{learner.course}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Level</p>
                <p className="font-semibold text-navy">{learner.level}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Enrolled Since</p>
                <p className="font-semibold text-navy">{new Date(learner.enrolledDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Overall Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-navy">{progressOverview.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gold rounded-full h-3 transition-all"
                    style={{ width: `${progressOverview.overallProgress}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Modules completed: <span className="font-semibold text-navy">{progressOverview.modulesCompleted}/{progressOverview.modulesTotal}</span>
                </p>
                <p className="text-gray-600">
                  Sessions attended: <span className="font-semibold text-navy">{progressOverview.sessionsAttended}</span>
                </p>
                <p className="text-gray-600">
                  Certificates earned: <span className="font-semibold text-navy">{progressOverview.certificatesEarned}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                <p className="text-sm text-green-700 mb-2">Learning Streak</p>
                <p className="text-2xl font-bold text-green-700" style={{ fontFamily: 'Poppins' }}>
                  12 days
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <p className="text-sm text-blue-700 mb-2">Last Session</p>
                <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'Poppins' }}>
                  2 days ago
                </p>
              </div>
            </div>
          </div>

          {/* Module Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Module Progress
            </h3>
            <div className="space-y-3">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(module.status)}
                    <div>
                      <p className="font-semibold text-navy text-sm">{module.name}</p>
                      {module.completedDate && (
                        <p className="text-xs text-gray-600">Completed {new Date(module.completedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    module.status === 'completed'
                      ? 'bg-green-50 text-green-700'
                      : module.status === 'in-progress'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-50 text-gray-600'
                  }`}>
                    {module.status === 'completed' ? 'Complete' : module.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Session History */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Session History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy">Notes</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session.id} className="border-b border-gray-100 hover:bg-gold-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-navy">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm text-navy">{session.duration}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleAddNote(session.id)}
                          className="text-sm text-gold hover:text-gold-light transition-colors font-semibold"
                        >
                          {notes[session.id] ? 'Edit' : 'Add'} Note
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-700">
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Materials Assigned */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Materials Assigned
            </h3>
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors">
                  <div>
                    <p className="font-semibold text-navy text-sm">{material.title}</p>
                    <p className="text-xs text-gray-600">
                      {material.type} • {new Date(material.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    material.viewed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {material.viewed ? 'Viewed' : 'Not Viewed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Add Session Note
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
