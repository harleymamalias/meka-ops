import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceRequestStatusBadge } from '@/features/service-requests';
import { cn } from '@/lib/utils';
import { DashboardSectionHeader } from '@/features/dashboard/components/DashboardSectionHeader/DashboardSectionHeader';
import { floorJobs, type DashboardTone } from '../../data';

type BoardFilter = 'all' | 'attention' | 'completed';

const filters: Array<{ label: string; value: BoardFilter }> = [
  { label: 'All jobs', value: 'all' },
  { label: 'Needs attention', value: 'attention' },
  { label: 'Completed', value: 'completed' },
];

const toneClasses: Record<DashboardTone, string> = {
  primary: 'bg-primary',
  info: 'bg-info',
  warning: 'bg-warning',
  success: 'bg-success',
  destructive: 'bg-destructive',
};

export function ServiceBoard() {
  const [filter, setFilter] = useState<BoardFilter>('all');
  const visibleJobs = useMemo(
    () =>
      floorJobs.filter(
        (job) =>
          filter === 'all' ||
          (filter === 'attention' && job.status !== 'COMPLETED') ||
          (filter === 'completed' && job.status === 'COMPLETED'),
      ),
    [filter],
  );

  return (
    <Card
      className="overflow-hidden shadow-none"
      aria-labelledby="service-board-title"
    >
      <DashboardSectionHeader
        eyebrow="Live work queue"
        title="Service board"
        titleId="service-board-title"
        description="A quick read of every vehicle currently in motion."
        action={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/service-requests">
              Open queue
              <ArrowUpRight />
            </Link>
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 border-y px-5">
        <div
          className="flex gap-5 overflow-x-auto"
          role="tablist"
          aria-label="Service board filters"
        >
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              className={cn(
                'relative shrink-0 py-3 text-xs text-muted-foreground hover:text-foreground',
                filter === item.value &&
                  'text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary',
              )}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {visibleJobs.length} visible
        </span>
      </div>

      <div className="divide-y">
        {visibleJobs.map((job) => (
          <Link
            key={job.id}
            to={`/dashboard/service-requests/${job.id}`}
            className="grid min-h-24 grid-cols-[3px_minmax(0,1fr)_auto] items-center gap-4 pr-4 transition-colors hover:bg-muted/50 sm:grid-cols-[3px_minmax(0,1fr)_minmax(140px,0.35fr)_16px]"
          >
            <span
              className={cn('h-full', toneClasses[job.tone])}
              aria-hidden="true"
            />

            <div className="min-w-0 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary">
                  {job.id}
                </span>
                <ServiceRequestStatusBadge status={job.status} />
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {job.bay}
                </span>
              </div>
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <strong className="truncate text-sm font-medium text-foreground">
                  {job.vehicle}
                </strong>
                <span className="truncate text-xs text-muted-foreground">
                  {job.customer}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      'block h-full',
                      toneClasses[job.tone],
                      job.progressClassName,
                    )}
                  />
                </span>
                <small className="text-[10px] text-muted-foreground">
                  {job.progress}% complete
                </small>
              </div>
            </div>

            <div className="hidden text-right text-xs sm:block">
              <span className="block text-muted-foreground">
                {job.mechanic}
              </span>
              <strong className="mt-1 block font-medium text-foreground">
                {job.eta}
              </strong>
            </div>
            <ChevronRight className="hidden size-4 text-muted-foreground sm:block" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
