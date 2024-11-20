"use client";

import React, { useState, useEffect, useContext } from "react";
import { CssBaseline, Box } from "@mui/material";
import styles from "@/styles/page.module.css";
import SplitContent from "@/app/components/SplitContent";
import SearchLogic from "@/app/components/SearchBar/SearchLogic";
import { getVenues } from "@/utils/firestore";
import NavigationLogic from "@/app/components/NavBar/NavigationLogic";
import { AuthContext } from "@/context/AuthContext";

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
    <>
      <CssBaseline />
      <Box sx={{ margin: "1em" }}>
        <NavigationLogic user={user} />
      </Box>
      <main className={styles.main}>
        <Box className={styles.center}>
          <SplitContent />
        </Box>
        <Box className={styles.CategorySelect}>
          <SearchLogic category={category} handleCategoryChange={handleCategoryChange} venues={venues} />
        </Box>
      </main>
    </>
  );
}