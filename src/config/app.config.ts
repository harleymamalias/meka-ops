import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4001,
  apiPrefix: process.env.API_PREFIX || 'api',
}));
