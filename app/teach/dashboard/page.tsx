'use client'

import TeachTopbar from '@/components/teach-topbar'
import { Users, Calendar, FileText, TrendingUp, Upload, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function TeachDashboard() {
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const stats = [
    { label: 'Active Learners', value: '24', icon: Users, color: 'bg-blue-50' },
    { label: 'Sessions This Week', value: '12', icon: Calendar, color: 'bg-purple-50' },
    { label: 'Materials Uploaded', value: '38', icon: FileText, color: 'bg-green-50' },
    { label: 'Avg. Learner Progress', value: '68%', icon: TrendingUp, color: 'bg-orange-50' },
  ]

  const todaySessions = [
    { learnerName: 'Amara K.', language: 'French', level: 'B1', time: '10:00 AM', id: 1 },
    { learnerName: 'Marco R.', language: 'English', level: 'A2', time: '11:30 AM', id: 2 },
    { learnerName: 'Sophie L.', language: 'German', level: 'B2', time: '2:00 PM', id: 3 },
  ]

  const topLearners = [
    { name: 'Amara K.', course: 'French (B1)', progress: 75, lastActive: '2 days ago' },
    { name: 'Marco R.', course: 'English (A2)', progress: 45, lastActive: '1 hour ago' },
    { name: 'Sophie L.', course: 'German (B2)', progress: 82, lastActive: '5 hours ago' },
    { name: 'Yuki T.', course: 'Kiswahili (A1)', progress: 28, lastActive: '3 days ago' },
    { name: 'Hassan M.', course: 'French (B1)', progress: 61, lastActive: '1 day ago' },
  ]

  const handleFileUpload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setUploadFile(files[0])
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TeachTopbar title="Dashboard" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8 max-w-7xl">
          {/* Welcome Banner */}
          <div className="bg-navy rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins' }}>
              Welcome, Sarah M.
            </h2>
            <p className="text-gray-300">
              You have 12 sessions scheduled this week. 3 learners need attention on their recent assignments.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gold hover:shadow-sm transition-all duration-150">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-navy" />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Sessions */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Today's Sessions
              </h3>
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
                        {session.learnerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.language} • {session.level}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-navy">{session.time}</span>
                      <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                        Start Zoom
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Learners</p>
                  <p className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                    24
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    68%
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Ratings</p>
                  <p className="text-2xl font-bold text-gold" style={{ fontFamily: 'Poppins' }}>
                    4.8/5
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Learners */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Top Learners
            </h3>
            <div className="space-y-3">
              {topLearners.map((learner, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-navy" style={{ fontFamily: 'Poppins' }}>
                      {learner.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{learner.course}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gold rounded-full h-2 transition-all"
                        style={{ width: `${learner.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-navy">{learner.progress}%</p>
                    <p className="text-xs text-gray-600">{learner.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
              Quick Upload
            </h3>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileUpload}
              className="border-2 border-dashed border-gold rounded-lg p-8 text-center hover:bg-gold-50 transition-colors cursor-pointer"
            >
              {uploadFile ? (
                <div>
                  <p className="text-navy font-semibold mb-2">{uploadFile.name}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {(uploadFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto text-gold mb-2" size={32} />
                  <p className="text-navy font-semibold mb-1">Drag files here</p>
                  <p className="text-sm text-gray-600">PDF, MP3, MP4, DOCX supported</p>
                </div>
              )}
            </div>
            {uploadFile && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Material title"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Course</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>French</option>
                      <option>English</option>
                      <option>German</option>
                      <option>Kiswahili</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Module</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                      <option>A1</option>
                      <option>A2</option>
                      <option>B1</option>
                      <option>B2</option>
                    </select>
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-gold hover:bg-gold-light text-navy font-semibold rounded-full transition-all duration-150">
                  Upload Material
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
