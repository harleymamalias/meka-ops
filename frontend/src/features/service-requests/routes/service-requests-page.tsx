import { Filter, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { serviceRequests } from '../data'
import { ServiceRequestStatusBadge } from '../components/status-badge'
import type { ServiceRequestStatus } from '../types'

export function ServiceRequestsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | ServiceRequestStatus>('all')
  const filteredRequests = useMemo(() => serviceRequests.filter((request) => {
    const matchesSearch = `${request.id} ${request.vehicle} ${request.customer}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (status === 'all' || request.status === status)
  }), [search, status])

  return <div className="mx-auto max-w-[1440px] space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Service requests</h1><p className="mt-1 text-sm text-muted-foreground">Track active jobs, assignments, and service progress.</p></div><Button asChild><Link to="/service-requests/new"><Plus />New request</Link></Button></div><Card><CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>All service requests</CardTitle><CardDescription>{filteredRequests.length} requests in the current view</CardDescription></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests" className="pl-9 sm:w-56" /></div><Select value={status} onValueChange={(value) => setStatus(value as typeof status)}><SelectTrigger className="sm:w-40"><Filter className="mr-2 size-4 text-muted-foreground" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="PENDING">Pending</SelectItem><SelectItem value="INSPECTING">Inspecting</SelectItem><SelectItem value="IN_PROGRESS">In progress</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem></SelectContent></Select></div></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Vehicle</TableHead><TableHead>Customer</TableHead><TableHead>Mechanic</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Updated</TableHead></TableRow></TableHeader><TableBody>{filteredRequests.map((request) => <TableRow key={request.id}><TableCell><Link className="font-medium text-primary hover:underline" to={`/service-requests/${request.id}`}>{request.id}</Link></TableCell><TableCell>{request.vehicle}</TableCell><TableCell>{request.customer}</TableCell><TableCell className="text-muted-foreground">{request.mechanic}</TableCell><TableCell><ServiceRequestStatusBadge status={request.status} /></TableCell><TableCell className="text-right text-muted-foreground">{request.updatedAt}</TableCell></TableRow>)}</TableBody></Table>{filteredRequests.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No service requests match the current filters.</div>}</CardContent></Card></div>
}
