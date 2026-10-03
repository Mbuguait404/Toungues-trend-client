import { apiFetch } from '@/lib/api'

export interface Subscriber {
  _id: string
  email: string
  status: string
  createdAt: string
}

export interface SubscribeResult {
  subscriber: Subscriber
  created: boolean
}

/**
 * `website` is a honeypot field. Bots fill hidden inputs, so a truthy value means
 * the request should be treated as a no-op rather than rejected.
 */
export function subscribe(email: string, website?: string): Promise<SubscribeResult> {
  return apiFetch<SubscribeResult>('/subscribers', {
    method: 'POST',
    body: { email, website: website ?? '' },
  })
}

export function getAllSubscribers(query?: Record<string, string>): Promise<Subscriber[]> {
  const qs = query ? '?' + new URLSearchParams(query).toString() : ''
  return apiFetch<Subscriber[]>(`/subscribers${qs}`, { auth: true })
}

export function deleteSubscriber(id: string): Promise<Subscriber> {
  return apiFetch<Subscriber>(`/subscribers/${id}`, { method: 'DELETE', auth: true })
}