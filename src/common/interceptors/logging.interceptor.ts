import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { REQUEST_ID_HEADER } from '../middleware/request-id.middleware';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const requestId = req.headers[REQUEST_ID_HEADER] as string | undefined;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info(
            {
              req: { method, url, requestId },
              res: { statusCode: res.statusCode },
              responseTime: `${Date.now() - now}ms`,
            },
            `${method} ${url} ${res.statusCode} - ${Date.now() - now}ms`,
          );
        },
        error: (err: unknown) => {
          const errMessage = err instanceof Error ? err.message : String(err);
          this.logger.error(
            {
              req: { method, url, requestId },
              err,
              responseTime: `${Date.now() - now}ms`,
            },
            `${method} ${url} - Error: ${errMessage} (${Date.now() - now}ms)`,
          );
        },
      }),
    );
  }
}
