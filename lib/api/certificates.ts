import { apiFetch } from '@/lib/api'

export interface Certificate {
  _id: string
  userId: string
  courseId: string
  courseName?: string
  language?: string
  level?: string
  issuedAt: string
  certificateUrl?: string
}

export function getMyCertificates(): Promise<Certificate[]> {
  return apiFetch<Certificate[]>('/certificates/me', { auth: true })
}
