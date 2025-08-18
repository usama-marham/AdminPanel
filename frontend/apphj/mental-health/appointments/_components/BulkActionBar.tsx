'use client';

import { useBulkActions } from '@/lib/hooks/appointments';
import { useAppointmentsStore } from '@/lib/store/appointments';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { NotificationsActive, Phone, PersonAdd, Warning } from '@mui/icons-material';

export function BulkActionBar() {
  const { selectedIds, clearSelection } = useAppointmentsStore();
  const { urgentMode, toggleUrgentMode } = useAppointmentsStore();
  const bulkMutation = useBulkActions();

  if (selectedIds.length === 0) return null;

  const handleRemind = () => {
    bulkMutation.mutate(
      { action: 'REMIND', ids: selectedIds },
      {
        onSuccess: () => {
          clearSelection();
        },
      }
    );
  };

  const handleEscalate = () => {
    bulkMutation.mutate(
      { action: 'ESCALATE_CALL', ids: selectedIds },
      {
        onSuccess: () => {
          clearSelection();
        },
      }
    );
  };

  const handleAssign = () => {
    bulkMutation.mutate(
      { action: 'ASSIGN', ids: selectedIds, assigneeId: 'agent-1' },
      {
        onSuccess: () => {
          clearSelection();
        },
      }
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        px: 3,
        transform: selectedIds.length === 0 ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.2s ease-in-out',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            {selectedIds.length} appointments selected
          </Typography>
          <Button
            variant={urgentMode ? 'contained' : 'outlined'}
            color={urgentMode ? 'error' : 'primary'}
            size="small"
            startIcon={<Warning />}
            onClick={toggleUrgentMode}
          >
            Urgent Mode
          </Button>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<NotificationsActive />}
            onClick={handleRemind}
            disabled={bulkMutation.isPending}
          >
            Remind All
          </Button>
          <Button
            variant="outlined"
            startIcon={<Phone />}
            onClick={handleEscalate}
            disabled={bulkMutation.isPending}
          >
            Escalate to Call
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={handleAssign}
            disabled={bulkMutation.isPending}
          >
            Assign Selected
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
} 