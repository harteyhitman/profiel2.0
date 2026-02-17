'use client';

import React, { useMemo } from 'react';
import { useChurchDashboard, useMyChurch } from '@/hooks/use-dashboard';
import { generateDummyDashboardData } from '@/lib/utils/dummyData';
import { TeamGapAnalysis } from '@/components/dashboard/TeamGapAnalysis/TeamGapAnalysis';
import styles from '../page.module.scss';

export default function TeamGapAnalysisPage() {
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
          <h1 className={styles.title}>Hiatenanalyse</h1>
          <p className={styles.subtitle}>
            Analyseer de gaten in de bedieningenprofielen van je teams.
          </p>
        </div>
      </div>

      <TeamGapAnalysis
        teams={effectiveDashboardData?.teams || []}
        teamRoleScores={effectiveDashboardData?.aggregatedScores || { apostle: 0, prophet: 0, evangelist: 0, herder: 0, teacher: 0 }}
        teamMembers={[]}
      />
    </div>
  );
}
