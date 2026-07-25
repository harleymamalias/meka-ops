import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/api/auth.api';
import {
  AuthFormFooter,
  AuthFormHeader,
  FormError,
  loginSchema,
  PasswordField,
  type LoginFormValues,
} from '@/features/auth';
import { sessionService } from '@/services/session.service';

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      sessionService.set(await login(values));
      toast.success('Welcome back to MekaOps.');
      navigate('/dashboard');
    } catch {
      setError('root', {
        message: 'We could not sign you in. Check your details and try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <AuthFormHeader
        eyebrow="Welcome back"
        title="Sign in to your shop."
        description="Pick up where the floor left off."
      />

      <div className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground">
        <span className="size-2 rounded-full bg-success" />
        <span>Live operations console</span>
        <span className="h-px w-6 bg-border" />
        <span>Secure access</span>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="login-email">Work email</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-email"
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

        <PasswordField
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          registration={register('password')}
          error={errors.password?.message}
          showRecovery
          onRecovery={() =>
            toast.info('Password recovery will be connected next.')
          }
        />

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
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <AuthFormFooter
        prompt="New to MekaOps?"
        linkLabel="Create an account"
        linkTo="/signup"
        note="By continuing, you agree to use MekaOps for authorized shop operations only."
      />
    </div>
  );
}

export { LoginPage as Component };
