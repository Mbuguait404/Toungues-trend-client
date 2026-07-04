'use client'

import { useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { Users, BookOpen, Edit, Trash2, Plus, X } from 'lucide-react'

const courses = [
  {
    id: 1,
    name: 'French',
    flag: '🇫🇷',
    learners: 248,
    modules: 24,
    teachers: [{ name: 'Sophie Laurent', avatar: 'SL' }],
    modules_list: [
      { level: 'A1', title: 'Greetings & Basics', materials: 12, completions: 145 },
      { level: 'A2', title: 'Daily Conversations', materials: 14, completions: 98 },
      { level: 'B1', title: 'Intermediate Topics', materials: 16, completions: 67 },
    ],
  },
  {
    id: 2,
    name: 'English',
    flag: '🇬🇧',
    learners: 312,
    modules: 24,
    teachers: [{ name: 'Hans Mueller', avatar: 'HM' }],
    modules_list: [
      { level: 'A1', title: 'Introduction to English', materials: 12, completions: 234 },
      { level: 'A2', title: 'Basic Conversations', materials: 14, completions: 156 },
      { level: 'B1', title: 'Workplace English', materials: 16, completions: 89 },
    ],
  },
  {
    id: 3,
    name: 'German',
    flag: '🇩🇪',
    learners: 184,
    modules: 24,
    teachers: [{ name: 'Elsa Mueller', avatar: 'EM' }],
    modules_list: [
      { level: 'A1', title: 'German Basics', materials: 12, completions: 112 },
      { level: 'A2', title: 'Conversational German', materials: 14, completions: 78 },
      { level: 'B1', title: 'Advanced Topics', materials: 16, completions: 43 },
    ],
  },
  {
    id: 4,
    name: 'Kiswahili',
    flag: '🇰🇪',
    learners: 156,
    modules: 20,
    teachers: [{ name: 'David Kipkemboi', avatar: 'DK' }],
    modules_list: [
      { level: 'A1', title: 'Swahili Foundation', materials: 10, completions: 98 },
      { level: 'A2', title: 'Daily Kiswahili', materials: 12, completions: 67 },
      { level: 'B1', title: 'Cultural Context', materials: 14, completions: 34 },
    ],
  },
]

export default function AdminCourses() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [managingCourse, setManagingCourse] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('modules')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Course Management" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gold hover:shadow-sm transition-all">
                <div className="text-4xl mb-3">{course.flag}</div>
                <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: 'Poppins' }}>
                  {course.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-gold" />
                    <span className="text-sm text-gray-dark">{course.learners} learners</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen size={16} className="text-gold" />
                    <span className="text-sm text-gray-dark">{course.modules} modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-mid">Teachers:</span>
                    <div className="flex -space-x-2">
                      {course.teachers.map((teacher, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold border border-white"
                          title={teacher.name}
                        >
                          {teacher.avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setManagingCourse(course.id)}
                  className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>

          {/* Course Management Modal */}
          {managingCourse !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                    {courses.find(c => c.id === managingCourse)?.name} Course Management
                  </h2>
                  <button onClick={() => setManagingCourse(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 border-b border-gray-100 px-6">
                  {[
                    { label: 'Modules', value: 'modules' },
                    { label: 'Teachers', value: 'teachers' },
                    { label: 'Settings', value: 'settings' },
                  ].map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={`px-6 py-3 font-semibold transition-all text-sm ${
                        activeTab === tab.value
                          ? 'text-gold border-b-2 border-gold'
                          : 'text-gray-mid hover:text-navy'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                  {activeTab === 'modules' && (
                    <div className="space-y-4">
                      {courses.find(c => c.id === managingCourse)?.modules_list.map((module, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg hover:bg-gray-200 transition-colors">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold px-2 py-1 rounded bg-gold text-navy">
                                {module.level}
                              </span>
                              <p className="font-semibold text-navy">{module.title}</p>
                            </div>
                            <p className="text-xs text-gray-mid">{module.materials} materials • {module.completions} completions</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                              <Edit size={16} className="text-gray-mid" />
                            </button>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button className="w-full flex items-center justify-center gap-2 py-3 border border-gold rounded-lg text-gold hover:bg-gold hover:text-navy font-semibold transition-colors">
                        <Plus size={18} />
                        Add Module
                      </button>
                    </div>
                  )}

                  {activeTab === 'teachers' && (
                    <div className="space-y-4">
                      {courses.find(c => c.id === managingCourse)?.teachers.map((teacher, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-light rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold">
                              {teacher.avatar}
                            </div>
                            <p className="font-semibold text-navy">{teacher.name}</p>
                          </div>
                          <button className="text-red-500 hover:text-red-700 font-semibold text-sm">Remove</button>
                        </div>
                      ))}
                      <div className="pt-2">
                        <label className="text-sm font-semibold text-navy mb-2 block">Assign Teacher</label>
                        <div className="flex gap-2">
                          <select className="flex-1 border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                            <option>Select a teacher</option>
                            <option>Sophie Laurent</option>
                            <option>Hans Mueller</option>
                            <option>Elsa Mueller</option>
                          </select>
                          <button className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-2 rounded-lg transition-colors text-sm">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-navy mb-2 block">Course Title</label>
                        <input type="text" defaultValue={courses.find(c => c.id === managingCourse)?.name} className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-navy mb-2 block">Description</label>
                        <textarea placeholder="Enter course description" className="w-full border border-gray-100 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-gold resize-none" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-light rounded-lg">
                        <span className="font-semibold text-navy">Course Status</span>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-sm">Active</button>
                          <button className="px-4 py-2 border border-gray-100 text-gray-dark font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors">Inactive</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-4 p-6 border-t border-gray-100">
                  <button onClick={() => setManagingCourse(null)} className="flex-1 border border-gray-100 rounded-full py-3 font-semibold text-navy hover:bg-gray-50 transition-colors">
                    Close
                  </button>
                  <button className="flex-1 bg-gold hover:bg-gold-light text-navy rounded-full py-3 font-semibold transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
