'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { BookOpen, Edit, Trash2, Plus, Loader2, AlertCircle, CheckCircle2, X, Users, GraduationCap } from 'lucide-react'
import {
  getAllCourses, getEnrollmentsByCourse, createCourse, updateCourse, deactivateCourse,
  assignTeacherToCourse, removeTeacherFromCourse,
  type Course, type CourseEnrollment,
} from '@/lib/api/courses'
import { getAllUsers } from '@/lib/api/admin'
import type { AuthUser } from '@/lib/auth'

const LANGUAGE_OPTIONS = [
  { value: 'french', label: 'French', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_2_public.png' },
  { value: 'english', label: 'English', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_3_public.png' },
  { value: 'german', label: 'German', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_4_public.png' },
  { value: 'kiswahili', label: 'Kiswahili', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_5_public.png' },
]

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

function langFlag(lang: string) {
  return LANGUAGE_OPTIONS.find((l) => l.value === lang)?.flag ?? LANGUAGE_OPTIONS[0].flag
}

function langLabel(lang: string) {
  return LANGUAGE_OPTIONS.find((l) => l.value === lang)?.label ?? lang
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<AuthUser[]>([])
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({})
  const [courseLearners, setCourseLearners] = useState<CourseEnrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: '', language: 'french', description: '', levels: [] as string[] })

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTab, setEditTab] = useState<'details' | 'teachers' | 'learners'>('details')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editForm, setEditForm] = useState({ title: '', language: 'french', description: '', levels: [] as string[] })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingLearners, setIsLoadingLearners] = useState(false)

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Assign teacher state
  const [assigningFor, setAssigningFor] = useState<string | null>(null)

  const loadCourses = useCallback(async () => {
    const [coursesData, teachersData] = await Promise.all([
      getAllCourses(),
      getAllUsers({ role: 'TEACHER' }),
    ])
    setCourses(coursesData)
    setTeachers(teachersData)

    const counts: Record<string, number> = {}
    await Promise.all(coursesData.map(async (c) => {
      try {
        const enrollments = await getEnrollmentsByCourse(c._id)
        counts[c._id] = enrollments.length
      } catch { counts[c._id] = 0 }
    }))
    setEnrollmentCounts(counts)
  }, [])

  useEffect(() => {
    loadCourses()
      .catch((err) => setError(err?.message ?? 'Failed to load courses'))
      .finally(() => setIsLoading(false))
  }, [loadCourses])

  function toast(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 3000)
  }

  // ─── Create course ───────────────────────────────────────────────────────
  function openCreateModal() {
    setNewCourse({ title: '', language: 'french', description: '', levels: [] })
    setIsCreateOpen(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsCreating(true)
    try {
      const created = await createCourse(newCourse)
      setCourses((prev) => [...prev, created])
      setIsCreateOpen(false)
      toast(`${created.title} created`)
    } catch (err: any) {
      alert(err.message || 'Failed to create course')
    } finally {
      setIsCreating(false)
    }
  }

  // ─── Edit course ─────────────────────────────────────────────────────────
  function openEditModal(course: Course) {
    setEditingCourse(course)
    setEditForm({ title: course.title, language: course.language, description: course.description || '', levels: course.levels })
    setEditTab('details')
    setCourseLearners([])
    setIsEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editingCourse) return
    setIsSaving(true)
    try {
      const updated = await updateCourse(editingCourse._id, editForm)
      setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? { ...c, ...updated } : c)))
      setEditingCourse({ ...editingCourse, ...updated })
      toast('Course updated')
    } catch (err: any) {
      alert(err.message || 'Failed to update course')
    } finally {
      setIsSaving(false)
    }
  }

  async function loadLearnersForCourse() {
    if (!editingCourse) return
    setIsLoadingLearners(true)
    try {
      const enrollments = await getEnrollmentsByCourse(editingCourse._id)
      setCourseLearners(enrollments)
    } catch {
      setCourseLearners([])
    } finally {
      setIsLoadingLearners(false)
    }
  }

  function handleTabChange(tab: 'details' | 'teachers' | 'learners') {
    setEditTab(tab)
    if (tab === 'learners') loadLearnersForCourse()
  }

  // ─── Teacher assignment ──────────────────────────────────────────────────
  async function handleAssignTeacher(teacherId: string) {
    if (!editingCourse) return
    setAssigningFor(teacherId)
    try {
      await assignTeacherToCourse(editingCourse._id, teacherId)
      const assignedTeacher = teachers.find((t) => (t as any)._id === teacherId)
      if (assignedTeacher) {
        const newTeacherEntry = {
          _id: assignedTeacher._id!,
          name: assignedTeacher.name,
          email: assignedTeacher.email,
          avatarUrl: assignedTeacher.avatarUrl,
        }
        const updated = {
          ...editingCourse,
          teacherIds: [...editingCourse.teacherIds, newTeacherEntry],
        }
        setEditingCourse(updated)
        setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? updated : c)))
      }
      toast('Teacher assigned')
    } catch (err: any) {
      alert(err.message || 'Failed to assign teacher')
    } finally {
      setAssigningFor(null)
    }
  }

  async function handleRemoveTeacher(teacherId: string) {
    if (!editingCourse) return
    setAssigningFor(teacherId)
    try {
      await removeTeacherFromCourse(editingCourse._id, teacherId)
      const updated = {
        ...editingCourse,
        teacherIds: editingCourse.teacherIds.filter((t) => t._id !== teacherId),
      }
      setEditingCourse(updated)
      setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? updated : c)))
      toast('Teacher removed')
    } catch (err: any) {
      alert(err.message || 'Failed to remove teacher')
    } finally {
      setAssigningFor(null)
    }
  }

  // ─── Delete course ───────────────────────────────────────────────────────
  function openDeleteModal(course: Course) {
    setDeletingCourse(course)
    setIsDeleteOpen(true)
  }

  async function handleDelete() {
    if (!deletingCourse) return
    setIsDeleting(true)
    try {
      await deactivateCourse(deletingCourse._id)
      setCourses((prev) => prev.filter((c) => c._id !== deletingCourse._id))
      setIsDeleteOpen(false)
      toast(`${deletingCourse.title} deactivated`)
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate course')
    } finally {
      setIsDeleting(false)
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const assignedTeacherIds = editingCourse?.teacherIds.map((t) => t._id) ?? []
  const availableTeachers = teachers.filter((t) => !assignedTeacherIds.includes((t as any)._id))

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="Courses" />
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {actionMsg && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            <CheckCircle2 size={18} />
            {actionMsg}
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Course Management</h2>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-full font-semibold text-sm hover:bg-gold-light transition-all shadow-sm"
          >
            <Plus size={18} /> Add Course
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={32} className="animate-spin mr-3" />
            Loading courses…
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No courses have been created yet.</p>
            <button
              onClick={openCreateModal}
              className="bg-gold text-navy px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-light transition-all shadow-sm"
            >
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
                      <span className="text-3xl">{langFlag(course.language)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-navy">{langLabel(course.language)}</h3>
                        <p className="text-sm text-gray-500">{course.title}</p>
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
                    <span className="flex items-center gap-1" title="Assigned teachers">
                      <Users size={14} />
                      {course.teacherIds?.length ?? 0}
                    </span>
                    <span className="flex items-center gap-1" title="Enrolled learners">
                      <GraduationCap size={14} />
                      {enrollmentCounts[course._id] ?? '…'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="p-2 text-navy hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                      title="Edit course"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(course)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Delete course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────── Create Course Modal ──────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>Create Course</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-navy transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                  placeholder="e.g. French for Beginners"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Language</label>
                <select
                  value={newCourse.language}
                  onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm bg-white"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
                  rows={3}
                  placeholder="Course description…"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">CEFR Levels</label>
                <div className="flex flex-wrap gap-2">
                  {CEFR_LEVELS.map((lvl) => {
                    const checked = newCourse.levels.includes(lvl)
                    return (
                      <label
                        key={lvl}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                          checked ? 'bg-gold text-navy border-gold' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() => {
                            setNewCourse({
                              ...newCourse,
                              levels: checked ? newCourse.levels.filter((l) => l !== lvl) : [...newCourse.levels, lvl],
                            })
                          }}
                        />
                        {lvl}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gold text-navy rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isCreating ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── Edit Course Modal ──────────────── */}
      {isEditOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                {langFlag(editingCourse.language)} {editingCourse.title}
              </h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-navy transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 shrink-0">
              {(['details', 'teachers', 'learners'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors capitalize ${
                    editTab === tab
                      ? 'text-navy border-b-2 border-gold bg-gold/5'
                      : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                  }`}
                >
                  {tab}
                  {tab === 'teachers' && ` (${editingCourse.teacherIds?.length ?? 0})`}
                  {tab === 'learners' && ` (${enrollmentCounts[editingCourse._id] ?? ''})`}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-auto p-6">
              {/* Details tab */}
              {editTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Language</label>
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm bg-white"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>{l.flag} {l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">CEFR Levels</label>
                    <div className="flex flex-wrap gap-2">
                      {CEFR_LEVELS.map((lvl) => {
                        const checked = editForm.levels.includes(lvl)
                        return (
                          <label
                            key={lvl}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                              checked ? 'bg-gold text-navy border-gold' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={() => {
                                setEditForm({
                                  ...editForm,
                                  levels: checked ? editForm.levels.filter((l) => l !== lvl) : [...editForm.levels, lvl],
                                })
                              }}
                            />
                            {lvl}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-gold text-navy rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {/* Teachers tab */}
              {editTab === 'teachers' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Assign Teacher</label>
                    {availableTeachers.length === 0 ? (
                      <p className="text-sm text-gray-400">All teachers are already assigned to this course.</p>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleAssignTeacher(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-sm bg-white"
                      >
                        <option value="">Select a teacher…</option>
                        {availableTeachers.map((t) => (
                          <option key={(t as any)._id} value={(t as any)._id}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Assigned Teachers</label>
                    {editingCourse.teacherIds.length === 0 ? (
                      <p className="text-sm text-gray-400">No teachers assigned to this course.</p>
                    ) : (
                      <div className="space-y-2">
                        {editingCourse.teacherIds.map((teacher) => {
                          const initials = (teacher.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                          return (
                            <div
                              key={teacher._id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                {teacher.avatarUrl ? (
                                  <img src={teacher.avatarUrl} alt={teacher.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-navy">{teacher.name}</p>
                                  <p className="text-xs text-gray-500">{teacher.email}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveTeacher(teacher._id)}
                                disabled={assigningFor === teacher._id}
                                className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                                title="Remove teacher"
                              >
                                {assigningFor === teacher._id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Learners tab */}
              {editTab === 'learners' && (
                <div>
                  {isLoadingLearners ? (
                    <div className="flex items-center justify-center py-12 text-gray-400">
                      <Loader2 size={24} className="animate-spin mr-3" />
                      Loading learners…
                    </div>
                  ) : courseLearners.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No learners enrolled in this course.</p>
                  ) : (
                    <div className="space-y-2">
                      {courseLearners.map((enrollment) => {
                        const learner = enrollment.userId
                        const initials = (learner?.name || '').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                        return (
                          <div key={enrollment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              {learner?.avatarUrl ? (
                                <img src={learner.avatarUrl} alt={learner.name} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-navy">{learner?.name ?? 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{learner?.email ?? ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  enrollment.status === 'active' ? 'bg-green-100 text-green-700' :
                                  enrollment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {enrollment.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-0.5">{enrollment.level}</p>
                              </div>
                              <div className="w-20">
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gold rounded-full transition-all"
                                    style={{ width: `${enrollment.progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 text-right">{enrollment.progress}%</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── Delete Confirmation Modal ──────────────── */}
      {isDeleteOpen && deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: 'Poppins' }}>Deactivate Course</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to deactivate <span className="font-semibold text-navy">{deletingCourse.title}</span>?
                This will hide the course from learners.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
