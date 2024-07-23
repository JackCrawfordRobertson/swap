// src/pages/index.js
import React, { useState, useEffect, useContext } from 'react';
import styles from "../src/app/styles/page.module.css";
import SplitContent from "../src/app/components/SplitContent";
import CategorySelect from "../src/app/components/CategorySelect";
import { getVenues } from '../src/utils/firestore';
import NavigationBar from '../src/app/components/NavigationBar';
import { AuthContext } from '../src/context/AuthContext';

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
    <div>
      <NavigationBar user={user} />
      <main className={styles.main}>
        <div className={styles.center}>
          <SplitContent />
        </div>
        <div className={styles.CategorySelect}>
          <CategorySelect category={category} handleCategoryChange={handleCategoryChange} venues={venues} />
        </div>
        <div className={styles.firebaseContainer}>{/* Placeholder for Firebase array data */}</div>
      </main>
    </div>
  );
}
