import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ServiceRequestFilters,
  ServiceRequestTable,
  serviceRequests,
  type ServiceRequestStatusFilter,
} from '@/features/service-requests';

export function ServiceRequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const status = parseStatusFilter(searchParams.get('status'));
  const filteredRequests = useMemo(
    () =>
      serviceRequests.filter((request) => {
        const searchText =
          `${request.id} ${request.vehicle} ${request.customer}`.toLowerCase();
        const matchesSearch = searchText.includes(search.toLowerCase());

        return matchesSearch && (status === 'all' || request.status === status);
      }),
    [search, status],
  );

  const updateFilter = (key: 'search' | 'status', value: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (!value || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }

      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Service requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track active jobs, assignments, and service progress.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/service-requests/new">
            <Plus />
            New request
          </Link>
        </Button>
      </div>

      <Card>
        <ServiceRequestFilters
          count={filteredRequests.length}
          search={search}
          status={status}
          onSearchChange={(value) => updateFilter('search', value)}
          onStatusChange={(value) => updateFilter('status', value)}
        />
        <ServiceRequestTable requests={filteredRequests} />
      </Card>
    </div>
  );
}

export { ServiceRequestsPage as Component };

function parseStatusFilter(value: string | null): ServiceRequestStatusFilter {
  if (
    value === 'PENDING' ||
    value === 'INSPECTING' ||
    value === 'IN_PROGRESS' ||
    value === 'COMPLETED'
  ) {
    return value;
  }

  return 'all';
}
