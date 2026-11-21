import { apiFetch } from '@/lib/api'

export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'SPAM'

export interface Inquiry {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: InquiryStatus
  adminNotes?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

export type InquiryStats = Record<InquiryStatus, number>

export interface CreateInquiryInput {
  name: string
  email: string
  subject: string
  message: string
}

export function createInquiry(data: CreateInquiryInput): Promise<Inquiry> {
  return apiFetch<Inquiry>('/inquiries', { method: 'POST', body: data })
}

export function getAllInquiries(query?: Record<string, string>): Promise<Inquiry[]> {
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  return apiFetch<Inquiry[]>(`/inquiries${qs}`, { auth: true })
}

export function getInquiryStats(): Promise<InquiryStats> {
  return apiFetch<InquiryStats>('/inquiries/stats', { auth: true })
}

export function updateInquiry(
  id: string,
  data: Partial<Pick<Inquiry, 'status' | 'adminNotes'>>,
): Promise<Inquiry> {
  return apiFetch<Inquiry>(`/inquiries/${id}`, { method: 'PATCH', body: data, auth: true })
}

export function deleteInquiry(id: string): Promise<Inquiry> {
  return apiFetch<Inquiry>(`/inquiries/${id}`, { method: 'DELETE', auth: true })
}