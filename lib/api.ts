/**
 * Central API client for Tongues Trend.
 * - All requests go to NEXT_PUBLIC_API_URL
 * - Access token stored in memory (refreshed on page load)
 * - Refresh token stored in httpOnly cookie (set by server)
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

/** In-memory access token store (cleared on page reload, re-fetched via refresh cookie) */
let _accessToken: string | null = null

export function setAccessToken(token: string | null) {
  _accessToken = token
}

export function getAccessToken(): string | null {
  return _accessToken
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
  errors?: string[]
}

export class ApiException extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiException'
  }
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
  multipart?: boolean
}

async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // sends httpOnly refresh_token cookie
    })
    if (!res.ok) return false
    const data = await res.json()
    // API response is wrapped: { data: { accessToken, user } }
    const payload = data.data ?? data
    if (payload.accessToken) {
      setAccessToken(payload.accessToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = false, multipart = false } = options

  const headers: Record<string, string> = {}

  if (auth && _accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`
  }

  if (body && !multipart) {
    headers['Content-Type'] = 'application/json'
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
    ...(body ? { body: multipart ? (body as FormData) : JSON.stringify(body) } : {}),
  }

  let res = await fetch(`${BASE_URL}${path}`, fetchOptions)

  // 401 → try token refresh once, then retry
  if (res.status === 401 && auth) {
    const refreshed = await attemptRefresh()
    if (refreshed && _accessToken) {
      headers['Authorization'] = `Bearer ${_accessToken}`
      res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers })
    }
  }

  if (!res.ok) {
    let errMsg = 'An error occurred'
    try {
      const errData = await res.json()
      if (errData.errors && Array.isArray(errData.errors) && errData.errors.length > 0) {
        errMsg = errData.errors.join('\n')
      } else {
        errMsg = errData.message || errMsg
      }
    } catch {}
    throw new ApiException(errMsg, res.status)
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T

  const json = await res.json()
  // Unwrap NestJS TransformResponseInterceptor envelope: { data: T }
  return (json.data ?? json) as T
}
