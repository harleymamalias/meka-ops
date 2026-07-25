import { X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MainHeader } from './MainHeader';
import { MainSidebar } from './MainSidebar';

export function MainLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">
        <MainSidebar />
      </div>

      {mobileNavigationOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileNavigationOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform lg:hidden',
          mobileNavigationOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="relative h-full">
          <MainSidebar onNavigate={() => setMobileNavigationOpen(false)} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => setMobileNavigationOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <MainHeader onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
