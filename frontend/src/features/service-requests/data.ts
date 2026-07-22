import type { ServiceRequestSummary } from './types'

export const serviceRequests: ServiceRequestSummary[] = [
  { id: 'SR-1048', vehicle: 'Yamaha NMAX 155', customer: 'Mia Santos', mechanic: 'R. Dela Cruz', status: 'IN_PROGRESS', updatedAt: '12 min ago' },
  { id: 'SR-1047', vehicle: 'Honda Civic 2020', customer: 'Noah Lim', mechanic: 'A. Garcia', status: 'INSPECTING', updatedAt: '28 min ago' },
  { id: 'SR-1046', vehicle: 'Toyota Vios 2018', customer: 'Elena Cruz', mechanic: 'Unassigned', status: 'PENDING', updatedAt: '46 min ago' },
  { id: 'SR-1045', vehicle: 'Suzuki Raider 150', customer: 'Paolo Reyes', mechanic: 'J. Flores', status: 'COMPLETED', updatedAt: '1 hr ago' },
]
