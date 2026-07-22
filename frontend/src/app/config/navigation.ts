import type { LucideIcon } from 'lucide-react'
import { ClipboardList, Gauge, Package, Receipt, Settings2, Users, Wrench } from 'lucide-react'

export interface NavigationItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

export const navigationItems: NavigationItem[] = [
  { label: 'Overview', to: '/', icon: Gauge, end: true },
  { label: 'Service requests', to: '/service-requests', icon: ClipboardList },
  { label: 'Vehicles', to: '/vehicles', icon: Wrench },
  { label: 'Inventory', to: '/inventory', icon: Package },
  { label: 'Invoices', to: '/invoices', icon: Receipt },
  { label: 'Users', to: '/users', icon: Users },
]

export const utilityItems: NavigationItem[] = [
  { label: 'Settings', to: '/settings', icon: Settings2 },
]
