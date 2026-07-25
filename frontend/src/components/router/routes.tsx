import type { RouteObject } from 'react-router';
import { AuthLayout } from '@/components/layouts/AuthLayout/AuthLayout';
import { ErrorLayout } from '@/components/layouts/ErrorLayout/ErrorLayout';
import { MainLayout } from '@/components/layouts/MainLayout/MainLayout';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { RouteLoading } from './RouteLoading';

export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('@/pages/LandingPage'),
    HydrateFallback: RouteLoading,
    ErrorBoundary: ErrorLayout,
  },
  {
    Component: AuthLayout,
    ErrorBoundary: ErrorLayout,
    children: [
      {
        path: 'login',
        lazy: () => import('@/pages/LoginPage'),
        HydrateFallback: RouteLoading,
      },
      {
        path: 'signup',
        lazy: () => import('@/pages/SignUpPage'),
        HydrateFallback: RouteLoading,
      },
    ],
  },
  {
    path: '/dashboard',
    Component: MainLayout,
    ErrorBoundary: ErrorLayout,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/DashboardPage'),
        HydrateFallback: RouteLoading,
      },
      {
        path: 'service-requests',
        lazy: () => import('@/pages/ServiceRequestsPage'),
        HydrateFallback: RouteLoading,
      },
      { path: 'service-requests/new', Component: PlaceholderPage },
      {
        path: 'service-requests/:serviceRequestId',
        Component: PlaceholderPage,
      },
      { path: 'vehicles', Component: PlaceholderPage },
      { path: 'inventory', Component: PlaceholderPage },
      { path: 'invoices', Component: PlaceholderPage },
      { path: 'users', Component: PlaceholderPage },
      { path: 'settings', Component: PlaceholderPage },
    ],
  },
];
