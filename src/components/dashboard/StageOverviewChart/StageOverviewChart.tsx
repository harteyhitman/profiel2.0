'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './StageOverviewChart.module.scss';

interface StageOverviewChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function StageOverviewChart({ dashboardData }: StageOverviewChartProps) {
  const stages = useMemo(() => [
    { name: 'Start', percentage: 45, color: '#93C5FD' },
    { name: 'Active', percentage: 20, color: '#A78BFA' },
    { name: 'Growing', percentage: 39, color: '#F9A8D4' },
    { name: 'Deepening', percentage: 30, color: '#86EFAC' },
    { name: 'Fruitful', percentage: 25, color: '#FDE047' },
  ], [dashboardData]);

  return (
    <div className={styles.chart}>
      <div className={styles.bars}>
        {stages.map((stage) => (
          <VerticalStageBar key={stage.name} stage={stage} />
        ))}
      </div>
    </div>
  );
}

function VerticalStageBar({ stage }: { stage: { name: string; percentage: number; color: string } }) {
  const animatedPercentage = useCountUp(stage.percentage, {
    enabled: true,
    duration: 1200,
    start: 0,
  });
  const animatedValue = useCountUp(stage.percentage, {
    enabled: true,
    duration: 1200,
    start: 0,
  });

  return (
    <div className={styles.barColumn}>
      <div className={styles.barWrapper}>
        <div
          className={styles.bar}
          style={{
            height: `${animatedPercentage}%`,
            backgroundColor: stage.color,
          }}
        >
          <span className={styles.stageNameInBar}>{stage.name}</span>
        </div>
      </div>
      <span className={styles.percentage}>{animatedValue}%</span>
    </div>
  );
}
