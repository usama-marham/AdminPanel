"use client";

import { Box, Container, Paper } from "@mui/material";
import { TopNav } from "./_components/TopNav";
import { HeaderMetrics } from "./_components/HeaderMetrics";
import { ViolationsSidebar } from "./_components/ViolationsSidebar";
import { AppointmentsTable } from "./_components/AppointmentsTable";
import { BulkActionBar } from "./_components/BulkActionBar";
import { DetailsDrawer } from "./_components/DetailsDrawer";
import { FilterBar } from "./_components/FilterBar";
import { useState } from "react";

const defaultNavItems = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "Appointments", href: "/appointments", active: true },
  { label: "Patients", href: "/patients", active: false },
  { label: "Doctors", href: "/doctors", active: false },
  { label: "Hospitals", href: "/hospitals", active: false },
  { label: "Reports", href: "/reports", active: false },
];

export default function AppointmentsPage() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const handleFiltersChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({});
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <TopNav items={defaultNavItems} />
      
      {/* Stats Bar */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <HeaderMetrics />
        </Container>
      </Paper>
      
      {/* Violations Sidebar - Above Filters */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <ViolationsSidebar />
      </Container>
      
      {/* Filter Bar */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <FilterBar
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isExpanded={false}
        />
      </Container>
      
      {/* Main Content - Table takes full width */}
      <Box sx={{ flex: 1, px: 3, pb: 3 }}>
        <AppointmentsTable filters={currentFilters} />
      </Box>
      
      <DetailsDrawer
        appointmentId={selectedAppointmentId}
        onClose={() => setSelectedAppointmentId(null)}
      />
      <BulkActionBar />
    </Box>
  );
}
