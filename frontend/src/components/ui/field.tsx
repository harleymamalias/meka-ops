import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
}

interface FieldLabelProps {
  children: ReactNode;
  htmlFor: string;
  className?: string;
}

export function Field({ className, invalid = false, ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      data-invalid={invalid || undefined}
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
}

export function FieldLabel({ children, className, htmlFor }: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={cn('text-foreground', className)}>
      {children}
    </Label>
  );
}

export function FieldDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-xs leading-4 text-muted-foreground', className)}
      {...props}
    />
  );
}

export function FieldError({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  if (!children) {
    return null;
  }

  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn('text-xs leading-4 text-destructive', className)}
      {...props}
    >
      {children}
    </p>
  );
}
