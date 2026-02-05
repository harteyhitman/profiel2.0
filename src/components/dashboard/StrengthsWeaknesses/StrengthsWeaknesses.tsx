'use client';

import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './StrengthsWeaknesses.module.scss';

const ROLE_KEYS = [
  { name: 'Apostel', key: 'apostle' as const },
  { name: 'Profeet', key: 'prophet' as const },
  { name: 'Evangelist', key: 'evangelist' as const },
  { name: 'Herder', key: 'herder' as const },
  { name: 'Leraar', key: 'teacher' as const },
] as const;

interface StrengthsWeaknessesProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function StrengthsWeaknesses({ teamResults, dashboardData }: StrengthsWeaknessesProps) {
  const roles = useMemo(() => {
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;

    if (!scores) {
      return ROLE_KEYS.map((r) => ({ ...r, percentage: 0 }));
    }

    const total =
      (scores.apostle || 0) +
      (scores.prophet || 0) +
      (scores.evangelist || 0) +
      (scores.herder || 0) +
      (scores.teacher || 0);

    return ROLE_KEYS.map((r) => ({
      ...r,
      percentage: total > 0 ? Math.round(((scores[r.key] || 0) / total) * 100) : 0,
    }));
  }, [teamResults, dashboardData]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Strengths & Weaknesses</h3>
      </div>
      <ul className={styles.list}>
        {roles.map((role) => (
          <li key={role.name} className={styles.row}>
            <span className={styles.roleName}>{role.name}</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${Math.min(role.percentage, 100)}%` }}
                role="progressbar"
                aria-valuenow={role.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className={styles.percentage}>{role.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

