import { BrandMark } from '@/components/common/BrandMark/BrandMark';
import { Separator } from '@/components/ui/separator';
import { navigationItems, utilityItems } from '@/config/navigation';
import { NavigationGroup } from './NavigationGroup';

interface MainSidebarProps {
  onNavigate?: () => void;
}

export function MainSidebar({ onNavigate }: MainSidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <BrandMark inverse />
        <div>
          <p className="text-sm font-semibold tracking-wide">MekaOps</p>
          <p className="text-xs text-sidebar-foreground/60">
            Operations console
          </p>
        </div>
      </div>

      <nav
        className="flex-1 space-y-1 px-3 py-5"
        aria-label="Primary navigation"
      >
        <NavigationGroup
          label="Workspace"
          items={navigationItems}
          onNavigate={onNavigate}
        />
        <Separator className="my-5 bg-sidebar-border" />
        <NavigationGroup
          label="System"
          items={utilityItems}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="grid size-8 place-items-center rounded-full bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
            HM
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Harley Mamalias</p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
