import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sessionService } from '@/services/session.service';
import { httpApi } from './http.api';

const session = {
  user: {
    id: 'user-1',
    email: 'owner@mekaops.test',
    firstName: 'Harley',
    lastName: 'Mamalias',
    role: 'ADMIN',
  },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function successResponse<T>(data: T) {
  return {
    success: true as const,
    statusCode: 200,
    message: 'OK',
    data,
    timestamp: '2026-07-24T00:00:00.000Z',
  };
}

describe('httpApi', () => {
  beforeEach(() => {
    sessionService.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps successful responses and sends the current access token', async () => {
    sessionService.set(session);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(successResponse({ id: 'vehicle-1' })));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      httpApi.get<{ id: string }>('/vehicles/vehicle-1'),
    ).resolves.toEqual({
      id: 'vehicle-1',
    });

    const [, request] = fetchMock.mock.calls[0];
    expect(new Headers(request?.headers).get('Authorization')).toBe(
      'Bearer access-token',
    );
  });

  it('normalizes API failures', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          success: false,
          statusCode: 422,
          message: ['Plate number is required.', 'Year must be valid.'],
          error: 'Unprocessable Entity',
          path: '/api/vehicles',
          timestamp: '2026-07-24T00:00:00.000Z',
          requestId: 'request-1',
        },
        422,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const request = httpApi.post('/vehicles', {});

    await expect(request).rejects.toMatchObject({
      message: 'Plate number is required. Year must be valid.',
      statusCode: 422,
      requestId: 'request-1',
    });
  });

  it('refreshes an expired session once and retries the request', async () => {
    sessionService.set(session);
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse(
          {
            success: false,
            statusCode: 401,
            message: 'Unauthorized',
            error: 'Unauthorized',
            path: '/api/vehicles',
            timestamp: '2026-07-24T00:00:00.000Z',
          },
          401,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          successResponse({
            accessToken: 'refreshed-access-token',
            refreshToken: 'refreshed-refresh-token',
          }),
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(successResponse([{ id: 'vehicle-1' }])),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      httpApi.get<Array<{ id: string }>>('/vehicles'),
    ).resolves.toEqual([{ id: 'vehicle-1' }]);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const [, retriedRequest] = fetchMock.mock.calls[2];
    expect(new Headers(retriedRequest?.headers).get('Authorization')).toBe(
      'Bearer refreshed-access-token',
    );
  });
});
