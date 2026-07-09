'use client'

import { useEffect, useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { BookOpen, Edit, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react'
import { getAllCourses, type Course } from '@/lib/api/courses'

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllCourses()
      .then(setCourses)
      .catch((err) => setError(err?.message ?? 'Failed to load courses'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Courses" />
      <div className="flex-1 overflow-auto p-8 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Course Management</h2>
          <button className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all shadow-sm">
            <Plus size={18} /> Add Course
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading courses…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No courses have been created yet.</p>
            <button className="bg-gold text-navy px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-light transition-all shadow-sm">
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="p-6 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{course.flag ?? '🌐'}</span>
                      <div>
                        <h3 className="text-xl font-bold text-navy">{course.language}</h3>
                        <p className="text-sm text-gray-500">{course.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="font-semibold">{course.modules?.length ?? 0} modules</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-navy hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Edit course">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Delete course">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
