import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import { REQUEST_ID_HEADER } from '../middleware/request-id.middleware';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Something went wrong. Please try again.';
    let error = 'Internal Server Error';
    const requestId = request.headers[REQUEST_ID_HEADER] as string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const { message: resMessage, error: resError } = res as Record<
          string,
          unknown
        >;
        if (typeof resMessage === 'string' || Array.isArray(resMessage)) {
          message = resMessage as string | string[];
        }
        if (typeof resError === 'string') error = resError;
      } else if (typeof res === 'string') {
        message = res;
      }
    }

    this.logger.error({
      statusCode: status,
      message,
      path: request.url,
      method: request.method,
      requestId,
      exception,
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
