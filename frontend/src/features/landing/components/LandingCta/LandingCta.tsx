import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { PageContainer } from '@/components/common/PageContainer/PageContainer';
import { Button } from '@/components/ui/button';

export function LandingCta() {
  return (
    <PageContainer className="flex flex-col items-start justify-between gap-8 py-20 sm:flex-row sm:items-end lg:py-24">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Make the next move clear
        </p>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground">
          A better day starts with a better view.
        </h2>
      </div>
      <Button size="lg" asChild className="w-full sm:w-auto">
        <Link to="/signup">
          Create your workspace
          <ArrowRight />
        </Link>
      </Button>
    </PageContainer>
  );
}
