import { apiFetch } from '@/lib/api'

export interface UpdateProgressDto {
  moduleId: string
  partId?: string
  materialId?: string
  isCompleted?: boolean
  score?: number
}

export interface Progress {
  _id: string
  userId: string
  enrollmentId: string
  moduleId: string
  partId?: string
  materialId?: string
  eventType?: 'viewed' | 'completed'
  isCompleted: boolean
  score: number
  completedAt?: string
}

export function getEnrollmentProgress(enrollmentId: string): Promise<Progress[]> {
  return apiFetch<Progress[]>(`/enrollments/${enrollmentId}/progress`, { auth: true })
}

export function updateProgress(enrollmentId: string, dto: UpdateProgressDto): Promise<Progress> {
  return apiFetch<Progress>(`/enrollments/${enrollmentId}/progress`, {
    method: 'PUT',
    body: dto,
    auth: true,
  })
}
