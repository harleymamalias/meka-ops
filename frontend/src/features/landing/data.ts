import {
  ClipboardCheck,
  PackageCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type FloorJobTone = 'primary' | 'info' | 'warning';

export interface FloorJob {
  id: string;
  vehicle: string;
  status: string;
  bay: string;
  tone: FloorJobTone;
  progress: number;
  progressClassName: string;
}

export interface LandingCapability {
  icon: LucideIcon;
  index: string;
  title: string;
  detail: string;
  signal: string;
}

export const floorJobs: FloorJob[] = [
  {
    id: 'SR-1048',
    vehicle: 'Yamaha NMAX 155',
    status: 'In progress',
    bay: 'Bay 03',
    tone: 'primary',
    progress: 68,
    progressClassName: 'w-[68%]',
  },
  {
    id: 'SR-1047',
    vehicle: 'Honda Civic 2020',
    status: 'Inspecting',
    bay: 'Bay 01',
    tone: 'info',
    progress: 32,
    progressClassName: 'w-[32%]',
  },
  {
    id: 'SR-1046',
    vehicle: 'Toyota Vios 2018',
    status: 'Needs assignment',
    bay: 'Queue',
    tone: 'warning',
    progress: 8,
    progressClassName: 'w-[8%]',
  },
];

export const capabilities: LandingCapability[] = [
  {
    icon: ClipboardCheck,
    index: '01',
    title: 'See the whole floor',
    detail: 'Turn every request into a shared, current view of work in motion.',
    signal: 'Intake → inspect → repair',
  },
  {
    icon: PackageCheck,
    index: '02',
    title: 'Stay ahead of parts',
    detail:
      'Spot stock signals that can slow a repair before they become a delay.',
    signal: 'Stock → reserve → reorder',
  },
  {
    icon: Wrench,
    index: '03',
    title: 'Move with confidence',
    detail:
      'Give owners, service advisors, and mechanics the same operating picture.',
    signal: 'Assign → update → release',
  },
];

export const operatingSignals = [
  { value: 'One view', detail: 'for every active job' },
  { value: 'Fewer stalls', detail: 'before they reach customers' },
  { value: 'Clear handoffs', detail: 'from intake to release' },
];

export const workflowSteps = [
  {
    index: '01',
    title: 'Intake',
    detail: 'Capture the request',
    state: 'complete',
  },
  {
    index: '02',
    title: 'Inspect',
    detail: 'Make the work clear',
    state: 'complete',
  },
  {
    index: '03',
    title: 'Repair',
    detail: 'Keep the bay moving',
    state: 'active',
  },
  {
    index: '04',
    title: 'Release',
    detail: 'Close the promise',
    state: 'pending',
  },
] as const;
