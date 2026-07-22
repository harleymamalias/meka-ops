import { createBrowserRouter } from 'react-router'
import { AppLayout } from './layouts/app-layout'
import { ErrorLayout } from './layouts/error-layout'
import { DashboardPage } from '@/pages/dashboard-page'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { ServiceRequestsPage } from '@/features/service-requests'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: ErrorLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'service-requests', Component: ServiceRequestsPage },
      { path: 'service-requests/new', Component: PlaceholderPage },
      { path: 'service-requests/:serviceRequestId', Component: PlaceholderPage },
      { path: 'vehicles', Component: PlaceholderPage },
      { path: 'inventory', Component: PlaceholderPage },
      { path: 'invoices', Component: PlaceholderPage },
      { path: 'users', Component: PlaceholderPage },
      { path: 'settings', Component: PlaceholderPage },
    ],
  },
])
