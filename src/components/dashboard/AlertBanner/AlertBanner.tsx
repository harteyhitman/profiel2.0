'use client';

import React from 'react';
import styles from './AlertBanner.module.scss';
import { Button } from '@/components/ui/forms';

export default function AlertBanner() {
  return (
    <div className={styles.alertBanner}>
      <div className={styles.alertContent}>
        <div className={styles.alertIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className={styles.alertText}>
          Je dashboard wacht om tot leven te komen! Voltooi je kerkinstellingen om functies te gebruiken.
        </p>
      </div>
      <Button variant="outline" type="button" className={styles.setupButton}>
        Profiel instellen
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </div>
  );
}

