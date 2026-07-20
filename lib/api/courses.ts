import { apiFetch } from '@/lib/api'

export interface CourseTeacher {
  _id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface CourseEnrollment {
  _id: string
  userId: { _id: string; name: string; email: string; avatarUrl?: string; isActive: boolean }
  courseId: { _id: string; title: string; language: string }
  level: string
  status: string
  progress: number
  startedAt: string
}

export interface Course {
  _id: string
  title: string
  language: string
  description?: string
  levels: string[]
  teacherIds: CourseTeacher[]
  isActive: boolean
  createdAt?: string
}

export function getAllCourses(): Promise<Course[]> {
  return apiFetch<Course[]>('/courses')
}

export function getCourseById(id: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`)
}

export function createCourse(dto: { title: string; language: string; description: string; levels: string[] }): Promise<Course> {
  return apiFetch<Course>('/courses', { method: 'POST', body: dto, auth: true })
}

export function updateCourse(id: string, dto: Partial<Course>): Promise<Course> {
  return apiFetch<Course>(`/courses/${id}`, { method: 'PUT', body: dto, auth: true })
}

export function deactivateCourse(id: string): Promise<void> {
  return apiFetch<void>(`/courses/${id}`, { method: 'DELETE', auth: true })
}

export function assignTeacherToCourse(courseId: string, teacherId: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}/teachers/add`, { method: 'PATCH', body: { teacherId }, auth: true })
}

export function removeTeacherFromCourse(courseId: string, teacherId: string): Promise<Course> {
  return apiFetch<Course>(`/courses/${courseId}/teachers/remove`, { method: 'PATCH', body: { teacherId }, auth: true })
}

export function getEnrollmentsByCourse(courseId: string): Promise<CourseEnrollment[]> {
  return apiFetch<CourseEnrollment[]>(`/enrollments/by-course/${courseId}`, { auth: true })
}
