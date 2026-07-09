import { apiFetch } from '@/lib/api'

export interface Course {
  _id: string
  name: string
  language: string
  slug?: string
  description?: string
  flag?: string
  isActive: boolean
  teachers?: string[]
  modules?: string[]
  createdAt?: string
}

export function getAllCourses(): Promise<Course[]> {
  return apiFetch<Course[]>('/courses')
}

export function getCourseById(id: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`)
}

export function createCourse(dto: Partial<Course>): Promise<Course> {
  return apiFetch<Course>('/courses', { method: 'POST', body: dto, auth: true })
}

export function updateCourse(id: string, dto: Partial<Course>): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`, { method: 'PUT', body: dto, auth: true })
}

export function deactivateCourse(id: string): Promise<void> {
  return apiFetch<void>(`/courses/${id}`, { method: 'DELETE', auth: true })
}
