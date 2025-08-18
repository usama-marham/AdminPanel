"use client";

import { useAppointments } from "../../../../lib/hooks/appointments";
import { useEffect } from "react";
import { useAppointmentsStore } from "@/lib/store/appointments";
import { getStatusColor, getPaymentStatusColor } from "@/lib/utils/appointments";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip, Typography, Select, MenuItem, Box } from "@mui/material";
import { useState } from "react";

export function AppointmentsTable() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  
  const { data, isLoading, error } = useAppointments({
    tab: "ALL",
    page: paginationModel.page + 1, // Convert 0-based to 1-based pagination
    pageSize: paginationModel.pageSize,
  });

  useEffect(() => {
    console.log('Table data:', data);
    console.log('Loading state:', isLoading);
  }, [data, isLoading]);

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }, [error]);
  
  const { setSelectedIds } = useAppointmentsStore();

  // Define status options
  const appointmentStatusOptions = [
    "In Process",
    "Scheduled",
    "Cancelled",
    "Doctor Not Responding",
    "Data Incorrect",
    "Doctor Not Available",
    "Inquiry",
    "Showed up",
    "Other",
    "Patient - Not Showed up",
    "Patient Not Responding",
    "Doctor - Not Showed Up",
    "Case Declined",
    "Not Showed-up By Doctor",
    "Powered Off",
    "Not Showed up-Billing",
    "Duplicate",
  ];

  const paymentStatusOptions = [
    "Unpaid",
    "Paid",
    "Evidence Received",
    "Pending",
    "To Be Refund",
    "Refunded",
  ];



  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 220,
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
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.row.patient.name}
          </Typography>
          <Typography 
            variant="caption" 
            color="textSecondary" 
            sx={{ 
              display: 'block',
              mt: 0.5,
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}
          >
            {params.row.patient.phone}
          </Typography>
        </Box>
      ),
    },
    {
      field: "doctor",
      headerName: "Doctor",
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
      field: "doctorPhone",
      headerName: "Doctor Phone",
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.doctor.phone || "+92 300 1234567"}
        </Typography>
      ),
    },
    {
      field: "hospital",
      headerName: "Hospital",
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
      field: "time",
      headerName: "Time",
      width: 160,
      renderCell: (params) => (
        <div>
          <Typography variant="body2">
            {format(new Date(params.row.time), "MMM d, yyyy")}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {format(new Date(params.row.time), "h:mm a")}
          </Typography>
        </div>
      ),
    },
    {
      field: "feePKR",
      headerName: "Fee (PKR)",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.feePKR.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "appointmentStatus",
      headerName: "Appointment Status",
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: appointmentStatusOptions,
      preProcessEditCellProps: (params) => {
        const value = params.props.value || appointmentStatusOptions[0];
        return { ...params.props, value };
      },
      renderCell: (params) => {
        const value = params.value || appointmentStatusOptions[0];
        return (
          <Select
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: "appointmentStatus",
                value: newValue,
              }, e);
              params.api.updateRows([{ id: params.id, appointmentStatus: newValue }]);
            }}
            sx={{
              width: "100%",
              height: "32px",
              fontSize: "0.875rem",
              color: getStatusColor(value),
              "& .MuiSelect-select": {
                padding: "4px 8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(0, 0, 0, 0.23)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(0, 0, 0, 0.23)",
              },
            }}
          >
            {appointmentStatusOptions.map((option: string) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={{ color: getStatusColor(option) }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 180,
      editable: true,
      type: "singleSelect",
      valueOptions: paymentStatusOptions,
      preProcessEditCellProps: (params) => {
        const value = params.props.value || paymentStatusOptions[0];
        return { ...params.props, value };
      },
      renderCell: (params) => {
        const value = params.value || paymentStatusOptions[0];
        return (
          <Select
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              params.api.setEditCellValue({
                id: params.id,
                field: "paymentStatus",
                value: newValue,
              }, e);
              params.api.updateRows([{ id: params.id, paymentStatus: newValue }]);
            }}
            sx={{
              width: "100%",
              height: "32px",
              fontSize: "0.875rem",
              color: getPaymentStatusColor(value),
              "& .MuiSelect-select": {
                padding: "4px 8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(0, 0, 0, 0.23)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(0, 0, 0, 0.23)",
              },
            }}
          >
            {paymentStatusOptions.map((option: string) => (
              <MenuItem 
                key={option} 
                value={option}
                sx={{ color: getPaymentStatusColor(option) }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      renderCell: (params) => {
        const date = params.row.createdAt
          ? new Date(params.row.createdAt)
          : null;
        return date ? (
          <div>
            <Typography variant="body2">
              {format(date, "MMM d, yyyy")}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {format(date, "h:mm a")}
            </Typography>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Not available
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
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
    <Box
      sx={{
        height: "calc(100vh - 250px)", // Account for header, nav, and padding
        width: "100%",
        overflow: "hidden",
        "& .MuiDataGrid-root": {
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: "4px",
          overflow: "hidden",
        },
        "& .MuiDataGrid-main": {
          overflow: "hidden",
        },
        "& .MuiDataGrid-virtualScroller": {
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        },
      }}
    >
      <DataGrid
        rows={data?.rows || []}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: {
            sortModel: [{ field: 'time', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={(newModel) => {
          setPaginationModel(newModel);
        }}
        pagination
        onRowSelectionModelChange={(newSelection) => {
          setSelectedIds(newSelection as string[]);
        }}
        sortingMode="client"
        sx={{
          height: "100%",
          width: "100%",
          "& .MuiDataGrid-cell": {
            fontSize: "0.875rem",
            padding: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiDataGrid-columnHeader": {
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          },
          "& .MuiSelect-select": {
            backgroundColor: "transparent",
          },
        }}
      />
    </Box>
  );
}


