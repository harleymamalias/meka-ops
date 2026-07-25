import { Link } from 'react-router';
import { CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServiceRequestSummary } from '../../types';
import { ServiceRequestStatusBadge } from '@/features/service-requests/components/StatusBadge/StatusBadge';

export function ServiceRequestTable({
  requests,
}: {
  requests: ServiceRequestSummary[];
}) {
  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Mechanic</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Link
                  className="font-medium text-primary hover:underline"
                  to={`/dashboard/service-requests/${request.id}`}
                >
                  {request.id}
                </Link>
              </TableCell>
              <TableCell>{request.vehicle}</TableCell>
              <TableCell>{request.customer}</TableCell>
              <TableCell className="text-muted-foreground">
                {request.mechanic}
              </TableCell>
              <TableCell>
                <ServiceRequestStatusBadge status={request.status} />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {request.updatedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {requests.length === 0 && (
        <div className="p-10 text-center text-sm text-muted-foreground">
          No service requests match the current filters.
        </div>
      )}
    </CardContent>
  );
}
