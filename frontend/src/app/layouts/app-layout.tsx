import { Bell, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { navigationItems, utilityItems } from '@/app/config/navigation'

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">M</div>
        <div>
          <p className="text-sm font-semibold tracking-wide">MekaOps</p>
          <p className="text-xs text-sidebar-foreground/60">Operations console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Primary navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">Workspace</p>
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} className={({ isActive }) => cn('flex h-9 items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}>
              <Icon className="size-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
        <Separator className="my-5 bg-sidebar-border" />
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">System</p>
        {utilityItems.map((item) => {
          const Icon = item.icon
          return <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => cn('flex h-9 items-center gap-3 rounded-md px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}><Icon className="size-4" /><span>{item.label}</span></NavLink>
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-teal-500/20 text-xs font-semibold text-teal-200">HM</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Harley Mamalias</p>
            <p className="truncate text-xs text-sidebar-foreground/55">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex"><Sidebar /></div>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={cn('fixed inset-y-0 left-0 z-50 transition-transform lg:hidden', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="relative h-full"><Sidebar onNavigate={() => setMobileOpen(false)} /><Button variant="ghost" size="icon" className="absolute right-2 top-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></Button></div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button>
            <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search" placeholder="Search operations" className="h-9 w-64 rounded-md border bg-muted/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></div>
          </div>
          <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications"><Bell /></Button><div className="ml-1 flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">HM</div></div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8"><Outlet /></main>
      </div>
    </div>
  )
}
