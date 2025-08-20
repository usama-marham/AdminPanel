"use client";

import { Box, Typography } from "@mui/material";

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Appointments
      </Typography>
      {children}
    </Box>
  );
}