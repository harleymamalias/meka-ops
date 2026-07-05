import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const rawId = req.headers[REQUEST_ID_HEADER];
    const reqId: string = (Array.isArray(rawId) ? rawId[0] : rawId) ?? randomUUID();
    req.headers[REQUEST_ID_HEADER] = reqId;
    res.setHeader(REQUEST_ID_HEADER, reqId);
    next();
  }
}
