'use client';


import React, { useMemo } from 'react';
import type { TeamResults } from '@/lib/types/dashboard';
import styles from './UnderrepresentedMinistries.module.scss';

interface UnderrepresentedMinistriesProps {
  teamResults?: TeamResults | null;
  members?: any[];
}

const ROLE_COLORS: Record<string, string> = {
  'Apostel': '#3b82f6', // Blue
  'Profeet': '#10b981', // Green
  'Evangelist': '#ec4899', // Pink
  'Herder': '#f59e0b', // Orange
  'Leraar': '#8b5cf6', // Purple
};

export default function UnderrepresentedMinistries({ teamResults, members: propMembers }: UnderrepresentedMinistriesProps) {
  const ministries = useMemo(() => {
    const scores = teamResults?.aggregatedScores;
    
    if (!scores) {
      return [
        { name: 'Apostel', key: 'apostle', memberCount: 0, description: 'Het team heeft meer Apostolische energie nodig.' },
        { name: 'Profeet', key: 'prophet', memberCount: 0, description: 'Het team heeft meer Profetische energie nodig.' },
        { name: 'Evangelist', key: 'evangelist', memberCount: 0, description: 'Het team heeft meer Evangelistische energie nodig.' },
        { name: 'Herder', key: 'herder', memberCount: 0, description: 'Het team heeft meer Herderlijke energie nodig.' },
        { name: 'Leraar', key: 'teacher', memberCount: 0, description: 'Het team heeft meer Onderwijzende energie nodig.' },
      ];
    }

    const roles = [
      { name: 'Apostel', key: 'apostle', value: scores.apostle || 0, description: 'Het team heeft meer Apostolische energie nodig.' },
      { name: 'Profeet', key: 'prophet', value: scores.prophet || 0, description: 'Het team heeft meer Profetische energie nodig.' },
      { name: 'Evangelist', key: 'evangelist', value: scores.evangelist || 0, description: 'Het team heeft meer Evangelistische energie nodig.' },
      { name: 'Herder', key: 'herder', value: scores.herder || 0, description: 'Het team heeft meer Herderlijke energie nodig.' },
      { name: 'Leraar', key: 'teacher', value: scores.teacher || 0, description: 'Het team heeft meer Onderwijzende energie nodig.' },
    ].sort((a, b) => a.value - b.value);

    // Filter members who have these roles as primary
    const members = propMembers || teamResults?.members || [];
    
    return roles.map(role => {
      const primaryCount = members.length > 0 ? members.filter((m: any) => {
        const s = m.profile || m.scores;
        if (!s) return false;
        // Find the key with the highest value
        let maxVal = -1;
        let dominant = '';
        for (const [key, val] of Object.entries(s)) {
          if (typeof val === 'number' && val > maxVal) {
            maxVal = val;
            dominant = key;
          }
        }
        return dominant === role.key;
      }).length : 0;

      return {
        ...role,
        memberCount: primaryCount
      };
    });
  }, [teamResults, propMembers]);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Ondervertegenwoordigde Bedieningen</h3>

      <div className={styles.columnsGrid}>
        <div className={styles.column}>
          {ministries.slice(0, 3).map((ministry, index) => (
            <div key={index} className={styles.ministryItem}>
              <div 
                className={styles.ministryTag}
                style={{ 
                  backgroundColor: `${ROLE_COLORS[ministry.name] || '#10b981'}15`,
                  color: ROLE_COLORS[ministry.name] || '#10b981'
                }}
              >
                {ministry.name}
              </div>
              <div className={styles.descriptionBox}>
                <p className={styles.ministryDescription}>
                  {ministry.description}
                </p>
                <span className={styles.memberCount}>
                  {ministry.memberCount} {ministry.memberCount === 1 ? 'lid' : 'leden'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.column}>
          {ministries.slice(3, 5).map((ministry, index) => (
            <div key={index} className={styles.ministryItem}>
              <div 
                className={styles.ministryTag}
                style={{ 
                  backgroundColor: `${ROLE_COLORS[ministry.name] || '#10b981'}15`,
                  color: ROLE_COLORS[ministry.name] || '#10b981'
                }}
              >
                {ministry.name}
              </div>
              <div className={styles.descriptionBox}>
                <p className={styles.ministryDescription}>
                  {ministry.description}
                </p>
                <span className={styles.memberCount}>
                  {ministry.memberCount} {ministry.memberCount === 1 ? 'lid' : 'leden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

