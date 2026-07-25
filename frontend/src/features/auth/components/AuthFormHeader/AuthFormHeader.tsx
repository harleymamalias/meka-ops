interface AuthFormHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthFormHeader({
  description,
  eyebrow,
  title,
}: AuthFormHeaderProps) {
  return (
    <header className="mb-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
