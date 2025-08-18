import { HeaderMetric, MetricKey } from '../lib/types/appointments';

export const mockMetrics: HeaderMetric[] = [
  {
    key: 'FIVE_STAR_RATE',
    label: '5-Star Rating',
    value: 42,
    unit: 'PERCENT',
    changePct: 12,
    trend: 'up',
    color: 'green'
  },
  {
    key: 'LOST_PATIENTS',
    label: 'Lost Patients',
    value: 3241,
    unit: 'COUNT',
    changePct: 5,
    trend: 'up',
    color: 'red'
  },
  {
    key: 'PENDING_CONFIRMATION',
    label: 'Pending Confirmation',
    value: 187,
    unit: 'COUNT',
    changePct: 3,
    trend: 'down',
    color: 'yellow'
  },
  {
    key: 'SLA_BREACHES',
    label: 'SLA Breaches',
    value: 43,
    unit: 'COUNT',
    changePct: 8,
    trend: 'up',
    color: 'red'
  },
  {
    key: 'AGENT_EFFICIENCY',
    label: 'Agent Efficiency',
    value: 78,
    unit: 'PERCENT',
    changePct: 4,
    trend: 'up',
    color: 'green'
  }
]; 