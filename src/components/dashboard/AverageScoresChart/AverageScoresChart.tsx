'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './AverageScoresChart.module.scss';

const ROLE_CONFIG = [
  { label: 'apostle', key: 'apostle' as const, fill: 'var(--chart-apostle)' },
  { label: 'prophet', key: 'prophet' as const, fill: 'var(--chart-prophet)' },
  { label: 'evangelist', key: 'evangelist' as const, fill: 'var(--chart-evangelist)' },
  { label: 'shepherd', key: 'herder' as const, fill: 'var(--chart-shepherd)' },
  { label: 'teacher', key: 'teacher' as const, fill: 'var(--chart-teacher)' },
] as const;

interface AverageScoresChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function AverageScoresChart({ dashboardData }: AverageScoresChartProps) {
  const data = useMemo(() => {
    const scores = dashboardData?.averageScores ?? dashboardData?.aggregatedScores;
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
  }, [dashboardData]);

  const maxPct = Math.max(...data.map((d) => d.percentage), 1);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Average scores</h3>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.gridLines} aria-hidden />
        <div className={styles.barsContainer}>
          {data.map((item) => (
            <div key={item.label} className={styles.barItem}>
              <div
                className={styles.bar}
                style={{
                  height: `${(item.percentage / maxPct) * 100}%`,
                  backgroundColor: item.fill,
                }}
              />
              <span className={styles.barLabel}>{item.label}</span>
              <span className={styles.barPercentage}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
