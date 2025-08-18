import { format, formatDistanceToNow } from 'date-fns';

// Date formatting
export function formatAppointmentTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// Currency formatting
export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Status helpers
export function getStatusColor(status: string): string {
  switch (status) {
    case 'In Process':
    case 'Scheduled':
      return 'primary.main';
    case 'Showed up':
      return 'success.main';
    case 'Cancelled':
    case 'Doctor Not Responding':
    case 'Doctor Not Available':
    case 'Patient - Not Showed up':
    case 'Patient Not Responding':
    case 'Doctor - Not Showed Up':
    case 'Not Showed-up By Doctor':
    case 'Not Showed up-Billing':
      return 'error.main';
    case 'Data Incorrect':
    case 'Case Declined':
    case 'Powered Off':
      return 'warning.main';
    case 'Inquiry':
    case 'Other':
    case 'Duplicate':
      return 'info.main';
    default:
      return 'text.primary';
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'Paid':
    case 'Refunded':
      return 'success.main';
    case 'Unpaid':
      return 'error.main';
    case 'Evidence Received':
    case 'Pending':
      return 'warning.main';
    case 'To Be Refund':
      return 'info.main';
    default:
      return 'text.primary';
  }
}