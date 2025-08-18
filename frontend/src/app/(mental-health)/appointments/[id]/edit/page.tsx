'use client';

import { useAppointment, useEditAppointment } from '@/lib/hooks/appointments';
import { Box, Container, Paper, Typography, Grid, TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Button, Divider, AppBar, Toolbar, Breadcrumbs, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

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
  const editMutation = useEditAppointment(params.id);
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
    appointmentStatus: 'Showed up',
    paymentStatus: 'Unpaid',
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
    if (appointment) {
      setFormData({
        ...defaultFormData,
        patientPhone: appointment.patient?.phone || defaultFormData.patientPhone,
        appointmentStatus: appointment.status || defaultFormData.appointmentStatus,
        paymentStatus: appointment.paymentStatus || defaultFormData.paymentStatus,
        appointmentNotes: appointment.notes || defaultFormData.appointmentNotes,
        appointmentInstructions: appointment.appointmentInstructions || defaultFormData.appointmentInstructions,
      });
    }
  }, [appointment]);

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
        status: formData.appointmentStatus,
        paymentStatus: formData.paymentStatus,
        notes: formData.appointmentNotes,
        appointmentInstructions: formData.appointmentInstructions,
        patientDetails: {
          phone: formData.patientPhone,
          occupation: formData.patientOccupation,
          age: formData.patientAge,
          gender: formData.patientGender,
          city: formData.patientCity,
        },
        paInfo: {
          hospital: formData.doctorPA,
          number: formData.paNumber,
        },
        flags: {
          willFixNextTime: formData.willFixNextTime,
          isMarkFollowUp: formData.isMarkFollowUp,
          isDirectBooking: formData.isDirectBooking,
          isAgentSpecial: formData.isAgentSpecial,
          isWhatsappCreated: formData.isWhatsappCreated,
          isMarkDoctorAsRed: formData.isMarkDoctorAsRed,
          isProcedure: formData.isProcedure,
        },
        messageSettings: {
          sendToPatient: formData.sendMessageToPatient,
          sendToDoctor: formData.sendMessageToDoctor,
          sendToAssistant: formData.sendMessageToAssistant,
          sendVoiceToPatient: formData.sendVoiceMessageToPatient,
        },
      });
      alert('Appointment updated successfully!');
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment. Please try again.');
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
                    <Typography>{appointment?.doctor.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2" gutterBottom>Specialty</Typography>
                    <Typography>{appointment?.doctor.specialty}</Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2" gutterBottom>Fee</Typography>
                    <Typography>{appointment?.feePKR}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" gutterBottom>Hospital</Typography>
                    <Typography>{appointment?.hospital.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="subtitle2" gutterBottom>Timing</Typography>
                    <Typography>{format(new Date(appointment?.time || ''), 'hh:mm a')}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* PA Info */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>PA Info & Hospital Address Verification</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Choose Hospital</InputLabel>
                      <Select value={formData.doctorPA} onChange={(e) => setFormData({ ...formData, doctorPA: e.target.value })}>
                        <MenuItem value="">-- Choose Hospital --</MenuItem>
                        <MenuItem value="omar">Omar Hospital</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="PA Name" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="PA Number" value={formData.paNumber} onChange={(e) => setFormData({ ...formData, paNumber: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.willFixNextTime} onChange={(e) => setFormData({ ...formData, willFixNextTime: e.target.checked })} />}
                      label="Will Fix it Next Time"
                    />
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
                  Direct Booking Available
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
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.appointmentStatus}
                        onChange={(e) => setFormData({ ...formData, appointmentStatus: e.target.value })}
                      >
                        <MenuItem value="In Process">In Process</MenuItem>
                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                        <MenuItem value="Doctor Not Responding">Doctor Not Responding</MenuItem>
                        <MenuItem value="Data Incorrect">Data Incorrect</MenuItem>
                        <MenuItem value="Doctor Not Available">Doctor Not Available</MenuItem>
                        <MenuItem value="Inquiry">Inquiry</MenuItem>
                        <MenuItem value="Showed up">Showed up</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Patient - Not Showed up">Patient - Not Showed up</MenuItem>
                        <MenuItem value="Patient Not Responding">Patient Not Responding</MenuItem>
                        <MenuItem value="Doctor - Not Showed Up">Doctor - Not Showed Up</MenuItem>
                        <MenuItem value="Case Declined">Case Declined</MenuItem>
                        <MenuItem value="Not Showed-up By Doctor">Not Showed-up By Doctor</MenuItem>
                        <MenuItem value="Powered Off">Powered Off</MenuItem>
                        <MenuItem value="Not Showed up-Billing">Not Showed up-Billing</MenuItem>
                        <MenuItem value="Duplicate">Duplicate</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      >
                        <MenuItem value="Unpaid">Unpaid</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Evidence Received">Evidence Received</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="To Be Refund">To Be Refund</MenuItem>
                        <MenuItem value="Refunded">Refunded</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.isMarkFollowUp} onChange={(e) => setFormData({ ...formData, isMarkFollowUp: e.target.checked })} />}
                        label="Mark Follow-Up"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.isDirectBooking} onChange={(e) => setFormData({ ...formData, isDirectBooking: e.target.checked })} />}
                        label="Direct Booking"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={<Checkbox checked={formData.isAgentSpecial} onChange={(e) => setFormData({ ...formData, isAgentSpecial: e.target.checked })} />}
                        label="Agent Special"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.isMarkDoctorAsRed} onChange={(e) => setFormData({ ...formData, isMarkDoctorAsRed: e.target.checked })} />}
                    label="Mark Doctor as Red (If doctor doesn't take call, ignore patient or doesn't pay, you can mark him/her as red)"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={<Checkbox checked={formData.isProcedure} onChange={(e) => setFormData({ ...formData, isProcedure: e.target.checked })} />}
                    label="Is Procedure"
                  />
                </Box>
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

            {/* Message Options */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.sendMessageToPatient} onChange={(e) => setFormData({ ...formData, sendMessageToPatient: e.target.checked })} />}
                      label="Send Message To Patient"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.sendMessageToDoctor} onChange={(e) => setFormData({ ...formData, sendMessageToDoctor: e.target.checked })} />}
                      label="Send Message To Doctor"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.sendMessageToAssistant} onChange={(e) => setFormData({ ...formData, sendMessageToAssistant: e.target.checked })} />}
                      label="Send Message To Assistant"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControlLabel
                      control={<Checkbox checked={formData.sendVoiceMessageToPatient} onChange={(e) => setFormData({ ...formData, sendVoiceMessageToPatient: e.target.checked })} />}
                      label="Send Voice Message To Patient"
                    />
                  </Grid>
                </Grid>
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
              >
                Update Appointment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  </Box>
  );
}
