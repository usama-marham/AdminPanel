'use client';

import { Box, Container, Paper } from '@mui/material';
import { TopNav } from './_components/TopNav';
import { HeaderMetrics } from './_components/HeaderMetrics';
import { ViolationsSidebar } from './_components/ViolationsSidebar';
import { AppointmentsTable } from './_components/AppointmentsTable';
import { BulkActionBar } from './_components/BulkActionBar';
import { DetailsDrawer } from './_components/DetailsDrawer';
import { useState } from 'react';

const defaultNavItems = [
  { label: 'Admin', href: '/admin' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Hospitals', href: '/hospitals' },
  { label: 'Labs', href: '/labs' },
  { label: 'Medicines', href: '/medicines' },
  { label: 'Appointments', href: '/mental-health/appointments', active: true },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Patients', href: '/patients' },
  { label: 'Forum', href: '/forum' },
  { label: 'GR Met', href: '/gr-met' },
  { label: 'View', href: '/view' },
  { label: 'Programs', href: '/programs' },
  { label: 'Add+', href: '/add' },
  { label: 'Marketing', href: '/marketing' },
];

export default function AppointmentsPage() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    null
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <TopNav items={defaultNavItems} />

      {/* Header Metrics */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <HeaderMetrics />
        </Container>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar */}
        <ViolationsSidebar />

        {/* Main Table */}
        <Box sx={{ flex: 1, p: 3 }}>
          <AppointmentsTable />
        </Box>

        {/* Right Details Drawer */}
        <DetailsDrawer
          appointmentId={selectedAppointmentId}
          onClose={() => setSelectedAppointmentId(null)}
        />
      </Box>

      {/* Bulk Action Bar */}
      <BulkActionBar />
    </Box>
  );
} 