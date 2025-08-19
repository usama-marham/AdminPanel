'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLookups } from '@/lib/hooks/appointments';

interface LookupData {
  specialties: Array<{ id: number; name: string }>;
  doctors: Array<{ id: string; name: string; specialty: string }>;
  patients: Array<{ id: string; name: string; phone: string }>;
  users: Array<{ id: string; name: string; type: string }>;
}

interface FilterState {
  q: string;
  bookedDateFrom: Date | null;
  bookedDateTo: Date | null;
  scheduledDateFrom: Date | null;
  scheduledDateTo: Date | null;
  status: string;
  paymentStatus: string;
  onPanel: string;
  doctorName: string;
  specialtyName: string;
  bookedByName: string;
  patientName: string;
  hospitalName: string;
  minFee: string;
  maxFee: string;
}

interface FilterBarProps {
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  isExpanded?: boolean;
}

const appointmentStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: '1', label: 'In Process' },
  { value: '2', label: 'Scheduled' },
  { value: '3', label: 'Cancelled' },
  { value: '4', label: 'Doctor Not Responding' },
  { value: '5', label: 'Data Incorrect' },
  { value: '6', label: 'Doctor Not Available' },
  { value: '7', label: 'Inquiry' },
  { value: '8', label: 'Showed up' },
  { value: '9', label: 'Other' },
  { value: '10', label: 'Patient - Not Showed up' },
  { value: '11', label: 'Patient Not Responding' },
  { value: '12', label: 'Doctor - Not Showed Up' },
  { value: '13', label: 'Case Declined' },
  { value: '14', label: 'Not Showed-up By Doctor' },
  { value: '15', label: 'Powered Off' },
  { value: '16', label: 'Not Showed up-Billing' },
  { value: '17', label: 'Duplicate' },
];

const paymentStatusOptions = [
  { value: '', label: 'All Payment Statuses' },
  { value: '1', label: 'No' },
  { value: '2', label: 'Yes' },
  { value: '3', label: 'Evidence Received' },
  { value: '4', label: 'Pending' },
  { value: '5', label: 'To Be Refund' },
  { value: '6', label: 'Refunded' },
];

const onPanelOptions = [
  { value: '', label: 'All Doctors' },
  { value: 'true', label: 'On Panel' },
  { value: 'false', label: 'Not On Panel' },
];

export function FilterBar({ onFiltersChange, onClearFilters, isExpanded = false }: FilterBarProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    q: '',
    bookedDateFrom: null,
    bookedDateTo: null,
    scheduledDateFrom: null,
    scheduledDateTo: null,
    status: '',
    paymentStatus: '',
    onPanel: '',
    doctorName: '',
    specialtyName: '',
    bookedByName: '',
    patientName: '',
    hospitalName: '',
    minFee: '',
    maxFee: '',
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { data: lookups, isLoading: lookupsLoading, error: lookupsError } = useLookups() as { 
    data: LookupData | undefined; 
    isLoading: boolean; 
    error: any;
  };

  // Show error message if lookups fail to load
  useEffect(() => {
    if (lookupsError) {
      console.error('Failed to load lookups:', lookupsError);
    }
  }, [lookupsError]);

  useEffect(() => {
    // Update active filters count
    const active = Object.entries(filters).filter(([key, value]) => {
      if (key === 'q') return value.trim() !== '';
      if (key.includes('Date')) return value !== null;
      return value !== '' && value !== null;
    }).map(([key]) => key);
    setActiveFilters(active);
  }, [filters]);

  const handleFilterChange = async (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    setIsLoading(true);
    
    try {
      // Format dates for API calls
      const apiFilters: any = { ...newFilters };
      if (key === 'bookedDateFrom' && value) {
        apiFilters.bookedDateFrom = value.toISOString().split('T')[0];
      }
      if (key === 'bookedDateTo' && value) {
        apiFilters.bookedDateTo = value.toISOString().split('T')[0];
      }
      if (key === 'scheduledDateFrom' && value) {
        apiFilters.scheduledDateFrom = value.toISOString().split('T')[0];
      }
      if (key === 'scheduledDateTo' && value) {
        apiFilters.scheduledDateTo = value.toISOString().split('T')[0];
      }
      
      // Remove empty values
      Object.keys(apiFilters).forEach(k => {
        if (apiFilters[k] === '' || apiFilters[k] === null) {
          delete apiFilters[k];
        }
      });
      
      await onFiltersChange(apiFilters);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      q: '',
      bookedDateFrom: null,
      bookedDateTo: null,
      scheduledDateFrom: null,
      scheduledDateTo: null,
      status: '',
      paymentStatus: '',
      onPanel: '',
      doctorName: '',
      specialtyName: '',
      bookedByName: '',
      patientName: '',
      hospitalName: '',
      minFee: '',
      maxFee: '',
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    if (key.includes('Date')) {
      (newFilters as any)[key] = null;
    } else {
      (newFilters as any)[key] = '';
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Paper elevation={1} sx={{ mb: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Filters
            </Typography>
            {activeFilters.length > 0 && (
              <Chip
                label={activeFilters.length}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
            >
              Clear All
            </Button>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeFilters.map((key) => (
                <Chip
                  key={key}
                  label={`${key}: ${filters[key as keyof FilterState]}`}
                  onDelete={() => removeFilter(key)}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by patient name, phone, doctor name, or hospital name..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                </Box>
              ),
            }}
            size="small"
            disabled={isLoading}
          />
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            {/* Date Filters */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                Date Filters
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Booked From"
                value={filters.bookedDateFrom}
                onChange={(date: Date | null) => handleFilterChange('bookedDateFrom', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Booked To"
                value={filters.bookedDateTo}
                onChange={(date: Date | null) => handleFilterChange('bookedDateTo', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Scheduled From"
                value={filters.scheduledDateFrom}
                onChange={(date: Date | null) => handleFilterChange('scheduledDateFrom', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Scheduled To"
                value={filters.scheduledDateTo}
                onChange={(date: Date | null) => handleFilterChange('scheduledDateTo', date)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            {/* Status Filters */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, mt: 2 }}>
                Status & Payment
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Appointment Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Appointment Status"
                >
                  {appointmentStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={filters.paymentStatus}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  label="Payment Status"
                >
                  {paymentStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Doctor Panel Status</InputLabel>
                <Select
                  value={filters.onPanel}
                  onChange={(e) => handleFilterChange('onPanel', e.target.value)}
                  label="Doctor Panel Status"
                >
                  {onPanelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fee Filters */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Min Fee"
                type="number"
                value={filters.minFee}
                onChange={(e) => handleFilterChange('minFee', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Max Fee"
                type="number"
                value={filters.maxFee}
                onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                InputProps={{
                  startAdornment: <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
            </Grid>

            {/* Additional Filters */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, mt: 2 }}>
                Additional Filters
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={lookups?.doctors || []}
                getOptionLabel={(option) => `${option.name} (${option.specialty})`}
                value={lookups?.doctors?.find(d => d.name === filters.doctorName) || null}
                onChange={(_, newValue) => handleFilterChange('doctorName', newValue?.name || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Doctor"
                    size="small"
                    placeholder="Search doctor..."
                  />
                )}
                loading={lookupsLoading}
                disabled={lookupsLoading}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={filters.specialtyName}
                  onChange={(e) => handleFilterChange('specialtyName', e.target.value)}
                  label="Specialty"
                >
                  <MenuItem value="">All Specialties</MenuItem>
                  {lookups?.specialties?.map((specialty) => (
                    <MenuItem key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Booked By</InputLabel>
                <Select
                  value={filters.bookedByName}
                  onChange={(e) => handleFilterChange('bookedByName', e.target.value)}
                  label="Booked By"
                >
                  <MenuItem value="">All Users</MenuItem>
                  {lookups?.users?.map((user) => (
                    <MenuItem key={user.id} value={user.name}>
                      {user.name} ({user.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Autocomplete
                options={lookups?.patients || []}
                getOptionLabel={(option) => `${option.name} (${option.phone})`}
                value={lookups?.patients?.find(p => p.name === filters.patientName) || null}
                onChange={(_, newValue) => handleFilterChange('patientName', newValue?.name || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Patient"
                    size="small"
                    placeholder="Search patient..."
                  />
                )}
                loading={lookupsLoading}
                disabled={lookupsLoading}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Box>
    </Paper>
  );
}
