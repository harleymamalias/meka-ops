import { ArrowUpRight, CircleCheck, ShieldCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router';
import { BrandMark } from '@/components/common/BrandMark/BrandMark';

const trustPoints = [
  { icon: ShieldCheck, label: 'Role-aware workflows' },
  { icon: Wrench, label: 'Built around the service floor' },
];

export function AuthBrandPanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between px-10 py-10 xl:px-16">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-sidebar-foreground"
        >
          <BrandMark inverse />
          <span className="text-sm font-semibold">MekaOps</span>
        </Link>

        <div className="my-16 max-w-md xl:my-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-sidebar-primary">
            Vehicle service operations
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-sidebar-foreground xl:text-5xl">
            Keep every bay, part, and promise moving.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-sidebar-foreground/60">
            One operating picture for the people who keep the shop running.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs text-sidebar-foreground/60">
        {trustPoints.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="size-4 text-sidebar-primary" />
            <span>{label}</span>
          </div>
        ))}

        <div className="mt-6 max-w-sm border-y border-sidebar-border py-4">
          <p className="font-mono text-[11px] uppercase text-sidebar-foreground/40">
            Today / Floor rhythm
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sidebar-primary">
              <CircleCheck className="size-3.5" />7 bays active
            </span>
            <span>18 jobs in motion</span>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 pt-2 font-medium text-sidebar-foreground hover:text-sidebar-primary"
        >
          Explore MekaOps
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
