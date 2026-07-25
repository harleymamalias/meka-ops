import { ChevronRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DashboardSectionHeader } from '@/features/dashboard/components/DashboardSectionHeader/DashboardSectionHeader';
import { attentionItems, type DashboardTone } from '../../data';

const toneClasses: Record<DashboardTone, string> = {
  primary: 'bg-accent text-primary',
  info: 'bg-info-muted text-info',
  warning: 'bg-warning-muted text-warning',
  success: 'bg-success-muted text-success',
  destructive: 'bg-destructive/10 text-destructive',
};

export function AttentionQueue() {
  return (
    <Card
      className="overflow-hidden shadow-none"
      aria-labelledby="attention-title"
    >
      <DashboardSectionHeader
        eyebrow="Small moves, big flow"
        title="Attention queue"
        titleId="attention-title"
        action={
          <span className="text-xl font-semibold text-muted-foreground/40">
            03
          </span>
        }
      />

      <div className="divide-y border-t">
        {attentionItems.map(({ detail, icon: Icon, title, tone }, index) => (
          <button
            key={title}
            type="button"
            className="grid w-full grid-cols-[24px_32px_minmax(0,1fr)_16px] items-center gap-3 px-5 py-4 text-left hover:bg-muted/50"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              0{index + 1}
            </span>
            <span
              className={cn(
                'grid size-8 place-items-center rounded-md',
                toneClasses[tone],
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm font-medium text-foreground">
                {title}
              </strong>
              <small className="mt-1 block truncate text-xs text-muted-foreground">
                {detail}
              </small>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
        <Sparkles className="size-4 text-primary" />
        MekaOps has your next move.
      </div>
    </Card>
  );
}
