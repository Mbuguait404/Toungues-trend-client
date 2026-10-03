import { apiFetch } from '@/lib/api'

export interface CourseModule {
  _id: string
  courseId: string
  title: string
  level: string
  order: number
  description?: string
  content?: string
  parts?: Array<{ _id?: string; title: string; content?: string; order: number; accessType: 'free' | 'premium'; locked?: boolean }>
  accessType?: 'free' | 'premium'
  accessLevel?: 'full' | 'preview' | 'locked'
  locked?: boolean
  objectives?: string[]
  estimatedDuration?: number
  prerequisiteModuleIds?: string[]
  coverImageUrl?: string
  notes?: string
  isPublished?: boolean
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

export function getModuleCount(courseId: string, level?: string): Promise<number> {
  const params = new URLSearchParams()
  params.set('courseId', courseId)
  if (level) params.set('level', level)
  return apiFetch<number>(`/modules/count?${params.toString()}`, { auth: true })
}

export function createModule(data: Partial<CourseModule>): Promise<CourseModule> {
  return apiFetch<CourseModule>('/modules', { method: 'POST', body: data, auth: true })
}

export function updateModule(id: string, data: Partial<CourseModule>): Promise<CourseModule> {
  return apiFetch<CourseModule>(`/modules/${id}`, { method: 'PUT', body: data, auth: true })
}

export function deleteModule(id: string): Promise<void> {
  return apiFetch<void>(`/modules/${id}`, { method: 'DELETE', auth: true })
}
