import { apiFetch } from '@/lib/api'

export interface Enrollment {
  _id: string
  courseId: string | { _id: string; title?: string; language?: string; description?: string }
  courseName?: string
  language?: string
  level?: string
  progress?: number
  /** Matches the API DTO — the raw mongoose array is not serialised. */
  completedModulesCount?: number
  totalModules?: number
  isActive: boolean
  createdAt: string
  status?: string
  accessStatus?: 'preview' | 'paid' | 'free'
}

// Helper to resolve populated course fields
export function getEnrollmentCourseName(e: Enrollment): string {
  if (typeof e.courseId === 'object' && e.courseId !== null) {
    return e.courseId.title ?? e.courseName ?? 'Course'
  }
  return e.courseName ?? 'Course'
}

export function getEnrollmentLanguage(e: Enrollment): string {
  if (typeof e.courseId === 'object' && e.courseId !== null) {
    return e.courseId.language ?? e.language ?? ''
  }
  return e.language ?? ''
}

export function getMyEnrollments(): Promise<Enrollment[]> {
  return apiFetch<Enrollment[]>('/enrollments/me', { auth: true })
}

export function getEnrollmentById(id: string): Promise<Enrollment> {
  return apiFetch<Enrollment>(`/enrollments/${id}`, { auth: true })
}

export function enrolInCourse(courseId: string, level: string): Promise<Enrollment> {
  return apiFetch<Enrollment>('/enrollments', { method: 'POST', body: { courseId, level }, auth: true })
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function getAllEnrollments(query?: Record<string, string>): Promise<Enrollment[]> {
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  return apiFetch<Enrollment[]>(`/enrollments${qs}`, { auth: true })
}
