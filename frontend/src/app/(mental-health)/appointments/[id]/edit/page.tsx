'use client';

import { useAppointment, useEditAppointment, useLookups } from '@/lib/hooks/appointments';
import { Box, Container, Paper, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Button, AppBar, Toolbar, Breadcrumbs, IconButton, Snackbar, Alert } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';

const defaultNavItems = [
  { label: 'Admin', href: '/admin' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Hospitals', href: '/hospitals' },
  { label: 'Labs', href: '/labs' },
  { label: 'Medicines', href: '/medicines' },
  { label: 'Appointments', href: '/appointments', active: true },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Patients', href: '/patients' },
  { label: 'Forum', href: '/forum' },
  { label: 'GR Met', href: '/gr-met' },
  { label: 'View', href: '/view' },
  { label: 'Programs', href: '/programs' },
  { label: 'Add+', href: '/add' },
  { label: 'Marketing', href: '/marketing' },
];

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  const { data: appointment, isLoading } = useAppointment(params.id);
  const { data: lookups } = useLookups();
  const editMutation = useEditAppointment();

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const statusOptions = useMemo(() => {
    console.log('Lookups data:', lookups);
    console.log('Appointment statuses:', lookups?.appointmentStatuses);
    return (lookups?.appointmentStatuses?.map((s: any) => s.title) || []);
  }, [lookups]);
  const paymentOptions = useMemo(() => {
    console.log('Payment statuses:', lookups?.paymentStatuses);
    return (lookups?.paymentStatuses?.map((s: any) => s.title) || []);
  }, [lookups]);
  const probabilityOptions = useMemo(() => {
    console.log('Probabilities:', lookups?.probabilities);
    return (lookups?.probabilities?.map((p: any) => p.name) || []);
  }, [lookups]);

  interface FormData {
    callStatus: string;
    doctorPA: string;
    paNumber: string;
    willFixNextTime: boolean;
    appointmentInstructions: string;
    requestedDate: string;
    requestedTime: string;
    patientPhone: string;
    patientOccupation: string;
    patientAge: string;
    patientGender: string;
    patientCity: string;
    patientArea: string;
    appointmentStatus: string;
    paymentStatus: string;
    probability: string;
    isMarkFollowUp: boolean;
    isDirectBooking: boolean;
    isAgentSpecial: boolean;
    isWhatsappCreated: boolean;
    isMarkDoctorAsRed: boolean;
    isProcedure: boolean;
    callCenterNotes: string;
    appointmentNotes: string;
    sendMessageToPatient: boolean;
    sendMessageToDoctor: boolean;
    sendMessageToAssistant: boolean;
    sendVoiceMessageToPatient: boolean;
  }

  const defaultFormData: FormData = {
    doctorPA: '',
    paNumber: '',
    willFixNextTime: false,
    appointmentInstructions: '',
    requestedDate: format(new Date(), 'yyyy-MM-dd'),
    requestedTime: '08:00',
    patientPhone: '',
    patientOccupation: '',
    patientAge: '',
    patientGender: 'Male',
    patientCity: 'Lahore',
    patientArea: '',
    appointmentStatus: 'In Process',
    paymentStatus: 'Unpaid',
    probability: 'No Response',
    callStatus: 'Call Done',
    isMarkFollowUp: false,
    isDirectBooking: false,
    isAgentSpecial: false,
    isWhatsappCreated: false,
    isMarkDoctorAsRed: false,
    isProcedure: false,
    callCenterNotes: '',
    appointmentNotes: '',
    sendMessageToPatient: true,
    sendMessageToDoctor: true,
    sendMessageToAssistant: true,
    sendVoiceMessageToPatient: true,
  };

  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Populate form data when appointment is loaded
  useEffect(() => {
    console.log('Appointment data received:', appointment);
    if (appointment) {
      setFormData((prev) => ({
        ...prev,
        patientPhone: appointment.patientPhone || prev.patientPhone,
        appointmentStatus: appointment.appointmentStatus || prev.appointmentStatus,
        paymentStatus: appointment.paymentStatus || prev.paymentStatus,
        probability: appointment.probability || prev.probability,
        appointmentNotes: '',
        appointmentInstructions: '',
      }));
    }
  }, [appointment]);

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: 'none', color: 'primary.main', mr: 4, fontWeight: 'bold' }}>
              MindCare Admin
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
              {defaultNavItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  color={item.active ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none', fontWeight: item.active ? 600 : 400 }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
                <Link href="/appointments" style={{ color: 'inherit', textDecoration: 'none' }}>Appointments</Link>
                <Typography color="text.primary">Edit Appointment</Typography>
              </Breadcrumbs>
            </Box>
            <IconButton size="large" edge="end" aria-label="account" aria-haspopup="true" color="inherit">
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Loading Content */}
        <Container maxWidth="xl" sx={{ py: 4, flex: 1, bgcolor: 'background.default' }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ 
              height: '400px', 
              bgcolor: 'action.hover', 
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }} />
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editMutation.mutateAsync({
        id: params.id,
        appointmentStatus: formData.appointmentStatus,
        paymentStatus: formData.paymentStatus,
        probability: formData.probability,
        appointmentInstructions: formData.appointmentInstructions,
        notes: formData.appointmentNotes,
        patientDetails: {
          phone: formData.patientPhone,
          occupation: formData.patientOccupation,
          age: formData.patientAge,
          gender: formData.patientGender,
          city: formData.patientCity,
        },
      });
      
      // Show success toast
      setToast({
        open: true,
        message: 'Appointment updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to update appointment:', error);
      
      // Show error toast
      setToast({
        open: true,
        message: 'Failed to update appointment. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: 'none', color: 'primary.main', mr: 4, fontWeight: 'bold' }}>
            MindCare Admin
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            {defaultNavItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                color={item.active ? 'primary' : 'inherit'}
                sx={{ textTransform: 'none', fontWeight: item.active ? 600 : 400 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
              <Link href="/appointments" style={{ color: 'inherit', textDecoration: 'none' }}>Appointments</Link>
              <Typography color="text.primary">Edit Appointment</Typography>
            </Breadcrumbs>
          </Box>
          <IconButton size="large" edge="end" aria-label="account" aria-haspopup="true" color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, flex: 1, bgcolor: 'background.default' }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Edit Appointment Detail</Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Doctor & Hospital Info */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom>Doctor</Typography>
                      <Typography>{appointment?.doctorName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" gutterBottom>Specialty</Typography>
                      <Typography>{appointment?.doctorSpecialty}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" gutterBottom>Fee</Typography>
                      <Typography>{appointment?.fee}</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2" gutterBottom>Hospital</Typography>
                      <Typography>{appointment?.hospitalName}</Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Typography variant="subtitle2" gutterBottom>Timing</Typography>
                      <Typography>{appointment?.scheduledAt ? format(new Date(appointment.scheduledAt), 'PP p') : 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Appointment Instructions */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Appointment Instructions</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.appointmentInstructions}
                    onChange={(e) => setFormData({ ...formData, appointmentInstructions: e.target.value })}
                  />
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
                    {appointment?.directBookingAllowed ? 'Direct Booking Allowed' : 'Direct Booking Not Allowed'}
                  </Box>
                </Paper>
              </Grid>

              {/* Date and Time */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Requested Date"
                        value={formData.requestedDate}
                        onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Requested Time"
                        value={formData.requestedTime}
                        onChange={(e) => setFormData({ ...formData, requestedTime: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Patient Details */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Patient Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={formData.patientPhone}
                        onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Occupation"
                        value={formData.patientOccupation}
                        onChange={(e) => setFormData({ ...formData, patientOccupation: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Age"
                        value={formData.patientAge}
                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={formData.patientGender}
                          onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <FormControl fullWidth>
                        <InputLabel>City</InputLabel>
                        <Select
                          value={formData.patientCity}
                          onChange={(e) => setFormData({ ...formData, patientCity: e.target.value })}
                        >
                          <MenuItem value="Lahore">Lahore</MenuItem>
                          <MenuItem value="Karachi">Karachi</MenuItem>
                          <MenuItem value="Islamabad">Islamabad</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Appointment Status */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Appointment</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.appointmentStatus}
                          onChange={(e) => setFormData({ ...formData, appointmentStatus: e.target.value })}
                        >
                          {statusOptions.map((opt: string) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Status</InputLabel>
                        <Select
                          value={formData.paymentStatus}
                          onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                        >
                          {paymentOptions.map((opt: string) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Probability</InputLabel>
                        <Select
                          value={formData.probability}
                          onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                        >
                          {probabilityOptions.map((opt: string) => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Call Center Notes</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.callCenterNotes}
                    onChange={(e) => setFormData({ ...formData, callCenterNotes: e.target.value })}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Appointment Notes</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.appointmentNotes}
                    onChange={(e) => setFormData({ ...formData, appointmentNotes: e.target.value })}
                  />
                </Paper>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={editMutation.isPending}
                  sx={{
                    '&:disabled': {
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  {editMutation.isPending ? 'Updating...' : 'Update Appointment'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
