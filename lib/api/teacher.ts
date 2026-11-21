import { apiFetch } from '@/lib/api'
import type { Session } from './sessions'
import type { Material } from './materials'

// Re-exported so teacher screens can pull their whole vocabulary from one module.
export type { Session }

export interface TeacherLearnerUser {
  _id: string
  name: string
  email?: string
  avatarUrl?: string
  country?: string
  isActive?: boolean
}

export interface TeacherLearnerCourse {
  _id: string
  title?: string
  language?: string
}

/**
 * A row from /enrollments/my-learners — an *enrolment*, not a user record.
 * `userId` and `courseId` arrive populated, but fall back to raw ids when
 * populate() cannot resolve them, so both shapes are modelled here.
 */
export interface TeacherLearner {
  _id: string
  userId: TeacherLearnerUser | string | null
  courseId: TeacherLearnerCourse | string | null
  level?: string
  progress?: number
  status?: string
  startedAt?: string
  createdAt?: string
}

const asObject = <T>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

export function getLearnerUser(l: TeacherLearner): TeacherLearnerUser | null {
  return asObject<TeacherLearnerUser>(l.userId)
}

export function getLearnerName(l: TeacherLearner): string {
  return getLearnerUser(l)?.name ?? 'Learner'
}

export function getLearnerEmail(l: TeacherLearner): string | undefined {
  return getLearnerUser(l)?.email
}

export function getLearnerCourse(l: TeacherLearner): TeacherLearnerCourse | null {
  return asObject<TeacherLearnerCourse>(l.courseId)
}

export function getLearnerCourseTitle(l: TeacherLearner): string {
  return getLearnerCourse(l)?.title ?? 'Enrolled'
}

export function getLearnerLanguage(l: TeacherLearner): string {
  const course = getLearnerCourse(l)
  return course?.language ?? l.level ?? '—'
}

/** Get sessions for the logged-in teacher */
export function getTeacherSessions(): Promise<Session[]> {
  return apiFetch<Session[]>('/sessions/me', { auth: true })
}

/** Get enrolments for learners in the teacher's courses (user + course populated) */
export function getMyLearners(): Promise<TeacherLearner[]> {
  return apiFetch<TeacherLearner[]>('/enrollments/my-learners', { auth: true })
}

/** Upload a material file */
export function uploadMaterial(formData: FormData): Promise<Material> {
  return apiFetch<Material>('/materials', {
    method: 'POST',
    body: formData,
    auth: true,
    multipart: true,
  })
}

/** Upload a YouTube link as material */
export function uploadYoutubeMaterial(
  title: string,
  youtubeUrl: string,
  options: { courseId?: string; moduleId?: string; partId?: string; accessType: 'free' | 'premium' },
): Promise<Material> {
  return apiFetch<Material>('/materials', {
    method: 'POST',
    body: { title, youtubeUrl, ...options },
    auth: true,
  })
}

/** Get materials uploaded by the logged-in teacher */
export function getMyMaterials(): Promise<Material[]> {
  return apiFetch<Material[]>('/materials/my', { auth: true })
}

/** Add session notes */
export function addSessionNotes(sessionId: string, notes: string): Promise<Session> {
  return apiFetch<Session>(`/sessions/${sessionId}/notes`, {
    method: 'PUT',
    body: { notes },
    auth: true,
  })
}
