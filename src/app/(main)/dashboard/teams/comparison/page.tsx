'use client';

import React, { useMemo } from 'react';
import { useChurchDashboard, useMyChurch } from '@/hooks/use-dashboard';
import { generateDummyDashboardData } from '@/lib/utils/dummyData';
import TeamComparison from '@/components/dashboard/TeamComparison/TeamComparison';
import styles from '../page.module.scss';

export default function TeamComparisonPage() {
  const { data: churchData } = useMyChurch();
  const churchId = (churchData as any)?.church?.id ?? null;
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(churchId);

  const effectiveDashboardData = useMemo(() => {
    if (dashboardData) return dashboardData;
    if (dashboardLoading) return null;
    return generateDummyDashboardData();
  }, [dashboardData, dashboardLoading]);

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Teamvergelijking</h1>
          <p className={styles.subtitle}>
            Vergelijk de profielen van verschillende teams binnen je kerk.
          </p>
        </div>
      </div>

      <TeamComparison teams={effectiveDashboardData?.teams || []} />
    </div>
  );
}
