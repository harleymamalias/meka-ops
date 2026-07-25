import { ArrowLeft, Construction } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';

export function PlaceholderPage() {
  const location = useLocation();
  const label =
    location.pathname.split('/')[1]?.replaceAll('-', ' ') || 'this view';

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <Construction className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold capitalize">{label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This workspace is part of the next implementation milestone. The
          shared foundation is ready for the feature workflow.
        </p>
        <Button variant="outline" asChild className="mt-6">
          <Link to="/dashboard">
            <ArrowLeft />
            Back to overview
          </Link>
        </Button>
      </div>
    </div>
  );
}
