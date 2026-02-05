'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_COLORS, type RoleKey } from '@/lib/constants/questionnaire';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './ScoreOverviewChart.module.scss';

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];

const MAX_SCORE_PER_ROLE = 200; // 40 questions × 5 (docs/QUESTIONNAIRE_AND_RESULTS_V2.md)

function AnimatedBarGroup({
  score,
  maxScore,
  delay,
}: {
  score: { label: string; value: number; color: string };
  maxScore: number;
  delay: number;
}) {
  const animatedValue = useCountUp(score.value, {
    enabled: true,
    duration: 1500,
    start: 0,
  });

  return (
    <div className={styles.barGroup}>
      <div className={styles.barWrapper}>
        <div
          className={styles.bar}
          style={{
            height: `${maxScore > 0 ? (animatedValue / maxScore) * 100 : 0}%`,
            backgroundColor: score.color,
            transition: 'height 0.1s ease-out',
          }}
        />
      </div>
      <div className={styles.xAxisLabel}>{score.label}</div>
    </div>
  );
}

interface ScoreOverviewChartProps {
  scores?: RoleScores | null;
}

export default function ScoreOverviewChart({ scores: propScores }: ScoreOverviewChartProps) {
  const scores = useMemo(() => {
    if (propScores) {
      return ROLE_KEYS.map((key) => ({
        label: ROLE_LABELS[key],
        value: propScores[key] ?? 0,
        color: ROLE_COLORS[key],
      }));
    }
    return ROLE_KEYS.map((key) => ({
      label: ROLE_LABELS[key],
      value: 0,
      color: ROLE_COLORS[key],
    }));
  }, [propScores]);

  return (
    <div className={styles.chart}>
      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          {[200, 150, 100, 50, 0].map((value) => (
            <div key={value} className={styles.yAxisLabel}>
              {value}
            </div>
          ))}
        </div>
        <div className={styles.barsContainer}>
          <div className={styles.gridLines} aria-hidden="true">
            {[200, 150, 100, 50].map((y) => (
              <div
                key={y}
                className={styles.gridLine}
                style={{ bottom: `${(y / MAX_SCORE_PER_ROLE) * 100}%` }}
              />
            ))}
          </div>
          {scores.map((score, index) => (
            <AnimatedBarGroup
              key={score.label}
              score={score}
              maxScore={MAX_SCORE_PER_ROLE}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

