'use client';


import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './TeamControlsBalance.module.scss';

interface TeamControlsBalanceProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TeamControlsBalance({ teamResults, dashboardData }: TeamControlsBalanceProps) {
  const { memberCount, strongestControl, weakestControl, balanceScore } = useMemo(() => {
    // Prefer teamResults, fallback to dashboardData
    const members = teamResults?.members || [];
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;
    
    if (!scores && members.length === 0) {
      return {
        memberCount: 0,
        strongestControl: 'Leraar',
        weakestControl: 'Apostel',
        balanceScore: 0,
      };
    }
    
    const roles = [
      { name: 'Leraar', value: scores?.teacher || 0 },
      { name: 'Apostel', value: scores?.apostle || 0 },
      { name: 'Profeet', value: scores?.prophet || 0 },
      { name: 'Evangelist', value: scores?.evangelist || 0 },
      { name: 'Herder', value: scores?.herder || 0 },
    ].sort((a, b) => b.value - a.value);

    const total = roles.reduce((sum, r) => sum + r.value, 0);
    const strongest = roles[0];
    const weakest = roles[roles.length - 1];

      return {
        memberCount: members.length || dashboardData?.teams?.reduce((sum, t) => sum + (t.memberCount || 0), 0) || 0,
        strongestControl: strongest?.name || 'N.v.t.',
        weakestControl: weakest?.name || 'N.v.t.',
        balanceScore: total > 0 ? Math.round((strongest?.value || 0) / total * 100) : 0,
      };
  }, [teamResults, dashboardData]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Team Controls Balans</h3>
        <p className={styles.sectionSubtitle}>
          Analyse van sterke en zwakke punten van je team controls.

        </p>
      </div>
      <div className={styles.cardsGrid}>
        <div className={styles.card}>

          <div className={`${styles.cardHeader} ${styles.cardHeaderGreen}`}></div>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Team Samenstelling</h4>
            <p className={styles.cardValue}>{memberCount} {memberCount === 1 ? 'lid' : 'leden'} met profiel</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.cardHeader} ${styles.cardHeaderBlue}`}></div>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Sterkste Control</h4>
            <p className={styles.cardValue}>{strongestControl}</p>
            <p className={`${styles.cardSubtext} ${styles.cardSubtextBlue}`}>Balans score: {balanceScore}%</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={`${styles.cardHeader} ${styles.cardHeaderRed}`}></div>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Zwakste Control</h4>
            <p className={styles.cardValue}>{weakestControl}</p>
            <p className={`${styles.cardSubtext} ${styles.cardSubtextRed}`}>Aandachtspunt voor werving</p>

          </div>
        </div>
      </div>
    </div>
  );
}

