import { env } from '@/config/env';
import { sessionService } from '@/services/session.service';
import { ApiError } from './ApiError';
import type { ApiErrorResponse, ApiResponse } from './response';
import { unwrapApiResponse } from './response';

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  authenticated?: boolean;
}

interface RefreshTokens {
  accessToken: string;
  refreshToken: string;
}

const DEFAULT_ERROR_MESSAGE = 'The request could not be completed.';

class HttpApi {
  private readonly baseUrl: string;
  private refreshRequest: Promise<void> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  private async request<T>(
    path: string,
    init: RequestInit & Pick<RequestOptions, 'authenticated'>,
    allowRefresh = true,
  ): Promise<T> {
    const { authenticated = true, ...requestInit } = init;
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...requestInit,
      credentials: 'include',
      headers: this.createHeaders(
        requestInit.headers,
        authenticated,
        requestInit.body,
      ),
    });

    if (
      response.status === 401 &&
      authenticated &&
      allowRefresh &&
      sessionService.get()
    ) {
      await this.refreshSession();
      return this.request<T>(path, init, false);
    }

    const payload = (await response.json().catch(() => null)) as
      | ApiResponse<T>
      | ApiErrorResponse
      | null;

    if (!response.ok || !payload || payload.success === false) {
      throw this.createError(response.status, payload);
    }

    return unwrapApiResponse(payload);
  }

  private createHeaders(
    initialHeaders: HeadersInit | undefined,
    authenticated: boolean,
    body: BodyInit | null | undefined,
  ) {
    const headers = new Headers(initialHeaders);
    headers.set('Accept', 'application/json');

    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const accessToken = sessionService.get()?.accessToken;
    if (authenticated && accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  private async refreshSession() {
    if (!this.refreshRequest) {
      this.refreshRequest = this.performRefresh().finally(() => {
        this.refreshRequest = null;
      });
    }

    return this.refreshRequest;
  }

  private async performRefresh() {
    const refreshToken = sessionService.get()?.refreshToken;
    if (!refreshToken) {
      sessionService.clear();
      throw new ApiError('Your session has expired.', 401);
    }

    try {
      const tokens = await this.request<RefreshTokens>(
        '/auth/refresh',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
          authenticated: false,
        },
        false,
      );
      sessionService.updateTokens(tokens);
    } catch (error) {
      sessionService.clear();
      throw error;
    }
  }

  private createError(
    statusCode: number,
    payload: ApiResponse<unknown> | ApiErrorResponse | null,
  ) {
    const message = payload?.message;
    const normalizedMessage = Array.isArray(message)
      ? message.join(' ')
      : message;

    return new ApiError(
      normalizedMessage || DEFAULT_ERROR_MESSAGE,
      statusCode,
      payload?.requestId,
    );
  }
}

export const httpApi = new HttpApi(env.VITE_API_URL);
