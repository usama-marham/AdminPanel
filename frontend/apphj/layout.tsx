'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Create a theme instance
const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    fontSize: 13, // Smaller base font size
    h1: { fontSize: '2rem' },
    h2: { fontSize: '1.75rem' },
    h3: { fontSize: '1.5rem' },
    h4: { fontSize: '1.25rem' },
    h5: { fontSize: '1.1rem' },
    h6: { fontSize: '1rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#2563eb', // Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#4f46e5', // Indigo
      light: '#6366f1',
      dark: '#4338ca',
    },
    error: {
      main: '#dc2626', // Red
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9', // Light Blue
      light: '#38bdf8',
      dark: '#0284c7',
    },
    success: {
      main: '#16a34a', // Green
      light: '#22c55e',
      dark: '#15803d',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 