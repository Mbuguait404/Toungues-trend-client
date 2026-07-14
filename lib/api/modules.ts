import { apiFetch } from '@/lib/api'

export interface CourseModule {
  _id: string
  courseId: string
  title: string
  level: string
  order: number
  description?: string
  createdBy: string
  createdAt: string
}

export function getModules(query?: { courseId?: string; level?: string }): Promise<CourseModule[]> {
  const params = new URLSearchParams()
  if (query?.courseId) params.set('courseId', query.courseId)
  if (query?.level) params.set('level', query.level)
  const qs = params.toString()
  return apiFetch<CourseModule[]>(`/modules${qs ? `?${qs}` : ''}`, { auth: true })
}

export function getModuleById(id: string): Promise<CourseModule> {
  return apiFetch<CourseModule>(`/modules/${id}`, { auth: true })
}
