'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUserResults } from '@/hooks/use-dashboard';
import type { UserResults } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type RoleKey } from '@/lib/constants/questionnaire';
import { profileAPI } from '@/lib/api/profile';
import ScoreOverviewChart from '@/components/dashboard/ScoreOverviewChart/ScoreOverviewChart';
import RoleCard from '@/components/dashboard/RoleCard/RoleCard';
import FullScoreBreakdown from '@/components/dashboard/FullScoreBreakdown/FullScoreBreakdown';
import ProfileScoreDistributionChart from '@/components/dashboard/ProfileScoreDistributionChart/ProfileScoreDistributionChart';
import SWOTAnalysis from '@/components/dashboard/SWOTAnalysis/SWOTAnalysis';
import SWOTModal from '@/components/dashboard/SWOTModal/SWOTModal';
import InfoNote from '@/components/dashboard/InfoNote/InfoNote';
import styles from './page.module.scss';

const EXPORT_FILENAME_PREFIX = 'bedieningen-profiel';

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.id != null ? Number(user.id) : null;
  const { data: profileData, isLoading: profileLoading } = useUserProfile(user?.id || null);
  const { data: resultsData, isLoading: resultsLoading } = useUserResults();
  /** Typed per docs: GET /api/users/:id/profile returns profile + role scores (UserResults). */
  const results = resultsData as UserResults | undefined;
  const hasResults = results?.scores != null;

  const [isSWOTModalOpen, setIsSWOTModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Strengths' | 'Weaknesses' | 'Chances' | 'Threats' | null>(null);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<'success' | 'error' | null>(null);

  const getExportFilename = () =>
    `${EXPORT_FILENAME_PREFIX}-${userId}-${Date.now()}.csv`;

  const handleShareWithTeamLeader = async () => {
    if (!userId || !hasResults) return;
    setSharing(true);
    setShareMessage(null);
    try {
      const blob = await profileAPI.exportUserData(userId);
      const file = new File([blob], getExportFilename(), { type: 'text/csv' });
      if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Bedieningen profiel',
          text: `Bedieningen profiel voor ${userId}`,
        });
        setShareMessage('success');
      } else {
        handleExport();
        setShareMessage('success');
      }
    } catch {
      setShareMessage('error');
    } finally {
      setSharing(false);
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
      a.download = getExportFilename();
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

  // Get primary and secondary roles from scores (Dutch labels + keys for descriptions)
  const { primaryRole, secondaryRole, primaryKey, secondaryKey } = React.useMemo(() => {
    const keys: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
    if (!results?.scores) {
      return {
        primaryRole: 'Apostel',
        secondaryRole: 'Herder',
        primaryKey: 'apostle' as RoleKey,
        secondaryKey: 'herder' as RoleKey,
      };
    }
    const scores = results.scores;
    const sorted = [...keys].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    return {
      primaryRole: ROLE_LABELS[sorted[0]] ?? 'Apostel',
      secondaryRole: ROLE_LABELS[sorted[1]] ?? 'Herder',
      primaryKey: sorted[0],
      secondaryKey: sorted[1],
    };
  }, [results]);

  const handleSWOTCardClick = (category: 'Strengths' | 'Weaknesses' | 'Chances' | 'Threats') => {
    setSelectedCategory(category);
    setIsSWOTModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSWOTModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className={styles.page}>
      <header className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Mijn profiel</h1>
          <p className={styles.subtitle}>
            Hieronder zie je de verdeling van jouw scores over de vijf bedieningen. Het profiel beschrijft geen vaste rol, ambt of titel, maar een combinatie van kenmerken die bij jou zichtbaar zijn binnen de vijf bedieningen.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.shareButton}
            aria-label="Delen"
            onClick={handleShareWithTeamLeader}
            disabled={sharing || !userId || !hasResults}
          >
            {sharing ? 'Bezig…' : 'Share'}
            <span className={styles.socialIcons} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </span>
          </button>
          <button
            type="button"
            className={styles.downloadButton}
            aria-label="Resultaat downloaden"
            onClick={handleExport}
            disabled={exporting || !userId}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M10 13V2M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {exporting ? 'Download…' : 'Download result'}
          </button>
        </div>
        {shareMessage === 'success' && (
          <p className={styles.feedbackMessage} role="status">
            Resultaten gedeeld met de teamleider.
          </p>
        )}
        {shareMessage === 'error' && (
          <p className={styles.feedbackError} role="alert">
            Delen mislukt. Probeer opnieuw of download het bestand.
          </p>
        )}
      </header>

      <section className={styles.scoreOverviewSection}>
        <div className={styles.scoreOverviewLeft}>
          <h2 className={styles.sectionTitle}>Score overzicht</h2>
          <div className={styles.chartWrapper}>
            <ScoreOverviewChart scores={results?.scores} />
          </div>
        </div>
        <div className={styles.scoreOverviewRight}>
          <div className={styles.roleCardWrap}>
            <RoleCard type="primary" role={primaryRole} description={ROLE_DESCRIPTIONS[primaryKey]} />
          </div>
          <div className={styles.roleCardWrap}>
            <RoleCard type="secondary" role={secondaryRole} description={ROLE_DESCRIPTIONS[secondaryKey]} />
          </div>
        </div>
      </section>

      <section className={styles.breakdownRow}>
        <div className={styles.breakdownLeft}>
          <FullScoreBreakdown scores={results?.scores} />
        </div>
        <div className={styles.breakdownRight}>
          <ProfileScoreDistributionChart scores={results?.scores} title="Score verdeling" />
        </div>
      </section>

      <section className={styles.swotSection}>
        <h2 className={styles.sectionTitle}>SWOT-analyse</h2>
        <p className={styles.swotDescription}>
          Deze aanbevelingen zijn bedoeld om je te helpen je verder te ontwikkelen en bewust te worden van gebieden waarin je kunt groeien. Gebruik ze als startpunt voor reflectie en groei. Je kunt deze aanbevelingen bespreken met je (team)leider of mentor om een persoonlijk ontwikkelingsplan te maken dat aansluit bij jouw unieke gaven en de behoeften van je team of gemeente. Onthoud: deze rollen van de Vijfvoudige bediening zijn een hulpmiddel, niet een definitief oordeel over je identiteit. God werkt op unieke manieren door ieder persoon heen, en deze profielen helpen slechts.
        </p>
        <SWOTAnalysis onCardClick={handleSWOTCardClick} />
      </section>

      <InfoNote />

      <SWOTModal
        isOpen={isSWOTModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        scores={results?.scores}
      />
    </div>
  );
}
