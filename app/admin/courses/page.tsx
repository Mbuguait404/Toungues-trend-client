'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import AdminTopBar from '@/components/admin-topbar'
import { Card, EmptyRow, PageHeader, Pill, StatTile } from '@/components/portal/portal-ui'
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import {
  getAllCourses,
  getEnrollmentsByCourse,
  createCourse,
  updateCourse,
  deactivateCourse,
  setCourseActive,
  assignTeacherToCourse,
  removeTeacherFromCourse,
  type Course,
  type CourseEnrollment,
} from '@/lib/api/courses'
import { getAllUsers } from '@/lib/api/admin'
import { getAllEnrollments, type Enrollment } from '@/lib/api/enrollments'
import type { AuthUser } from '@/lib/auth'

const LANGUAGE_OPTIONS = [
  { value: 'french', label: 'French', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_2_public.png' },
  { value: 'english', label: 'English', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_3_public.png' },
  { value: 'german', label: 'German', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_4_public.png' },
  { value: 'kiswahili', label: 'Kiswahili', flag: '/images/Language Tutoring Services at Tongues Trend/imgi_5_public.png' },
] as const

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

function langMeta(lang: string) {
  return LANGUAGE_OPTIONS.find((l) => l.value === lang) ?? LANGUAGE_OPTIONS[0]
}

function langLabel(lang: string) {
  return LANGUAGE_OPTIONS.find((l) => l.value === lang)?.label ?? lang
}

/** courseId is populated for most rows but still a raw id for legacy ones. */
function courseIdOf(e: Enrollment): string | null {
  if (!e.courseId) return null
  return typeof e.courseId === 'object' ? e.courseId._id : e.courseId
}

function priceLabel(course: Course): string {
  if (course.accessType === 'free') return 'Free'
  if (course.price == null) return 'No price set'
  return `${course.currency ?? 'KES'} ${course.price.toLocaleString()}`
}

function initials(name?: string | null) {
  return (
    (name ?? '')
      .trim()
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  )
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<AuthUser[]>([])
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({})
  const [courseLearners, setCourseLearners] = useState<CourseEnrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [langFilter, setLangFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '', language: 'french', description: '', levels: [] as string[],
    accessType: 'paid' as 'paid' | 'free', price: 0, currency: 'KES' as Course['currency'],
  })

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTab, setEditTab] = useState<'details' | 'teachers' | 'learners'>('details')
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editForm, setEditForm] = useState({
    title: '', language: 'french', description: '', levels: [] as string[],
    accessType: 'paid' as 'paid' | 'free', price: 0, currency: 'KES' as Course['currency'],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingLearners, setIsLoadingLearners] = useState(false)

  // Deactivate modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null)

  const [assigningFor, setAssigningFor] = useState<string | null>(null)

  // One request for every count, instead of one request per course.
  const loadCourses = useCallback(async () => {
    const [coursesData, teachersData, enrollments] = await Promise.all([
      getAllCourses(),
      getAllUsers({ role: 'TEACHER' }),
      getAllEnrollments({ limit: '500' }),
    ])
    setCourses(coursesData)
    setTeachers(teachersData)

    const counts: Record<string, number> = {}
    for (const e of enrollments) {
      const id = courseIdOf(e)
      if (id) counts[id] = (counts[id] ?? 0) + 1
    }
    setEnrollmentCounts(counts)
  }, [])

  const refresh = useCallback(async (background = false) => {
    if (background) setIsRefreshing(true)
    try {
      setError(null)
      await loadCourses()
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Failed to load courses')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [loadCourses])

  useEffect(() => {
    refresh()
  }, [refresh])

  function toast(msg: string) {
    setNotice(msg)
    setTimeout(() => setNotice(null), 3000)
  }

  const errMessage = (err: unknown, fallback: string) =>
    err instanceof Error && err.message ? err.message : fallback

  // ─── Derived ──────────────────────────────────────────────────────────────
  const activeCount = courses.filter((c) => c.isActive).length
  const totalEnrolled = useMemo(
    () => courses.reduce((sum, c) => sum + (enrollmentCounts[c._id] ?? 0), 0),
    [courses, enrollmentCounts]
  )
  const languagesUsed = useMemo(
    () => new Set(courses.map((c) => c.language)).size,
    [courses]
  )
  const pricedCourses = courses.filter((c) => c.accessType !== 'free' && typeof c.price === 'number')
  const avgPrice = pricedCourses.length
    ? Math.round(pricedCourses.reduce((s, c) => s + (c.price ?? 0), 0) / pricedCourses.length)
    : null

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return courses.filter((c) => {
      const matchesTerm = !term || `${c.title} ${c.description ?? ''} ${langLabel(c.language)}`.toLowerCase().includes(term)
      const matchesLang = langFilter === 'all' || c.language === langFilter
      const matchesStatus =
        statusFilter === 'all' || (statusFilter === 'active' ? c.isActive : !c.isActive)
      return matchesTerm && matchesLang && matchesStatus
    })
  }, [courses, search, langFilter, statusFilter])

  const assignedTeacherIds = editingCourse?.teacherIds.map((t) => t._id) ?? []
  const availableTeachers = teachers.filter((t) => !assignedTeacherIds.includes(t._id))

  // ─── Create ───────────────────────────────────────────────────────────────
  function openCreateModal() {
    setNewCourse({
      title: '', language: 'french', description: '', levels: [],
      accessType: 'paid', price: 0, currency: 'KES',
    })
    setFormError(null)
    setIsCreateOpen(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setIsCreating(true)
    setFormError(null)
    try {
      const created = await createCourse(newCourse)
      setCourses((prev) => [...prev, created])
      setIsCreateOpen(false)
      toast(`${created.title} created`)
    } catch (err) {
      setFormError(errMessage(err, 'Failed to create course'))
    } finally {
      setIsCreating(false)
    }
  }

  // ─── Edit ─────────────────────────────────────────────────────────────────
  function openEditModal(course: Course) {
    setEditingCourse(course)
    setEditForm({
      title: course.title,
      language: course.language,
      description: course.description || '',
      levels: course.levels,
      accessType: course.accessType ?? 'paid',
      price: course.price ?? 0,
      currency: course.currency ?? 'KES',
    })
    setEditTab('details')
    setCourseLearners([])
    setFormError(null)
    setIsEditOpen(true)
  }

  async function handleSaveEdit() {
    if (!editingCourse) return
    setIsSaving(true)
    setFormError(null)
    try {
      const updated = await updateCourse(editingCourse._id, editForm)
      setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? { ...c, ...updated } : c)))
      setEditingCourse({ ...editingCourse, ...updated })
      toast('Course updated')
    } catch (err) {
      setFormError(errMessage(err, 'Failed to update course'))
    } finally {
      setIsSaving(false)
    }
  }

  async function loadLearnersForCourse() {
    if (!editingCourse) return
    setIsLoadingLearners(true)
    try {
      setCourseLearners(await getEnrollmentsByCourse(editingCourse._id))
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

  // ─── Teacher assignment ───────────────────────────────────────────────────
  async function handleAssignTeacher(teacherId: string) {
    if (!editingCourse) return
    setAssigningFor(teacherId)
    setFormError(null)
    try {
      const assignedTeacher = teachers.find((t) => t._id === teacherId)
      if (!assignedTeacher) return
      await assignTeacherToCourse(editingCourse._id, teacherId)
      const updated: Course = {
        ...editingCourse,
        teacherIds: [
          ...editingCourse.teacherIds,
          {
            _id: assignedTeacher._id,
            name: assignedTeacher.name,
            email: assignedTeacher.email,
            avatarUrl: assignedTeacher.avatarUrl,
          },
        ],
      }
      setEditingCourse(updated)
      setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? updated : c)))
      toast(`${assignedTeacher.name} assigned`)
    } catch (err) {
      setFormError(errMessage(err, 'Failed to assign teacher'))
    } finally {
      setAssigningFor(null)
    }
  }

  async function handleRemoveTeacher(teacherId: string) {
    if (!editingCourse) return
    setAssigningFor(teacherId)
    setFormError(null)
    try {
      await removeTeacherFromCourse(editingCourse._id, teacherId)
      const updated: Course = {
        ...editingCourse,
        teacherIds: editingCourse.teacherIds.filter((t) => t._id !== teacherId),
      }
      setEditingCourse(updated)
      setCourses((prev) => prev.map((c) => (c._id === editingCourse._id ? updated : c)))
      toast('Teacher removed')
    } catch (err) {
      setFormError(errMessage(err, 'Failed to remove teacher'))
    } finally {
      setAssigningFor(null)
    }
  }

  // ─── Deactivate / reactivate ──────────────────────────────────────────────
  async function handleDelete() {
    if (!deletingCourse) return
    setIsDeleting(true)
    setFormError(null)
    try {
      await deactivateCourse(deletingCourse._id)
      // Keep the row so the Inactive state is actually visible.
      setCourses((prev) => prev.map((c) => (c._id === deletingCourse._id ? { ...c, isActive: false } : c)))
      if (editingCourse?._id === deletingCourse._id) {
        setEditingCourse({ ...editingCourse, isActive: false })
      }
      setIsDeleteOpen(false)
      toast(`${deletingCourse.title} deactivated`)
    } catch (err) {
      setFormError(errMessage(err, 'Failed to deactivate course'))
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleReactivate(course: Course) {
    setBusyCourseId(course._id)
    setError(null)
    try {
      const updated = await setCourseActive(course._id, true)
      setCourses((prev) => prev.map((c) => (c._id === course._id ? { ...c, ...updated } : c)))
      if (editingCourse?._id === course._id) setEditingCourse({ ...editingCourse, ...updated })
      toast(`${course.title} reactivated`)
    } catch (err) {
      setError(errMessage(err, 'Failed to reactivate course'))
    } finally {
      setBusyCourseId(null)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white'
  const labelClass = 'block text-[11px] font-semibold uppercase tracking-wide text-gray-mid mb-1'

  return (
    <>
      <AdminTopBar title="Courses" />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1400px] mx-auto p-5 space-y-4">
          <PageHeader
            title="Course management"
            subtitle={
              courses.length
                ? `${courses.length} courses · ${activeCount} live to learners · ${totalEnrolled} enrolments recorded`
                : 'Create your first course to get started'
            }
            onRefresh={() => refresh(true)}
            refreshing={isRefreshing}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gold text-navy text-sm font-bold hover:bg-gold-light transition-colors"
            >
              <Plus size={15} />
              Add course
            </button>
          </div>

          {notice && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle2 size={16} />
              {notice}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <StatTile label="Total courses" value={courses.length} icon={BookOpen} />
            <StatTile
              label="Live"
              value={activeCount}
              sub={`${courses.length - activeCount} inactive`}
              icon={CheckCircle2}
              accent="text-green-600"
            />
            <StatTile label="Languages" value={languagesUsed} icon={BookOpen} />
            <StatTile label="Enrolments" value={totalEnrolled} icon={GraduationCap} />
            <StatTile
              label="Avg. price"
              value={avgPrice === null ? '—' : avgPrice.toLocaleString()}
              sub={pricedCourses.length ? `across ${pricedCourses.length} paid` : 'no paid courses'}
              icon={BookOpen}
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-56 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-mid" />
              <input
                type="text"
                placeholder="Search title, description or language…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">All languages</option>
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white"
            >
              <option value="all">All statuses</option>
              <option value="active">Live only</option>
              <option value="inactive">Inactive only</option>
            </select>
            <span className="text-[11px] text-gray-mid ml-auto tabular-nums">
              {filtered.length} of {courses.length}
            </span>
          </div>

          <Card title="Courses" bodyClassName="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-mid text-sm">
                <Loader2 size={22} className="animate-spin mr-3" />
                Loading courses…
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Course</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Language</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Levels</th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Price</th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Teachers</th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Learners</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Status</th>
                    <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-mid">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <EmptyRow colSpan={8}>
                      {courses.length === 0 ? 'No courses yet — use “Add course” to create one.' : 'No courses match your filters.'}
                    </EmptyRow>
                  ) : (
                    filtered.map((course, idx) => (
                      <tr key={course._id} className={idx % 2 ? 'bg-gray-light/50' : ''}>
                        <td className="px-4 py-2.5">
                          <p className="text-sm font-medium text-navy truncate max-w-[16rem]">
                            {course.title}
                          </p>
                          {course.description && (
                            <p className="text-[11px] text-gray-mid truncate max-w-[16rem]">
                              {course.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-dark whitespace-nowrap">
                            <Image
                              src={langMeta(course.language).flag}
                              alt=""
                              width={20}
                              height={20}
                              className="w-5 h-5 object-contain shrink-0"
                            />
                            {langLabel(course.language)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="flex flex-wrap gap-1">
                            {course.levels.length === 0 ? (
                              <span className="text-[11px] text-gray-mid">—</span>
                            ) : (
                              course.levels.map((lvl) => (
                                <Pill key={lvl} tone="gray">
                                  {lvl}
                                </Pill>
                              ))
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-navy text-right whitespace-nowrap tabular-nums">
                          {priceLabel(course)}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-navy text-right tabular-nums">
                          {course.teacherIds?.length ?? 0}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-navy text-right tabular-nums">
                          {enrollmentCounts[course._id] ?? 0}
                        </td>
                        <td className="px-4 py-2.5">
                          <Pill tone={course.isActive ? 'green' : 'red'}>
                            {course.isActive ? 'Live' : 'Inactive'}
                          </Pill>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(course)}
                              aria-label={`Edit ${course.title}`}
                              className="p-1.5 rounded-lg text-navy hover:bg-gray-light transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            {course.isActive ? (
                              <button
                                onClick={() => {
                                  setFormError(null)
                                  setDeletingCourse(course)
                                  setIsDeleteOpen(true)
                                }}
                                aria-label={`Deactivate ${course.title}`}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivate(course)}
                                disabled={busyCourseId === course._id}
                                aria-label={`Reactivate ${course.title}`}
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                              >
                                {busyCourseId === course._id ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <RotateCcw size={15} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>

      {/* ──────────────── Create Course Modal ──────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
              <h3 className="text-base font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
                Create course
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                aria-label="Close"
                className="text-gray-mid hover:text-navy transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-3.5 overflow-auto">
              {formError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={15} />
                  {formError}
                </div>
              )}
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. French for Beginners"
                />
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <select
                  value={newCourse.language}
                  onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                  className={inputClass}
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="What will learners achieve?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Access</label>
                  <select
                    value={newCourse.accessType}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, accessType: e.target.value as 'paid' | 'free' })
                    }
                    className={inputClass}
                  >
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Price</label>
                  <div className="flex gap-2">
                    <select
                      value={newCourse.currency}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, currency: e.target.value as Course['currency'] })
                      }
                      className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gold"
                    >
                      {(['KES', 'EUR', 'CHF', 'USD'] as const).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required={newCourse.accessType === 'paid'}
                      disabled={newCourse.accessType === 'free'}
                      value={newCourse.price || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                      className={`${inputClass} disabled:bg-gray-100`}
                      placeholder="Required"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>CEFR levels</label>
                <div className="flex flex-wrap gap-2">
                  {CEFR_LEVELS.map((lvl) => {
                    const checked = newCourse.levels.includes(lvl)
                    return (
                      <label
                        key={lvl}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                          checked
                            ? 'bg-gold text-navy border-gold'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() =>
                            setNewCourse({
                              ...newCourse,
                              levels: checked
                                ? newCourse.levels.filter((l) => l !== lvl)
                                : [...newCourse.levels, lvl],
                            })
                          }
                        />
                        {lvl}
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-dark rounded-lg font-semibold text-sm hover:bg-gray-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating && <Loader2 size={15} className="animate-spin" />}
                  Create course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── Edit Course Modal ──────────────── */}
      {isEditOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
              <h3 className="text-base font-bold text-navy flex items-center gap-2 min-w-0" style={{ fontFamily: 'Poppins' }}>
                <Image
                  src={langMeta(editingCourse.language).flag}
                  alt=""
                  width={22}
                  height={22}
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="truncate">{editingCourse.title}</span>
                <Pill tone={editingCourse.isActive ? 'green' : 'red'}>
                  {editingCourse.isActive ? 'Live' : 'Inactive'}
                </Pill>
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                aria-label="Close"
                className="text-gray-mid hover:text-navy transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 shrink-0">
              {(['details', 'teachers', 'learners'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 px-4 py-2.5 text-sm font-semibold transition-colors capitalize ${
                    editTab === tab
                      ? 'text-navy border-b-2 border-gold bg-gold/5'
                      : 'text-gray-mid hover:text-navy hover:bg-gray-light'
                  }`}
                >
                  {tab}
                  {tab === 'teachers' && ` (${editingCourse.teacherIds?.length ?? 0})`}
                  {tab === 'learners' && ` (${enrollmentCounts[editingCourse._id] ?? 0})`}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-5">
              {formError && (
                <div className="mb-3 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={15} />
                  {formError}
                </div>
              )}

              {editTab === 'details' && (
                <div className="space-y-3.5">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Language</label>
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      className={inputClass}
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Access</label>
                      <select
                        value={editForm.accessType}
                        onChange={(e) =>
                          setEditForm({ ...editForm, accessType: e.target.value as 'paid' | 'free' })
                        }
                        className={inputClass}
                      >
                        <option value="paid">Paid</option>
                        <option value="free">Free</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Price</label>
                      <div className="flex gap-2">
                        <select
                          value={editForm.currency}
                          onChange={(e) =>
                            setEditForm({ ...editForm, currency: e.target.value as Course['currency'] })
                          }
                          className="px-2 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gold"
                        >
                          {(['KES', 'EUR', 'CHF', 'USD'] as const).map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required={editForm.accessType === 'paid'}
                          disabled={editForm.accessType === 'free'}
                          value={editForm.price || ''}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className={`${inputClass} disabled:bg-gray-100`}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>CEFR levels</label>
                    <div className="flex flex-wrap gap-2">
                      {CEFR_LEVELS.map((lvl) => {
                        const checked = editForm.levels.includes(lvl)
                        return (
                          <label
                            key={lvl}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                              checked
                                ? 'bg-gold text-navy border-gold'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={checked}
                              onChange={() =>
                                setEditForm({
                                  ...editForm,
                                  levels: checked
                                    ? editForm.levels.filter((l) => l !== lvl)
                                    : [...editForm.levels, lvl],
                                })
                              }
                            />
                            {lvl}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-dark rounded-lg font-semibold text-sm hover:bg-gray-light transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2 bg-gold text-navy rounded-lg font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving && <Loader2 size={15} className="animate-spin" />}
                      Save changes
                    </button>
                  </div>
                </div>
              )}

              {editTab === 'teachers' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Assign teacher</label>
                    {availableTeachers.length === 0 ? (
                      <p className="text-sm text-gray-mid">Every teacher is already assigned to this course.</p>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleAssignTeacher(e.target.value)
                        }}
                        className={inputClass}
                      >
                        <option value="">Select a teacher…</option>
                        {availableTeachers.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Assigned teachers</label>
                    {editingCourse.teacherIds.length === 0 ? (
                      <p className="text-sm text-gray-mid">No teachers assigned yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                        {editingCourse.teacherIds.map((teacher) => (
                          <li key={teacher._id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                            <div className="flex items-center gap-3 min-w-0">
                              {teacher.avatarUrl ? (
                                <Image
                                  src={teacher.avatarUrl}
                                  alt={teacher.name || 'Teacher'}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">
                                  {initials(teacher.name)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-navy truncate">{teacher.name || 'Teacher'}</p>
                                <p className="text-[11px] text-gray-mid truncate">{teacher.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveTeacher(teacher._id)}
                              disabled={assigningFor === teacher._id}
                              aria-label={`Remove ${teacher.name || 'teacher'}`}
                              className="shrink-0 text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {assigningFor === teacher._id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <X size={15} />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {editTab === 'learners' && (
                <div>
                  {isLoadingLearners ? (
                    <div className="flex items-center justify-center py-12 text-gray-mid text-sm">
                      <Loader2 size={20} className="animate-spin mr-3" />
                      Loading learners…
                    </div>
                  ) : courseLearners.length === 0 ? (
                    <p className="text-sm text-gray-mid text-center py-8">No learners enrolled yet.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                      {courseLearners.map((enrollment) => {
                        const learner = enrollment.userId
                        return (
                          <li
                            key={enrollment._id}
                            className="flex items-center justify-between gap-3 px-3 py-2.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {learner?.avatarUrl ? (
                                <Image
                                  src={learner.avatarUrl}
                                  alt={learner.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center text-xs font-bold shrink-0">
                                  {initials(learner?.name ?? '')}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-navy truncate">
                                  {learner?.name ?? 'Unknown'}
                                </p>
                                <p className="text-[11px] text-gray-mid truncate">{learner?.email ?? ''}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <Pill
                                tone={
                                  enrollment.status === 'completed'
                                    ? 'blue'
                                    : enrollment.status === 'active'
                                      ? 'green'
                                      : 'amber'
                                }
                              >
                                {enrollment.status}
                              </Pill>
                              <Pill tone="gray">{enrollment.level}</Pill>
                              <span className="text-[11px] text-navy tabular-nums w-9 text-right">
                                {enrollment.progress}%
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── Deactivate Confirmation ──────────────── */}
      {isDeleteOpen && deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="text-base font-bold text-navy mb-1.5" style={{ fontFamily: 'Poppins' }}>
                Deactivate course
              </h3>
              <p className="text-sm text-gray-mid">
                <span className="font-semibold text-navy">{deletingCourse.title}</span> will be hidden
                from learners. It stays in this list so you can switch it back on.
              </p>

              {formError && (
                <div className="mt-3 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={15} />
                  {formError}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-dark rounded-lg font-semibold text-sm hover:bg-gray-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 size={15} className="animate-spin" />}
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
