import type { ReactNode } from 'react';

interface DashboardSectionHeaderProps {
  eyebrow: string;
  title: string;
  titleId?: string;
  description?: string;
  action?: ReactNode;
}

export function DashboardSectionHeader({
  action,
  description,
  eyebrow,
  title,
  titleId,
}: DashboardSectionHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 p-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
        <h2
          id={titleId}
          className="mt-2 text-base font-semibold text-foreground"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}
