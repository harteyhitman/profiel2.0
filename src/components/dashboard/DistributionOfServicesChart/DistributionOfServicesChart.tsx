'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './DistributionOfServicesChart.module.scss';

interface DistributionOfServicesChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

interface ServiceRow {
  label: string;
  percentage: number;
}

function ProgressRow({ label, percentage }: ServiceRow) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className={styles.percentage}>{percentage}%</span>
    </div>
  );
}

export default function DistributionOfServicesChart({ dashboardData }: DistributionOfServicesChartProps) {
  const data = useMemo((): ServiceRow[] => {
    if (dashboardData?.aggregatedScores) {
      const scores = dashboardData.aggregatedScores;
      const total =
        (scores.apostle || 0) +
        (scores.prophet || 0) +
        (scores.evangelist || 0) +
        (scores.herder || 0) +
        (scores.teacher || 0);
      if (total > 0) {
        return [
          { label: 'Start', percentage: Math.round(((scores.apostle || 0) / total) * 100) },
          { label: 'Active', percentage: Math.round(((scores.prophet || 0) / total) * 100) },
          { label: 'Growing', percentage: Math.round(((scores.evangelist || 0) / total) * 100) },
          { label: 'Deepening', percentage: Math.round(((scores.herder || 0) / total) * 100) },
          { label: 'Fruitful', percentage: Math.round(((scores.teacher || 0) / total) * 100) },
        ];
      }
    }
    return [
      { label: 'Start', percentage: 43 },
      { label: 'Active', percentage: 35 },
      { label: 'Growing', percentage: 14 },
      { label: 'Deepening', percentage: 5 },
      { label: 'Fruitful', percentage: 5 },
    ];
  }, [dashboardData]);

  return (
    <div className={styles.card}>
      <div className={styles.rows}>
        {data.map((row) => (
          <ProgressRow key={row.label} label={row.label} percentage={row.percentage} />
        ))}
      </div>
    </div>
  );
}
