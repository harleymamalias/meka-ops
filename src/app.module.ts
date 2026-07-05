import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { dbConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { throttlerConfig } from './config/throttler.config';
import { EnvironmentConfigService } from './modules/environment-config/environment-config';
import { AppController } from './app.controller';
import { EnvironmentConfigModule } from './modules/environment-config/environment-config.module';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validationSchema } from './config/app-validation.schema';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from 'nestjs-pino';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { MaintenanceRecordsModule } from './modules/maintenance-records/maintenance-records.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoicesModule } from './modules/invoices/invoices.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig, throttlerConfig],
      validationSchema,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(process.env.THROTTLE_TTL) || 60,
          limit: Number(process.env.THROTTLE_LIMIT) || 50,
        },
      ],
      errorMessage: 'Too many requests. Please wait a moment and try again.',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    VehiclesModule,
    ServiceRequestsModule,
    MaintenanceRecordsModule,
    InventoryModule,
    InvoicesModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'prod'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvironmentConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
  exports: [EnvironmentConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
