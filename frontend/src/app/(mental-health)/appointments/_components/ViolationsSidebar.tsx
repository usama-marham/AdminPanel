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
          width: '100%',
          border: 1,
          borderColor: 'divider',
          p: 2,
          mb: 0,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Violations & Alerts
        </Typography>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 120,
                height: 32,
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
        width: '100%',
        border: 1,
        borderColor: 'divider',
        p: 2,
        mb: 0,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Violations & Alerts
      </Typography>
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          flexWrap: 'wrap',
          gap: 2,
          '& > *': { minWidth: 'fit-content' }
        }}
      >
        {violations.map((violation) => (
          <Chip
            key={violation.key}
            icon={getViolationIcon(violation.severity)}
            label={`${violation.title} (${violation.count})`}
            color={getViolationColor(violation.severity)}
            variant="outlined"
            onClick={() => handleViolationClick(violation)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { 
                transform: 'translateY(-1px)',
                boxShadow: 1,
                transition: 'all 0.2s ease-in-out'
              }
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
} 