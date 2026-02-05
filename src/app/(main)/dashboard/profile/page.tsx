'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUserResults } from '@/hooks/use-dashboard';
import type { UserResults } from '@/lib/types/dashboard';
import RolePercentages from '@/components/dashboard/RolePercentages/RolePercentages';
import RoleCard from '@/components/dashboard/RoleCard/RoleCard';
import FullScoreBreakdown from '@/components/dashboard/FullScoreBreakdown/FullScoreBreakdown';
import SWOTAnalysis from '@/components/dashboard/SWOTAnalysis/SWOTAnalysis';
import SWOTModal from '@/components/dashboard/SWOTModal/SWOTModal';
import InfoNote from '@/components/dashboard/InfoNote/InfoNote';
import styles from './page.module.scss';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(user?.id || null);
  const { data: resultsData, isLoading: resultsLoading } = useUserResults();
  /** Typed per docs: GET /api/users/:id/profile returns profile + role scores (UserResults). */
  const results = resultsData as UserResults | undefined;

  const [isSWOTModalOpen, setIsSWOTModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Strengths' | 'Weaknesses' | 'Chances' | 'Threats' | null>(null);

  // Get primary and secondary roles from scores
  const { primaryRole, secondaryRole } = React.useMemo(() => {
    if (!results?.scores) return { primaryRole: 'Apostle', secondaryRole: 'Shepherd' };
    const scores = results.scores;
    const roles = [
      { name: 'Apostle', value: scores.apostle || 0 },
      { name: 'Prophet', value: scores.prophet || 0 },
      { name: 'Evangelist', value: scores.evangelist || 0 },
      { name: 'Shepherd', value: scores.herder || 0 },
      { name: 'Teacher', value: scores.teacher || 0 },
    ].sort((a, b) => b.value - a.value);
    return {
      primaryRole: roles[0]?.name || 'Apostle',
      secondaryRole: roles[1]?.name || 'Shepherd',
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
            Hieronder zie je de verdeling van jouw scores over de vijf bedieningen.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.shareButton} aria-label="Share with team leader">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M15 13.3333C16.3807 13.3333 17.5 12.214 17.5 10.8333C17.5 9.45262 16.3807 8.33333 15 8.33333C13.6193 8.33333 12.5 9.45262 12.5 10.8333C12.5 12.214 13.6193 13.3333 15 13.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13.3333C6.38071 13.3333 7.5 12.214 7.5 10.8333C7.5 9.45262 6.38071 8.33333 5 8.33333C3.61929 8.33333 2.5 9.45262 2.5 10.8333C2.5 12.214 3.61929 13.3333 5 13.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 10.8333H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 8.33333L12.5 10.8333L15 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 8.33333L7.5 10.8333L5 13.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Share with team leader
          </button>
          <button type="button" className={styles.downloadButton} aria-label="Download result">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M10 13V2M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download result
          </button>
        </div>
      </header>

      <section className={styles.scoreCard}>
        <div className={styles.scoreCardLeft}>
          <RolePercentages scores={results?.scores} />
        </div>
        <div className={styles.scoreCardMiddle}>
          <RoleCard type="primary" role={primaryRole} description="" />
        </div>
        <div className={styles.scoreCardRight}>
          <RoleCard type="secondary" role={secondaryRole} description="" />
        </div>
      </section>

      <p className={styles.explanationText}>
        Het profiel beschrijft geen vaste rol, ambt of titel, maar een combinatie van kenmerken die bij jou zichtbaar zijn binnen de vijf bedieningen.
      </p>

      <section className={styles.fullScoreSection}>
        <FullScoreBreakdown scores={results?.scores} />
      </section>

      <section className={styles.swotSection}>
        <h2 className={styles.sectionTitle}>SWOT analysis</h2>
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
