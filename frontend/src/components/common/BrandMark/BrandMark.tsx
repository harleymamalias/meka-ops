import { cn } from '@/lib/utils';

export function BrandMark({
  inverse = false,
  className,
}: {
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-grid size-8 place-items-center rounded-md border border-primary bg-primary text-base font-bold leading-none text-primary-foreground',
        inverse &&
          'border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground',
        className,
      )}
      aria-hidden="true"
    >
      M
    </span>
  );
}
