import { createContext, useContext, ReactNode } from 'react';
import { IAppointmentsService, IMetricsService, IViolationsService } from '../../types/appointments';
import { InMemoryAppointmentsService, InMemoryMetricsService, InMemoryViolationsService } from './in-memory.service';

interface ServiceContextValue {
  appointmentsService: IAppointmentsService;
  metricsService: IMetricsService;
  violationsService: IViolationsService;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

// Default to in-memory implementations
const defaultServices: ServiceContextValue = {
  appointmentsService: new InMemoryAppointmentsService(),
  metricsService: new InMemoryMetricsService(),
  violationsService: new InMemoryViolationsService(),
};

export function ServiceProvider({ 
  children,
  services = defaultServices 
}: { 
  children: ReactNode;
  services?: ServiceContextValue;
}) {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
} 