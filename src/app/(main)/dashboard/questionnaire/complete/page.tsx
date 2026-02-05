'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/forms';
import styles from './page.module.scss';

export default function QuestionnaireCompletePage() {
  const router = useRouter();

  const handleViewResults = () => {
    // Navigate to results page and set flag to show Result nav
    localStorage.setItem('showResultNav', 'true');
    router.push('/dashboard/result');
  };

  return (
    <div className={styles.page}>
      <div className={styles.completionCard}>
        <h1 className={styles.title}>Vragenlijst Voltooid</h1>
        <p className={styles.message}>
          Je hebt de Bedieningenprofiel beoordeling voltooid. Laten we zien hoe je gaven aansluiten bij je roeping.
        </p>
        <Button
          variant="primary"
          type="button"
          onClick={handleViewResults}
          className={styles.viewResultsButton}
        >
          Bekijk Resultaten
        </Button>
      </div>
    </div>
  );
}

