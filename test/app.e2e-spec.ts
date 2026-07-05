import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import { App } from 'supertest/types';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { ResponseInterceptor } from './../src/common/interceptors/response.interceptor';
import { RequestIdMiddleware } from './../src/common/middleware/request-id.middleware';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req: Request, res: Response, next: NextFunction) =>
      new RequestIdMiddleware().use(req, res, next),
    );
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          success: true,
          statusCode: 200,
          message: 'OK',
          data: 'V1 API is running!',
        });
        expect(response.headers['x-request-id']).toBeDefined();
      });
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        const body = response.body as { data: { status: string } };
        expect(body.data.status).toBe('ok');
      });
  });
});
