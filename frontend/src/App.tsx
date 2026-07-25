import { AppProviders } from '@/AppProviders';
import { AppRouter } from '@/components/router/AppRouter';

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
