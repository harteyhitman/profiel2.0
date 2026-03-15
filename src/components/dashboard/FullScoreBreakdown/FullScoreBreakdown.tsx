'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLE_LABELS, type RoleKey } from '@/lib/constants/questionnaire';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './FullScoreBreakdown.module.scss';

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
const MAX_SCORE_PER_ROLE = 80;
const LEGACY_MAX = 200; // scale from legacy 0–200 to 0–80 for display

interface FullScoreBreakdownProps {
  scores?: RoleScores | null;
  variant?: 'grid' | 'cards';
}

export default function FullScoreBreakdown({ scores, variant = 'grid' }: FullScoreBreakdownProps) {
  const scoreData = useMemo(() => {
    const list = ROLE_KEYS.map((key) => {
      const raw = scores?.[key] ?? 0;
      const score = raw <= MAX_SCORE_PER_ROLE ? raw : Math.round((raw / LEGACY_MAX) * MAX_SCORE_PER_ROLE);
      return {
        role: ROLE_LABELS[key],
        score,
        maxScore: MAX_SCORE_PER_ROLE,
      };
    });
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
      <h2 className={styles.cardTitle}>
        Volledige score-uitsplitsing
        <span className={styles.titleInfoIcon} title="Uitleg score-uitsplitsing" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </h2>
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
          <strong>{animatedValue}</strong> van {item.maxScore}
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
          <span className={styles.maxScoreText}>{item.maxScore} punten</span>
        </div>
        <div className={styles.scoreValue}>{animatedValue}</div>
      </div>
      {showDivider && <div className={styles.divider} />}
    </div>
  );
}

