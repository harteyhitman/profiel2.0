'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './TopGrowthAreasChart.module.scss';

interface TopGrowthAreasChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TopGrowthAreasChart({ dashboardData }: TopGrowthAreasChartProps) {
  const growthAreas = useMemo(() => [
    { name: 'Community', color: '#A78BFA', percentage: 27 },
    { name: 'Safety', color: '#86EFAC', percentage: 22 },
    { name: 'Teen Ministry', color: '#F9A8D4', percentage: 20 },
    { name: 'Worship', color: '#14B8A6', percentage: 17 },
    { name: 'Young Adults', color: '#000000', percentage: 14 },
  ], [dashboardData]);
  const total = growthAreas.reduce((sum, area) => sum + area.percentage, 0);
  let currentAngle = -90; // Start from top

  return (
    <div className={styles.chart}>
      <div className={styles.legend}>
        {growthAreas.map((area, index) => (
          <div key={index} className={styles.legendItem}>
            <div
              className={styles.legendColor}
              style={{ backgroundColor: area.color }}
            />
            <span className={styles.legendLabel}>{area.name}</span>
          </div>
        ))}
      </div>
      <div className={styles.pieContainer}>
        <svg viewBox="0 0 200 200" className={styles.pie}>
          {growthAreas.map((area, index) => {
            const startAngle = currentAngle;
            const angle = (area.percentage / total) * 360;
            const endAngle = startAngle + angle;
            const largeArcFlag = angle > 180 ? 1 : 0;

            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(' ');

            currentAngle = endAngle;

            return (
              <path
                key={index}
                d={pathData}
                fill={area.color}
                className={styles.pieSegment}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

