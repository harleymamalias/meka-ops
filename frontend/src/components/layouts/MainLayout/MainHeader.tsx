import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MainHeaderProps {
  onOpenNavigation: () => void;
}

export function MainHeader({ onOpenNavigation }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenNavigation}
          aria-label="Open navigation"
        >
          <Menu />
        </Button>

        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search operations"
            placeholder="Search operations"
            className="h-9 w-64 bg-muted/40 pl-10 text-sm placeholder:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell />
        </Button>
        <div className="ml-1 grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          HM
        </div>
      </div>
    </header>
  );
}
