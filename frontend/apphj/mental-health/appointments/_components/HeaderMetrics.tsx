'use client';

import { useHeaderMetrics } from '@/lib/hooks/appointments';
import { useAppointmentsStore } from '@/lib/store/appointments';
import { Box, Button, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { HeaderMetric, MetricKey } from '@/lib/types/appointments';

const tooltipContent: Record<MetricKey, string> = {
  FIVE_STAR_RATE: 'Percentage of appointments rated 5 stars by patients',
  LOST_PATIENTS: 'Number of patients who cancelled or did not show up',
  PENDING_CONFIRMATION: 'Appointments waiting for confirmation',
  SLA_BREACHES: 'Number of appointments that breached service level agreements',
  AGENT_EFFICIENCY: 'Average efficiency rating of call center agents',
};

export function HeaderMetrics() {
  const { data: metrics, isLoading } = useHeaderMetrics();
  const setFilters = useAppointmentsStore((state) => state.setFilters);

  if (isLoading) {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Paper
              sx={{
                height: 100,
                bgcolor: 'action.hover',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!metrics) return null;

  const handleMetricClick = (key: MetricKey) => {
    switch (key) {
      case 'PENDING_CONFIRMATION':
        setFilters({ tab: 'PENDING' });
        break;
      case 'SLA_BREACHES':
        setFilters({ tab: 'CRITICAL' });
        break;
      // Add more metric click handlers as needed
    }
  };

  const getColorByMetric = (metric: HeaderMetric) => {
    switch (metric.color) {
      case 'green':
        return 'success.main';
      case 'red':
        return 'error.main';
      case 'yellow':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={2.4} key={metric.key}>
          <Tooltip title={tooltipContent[metric.key]} arrow>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleMetricClick(metric.key)}
              sx={{
                p: 2,
                height: 'auto',
                textAlign: 'left',
                borderColor: getColorByMetric(metric),
                '&:hover': {
                  borderColor: getColorByMetric(metric),
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  {metric.trend === 'up' ? (
                    <TrendingUpIcon
                      sx={{
                        color: metric.color === 'green' ? 'success.main' : 'error.main',
                        fontSize: 20,
                      }}
                    />
                  ) : (
                    <TrendingDownIcon
                      sx={{
                        color: metric.color === 'green' ? 'success.main' : 'error.main',
                        fontSize: 20,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{ color: getColorByMetric(metric), fontWeight: 'bold' }}
                  >
                    {metric.unit === 'PERCENT' ? `${metric.value}%` : metric.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      ml: 1,
                      color: metric.color === 'green' ? 'success.main' : 'error.main',
                    }}
                  >
                    {metric.trend === 'up' ? '+' : '-'}
                    {metric.changePct}%
                  </Typography>
                </Box>
              </Box>
            </Button>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
} 