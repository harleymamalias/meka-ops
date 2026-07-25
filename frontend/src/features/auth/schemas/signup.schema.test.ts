import { describe, expect, it } from 'vitest';
import { signupSchema } from './signup.schema';

const validSignup = {
  firstName: 'Harley',
  lastName: 'Mamalias',
  email: 'harley@mekaops.test',
  password: 'secure-pass',
  confirmPassword: 'secure-pass',
};

describe('signupSchema', () => {
  it('accepts matching account details', () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: 'another-pass',
    });

    expect(result.success).toBe(false);
  });
});
