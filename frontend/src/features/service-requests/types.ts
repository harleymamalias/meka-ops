export type ServiceRequestStatus = 'PENDING' | 'INSPECTING' | 'IN_PROGRESS' | 'COMPLETED'

export interface ServiceRequestSummary {
  id: string
  vehicle: string
  customer: string
  mechanic: string
  status: ServiceRequestStatus
  updatedAt: string
}
