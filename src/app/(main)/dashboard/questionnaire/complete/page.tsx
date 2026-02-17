'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/forms';
import { useAuth } from '@/contexts/AuthContext';
import { useUserResults } from '@/hooks/use-dashboard';
import { calculatePrimaryRole } from '@/lib/utils/roleCalculations';
import { ROLE_LABELS, type RoleKey } from '@/lib/constants/questionnaire';
import type { UserResults } from '@/lib/types/dashboard';
import CelebrationEffect from '@/components/dashboard/CelebrationEffect/CelebrationEffect';
import styles from './page.module.scss';

export default function QuestionnaireCompletePage() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id != null ? Number(user.id) : null;
  const { data: userResults } = useUserResults(userId ?? undefined);
  const results = userResults as UserResults | undefined;
  const scores = results?.scores ?? null;
  const roleProfile = scores ? calculatePrimaryRole(scores) : null;
  const primaryRoleLabel = roleProfile?.primaryRole ? ROLE_LABELS[roleProfile.primaryRole as RoleKey] : null;

  const [showCelebration, setShowCelebration] = useState(true);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    localStorage.setItem('showResultNav', 'true');
    router.push('/dashboard/result');
  };

  const handleViewResults = () => {
    localStorage.setItem('showResultNav', 'true');
    router.push('/dashboard/result');
  };

  return (
    <>
      <CelebrationEffect
        show={showCelebration}
        onComplete={handleCelebrationComplete}
        primaryRole={primaryRoleLabel}
        message="Gefeliciteerd! Je hebt de vragenlijst voltooid."
      />
      <div className={styles.page}>
        <div className={styles.completionCard}>
          <h1 className={styles.title}>Vragenlijst Voltooid</h1>
          <p className={styles.message}>
            Je hebt de Bedieningenprofiel beoordeling voltooid. Laten we zien hoe je gaven aansluiten bij je roeping.
          </p>
          <Button
            variant="primary"
            type="button"
            onClick={handleViewResults}
            className={styles.viewResultsButton}
          >
            Bekijk Resultaten
          </Button>
        </div>
      </div>
    </>
  );
}

