import { describe, expect, it } from 'vitest';
import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'advisor@mekaops.test',
      password: 'secure-pass',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'short',
    });

    expect(result.success).toBe(false);
  });
});
