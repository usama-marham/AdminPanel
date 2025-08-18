'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceProvider } from '../../../lib/services/appointments/provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceProvider>{children}</ServiceProvider>
    </QueryClientProvider>
  );
} 