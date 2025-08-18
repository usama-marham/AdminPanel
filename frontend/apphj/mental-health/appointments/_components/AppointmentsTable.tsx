'use client';

import { useAppointments } from '@/lib/hooks/appointments';
import { useAppointmentsStore } from '@/lib/store/appointments';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Edit } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';

export function AppointmentsTable() {
  const { data, isLoading } = useAppointments({ tab: 'ALL' });
  const { setSelectedIds } = useAppointmentsStore();

  const columns: GridColDef[] = [
    {
      field: 'patient',
      headerName: 'Patient',
      width: 200,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.patient.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.patient.phone}
          </Typography>
        </div>
      ),
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      width: 180,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.doctor.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.doctor.specialty}
          </Typography>
        </div>
      ),
    },
    {
      field: 'hospital',
      headerName: 'Hospital',
      width: 180,
      renderCell: (params) => (
        <div>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.hospital.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.hospital.location}
          </Typography>
        </div>
      ),
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 160,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">
            {format(new Date(params.row.time), 'MMM d, yyyy')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {format(new Date(params.row.time), 'h:mm a')}
          </Typography>
        </div>
      ),
    },
    {
      field: 'feePKR',
      headerName: 'Fee (PKR)',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.feePKR.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: getStatusColor(params.row.status),
            fontWeight: 500,
          }}
        >
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Edit Appointment">
          <IconButton
            size="small"
            onClick={() => {
              // Handle edit action
              console.log('Edit appointment:', params.row.id);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <DataGrid
        rows={data?.rows || []}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelection) => {
          setSelectedIds(newSelection as string[]);
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: '0.875rem',
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: '0.875rem',
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'CONFIRMED':
    case 'PAID':
    case 'SHOWED_UP':
      return 'success.main';
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'error.main';
    case 'PENDING_CONFIRMATION':
    case 'BOOKED':
      return 'warning.main';
    case 'RESCHEDULED':
      return 'info.main';
    default:
      return 'text.primary';
  }
} 