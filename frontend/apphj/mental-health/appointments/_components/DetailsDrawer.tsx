'use client';

import { useAppointment } from '@/lib/hooks/appointments';
import { formatAppointmentTime, getRelativeTime } from '@/lib/utils/appointments';
import { Box, Button, Chip, Drawer, IconButton, Stack, Typography, Divider } from '@mui/material';
import { Close as CloseIcon, NotificationsActive, Phone, PersonAdd } from '@mui/icons-material';

interface DetailsDrawerProps {
  appointmentId: string | null;
  onClose: () => void;
}

export function DetailsDrawer({ appointmentId, onClose }: DetailsDrawerProps) {
  const { data: appointment, isLoading } = useAppointment(appointmentId || '');

  if (!appointmentId) return null;

  return (
    <Drawer
      anchor="right"
      open={Boolean(appointmentId)}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400 },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Appointment Details</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {isLoading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  height: 80,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              />
            ))}
          </Stack>
        ) : appointment ? (
          <Stack spacing={3}>
            {/* Patient Section */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Patient
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {appointment.patient.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {appointment.patient.phone}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip
                    size="small"
                    label={appointment.patient.type}
                    color="primary"
                    variant="outlined"
                  />
                  {appointment.patient.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      size="small"
                      label={tag}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Doctor Section */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Doctor
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  {appointment.doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.doctor.specialty}
                </Typography>
              </Box>
            </Box>

            {/* Hospital Section */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Hospital
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  {appointment.hospital.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.hospital.location}
                </Typography>
              </Box>
            </Box>

            {/* Time & Status Section */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Time & Status
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  {formatAppointmentTime(appointment.time)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getRelativeTime(appointment.time)}
                </Typography>
                <Stack spacing={1} mt={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      size="small"
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Channel
                    </Typography>
                    <Typography variant="body2">
                      {appointment.channel}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>

            {/* Timeline Placeholder */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Timeline
              </Typography>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Timeline coming soon...
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box>
              <Typography color="text.secondary" gutterBottom>
                Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsActive />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Send Reminder
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Phone />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Escalate to Call
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonAdd />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Assign to Agent
                </Button>
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Typography color="text.secondary" align="center">
            Appointment not found
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}

function getStatusColor(status: string): 'success' | 'error' | 'warning' | 'default' {
  switch (status) {
    case 'CONFIRMED':
    case 'PAID':
    case 'SHOWED_UP':
      return 'success';
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'error';
    case 'PENDING_CONFIRMATION':
    case 'BOOKED':
      return 'warning';
    default:
      return 'default';
  }
} 