import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders an accessible button with its label', () => {
    render(<Button>Save changes</Button>);

    expect(screen.getByRole('button', { name: 'Save changes' })).toBeVisible();
  });

  it('supports disabled state', () => {
    render(<Button disabled>Submit</Button>);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
