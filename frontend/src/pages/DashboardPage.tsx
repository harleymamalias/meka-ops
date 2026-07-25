import { Gauge, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { BrandMark } from '@/components/common/BrandMark/BrandMark';
import { Button } from '@/components/ui/button';
import {
  AttentionQueue,
  BayCadence,
  MetricRail,
  OperationsPulse,
  PartsToWatch,
  ServiceBoard,
} from '@/features/dashboard';

function formatDate() {
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
}

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] pb-6">
      <header className="pb-6">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-success" />
            Live operations
          </span>
          <span>{formatDate()}</span>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Good evening, Harley<span className="text-primary">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              The shop is in motion. Here&apos;s where your attention will have
              the most impact.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Gauge />
              Shift view
            </Button>
            <Button asChild>
              <Link to="/dashboard/service-requests/new">
                <Plus />
                New request
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
        <OperationsPulse />
        <MetricRail />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_0.6fr]">
        <ServiceBoard />
        <AttentionQueue />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.4fr_0.6fr]">
        <BayCadence />
        <PartsToWatch />
      </div>

      <footer className="mt-6 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <BrandMark className="size-6 text-xs" />
          MekaOps operations console
        </span>
        <span>Built for the people keeping the shop moving.</span>
      </footer>
    </div>
  );
}

export { DashboardPage as Component };
