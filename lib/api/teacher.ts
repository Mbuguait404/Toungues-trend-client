import { apiFetch } from '@/lib/api'
import type { Session } from './sessions'
import type { Material } from './materials'

export interface TeacherLearner {
  _id: string
  name: string
  email: string
  course?: string
  level?: string
  progress?: number
  lastActive?: string
}

/** Get sessions for the logged-in teacher */
export function getTeacherSessions(): Promise<Session[]> {
  return apiFetch<Session[]>('/sessions/me', { auth: true })
}

/** Get students enrolled in the teacher's courses (via enrollments endpoint) */
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
