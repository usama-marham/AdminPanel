import axios from 'axios';
import { AppointmentListResponseDto } from '../../../types/api';

const API_BASE_URL = 'http://localhost:3333/v1';

export const appointmentsApi = {
  async list(params: { page?: number; pageSize?: number; q?: string }) {
    console.log('Making API request to:', `${API_BASE_URL}/appointments`);
    console.log('With params:', params);
    const response = await axios.get<AppointmentListResponseDto>(`${API_BASE_URL}/appointments`, {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 50,
        q: params.q,
      },
    });
    
    // Transform the backend response to match frontend format
    return {
      rows: response.data.data.map(item => ({
        id: item.id,
        patient: {
          name: item.patientName || 'N/A',
          phone: item.patientPhone || 'N/A',
        },
        doctor: {
          name: item.doctorName || 'N/A',
          specialty: item.doctorSpecialty || 'N/A',
          phone: item.doctorPhone || 'N/A',
        },
        hospital: {
          name: item.hospitalName || 'N/A',
          location: `${item.hospitalAddress || ''}, ${item.hospitalCity || ''}`.trim() || 'N/A',
        },
        time: item.scheduledAt || new Date().toISOString(),
        feePKR: item.fee || 0,
        appointmentStatus: item.appointmentStatus || 'N/A', // Use string value directly
        paymentStatus: item.paymentStatus || 'N/A', // Use string value directly
        createdAt: item.createdAt,
      })),
      total: response.data.meta.total,
    };
  },

  async get(id: string) {
    console.log('Making API request to:', `${API_BASE_URL}/appointments/${id}`);
    const response = await axios.get(`${API_BASE_URL}/appointments/${id}`);
    return response.data;
  },

  async edit(data: any) {
    console.log('Making edit API request to:', `${API_BASE_URL}/appointments/${data.id}`);
    console.log('With data:', data);
    
    // Remove id from request body since it's in the URL
    const { id, ...requestData } = data;
    
    const response = await axios.patch(`${API_BASE_URL}/appointments/${id}`, requestData);
    return response.data;
  },

  async getLookups() {
    console.log('Making API request to:', `${API_BASE_URL}/appointments/lookups`);
    const response = await axios.get(`${API_BASE_URL}/appointments/lookups`);
    return response.data;
  },
};

// Old mapping functions removed - backend now returns string values directly
