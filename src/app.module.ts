import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { dbConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { throttlerConfig } from './config/throttler.config';
import { EnvironmentConfigService } from './modules/environment-config/environment-config';
import { AppController } from './app.controller';
import { EnvironmentConfigModule } from './modules/environment-config/environment-config.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validationSchema } from './config/app-validation.schema';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvironmentConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [EnvironmentConfigService],
})
export class AppModule {}
