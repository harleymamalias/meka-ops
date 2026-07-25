import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { metrics, type DashboardTone } from '../../data';

const toneClasses: Record<DashboardTone, string> = {
  primary: 'bg-accent text-primary',
  info: 'bg-info-muted text-info',
  warning: 'bg-warning-muted text-warning',
  success: 'bg-success-muted text-success',
  destructive: 'bg-destructive/10 text-destructive',
};

export function MetricRail() {
  return (
    <section className="grid grid-cols-2 gap-3" aria-label="Shop metrics">
      {metrics.map(({ detail, icon: Icon, label, tone, value }) => (
        <Card
          key={label}
          className="flex min-h-28 items-start gap-3 p-4 shadow-none"
        >
          <div
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-md',
              toneClasses[tone],
            )}
          >
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] leading-4 text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
          </div>
        </Card>
      ))}
    </section>
  );
}
