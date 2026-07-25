import { Skeleton } from '@/components/ui/skeleton';

export function RouteLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center px-4 sm:px-6">
      <div className="w-full space-y-4" aria-label="Loading view">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
