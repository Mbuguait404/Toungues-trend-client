import { apiFetch, setAccessToken } from './api'

export interface AuthUser {
  _id: string
  name: string
  email: string
  role: 'LEARNER' | 'TEACHER' | 'ADMIN'
  avatarUrl?: string
  country?: string
  phone?: string
  isActive: boolean
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  setAccessToken(res.accessToken)
  return res
}

export async function register(payload: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })
  setAccessToken(res.accessToken)
  return res
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST', auth: true })
  setAccessToken(null)
}

export async function refreshSession(): Promise<AuthResponse | null> {
  try {
    const res = await apiFetch<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
    setAccessToken(res.accessToken)
    return res
  } catch {
    return null
  }
}

export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/users/me', { auth: true })
}

export function roleToPath(role: AuthUser['role']): string {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'TEACHER') return '/teach/dashboard'
  return '/learn/dashboard'
}
