import { apiFetch } from '@/lib/api'

export interface Material {
  _id: string
  title: string
  fileUrl: string
  fileType: string
  courseId: string
  moduleId?: string
  uploadedBy: string
  createdAt: string
}

export function getMaterials(courseId?: string): Promise<Material[]> {
  const qs = courseId ? `?courseId=${courseId}` : ''
  return apiFetch<Material[]>(`/materials${qs}`, { auth: true })
}

export function uploadMaterial(formData: FormData): Promise<Material> {
  return apiFetch<Material>('/materials', {
    method: 'POST',
    body: formData,
    auth: true,
    multipart: true,
  })
}

export function deleteMaterial(id: string): Promise<void> {
  return apiFetch<void>(`/materials/${id}`, { method: 'DELETE', auth: true })
}
