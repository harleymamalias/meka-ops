export class ApiError extends Error {
  public readonly status: number
  public readonly requestId?: string

  constructor(
    message: string,
    status: number,
    requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.requestId = requestId
  }
}
