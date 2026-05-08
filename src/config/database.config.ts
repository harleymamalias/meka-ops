import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //   synchronize: process.env.TYPEORM_SYNC === 'true', // for dev only!
  //   logging: process.env.TYPEORM_LOGGING === 'true',
}));
