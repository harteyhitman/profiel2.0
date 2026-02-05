'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import styles from './RolePercentages.module.scss';

interface RolePercentagesProps {
  scores?: RoleScores | null;
}

const ROLE_ORDER: { key: keyof RoleScores; label: string }[] = [
  { key: 'apostle', label: 'Apostle' },
  { key: 'prophet', label: 'prophet' },
  { key: 'evangelist', label: 'evangelist' },
  { key: 'herder', label: 'shepherd' },
  { key: 'teacher', label: 'teacher' },
];

export default function RolePercentages({ scores }: RolePercentagesProps) {
  const roles = useMemo(() => {
    if (!scores) {
      return ROLE_ORDER.map(({ label }) => ({ label, percentage: 0 }));
    }
    const total = (scores.apostle || 0) + (scores.prophet || 0) + (scores.evangelist || 0) +
      (scores.herder || 0) + (scores.teacher || 0);
    return ROLE_ORDER.map(({ key, label }) => {
      const value = scores[key] ?? 0;
      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
      return { label, percentage };
    });
  }, [scores]);

  return (
    <div className={styles.container}>
      {roles.map((role, index) => (
        <div key={index} className={styles.roleItem}>
          <span className={styles.roleLabel}>{role.label}</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${role.percentage}%` }}
            />
          </div>
          <span className={styles.rolePercentage}>{role.percentage}%</span>
        </div>
      ))}
    </div>
  );
}
