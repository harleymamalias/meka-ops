import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface AuthFormFooterProps {
  prompt: string;
  linkLabel: string;
  linkTo: string;
  note: string;
}

export function AuthFormFooter({
  linkLabel,
  linkTo,
  note,
  prompt,
}: AuthFormFooterProps) {
  return (
    <footer className="mt-7 text-center">
      <p className="text-sm text-muted-foreground">
        {prompt}{' '}
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 font-medium text-primary"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      </p>
      <p className="mx-auto mt-4 max-w-sm text-xs leading-5 text-muted-foreground/80">
        {note}
      </p>
    </footer>
  );
}
