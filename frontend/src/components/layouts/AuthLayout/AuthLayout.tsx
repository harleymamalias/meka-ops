import { ArrowUpRight } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { BrandMark } from '@/components/common/BrandMark/BrandMark';
import { AuthBrandPanel } from '@/features/auth';

export function AuthLayout() {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(360px,0.85fr)_minmax(520px,1.15fr)]">
      <aside className="hidden bg-sidebar lg:flex">
        <AuthBrandPanel />
      </aside>

      <main className="relative flex min-h-svh items-center justify-center px-5 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-x-5 top-6 flex items-center justify-between text-xs text-muted-foreground sm:inset-x-8 lg:inset-x-12">
          <span>Secure workspace access</span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            Back to site
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <Link
          to="/"
          className="absolute left-5 top-16 inline-flex items-center gap-3 font-semibold text-foreground sm:left-8 lg:hidden"
        >
          <BrandMark />
          MekaOps
        </Link>

        <Outlet />
      </main>
    </div>
  );
}
