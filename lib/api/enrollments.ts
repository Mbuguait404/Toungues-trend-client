import { apiFetch } from '@/lib/api'

export interface Enrollment {
  _id: string
  courseId: string
  courseName?: string
  language?: string
  level?: string
  progress?: number
  completedModules?: number
  totalModules?: number
  isActive: boolean
  createdAt: string
}

export function getMyEnrollments(): Promise<Enrollment[]> {
  return apiFetch<Enrollment[]>('/enrollments/me', { auth: true })
}

export function getEnrollmentById(id: string): Promise<Enrollment> {
  return apiFetch<Enrollment>(`/enrollments/${id}`, { auth: true })
}
