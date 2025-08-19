"use client";
import { useAppointments } from "@/lib/hooks/appointments";
import { useEffect, useState } from "react";
import { useAppointmentsStore } from "@/lib/store/appointments";
import { getStatusColor, getPaymentStatusColor } from "@/lib/utils/appointments";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format, formatDistanceToNow } from "date-fns";
import { Edit } from "@mui/icons-material";
import { 
  IconButton, 
  Tooltip, 
  Typography, 
  Box, 
  Chip,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Divider,
} from "@mui/material";

// Status options
const appointmentStatusOptions = [
  'In Process',
  'Scheduled',
  'Cancelled',
  'Doctor Not Responding',
  'Data Incorrect',
  'Doctor Not Available',
  'Inquiry',
  'Showed up',
  'Other',
  'Patient - Not Showed up',
  'Patient Not Responding',
  'Doctor - Not Showed Up',
  'Case Declined',
  'Not Showed-up By Doctor',
  'Powered Off',
  'Not Showed up-Billing',
  'Duplicate',
];

const paymentStatusOptions = [
  'No',
  'Yes',
  'Evidence Received',
  'Pending',
  'To Be Refund',
  'Refunded',
];

const probabilityOptions = [
  'Confirmed',
  'May Be',
  'No Response',
  'Call Done',
  'Address Lead',
  'Call Back Required',
];

interface AppointmentsTableProps {
  filters?: any;
}

export function AppointmentsTable({ filters = {} }: AppointmentsTableProps) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { data, isLoading, error } = useAppointments({
    tab: "ALL",
    page: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    ...filters, // Pass filters to the API
  });

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, [error]);

  const { setSelectedIds } = useAppointmentsStore();

  // Handle status changes
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Status changed for appointment', id, 'to:', newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Handle payment status changes
  const handlePaymentStatusChange = async (id: string, newStatus: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Payment status changed for appointment', id, 'to:', newStatus);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  // Handle probability changes
  const handleProbabilityChange = async (id: string, newProbability: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Probability changed for appointment', id, 'to:', newProbability);
    } catch (error) {
      console.error('Failed to update probability:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 180,
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {params.row.id}
        </Typography>
      ),
    },
    {
      field: "patient",
      headerName: "Patient",
      width: 180,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.patientName}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: 'block', mt: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}
          >
            {params.row.patientPhone}
          </Typography>
        </Box>
      ),
    },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 180,
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.doctorName}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: 'block', mt: 1, fontFamily: 'monospace', fontSize: '0.75rem' }}
          >
            {params.row.doctorPhone}
          </Typography>
        </Box>
      ),
    },
    {
      field: "doctorSpecialty",
      headerName: "Specialty",
      width: 140,
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.doctorSpecialty}
        </Typography>
      ),
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 200,
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ py: 1.5, width: '100%' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.primary',
              lineHeight: 1.3,
              mb: 0.5
            }}
          >
            {params.row.hospitalName || 'N/A'}
          </Typography>
          {params.row.hospitalAddress && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ 
                display: 'block', 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                color: 'text.secondary'
              }}
            >
              {params.row.hospitalAddress}
            </Typography>
          )}
          {params.row.hospitalCity && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ 
                display: 'block',
                fontSize: '0.75rem',
                lineHeight: 1.2,
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              {params.row.hospitalCity}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "scheduledAt",
      headerName: "Appointment Time",
      width: 160,
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5 }}>
          <Typography variant="body2">
            {params.row.scheduledAt ? format(new Date(params.row.scheduledAt), 'PPp') : 'Not scheduled'}
          </Typography>
          {params.row.createdToScheduledTime && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              Booked {params.row.createdToScheduledTime} before
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "fee",
      headerName: "Fee",
      width: 80,
      minWidth: 70,
      flex: 0.5,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.fee ? `₹${params.row.fee}` : '-'}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.row.status || 'In Process'}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            sx={{ 
              minWidth: 140,
              '& .MuiSelect-select': {
                py: 1,
              }
            }}
          >
            {appointmentStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 140,
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.row.paymentStatus || 'No'}
            onChange={(e) => handlePaymentStatusChange(params.row.id, e.target.value)}
            sx={{ 
              minWidth: 120,
              '& .MuiSelect-select': {
                py: 1,
              }
            }}
          >
            {paymentStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "booking",
      headerName: "Booking Info",
      width: 180,
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5 }}>
          <Typography variant="body2">
            By: {params.row.bookedBy || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
            From: {params.row.bookedFrom || 'Unknown'}
          </Typography>
          {params.row.acquisition && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Via: {params.row.acquisition}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "messageStatus",
      headerName: "Messages",
      width: 180,
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5 }}>
          {params.row.messageStatus !== null && (
            <Typography variant="body2">
              Status: {params.row.messageStatus}
            </Typography>
          )}
          {params.row.lastMessagePatient && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              Patient: {formatDistanceToNow(new Date(params.row.lastMessagePatient))} ago
            </Typography>
          )}
          {params.row.lastMessageDoctor && (
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Doctor: {formatDistanceToNow(new Date(params.row.lastMessageDoctor))} ago
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "probability",
      headerName: "Probability",
      width: 140,
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.row.probability || 'No Response'}
            onChange={(e) => handleProbabilityChange(params.row.id, e.target.value)}
            sx={{ 
              minWidth: 120,
              '& .MuiSelect-select': {
                py: 1,
              }
            }}
          >
            {probabilityOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 160,
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {format(new Date(params.row.createdAt), 'PPp')}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      minWidth: 70,
      flex: 0.5,
      renderCell: (params) => (
        <Tooltip title="Edit Appointment">
          <IconButton
            size="small"
            onClick={() => {
              window.open(`/appointments/${params.row.id}/edit`, '_blank');
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ height: "calc(100vh - 400px)", width: "100%", overflow: "hidden" }}>
      <DataGrid
        rows={data?.data || []}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{ 
          pagination: { paginationModel: { pageSize: 10 } }, 
          sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] } 
        }}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pagination
        onRowSelectionModelChange={(newSelection) => { setSelectedIds(newSelection as string[]); }}
        sortingMode="client"
        sx={{ 
          '& .MuiDataGrid-cell': { py: 0.5 },
          '& .MuiDataGrid-root': { width: '100%' },
          '& .MuiDataGrid-main': { width: '100%' },
          '& .MuiDataGrid-virtualScroller': { width: '100%' },
          '& .MuiDataGrid-virtualScrollerContent': { width: '100%' },
          '& .MuiDataGrid-virtualScrollerRenderZone': { width: '100%' },
          '& .MuiDataGrid-columnHeaders': { width: '100%' },
          '& .MuiDataGrid-footerContainer': { width: '100%' },
        }}
        columnVisibilityModel={{
          // Hide some columns on smaller screens if needed
          // You can customize this based on screen size
        }}
        disableColumnMenu={false}
        disableColumnFilter={false}
        disableColumnSelector={false}
        density="compact"
      />
    </Box>
  );
}