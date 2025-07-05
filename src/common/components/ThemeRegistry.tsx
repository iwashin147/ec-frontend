'use client';

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light', // 'light' or 'dark'
    primary: {
      main: '#1976d2', // Primary color
    },
    secondary: {
      main: '#dc004e', // Secondary color
    },
    background: {
      default: '#f5f5f5', // Default background color
      paper: '#ffffff', // Paper background color
    },
    text: {
      primary: '#000000', // Primary text color
      secondary: '#555555', // Secondary text color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Default font
    h1: {
      fontWeight: 500,
      fontSize: '2.125rem', // 34px
      lineHeight: 1.235,
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.5rem', // 24px
      lineHeight: 1.334,
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.25rem', // 20px
      lineHeight: 1.6,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
    },
    h6: {
      fontWeight: 500,
      fontSize: '0.875rem', // 14px
      lineHeight: 1.6,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem', // 14px
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem', // 14px
      lineHeight: 1.75,
      textTransform: 'uppercase', // Uppercase for buttons
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem', // 12px
      lineHeight: 1.66,
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.75rem', // 12px
      lineHeight: 2.66,
      textTransform: 'uppercase', // Uppercase for overline text
    },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
