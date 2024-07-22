// src/pages/index.js
import React, { useState } from 'react';
import styles from '../src/app/styles/page.module.css';

import CategorySelect from '../src/app/components/CategorySelect';
import SplitContent from '../src/app/components/SplitContent';

export default function Home() {
  const [category, setCategory] = useState("category1");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <SplitContent />
      </div>

      <div className={styles.CategorySelect}>
        <CategorySelect category={category} handleCategoryChange={handleCategoryChange} />
      </div>

      <div className={styles.firebaseContainer}>{/* Placeholder for Firebase array data */}</div>
    </main>
  );
}
