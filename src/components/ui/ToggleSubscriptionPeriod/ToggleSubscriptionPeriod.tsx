'use client';

import React from 'react';
import styles from './ToggleSubscriptionPeriod.module.scss';

export type Period = 'monthly' | 'yearly';

interface ToggleSubscriptionPeriodProps {
  period: Period;
  onChange: (period: Period) => void;
}

export default function ToggleSubscriptionPeriod({
  period,
  onChange,
}: ToggleSubscriptionPeriodProps) {
  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        className={`${styles.toggleButton} ${period === 'monthly' ? styles.active : ''}`}
        onClick={() => onChange('monthly')}
      >
        Maandelijks
      </button>
      <button
        type="button"
        className={`${styles.toggleButton} ${period === 'yearly' ? styles.active : ''}`}
        onClick={() => onChange('yearly')}
      >
        Jaarlijks
      </button>
    </div>
  );
}

