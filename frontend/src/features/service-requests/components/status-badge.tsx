import { Badge } from '@/components/ui/badge'
import type { ServiceRequestStatus } from '../types'

const statusCopy: Record<ServiceRequestStatus, { label: string; variant: 'default' | 'info' | 'success' | 'warning' }> = {
  PENDING: { label: 'Pending', variant: 'warning' },
  INSPECTING: { label: 'Inspecting', variant: 'info' },
  IN_PROGRESS: { label: 'In progress', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
}

export function ServiceRequestStatusBadge({ status }: { status: ServiceRequestStatus }) {
  const copy = statusCopy[status]
  return <Badge variant={copy.variant}>{copy.label}</Badge>
}
