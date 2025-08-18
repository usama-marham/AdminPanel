'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Button, IconButton, Box, Typography, Breadcrumbs } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

interface TopNavItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface TopNavProps {
  items: TopNavItem[];
}

export function TopNav({ items }: TopNavProps) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Brand */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            mr: 4,
            fontWeight: 'bold',
          }}
        >
          MindCare Admin
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          {items.map((item) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href || '#'}
              color={item.active ? 'primary' : 'inherit'}
              sx={{
                textTransform: 'none',
                fontWeight: item.active ? 600 : 400,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Breadcrumb */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
            <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
              Admin
            </Link>
            <Typography color="text.primary">
              All Call Center Appointments
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* User menu */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
} 