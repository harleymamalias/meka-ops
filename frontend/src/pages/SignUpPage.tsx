import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { registerAccount } from '@/api/auth.api';
import {
  AuthFormFooter,
  AuthFormHeader,
  FormError,
  PasswordField,
  signupSchema,
  type SignupFormValues,
} from '@/features/auth';
import { sessionService } from '@/services/session.service';

export function SignUpPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      sessionService.set(
        await registerAccount({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      );
      toast.success('Your MekaOps workspace is ready.');
      navigate('/dashboard');
    } catch {
      setError('root', {
        message:
          'We could not create the account. Review your details and try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-xl">
      <AuthFormHeader
        eyebrow="Start with clarity"
        title="Create your shop account."
        description="Bring your service floor, inventory, and customer promises into one place."
      />

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field invalid={Boolean(errors.firstName)}>
            <FieldLabel htmlFor="signup-first-name">First name</FieldLabel>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="signup-first-name"
                autoComplete="given-name"
                placeholder="Harley"
                aria-invalid={Boolean(errors.firstName)}
                className="pl-10"
                {...register('firstName')}
              />
            </div>
            <FieldError>{errors.firstName?.message}</FieldError>
          </Field>

          <Field invalid={Boolean(errors.lastName)}>
            <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
            <Input
              id="signup-last-name"
              autoComplete="family-name"
              placeholder="Mamalias"
              aria-invalid={Boolean(errors.lastName)}
              {...register('lastName')}
            />
            <FieldError>{errors.lastName?.message}</FieldError>
          </Field>
        </div>

        <Field invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="signup-email">Work email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="you@shop.com"
              aria-invalid={Boolean(errors.email)}
              className="pl-10"
              {...register('email')}
            />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordField
            id="signup-password"
            label="Password"
            placeholder="8+ characters"
            autoComplete="new-password"
            registration={register('password')}
            error={errors.password?.message}
          />
          <PasswordField
            id="signup-confirm-password"
            label="Confirm password"
            placeholder="Repeat password"
            autoComplete="new-password"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <FormError message={errors.root?.message} />

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ArrowRight />
          )}
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <AuthFormFooter
        prompt="Already have an account?"
        linkLabel="Sign in"
        linkTo="/login"
        note="Roles and shop permissions are assigned by an administrator after registration."
      />
    </div>
  );
}

export { SignUpPage as Component };
