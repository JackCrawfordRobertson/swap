'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5fa7d9', // Primary blue color
    },
    secondary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Sets button text to white
          boxShadow: 'none', // Removes button shadows
          '&:hover': {
            backgroundColor: '#7bb5e3', // Softer, lighter blue on hover
            boxShadow: 'none', // Ensures no shadow on hover
          },
          '&:active': {
            boxShadow: 'none',
          },
          '&:focus': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds a soft shadow to all card items
          transition: 'box-shadow 0.3s ease', // Smooth transition for hover effect
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // Slightly stronger shadow on hover
          },
        },
      },
    },
  },
});

export default function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}