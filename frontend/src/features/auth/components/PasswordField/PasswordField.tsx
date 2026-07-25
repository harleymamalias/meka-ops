import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface PasswordFieldProps {
  autoComplete: 'current-password' | 'new-password';
  error?: string;
  id: string;
  label: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  showRecovery?: boolean;
  onRecovery?: () => void;
}

export function PasswordField({
  autoComplete,
  error,
  id,
  label,
  onRecovery,
  placeholder,
  registration,
  showRecovery = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {showRecovery && (
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline"
            onClick={onRecovery}
          >
            Forgot password?
          </button>
        )}
      </div>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="px-10"
          {...registration}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground"
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>

      <FieldError>{error}</FieldError>
    </Field>
  );
}
