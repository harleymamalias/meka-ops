import { CircleGauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { floorJobs, type FloorJobTone } from '../../data';

const toneClasses: Record<
  FloorJobTone,
  { rail: string; text: string; progress: string }
> = {
  primary: {
    rail: 'bg-sidebar-primary',
    text: 'text-sidebar-primary',
    progress: 'bg-sidebar-primary',
  },
  info: {
    rail: 'bg-info',
    text: 'text-info',
    progress: 'bg-info',
  },
  warning: {
    rail: 'bg-warning',
    text: 'text-warning',
    progress: 'bg-warning',
  },
};

export function FloorSnapshot() {
  return (
    <Card className="overflow-hidden border-sidebar-border bg-sidebar-accent text-sidebar-foreground shadow-md">
      <header className="flex items-start justify-between border-b border-sidebar-border p-5 sm:p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-sidebar-foreground/45">
            Operations / Today
          </p>
          <h2 className="mt-2 text-base font-semibold">Floor snapshot</h2>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-sidebar-primary">
          <span className="size-2 rounded-full bg-sidebar-primary" />
          Live
        </span>
      </header>

      <div className="grid grid-cols-3 border-b border-sidebar-border">
        <SnapshotMetric label="Active work" value="18" />
        <SnapshotMetric label="Floor efficiency" value="82%" />
        <SnapshotMetric label="Bays active" value="07/12" />
      </div>

      <div className="divide-y divide-sidebar-border/70 py-2">
        {floorJobs.map((job) => {
          const tone = toneClasses[job.tone];

          return (
            <div key={job.id} className="flex gap-4 px-5 py-3.5 sm:px-6">
              <span
                className={cn('w-0.5 shrink-0', tone.rail)}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4 text-[11px] text-sidebar-foreground/45">
                  <span>{job.id}</span>
                  <span className={tone.text}>{job.status}</span>
                </div>
                <p className="mt-1.5 truncate text-sm font-medium">
                  {job.vehicle}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-sidebar-foreground/45">
                  <span>{job.bay}</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="mt-1.5 h-0.5 overflow-hidden bg-sidebar-border">
                  <span
                    className={cn(
                      'block h-full',
                      tone.progress,
                      job.progressClassName,
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="flex items-center gap-2 border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/50 sm:px-6">
        <CircleGauge className="size-4 text-sidebar-primary" />
        MekaOps keeps the next move visible.
      </footer>
    </Card>
  );
}

function SnapshotMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-sidebar-border p-4 last:border-r-0 sm:p-5">
      <p className="text-[11px] leading-4 text-sidebar-foreground/45">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        {value}
      </p>
    </div>
  );
}
