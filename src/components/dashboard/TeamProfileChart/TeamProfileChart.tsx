'use client';

import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './TeamProfileChart.module.scss';

const ROLE_CONFIG = [
  { name: 'Apostel', key: 'apostle' as const, fill: 'var(--chart-apostle)' },
  { name: 'Profeet', key: 'prophet' as const, fill: 'var(--chart-prophet)' },
  { name: 'Evangelist', key: 'evangelist' as const, fill: 'var(--chart-evangelist)' },
  { name: 'Herder', key: 'herder' as const, fill: 'var(--chart-shepherd)' },
  { name: 'Leraar', key: 'teacher' as const, fill: 'var(--chart-teacher)' },
] as const;

interface TeamProfileChartProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TeamProfileChart({ teamResults, dashboardData }: TeamProfileChartProps) {
  const roles = useMemo(() => {
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;

    if (!scores) {
      return ROLE_CONFIG.map((r) => ({ ...r, percentage: 0 }));
    }

    const total =
      (scores.apostle || 0) +
      (scores.prophet || 0) +
      (scores.evangelist || 0) +
      (scores.herder || 0) +
      (scores.teacher || 0);

    return ROLE_CONFIG.map((r) => ({
      ...r,
      percentage: total > 0 ? Math.round(((scores[r.key] || 0) / total) * 100) : 0,
    }));
  }, [teamResults, dashboardData]);

  const maxPercentage = Math.max(...roles.map((r) => r.percentage), 1);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Team Profile</h3>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.gridLines} aria-hidden />
        <div className={styles.barsContainer}>
          {roles.map((role) => (
            <div key={role.name} className={styles.barItem}>
              <div
                className={styles.bar}
                style={{
                  height: `${(role.percentage / maxPercentage) * 100}%`,
                  backgroundColor: role.fill,
                }}
              >
                <span className={styles.barLabel}>{role.name}</span>
              </div>
              <span className={styles.barPercentage}>{role.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

