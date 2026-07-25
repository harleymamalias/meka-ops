import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  Gauge,
  Package,
  Receipt,
  Settings2,
  Users,
  Wrench,
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Overview', to: '/dashboard', icon: Gauge, end: true },
  {
    label: 'Service requests',
    to: '/dashboard/service-requests',
    icon: ClipboardList,
  },
  { label: 'Vehicles', to: '/dashboard/vehicles', icon: Wrench },
  { label: 'Inventory', to: '/dashboard/inventory', icon: Package },
  { label: 'Invoices', to: '/dashboard/invoices', icon: Receipt },
  { label: 'Users', to: '/dashboard/users', icon: Users },
];

export const utilityItems: NavigationItem[] = [
  { label: 'Settings', to: '/dashboard/settings', icon: Settings2 },
];
