import {
  CircleAlert,
  ClipboardList,
  Clock3,
  Package,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { BadgeProps } from '@/components/ui/badge';
import type { ServiceRequestStatus } from '@/features/service-requests/types';

export type DashboardTone =
  | 'primary'
  | 'info'
  | 'warning'
  | 'success'
  | 'destructive';

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: DashboardTone;
}

export interface FloorJob {
  id: string;
  vehicle: string;
  customer: string;
  mechanic: string;
  bay: string;
  status: ServiceRequestStatus;
  progress: number;
  progressClassName: string;
  eta: string;
  tone: DashboardTone;
}

export const floorJobs: FloorJob[] = [
  {
    id: 'SR-1048',
    vehicle: 'Yamaha NMAX 155',
    customer: 'Mia Santos',
    mechanic: 'R. Dela Cruz',
    bay: 'Bay 03',
    status: 'IN_PROGRESS',
    progress: 68,
    progressClassName: 'w-[68%]',
    eta: 'Ready 4:30 PM',
    tone: 'primary',
  },
  {
    id: 'SR-1047',
    vehicle: 'Honda Civic 2020',
    customer: 'Noah Lim',
    mechanic: 'A. Garcia',
    bay: 'Bay 01',
    status: 'INSPECTING',
    progress: 32,
    progressClassName: 'w-[32%]',
    eta: 'Inspect by 3:15 PM',
    tone: 'info',
  },
  {
    id: 'SR-1046',
    vehicle: 'Toyota Vios 2018',
    customer: 'Elena Cruz',
    mechanic: 'Unassigned',
    bay: 'Queue',
    status: 'PENDING',
    progress: 8,
    progressClassName: 'w-[8%]',
    eta: 'Assign mechanic',
    tone: 'warning',
  },
  {
    id: 'SR-1045',
    vehicle: 'Suzuki Raider 150',
    customer: 'Paolo Reyes',
    mechanic: 'J. Flores',
    bay: 'Bay 05',
    status: 'COMPLETED',
    progress: 100,
    progressClassName: 'w-full',
    eta: 'Closed 1 hr ago',
    tone: 'success',
  },
];

export const metrics: DashboardMetric[] = [
  {
    label: 'Active requests',
    value: '18',
    detail: '+4 from yesterday',
    icon: ClipboardList,
    tone: 'primary',
  },
  {
    label: 'Awaiting inspection',
    value: '06',
    detail: '2 due today',
    icon: Clock3,
    tone: 'info',
  },
  {
    label: 'Low-stock parts',
    value: '09',
    detail: '3 need ordering',
    icon: Package,
    tone: 'warning',
  },
  {
    label: 'Mechanics on floor',
    value: '07',
    detail: '12 total on roster',
    icon: Wrench,
    tone: 'success',
  },
];

export const attentionItems = [
  {
    icon: CircleAlert,
    title: 'Assign a mechanic',
    detail: 'SR-1046 · Toyota Vios 2018',
    tone: 'warning' as const,
  },
  {
    icon: Package,
    title: 'Restock brake pad set',
    detail: '2 units remaining in inventory',
    tone: 'destructive' as const,
  },
  {
    icon: ShieldCheck,
    title: '3 jobs ready for release',
    detail: 'Customer updates are waiting',
    tone: 'primary' as const,
  },
];

export const partsToWatch: Array<{
  name: string;
  stock: string;
  level: string;
  variant: BadgeProps['variant'];
}> = [
  {
    name: 'Brake pad set',
    stock: '2 left',
    level: 'Critical',
    variant: 'destructive',
  },
  {
    name: '10W-40 engine oil',
    stock: '6 left',
    level: 'Low',
    variant: 'warning',
  },
  {
    name: 'Air filter element',
    stock: '8 left',
    level: 'Low',
    variant: 'warning',
  },
];

export const activityBars = [
  'h-[56%]',
  'h-[68%]',
  'h-[63%]',
  'h-[78%]',
  'h-[74%]',
  'h-[86%]',
  'h-[82%]',
  'h-[92%]',
  'h-[84%]',
  'h-[88%]',
  'h-[82%]',
  'h-[76%]',
];

export const cadenceItems = [
  {
    bay: 'Bay 01',
    label: 'Inspection',
    duration: '2h',
    placement: 'col-start-2 col-span-2',
  },
  {
    bay: 'Bay 03',
    label: 'Brake service',
    duration: '3h',
    placement: 'col-start-3 col-span-3',
  },
  {
    bay: 'Bay 05',
    label: 'Release check',
    duration: '1h',
    placement: 'col-start-5 col-span-1',
  },
];
