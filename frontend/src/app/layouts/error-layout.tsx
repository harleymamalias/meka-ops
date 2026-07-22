import { Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'

export function ErrorLayout() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : 'Something unexpected happened.'

  return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><p className="text-sm font-medium text-primary">MekaOps</p><h1 className="mt-2 text-2xl font-semibold">We could not load this view</h1><p className="mt-2 text-sm text-muted-foreground">{message}</p><Button asChild className="mt-6"><Link to="/">Return to overview</Link></Button></div></div>
}
