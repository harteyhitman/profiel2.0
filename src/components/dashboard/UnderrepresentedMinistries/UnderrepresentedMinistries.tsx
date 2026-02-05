'use client';


import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './UnderrepresentedMinistries.module.scss';

interface UnderrepresentedMinistriesProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function UnderrepresentedMinistries({ teamResults, dashboardData }: UnderrepresentedMinistriesProps) {
  const ministries = useMemo(() => {
    const members = teamResults?.members || [];
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;
    
    if (!scores || members.length === 0) {
      return [
        { name: 'Apostel', memberCount: 0 },
        { name: 'Apostel', memberCount: 0 },
        { name: 'Apostel', memberCount: 0 },
        { name: 'Apostel', memberCount: 0 },
        { name: 'Apostel', memberCount: 0 },
        { name: 'Apostel', memberCount: 0 },
      ];
    }

    // Find underrepresented roles (roles with low scores)
    const roles = [
      { name: 'Apostel', value: scores.apostle || 0 },
      { name: 'Profeet', value: scores.prophet || 0 },
      { name: 'Evangelist', value: scores.evangelist || 0 },
      { name: 'Herder', value: scores.herder || 0 },
      { name: 'Leraar', value: scores.teacher || 0 },
    ].sort((a, b) => a.value - b.value);

    // Return the 6 most underrepresented (with some repetition for design)
    return [
      { name: roles[0]?.name || 'Apostel', memberCount: 0 },
      { name: roles[0]?.name || 'Apostel', memberCount: members.length > 0 ? Math.floor(members.length * 0.1) : 0 },
      { name: roles[0]?.name || 'Apostel', memberCount: 0 },
      { name: roles[0]?.name || 'Apostel', memberCount: 0 },
      { name: roles[0]?.name || 'Apostel', memberCount: 0 },
      { name: roles[0]?.name || 'Apostel', memberCount: 0 },
    ];
  }, [teamResults, dashboardData]);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Ondervertegenwoordigde Bedieningen</h3>

      <div className={styles.columnsGrid}>
        <div className={styles.column}>
          {ministries.slice(0, 3).map((ministry, index) => (
            <div key={index} className={styles.ministryItem}>

             
              <div className={styles.descriptionBox}>
              <button className={styles.ministryButton}>
                {ministry.name}
              </button>
                <p className={styles.ministryDescription}>
                  Het team heeft meer {ministry.name} energie nodig.
                </p>
              </div>
              <span className={styles.memberCount}>
                {ministry.memberCount} {ministry.memberCount === 1 ? 'lid' : 'leden'}

              </span>
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {ministries.slice(3, 6).map((ministry, index) => (
            <div key={index} className={styles.ministryItem}>

             
              <div className={styles.descriptionBox}>
              <button className={styles.ministryButton}>
                {ministry.name}
              </button>
                <p className={styles.ministryDescription}>
                  Het team heeft meer {ministry.name} energie nodig.
                </p>
              </div>
              <span className={styles.memberCount}>
                {ministry.memberCount} {ministry.memberCount === 1 ? 'lid' : 'leden'}

              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

