// src/pages/index.js
import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import styles from "../src/app/styles/page.module.css";
import SplitContent from "../src/app/components/SplitContent";
import CategorySelect from "../src/app/components/CategorySelect";
import { getVenues } from "../src/utils/firestore";
import NavigationBar from "../src/app/components/NavigationBar";
import { AuthContext, AuthProvider } from "../src/context/AuthContext";
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

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [category, setCategory] = useState("category1");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedVenues = await getVenues();
        setVenues(fetchedVenues);
      } catch (error) {
        console.error("Error fetching venues: ", error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
          async
          defer
        />
        <Box sx={{ margin: '1em' }}>
          <NavigationBar user={user} />
        </Box>
        <main className={styles.main}>
          <Box className={styles.center}>
            <SplitContent />
          </Box>
          <Box className={styles.CategorySelect}>
            <CategorySelect category={category} handleCategoryChange={handleCategoryChange} venues={venues} />
          </Box>
          <Box className={styles.firebaseContainer}>{/* Placeholder for Firebase array data */}</Box>
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}
