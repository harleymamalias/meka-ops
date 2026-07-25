import { ArrowUpRight, Package } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DashboardSectionHeader } from '@/features/dashboard/components/DashboardSectionHeader/DashboardSectionHeader';
import { partsToWatch } from '../../data';

export function PartsToWatch() {
  return (
    <Card className="overflow-hidden shadow-none" aria-labelledby="parts-title">
      <DashboardSectionHeader
        eyebrow="Inventory signal"
        title="Parts to watch"
        titleId="parts-title"
        action={
          <Link
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            to="/dashboard/inventory"
          >
            View inventory
            <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />

      <div className="divide-y border-t">
        {partsToWatch.map((part) => (
          <div key={part.name} className="flex items-center gap-3 px-5 py-4">
            <span className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
              <Package className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-medium text-foreground">
                {part.name}
              </strong>
              <span className="mt-1 block text-xs text-muted-foreground">
                {part.stock}
              </span>
            </div>
            <Badge variant={part.variant}>{part.level}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
