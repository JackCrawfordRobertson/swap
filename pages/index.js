// src/pages/index.js
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "../src/app/styles/page.module.css";
import SplitContent from "../src/app/components/SplitContent";
import CategorySelect from "../src/app/components/CategorySelect";
import { getVenues } from '../src/utils/firestore';

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [category, setCategory] = useState("category1");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedVenues = await getVenues();
      setVenues(fetchedVenues);
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <SplitContent />
      </div>

      <div className={styles.CategorySelect}>
        <CategorySelect category={category} handleCategoryChange={handleCategoryChange} venues={venues} />
      </div>

      <div className={styles.firebaseContainer}>{/* Placeholder for Firebase array data */}</div>
    </main>
  );
}
