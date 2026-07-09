import { apiFetch } from '@/lib/api'

export interface Session {
  _id: string
  studentId: string
  teacherId: string
  teacherName?: string
  language?: string
  level?: string
  scheduledAt: string
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  zoomLink?: string
}

export interface BookSessionDto {
  teacherId: string
  courseId: string
  scheduledAt: string // ISO string
}

export function getMySessions(): Promise<Session[]> {
  return apiFetch<Session[]>('/sessions/me', { auth: true })
}

export function bookSession(dto: BookSessionDto): Promise<Session> {
  return apiFetch<Session>('/sessions/book', { method: 'POST', body: dto, auth: true })
}

export function cancelSession(id: string): Promise<void> {
  return apiFetch<void>(`/sessions/${id}/cancel`, { method: 'PATCH', auth: true })
}

export function getAvailability(teacherId: string, date: string): Promise<string[]> {
  return apiFetch<string[]>(`/sessions/availability?teacherId=${teacherId}&date=${date}`, { auth: true })
}
