// src/pages/_app.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../src/app/styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import Script from 'next/script';
import NavigationBar from '../src/app/components/NavigationBar';
import styles from "../src/app/styles/page.module.css";

const theme = createTheme({
  palette: {
    primary: {
      main: '#5fa7d9',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
        async
        defer
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <div className={styles.NavigationBar}>
            <NavigationBar />
          </div>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
