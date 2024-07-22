// src/pages/_app.js
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { auth } from '../src/config/firebaseConfig';
import NavigationBar from '../src/app/components/NavigationBar';
import '../src/app/styles/globals.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5fa7d9',
    },
    secondary: {
      main: '#ff4081',
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationBar user={user} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
