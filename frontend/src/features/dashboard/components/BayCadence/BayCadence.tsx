import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DashboardSectionHeader } from '@/features/dashboard/components/DashboardSectionHeader/DashboardSectionHeader';
import { cadenceItems } from '../../data';

const timeLabels = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

export function BayCadence() {
  return (
    <Card
      className="overflow-hidden shadow-none"
      aria-labelledby="cadence-title"
    >
      <DashboardSectionHeader
        eyebrow="Shop rhythm"
        title="Bay cadence"
        titleId="cadence-title"
        action={
          <Button variant="outline" size="sm">
            <CalendarDays />
            Today
          </Button>
        }
      />

      <div className="border-t px-5 py-4">
        <div className="grid grid-cols-[64px_repeat(6,minmax(40px,1fr))] text-[10px] text-muted-foreground">
          <span />
          {timeLabels.map((time) => (
            <span key={time}>{time}</span>
          ))}
        </div>

        <div className="mt-3 space-y-3">
          {cadenceItems.map((item) => (
            <div
              key={item.bay}
              className="grid grid-cols-[64px_repeat(6,minmax(40px,1fr))] items-center"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {item.bay}
              </span>
              <div className="col-span-6 grid h-10 grid-cols-6 border-l border-dashed bg-muted/40">
                <span
                  className={cn(
                    'flex min-w-0 items-center justify-between gap-2 rounded-md bg-accent px-3 text-xs text-accent-foreground',
                    item.placement,
                  )}
                >
                  <strong className="truncate font-medium">{item.label}</strong>
                  <small>{item.duration}</small>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
