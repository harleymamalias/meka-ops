import { env } from '@/lib/env'
import { ApiError } from './errors'
import type { ApiResponse } from './response'
import { unwrapApiResponse } from './response'

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${env.VITE_API_URL}${path}`, {
    ...init,
    headers,
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | { message?: string; requestId?: string } | null

  if (!response.ok) {
    throw new ApiError(
      payload && 'message' in payload && payload.message ? payload.message : 'The request could not be completed.',
      response.status,
      payload && 'requestId' in payload ? payload.requestId : undefined,
    )
  }

  return unwrapApiResponse(payload as ApiResponse<T>)
}
