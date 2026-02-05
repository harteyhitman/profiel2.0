'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/forms';
import ScoreOverviewChart from '@/components/dashboard/ScoreOverviewChart/ScoreOverviewChart';
import FullScoreBreakdown from '@/components/dashboard/FullScoreBreakdown/FullScoreBreakdown';
import CoreControl from '@/components/dashboard/CoreControl/CoreControl';
import { useAuth } from '@/contexts/AuthContext';
import { useUserResults } from '@/hooks/use-dashboard';
import { profileAPI } from '@/lib/api/profile';
import { calculatePrimaryRole } from '@/lib/utils/roleCalculations';
import styles from './page.module.scss';

export default function ResultPage() {
  const { user } = useAuth();
  const userId = user?.id != null ? Number(user.id) : null;
  const { data: userResults, isLoading: resultsLoading } = useUserResults();

  const scores = userResults?.scores ?? null;
  const roleProfile = scores ? calculatePrimaryRole(scores) : null;
  const hasResults = scores && roleProfile?.totalScore != null && roleProfile.totalScore > 0;

  const [exporting, setExporting] = useState(false);

  const handleShare = () => {
    if (navigator.share && hasResults) {
      navigator
        .share({
          title: 'Mijn Bedieningenprofiel Resultaten',
          text: 'Bekijk mijn bedieningenprofiel resultaten',
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExport = async () => {
    if (!userId) return;
    setExporting(true);
    try {
      const blob = await profileAPI.exportUserData(userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bedieningenprofiel-export-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Export may return 404 if not implemented
    } finally {
      setExporting(false);
    }
  };

  if (!resultsLoading && !hasResults) {
    return (
      <div className={styles.page}>
        <div className={styles.headerSection}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Resultaat</h1>
            <p className={styles.subtitle}>
              Je hebt de vragenlijst nog niet ingevuld. Vul de vragenlijst in om je bedieningenprofiel te zien.
            </p>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>Nog geen resultaten.</p>
          <Link href="/dashboard/questionnaire" className={styles.questionnaireLink}>
            Naar vragenlijst
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Resultaat</h1>
          <p className={styles.subtitle}>
            Je bedieningenprofiel op basis van de vragenlijst (scores 0–200 per rol).
          </p>
        </div>
        <div className={styles.actionButtons}>
          <Button
            variant="outline"
            type="button"
            onClick={handleShare}
            className={styles.shareButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 13.3333C16.3807 13.3333 17.5 12.214 17.5 10.8333C17.5 9.45262 16.3807 8.33333 15 8.33333C13.6193 8.33333 12.5 9.45262 12.5 10.8333C12.5 12.214 13.6193 13.3333 15 13.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13.3333C6.38071 13.3333 7.5 12.214 7.5 10.8333C7.5 9.45262 6.38071 8.33333 5 8.33333C3.61929 8.33333 2.5 9.45262 2.5 10.8333C2.5 12.214 3.61929 13.3333 5 13.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 10.8333H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 8.33333L12.5 10.8333L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 8.33333L7.5 10.8333L5 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Deel resultaat
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleExport}
            disabled={exporting || !userId}
            className={styles.downloadButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13V2M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {exporting ? 'Export…' : 'Exporteer rapport'}
          </Button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.chartCard}>
            <h2 className={styles.sectionTitle}>Score-overzicht</h2>
            <ScoreOverviewChart scores={scores} />
          </div>
          <div className={styles.coreControlCard}>
            <h2 className={styles.sectionTitle}>Kernbediening</h2>
            <CoreControl scores={scores} />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.breakdownCard}>
            <h2 className={styles.sectionTitle}>Volledige score-uitsplitsing</h2>
            <FullScoreBreakdown variant="cards" scores={scores} />
          </div>
        </div>
      </div>
    </div>
  );
}

