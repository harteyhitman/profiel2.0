'use client';


import React, { useMemo } from 'react';
import type { TeamResults } from '@/lib/types/dashboard';
import styles from './TeamControlsBalance.module.scss';

interface TeamControlsBalanceProps {
  teamResults?: TeamResults | null;
  members?: any[];
}

export default function TeamControlsBalance({ teamResults, members: propMembers }: TeamControlsBalanceProps) {
  const { memberCount, strongestControl, weakestControl, balanceScore } = useMemo(() => {
    const members = propMembers || teamResults?.members || [];
    const scores = teamResults?.aggregatedScores;
    
    // Total member count from different sources
    const totalMemberCount = members.length || 
                           (teamResults as any)?.members?.length || 
                           0;
    
    if (!scores && totalMemberCount === 0) {
      return {
        memberCount: 0,
        strongestControl: 'N.v.t.',
        weakestControl: 'N.v.t.',
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

    // Count members with scores/profile
    const membersWithProfile = members.length > 0 
      ? members.filter((m: any) => m.profile || m.scores).length
      : totalMemberCount;

    return {
      memberCount: membersWithProfile,
      strongestControl: strongest?.name || 'N/A',
      weakestControl: weakest?.name || 'N/A',
      balanceScore: total > 0 ? Math.round((strongest?.value || 0) / total * 100) : 0,
    };
  }, [teamResults, propMembers]);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Team Balans</h3>
        <p className={styles.sectionSubtitle}>
          Analyse van sterktes en zwaktes van de bedieningen in uw team.
        </p>
      </div>
      <div className={styles.cardsGrid}>
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Team Samenstelling</h4>
            <p className={styles.cardValue}>{memberCount} leden met profiel</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardBlue}`}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Sterkste Bediening</h4>
            <p className={styles.cardValue}>{strongestControl}</p>
            <p className={`${styles.cardSubtext} ${styles.cardSubtextBlue}`}>Balans score: {balanceScore}%</p>
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardRed}`}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Zwakste Bediening</h4>
            <p className={styles.cardValue}>{weakestControl}</p>
            <p className={`${styles.cardSubtext} ${styles.cardSubtextRed}`}>Aandachtspunt voor werving</p>
          </div>
        </div>
      </div>
    </div>
  );
}

