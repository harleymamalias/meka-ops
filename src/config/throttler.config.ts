import { registerAs } from '@nestjs/config';

export const throttlerConfig = registerAs('throttler', () => ({
  ttl: process.env.THROTTLE_TTL || 60,
  limit: process.env.THROTTLE_LIMIT || 50,
}));
