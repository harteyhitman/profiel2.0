'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLE_LABELS, type RoleKey } from '@/lib/constants/questionnaire';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './FullScoreBreakdown.module.scss';

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
const MAX_SCORE_PER_ROLE = 200; // 40 × 5 (docs/QUESTIONNAIRE_AND_RESULTS_V2.md)

interface FullScoreBreakdownProps {
  scores?: RoleScores | null;
  variant?: 'grid' | 'cards';
}

export default function FullScoreBreakdown({ scores, variant = 'grid' }: FullScoreBreakdownProps) {
  const scoreData = useMemo(() => {
    const list = ROLE_KEYS.map((key) => ({
      role: ROLE_LABELS[key],
      score: scores?.[key] ?? 0,
      maxScore: MAX_SCORE_PER_ROLE,
    }));
    return list.sort((a, b) => b.score - a.score);
  }, [scores]);

  if (variant === 'cards') {
    return (
      <div className={styles.cardsList}>
        {scoreData.map((item, index) => (
          <ScoreCard
            key={item.role}
            item={item}
            index={index}
            highlight={index === scoreData.length - 1}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.cardTitle}>Full Score Breakdown</h2>
      <div className={styles.grid}>
        {scoreData.map((item, index) => (
          <AnimatedScoreItem
            key={item.role}
            item={item}
            delay={index * 150}
            showDivider={index < scoreData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

// Card variant: single card with progress bar (for Result page)
function ScoreCard({
  item,
  index,
  highlight,
}: {
  item: { role: string; score: number; maxScore: number };
  index: number;
  highlight: boolean;
}) {
  const animatedValue = useCountUp(item.score, {
    enabled: true,
    duration: 1000,
    start: 0,
  });
  const pct = item.maxScore ? (animatedValue / item.maxScore) * 100 : 0;
  return (
    <div className={`${styles.scoreCard} ${highlight ? styles.scoreCardHighlight : ''}`}>
      <div className={styles.scoreCardHeader}>
        <span className={styles.scoreCardRole}>{item.role}</span>
        <span className={styles.scoreCardScore}>
          <strong>{animatedValue}</strong> of {item.maxScore}
        </span>
      </div>
      <div className={styles.scoreCardBarTrack}>
        <div
          className={styles.scoreCardBarFill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// Grid variant: animated score item with divider
function AnimatedScoreItem({ item, showDivider }: { item: { role: string; score: number; maxScore: number }; delay?: number; showDivider: boolean }) {
  const animatedValue = useCountUp(item.score, {
    enabled: true,
    duration: 1000,
    start: 0,
  });

  return (
    <div className={styles.scoreItem}>
      <div className={styles.scoreContent}>
        <div className={styles.roleInfo}>
          <span className={styles.roleLabel}>{item.role}</span>
          <span className={styles.maxScoreText}>{item.maxScore} points</span>
        </div>
        <div className={styles.scoreValue}>{animatedValue}</div>
      </div>
      {showDivider && <div className={styles.divider} />}
    </div>
  );
}

