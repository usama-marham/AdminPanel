import axios from 'axios';
import { AppointmentListResponseDto } from '../../../types/api';

const API_BASE_URL = 'http://localhost:3333/v1';

export const appointmentsApi = {
  async list(params: { page?: number; pageSize?: number; q?: string }) {
    console.log('Making API request to:', `${API_BASE_URL}/v1/appointments`);
    console.log('With params:', params);
    const response = await axios.get<AppointmentListResponseDto>(`${API_BASE_URL}/v1/appointments`, {
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
        appointmentStatus: mapStatusToFrontend(item.status),
        paymentStatus: mapPaymentStatusToFrontend(item.paymentStatus),
        createdAt: item.createdAt,
      })),
      total: response.data.meta.total,
    };
  },
};

function mapStatusToFrontend(status: number): string {
  const statusMap: Record<number, string> = {
    1: 'In Process',
    2: 'Scheduled',
    3: 'Cancelled',
    4: 'Doctor Not Responding',
    5: 'Data Incorrect',
    6: 'Doctor Not Available',
    7: 'Inquiry',
    8: 'Showed up',
    9: 'Other',
    10: 'Patient - Not Showed up',
    11: 'Patient Not Responding',
    12: 'Doctor - Not Showed Up',
    13: 'Case Declined',
    14: 'Not Showed-up By Doctor',
    15: 'Powered Off',
    16: 'Not Showed up-Billing',
    17: 'Duplicate',
  };
  return statusMap[status] || 'Other';
}

function mapPaymentStatusToFrontend(status: number | null): string {
  const statusMap: Record<number, string> = {
    1: 'Unpaid',
    2: 'Paid',
    3: 'Evidence Received',
    4: 'Pending',
    5: 'To Be Refund',
    6: 'Refunded',
  };
  return statusMap[status || 1] || 'Unpaid';
}
