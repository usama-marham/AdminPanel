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
  Paper,
  Divider,
} from "@mui/material";

// Status options - updated to match backend data
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
  'Patient No Show',
  'Patient Not Responding',
  'Doctor No Show',
  'Case Declined',
  'Doctor No Show Alt',
  'Powered Off',
  'No Show Billing',
  'Duplicate',
  'Cancelled By Doctor',
];

const paymentStatusOptions = [
  'Unpaid',
  'Paid',
  'Evidence Received',
  'Pending',
  'To Be Refunded',
  'Refunded',
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

  // Reset to first page when filters change
  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [filters]);

  // Debug pagination data
  useEffect(() => {
    if (data) {
      console.log('Pagination data:', {
        currentPage: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        totalRows: data.meta?.total,
        currentRows: data.data?.length,
        meta: data.meta,
        firstRow: data.data?.[0],
        lastRow: data.data?.[data.data.length - 1],
        paginationModel: paginationModel
      });
    }
  }, [data, paginationModel]);

  // Debug when pagination model changes
  useEffect(() => {
    console.log('Pagination model updated:', paginationModel);
  }, [paginationModel]);

  // Debug when data changes
  useEffect(() => {
    console.log('Data changed:', {
      dataLength: data?.data?.length,
      meta: data?.meta,
      paginationModel
    });
  }, [data]);

  const { setSelectedIds } = useAppointmentsStore();

  // Handle status changes - now just logging since we're using chips
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Status changed for appointment', id, 'to:', newStatus);
      // TODO: Implement API call to update appointmentStatus in edit page
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Handle payment status changes - now just logging since we're using chips
  const handlePaymentStatusChange = async (id: string, newStatus: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Payment status changed for appointment', id, 'to:', newStatus);
      // TODO: Implement API call to update paymentStatus in edit page
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  // Handle probability changes - now just logging since we're using chips
  const handleProbabilityChange = async (id: string, newProbability: string) => {
    try {
      // For now, just log the change. You can implement the actual API call here
      console.log('Probability changed for appointment', id, 'to:', newProbability);
      // TODO: Implement API call to update probability in edit page
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
      width: 200,
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {params.row.patientName || 'Unknown'}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem',
              lineHeight: 1.2,
              wordBreak: 'break-all',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {params.row.patientPhone || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "doctor",
      headerName: "Doctor",
      width: 200,
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {params.row.doctorName || 'Unknown'}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem',
              lineHeight: 1.2,
              wordBreak: 'break-all',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {params.row.doctorPhone || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "doctorSpecialty",
      headerName: "Specialty",
      width: 160,
      minWidth: 140,
      flex: 0.9,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {params.row.doctorSpecialty || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "hospital",
      headerName: "Hospital",
      width: 300,
      minWidth: 280,
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.primary',
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {params.row.hospitalName || 'N/A'}
          </Typography>
          {params.row.hospitalAddress && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                color: 'text.secondary',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '100%'
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
                fontSize: '0.75rem',
                lineHeight: 1.2,
                color: 'text.secondary',
                fontStyle: 'italic',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '100%'
              }}
            >
              {params.row.hospitalCity}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "apptPhone",
      headerName: "Appt. Phone",
      width: 140,
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: 1.2,
              wordBreak: 'break-all',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {params.row.hospitalPhone || 'N/A'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "directBooking",
      headerName: "Direct Booking",
      width: 150,
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Chip
            label={params.row.directBookingAllowed ? "Allowed" : "Not Allowed"}
            size="small"
            color={params.row.directBookingAllowed ? "success" : "default"}
            variant={params.row.directBookingAllowed ? "filled" : "outlined"}
            sx={{ 
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': { px: 1 },
              maxWidth: '100%',
              minWidth: 'fit-content'
            }}
          />
        </Box>
      ),
    },
    {
      field: "scheduledAt",
      headerName: "Appointment Time",
      width: 180,
      minWidth: 160,
      flex: 1.1,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography 
            variant="body2"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {params.row.scheduledAt ? format(new Date(params.row.scheduledAt), 'PPp') : 'Not scheduled'}
          </Typography>
          {params.row.createdToScheduledTime && (
            <Typography 
              variant="caption" 
              color="textSecondary" 
              sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              Booked {params.row.createdToScheduledTime} before
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "fee",
      headerName: "Fee",
      width: 100,
      minWidth: 80,
      flex: 0.6,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ 
            fontSize: '0.875rem',
            lineHeight: 1.2,
            maxWidth: '100%'
          }}>
            {params.row.fee || '-'}
          </Typography>
        </Box>
      ),
    },
    {
      field: "appointmentStatus",
      headerName: "Status",
      width: 170,
      minWidth: 150,
      flex: 1.1,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Chip
            label={params.row.appointmentStatus || 'In Process'}
            size="small"
            color={
              params.row.appointmentStatus === 'Scheduled' ? 'success' :
              params.row.appointmentStatus === 'Cancelled' ? 'error' :
              params.row.appointmentStatus === 'Patient No Show' ? 'warning' :
              params.row.appointmentStatus === 'Doctor No Show' ? 'error' :
              params.row.appointmentStatus === 'Showed up' ? 'success' :
              params.row.appointmentStatus === 'In Process' ? 'info' :
              'default'
            }
            variant="filled"
            sx={{ 
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': { px: 1 },
              maxWidth: '100%'
            }}
          />
        </Box>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 150,
      minWidth: 130,
      flex: 0.9,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Chip
            label={params.row.paymentStatus || 'Unpaid'}
            size="small"
            color={
              params.row.paymentStatus === 'Paid' ? 'success' :
              params.row.paymentStatus === 'Unpaid' ? 'error' :
              params.row.paymentStatus === 'Pending' ? 'warning' :
              params.row.paymentStatus === 'Evidence Received' ? 'info' :
              params.row.paymentStatus === 'To Be Refunded' ? 'warning' :
              params.row.paymentStatus === 'Refunded' ? 'default' :
              'default'
            }
            variant="filled"
            sx={{ 
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': { px: 1 },
              maxWidth: '100%'
            }}
          />
        </Box>
      ),
    },
    {
      field: "bookedBy",
      headerName: "Booked By",
      width: 130,
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Chip
            label={params.row.bookedBy || 'Unknown'}
            size="small"
            color={
              params.row.bookedBy === 'Admin' ? 'primary' :
              params.row.bookedBy === 'Patient' ? 'success' :
              params.row.bookedBy === 'Agent' ? 'warning' : 'default'
            }
            variant="filled"
            sx={{ 
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': { px: 1 },
              maxWidth: '100%',
              minWidth: 'fit-content'
            }}
          />
        </Box>
      ),
    },
    {
      field: "bookedFrom",
      headerName: "Booked From",
      width: 140,
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography
            variant="body2"
            sx={{ 
              fontSize: '0.875rem',
              lineHeight: 1.3,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%'
            }}
          >
            {params.row.bookedFrom || 'Unknown'}
          </Typography>
          {params.row.acquisition && (
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '100%'
              }}
            >
              Via: {params.row.acquisition}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "messageStatus",
      headerName: "Messages",
      width: 200,
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          {params.row.messageStatus && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                label={params.row.messageStatus}
                size="small"
                color={
                  params.row.messageStatus === 'Delivered' ? 'success' :
                  params.row.messageStatus === 'Failed' ? 'error' :
                  params.row.messageStatus === 'Pending' ? 'warning' :
                  'default'
                }
                variant="filled"
                sx={{ 
                  fontSize: '0.75rem',
                  height: '20px',
                  '& .MuiChip-label': { px: 1 },
                  maxWidth: '100%'
                }}
              />
            </Box>
          )}
          {params.row.lastMessagePatient && (
            <Typography 
              variant="caption" 
              color="textSecondary" 
              sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              Patient: {formatDistanceToNow(new Date(params.row.lastMessagePatient))} ago
            </Typography>
          )}
          {params.row.lastMessageDoctor && (
            <Typography 
              variant="caption" 
              color="textSecondary" 
              sx={{ 
                fontSize: '0.75rem',
                lineHeight: 1.2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              Doctor: {formatDistanceToNow(new Date(params.row.lastMessageDoctor))} ago
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "probability",
      headerName: "Probability",
      width: 150,
      minWidth: 130,
      flex: 0.9,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Chip
            label={params.row.probability || 'No Response'}
            size="small"
            color={
              params.row.probability === 'Confirmed' ? 'success' :
              params.row.probability === 'May Be' ? 'warning' :
              params.row.probability === 'No Response' ? 'error' :
              params.row.probability === 'Call Done' ? 'info' :
              params.row.probability === 'Address Lead' ? 'primary' :
              params.row.probability === 'Callback Required' ? 'secondary' :
              'default'
            }
            variant="filled"
            sx={{ 
              fontSize: '0.75rem',
              height: '24px',
              '& .MuiChip-label': { px: 1 },
              maxWidth: '100%'
            }}
          />
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      minWidth: 180,
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              lineHeight: 1.2, 
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {format(new Date(params.row.createdAt), 'PPpp')}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      minWidth: 80,
      flex: 0.6,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          py: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
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
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={data?.data || []}
        columns={columns}
        loading={isLoading}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        rowCount={data?.meta?.total || 0}
        autoHeight
        getRowHeight={() => 'auto'}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
            padding: '8px 16px',
            '&:focus': {
              outline: 'none',
            },
            // Ensure text doesn't overflow
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#f8f8f8',
            },
            minHeight: '60px !important',
          },
          // Ensure columns can grow and shrink properly
          '& .MuiDataGrid-column': {
            minWidth: '80px !important',
          },
          // Handle text overflow in cells
          '& .MuiDataGrid-cellContent': {
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          },
          // Ensure proper spacing
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'auto',
          },
        }}
        key={`${JSON.stringify(data?.data?.length)}-${JSON.stringify(paginationModel)}`}
      />
    </Box>
  );
}