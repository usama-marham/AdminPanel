'use client';

import { useViolations } from '@/lib/hooks/appointments';
import { useAppointmentsStore } from '@/lib/store/appointments';
import { ViolationItem } from '@/lib/types/appointments';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { ErrorOutline, Warning, Info } from '@mui/icons-material';

export function ViolationsSidebar() {
  const { data: violations, isLoading } = useViolations();
  const setFilters = useAppointmentsStore((state) => state.setFilters);

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: 320,
          borderRight: 1,
          borderColor: 'divider',
          p: 2,
          height: '100%',
        }}
      >
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
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
      </Paper>
    );
  }

  if (!violations) return null;

  const getViolationIcon = (severity: ViolationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <ErrorOutline sx={{ color: 'error.main' }} />;
      case 'warning':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'info':
        return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const getViolationColor = (severity: ViolationItem['severity']): 'error' | 'warning' | 'info' => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
    }
  };

  const handleViolationClick = (violation: ViolationItem) => {
    switch (violation.key) {
      case 'TIME_CONFIRMATION_ELAPSED':
      case 'NOT_CONFIRMED_BY_DOCTOR':
        setFilters({ tab: 'CRITICAL' });
        break;
      case 'TIME_RESCHEDULED':
        setFilters({ tab: 'TIME_PASSED' });
        break;
      case 'HARMONY_CALL_NOT_DONE':
        setFilters({ tab: 'PENDING' });
        break;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: 320,
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        height: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Violations
      </Typography>
      <Stack spacing={2}>
        {violations.map((violation) => (
          <Button
            key={violation.key}
            variant="outlined"
            onClick={() => handleViolationClick(violation)}
            sx={{
              p: 2,
              height: 'auto',
              textAlign: 'left',
              borderColor: `${getViolationColor(violation.severity)}.main`,
              '&:hover': {
                borderColor: `${getViolationColor(violation.severity)}.main`,
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getViolationIcon(violation.severity)}
                  <Typography variant="body1" component="span">
                    {violation.title}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={violation.count}
                  color={getViolationColor(violation.severity)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {violation.description}
              </Typography>
              {violation.elapsed && (
                <Typography variant="body2" color="error">
                  {violation.elapsed} overdue
                </Typography>
              )}
            </Box>
          </Button>
        ))}
      </Stack>
    </Paper>
  );
} 