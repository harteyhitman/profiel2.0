'use client';

import React from 'react';
import { Button } from '@/components/ui/forms';
import styles from './page.module.scss';

export default function AccountPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>

          <h1 className={styles.title}>Mijn account</h1>
          <p className={styles.subtitle}>
            Bekijk en beheer je huidige abonnement of upgrade naar een beter plan.

          </p>
        </div>
        <Button
          variant="primary"
          type="button"
          className={styles.startButton}
        >

          Start vragenlijst

        </Button>
      </div>
    </div>
  );
}
