export interface ApiResponse<T> {
  success: true
  statusCode: number
  message: string
  data: T
  timestamp: string
  requestId?: string
}

export function unwrapApiResponse<T>(payload: ApiResponse<T>): T {
  return payload.data
}
