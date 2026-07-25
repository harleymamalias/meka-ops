import { Filter, Search } from 'lucide-react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ServiceRequestStatus } from '../../types';

export type ServiceRequestStatusFilter = ServiceRequestStatus | 'all';

interface ServiceRequestFiltersProps {
  count: number;
  search: string;
  status: ServiceRequestStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ServiceRequestStatusFilter) => void;
}

export function ServiceRequestFilters({
  count,
  onSearchChange,
  onStatusChange,
  search,
  status,
}: ServiceRequestFiltersProps) {
  return (
    <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle>All service requests</CardTitle>
        <CardDescription>{count} requests in the current view</CardDescription>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search requests"
            aria-label="Search service requests"
            className="pl-10 sm:w-60"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as ServiceRequestStatusFilter)
          }
        >
          <SelectTrigger className="sm:w-44" aria-label="Filter by status">
            <Filter className="mr-2 size-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INSPECTING">Inspecting</SelectItem>
            <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardHeader>
  );
}
