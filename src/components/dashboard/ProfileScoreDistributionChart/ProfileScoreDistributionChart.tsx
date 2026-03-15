'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLE_LABELS, type RoleKey } from '@/lib/constants/questionnaire';
import styles from './ProfileScoreDistributionChart.module.scss';

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];

/** Green shades for horizontal bars (darker to lighter) */
const GREEN_SHADES = ['#065f46', '#047857', '#10b981', '#34d399', '#6ee7b7'];

interface ProfileScoreDistributionChartProps {
  scores?: RoleScores | null;
  title?: string;
}

export default function ProfileScoreDistributionChart({
  scores,
  title = 'Score verdeling',
}: ProfileScoreDistributionChartProps) {
  const data = useMemo(() => {
    if (!scores) {
      return ROLE_KEYS.map((key, i) => ({
        key,
        label: ROLE_LABELS[key],
        percentage: 0,
        color: GREEN_SHADES[i % GREEN_SHADES.length],
      }));
    }
    const total =
      (scores.apostle || 0) +
      (scores.prophet || 0) +
      (scores.evangelist || 0) +
      (scores.herder || 0) +
      (scores.teacher || 0);
    return ROLE_KEYS.map((key, i) => {
      const value = scores[key] ?? 0;
      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
      return {
        key,
        label: ROLE_LABELS[key],
        percentage,
        color: GREEN_SHADES[i % GREEN_SHADES.length],
      };
    });
  }, [scores]);

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.chart}>
        {data.map((item) => (
          <div key={item.key} className={styles.barRow}>
            <span className={styles.label}>{item.label}</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className={styles.percentage}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
