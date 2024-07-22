// src/pages/_app.js
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from '../src/config/firebaseConfig';
import NavigationBar from '../src/app/components/NavigationBar';
import '../src/app/styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import Script from 'next/script';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
          <NavigationBar user={user} />
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
