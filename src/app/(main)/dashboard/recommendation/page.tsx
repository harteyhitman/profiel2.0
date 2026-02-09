'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserResults } from '@/hooks/use-dashboard';
import type { UserResults } from '@/lib/types/dashboard';
import { calculatePrimaryRole } from '@/lib/utils/roleCalculations';
import {
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  RECOMMENDATION_STRENGTHS,
  RECOMMENDATION_DEVELOPMENT,
  type RoleKey,
} from '@/lib/constants/questionnaire';
import styles from './page.module.scss';

export default function RecommendationPage() {
  const { user } = useAuth();
  const userId = user?.id != null ? Number(user.id) : null;
  const { data: userResults, isLoading } = useUserResults(userId ?? undefined);
  const results = userResults as UserResults | undefined;
  const scores = results?.scores ?? null;
  const roleProfile = scores ? calculatePrimaryRole(scores) : null;
  const primaryRole = roleProfile?.primaryRole ?? null;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} aria-hidden />
          <p className={styles.loadingText}>Laden…</p>
        </div>
      </div>
    );
  }

  if (!primaryRole) {
    return (
      <div className={styles.page}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Aanbeveling</h1>
          <p className={styles.subtitle}>
            Vul eerst de vragenlijst in om je persoonlijke aanbevelingen te zien.
          </p>
          <Link href="/dashboard/questionnaire" className={styles.primaryButton}>
            Naar vragenlijst
          </Link>
        </div>
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[primaryRole as RoleKey];
  const description = ROLE_DESCRIPTIONS[primaryRole as RoleKey];
  const color = ROLE_COLORS[primaryRole as RoleKey];
  const strengths = RECOMMENDATION_STRENGTHS[primaryRole as RoleKey];
  const development = RECOMMENDATION_DEVELOPMENT[primaryRole as RoleKey];

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Aanbeveling</h1>
      </div>

      <section className={styles.primaryRoleSection} style={{ borderLeftColor: color }}>
        <h2 className={styles.primaryRoleTitle}>Jouw primaire rol is {roleLabel}</h2>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Waarom {roleLabel}?</h3>
        <p className={styles.blockText}>{description}</p>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Sterke punten van een {roleLabel}</h3>
        <ul className={styles.bulletList}>
          {strengths.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Ontwikkelpunten</h3>
        <ul className={styles.bulletList}>
          {development.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <div className={styles.actions}>
        <Link href="/dashboard/result" className={styles.primaryButton}>
          Bekijk resultaat
        </Link>
      </div>
    </div>
  );
}
