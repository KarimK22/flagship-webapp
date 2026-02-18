import { env } from '@/env'
import { ApiError } from '@/services/api'
import { makeRequestId } from './req-headers'

export async function callApi<T>({
  path,
  body,
  method,
  headers,
}: {
  path: string
  body?: object
  headers?: Record<string, string>
  method: 'POST' | 'DELETE' | 'GET'
}): Promise<T> {
  const timestamp = new Date().getTime()

  const response = await fetch(`${env.api.baseUrl}${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ['X-Request-Id']: makeRequestId(),
      ['X-Request-Timestamp']: timestamp.toString(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const responseJson = await response.json()

  if (!response.ok) {
    const { error } = responseJson as {
      error: {
        message: string
        issues: unknown
        metadata?: Record<string, unknown>
      }
    }
    console.error({ apiError: error })
    if (error.issues) {
      throw new ApiError('Validation failed', { issues: error.issues })
    } else if (error.message) {
      throw new ApiError(error.message, error.metadata)
    } else {
      throw new ApiError('Unknown error', { error: error })
    }
  }

  return responseJson as T
}
