'use client';

import React, { useMemo } from 'react';
import type { RoleScores } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type RoleKey } from '@/lib/constants/questionnaire';
import styles from './CoreControl.module.scss';

const ROLE_KEYS: RoleKey[] = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];

interface CoreControlProps {
  scores?: RoleScores | null;
}

export default function CoreControl({ scores }: CoreControlProps) {
  const coreControls = useMemo(() => {
    if (scores) {
      const withScores = ROLE_KEYS.map((key) => ({
        key,
        value: scores[key] ?? 0,
        label: ROLE_LABELS[key],
        description: ROLE_DESCRIPTIONS[key],
      }));
      const sorted = [...withScores].sort((a, b) => b.value - a.value);
      const primary = sorted[0];
      const secondary = sorted[1];
      return [
        { type: 'Primary' as const, label: primary.label, description: primary.description },
        { type: 'Secondary' as const, label: secondary.label, description: secondary.description },
      ];
    }
    return [
      { type: 'Primary' as const, label: ROLE_LABELS.prophet, description: ROLE_DESCRIPTIONS.prophet },
      { type: 'Secondary' as const, label: ROLE_LABELS.teacher, description: ROLE_DESCRIPTIONS.teacher },
    ];
  }, [scores]);
  return (
    <div className={styles.container}>
      {coreControls.map((control, index) => (
        <div
          key={control.type}
          className={index === 0 ? styles.cardPrimary : styles.cardSecondary}
        >
          <div className={index === 0 ? styles.badgePrimary : styles.badgeSecondary}>
            {control.type}
          </div>
          <div className={styles.content}>
            <h3 className={styles.label}>{control.label}</h3>
            <p className={styles.description}>{control.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

