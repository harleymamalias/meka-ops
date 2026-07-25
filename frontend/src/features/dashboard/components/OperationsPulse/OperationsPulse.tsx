import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { activityBars } from '../../data';

export function OperationsPulse() {
  return (
    <Card className="min-h-60 border-sidebar-border bg-sidebar p-6 text-sidebar-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-primary">
            Operational pulse
          </p>
          <h2 className="mt-2 text-base font-semibold">The floor is moving.</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-primary/25 px-2.5 py-1 text-xs text-sidebar-primary">
          <span className="size-1.5 rounded-full bg-sidebar-primary" />
          Live
        </span>
      </div>

      <div className="mt-6 flex items-end gap-4">
        <p className="text-5xl font-semibold leading-none tracking-tight">
          82<span className="text-xl text-sidebar-primary">%</span>
        </p>
        <div className="pb-1 text-xs text-sidebar-foreground/55">
          <p>Today&apos;s floor efficiency</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-sidebar-primary">
            <Activity className="size-3.5" />
            +8.4% vs. last week
          </p>
        </div>
      </div>

      <div
        className="mt-5 flex h-12 items-end gap-1.5"
        aria-label="Floor efficiency trend"
      >
        <span className="sr-only">
          Floor efficiency trend over the last twelve readings
        </span>
        {activityBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={cn(
              'min-w-1 flex-1 rounded-sm bg-sidebar-primary/25',
              height,
              index === activityBars.length - 1 && 'bg-sidebar-primary',
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sidebar-border pt-3 text-[11px] text-sidebar-foreground/50">
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-sidebar-primary" />7 of 12
          bays active
        </span>
        <span>Last synced just now</span>
      </div>
    </Card>
  );
}
