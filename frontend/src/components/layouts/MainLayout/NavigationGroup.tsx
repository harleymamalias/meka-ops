import { NavLink } from 'react-router';
import type { NavigationItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

interface NavigationGroupProps {
  items: NavigationItem[];
  label: string;
  onNavigate?: () => void;
}

export function NavigationGroup({
  items,
  label,
  onNavigate,
}: NavigationGroupProps) {
  return (
    <div>
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        {label}
      </p>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
              )
            }
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
