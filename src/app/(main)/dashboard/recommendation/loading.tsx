import React from 'react';
import styles from './page.module.scss';

export default function RecommendationLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} aria-hidden />
        <p className={styles.loadingText}>Laden…</p>
      </div>
    </div>
  );
}
