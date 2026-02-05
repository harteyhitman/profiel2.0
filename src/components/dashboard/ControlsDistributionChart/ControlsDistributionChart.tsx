'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './ControlsDistributionChart.module.scss';

interface ControlsDistributionChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

/** Pie slice colors — exact match to design (flat, no gradients) */
const PIE_COLORS = [
  '#CAD9F3', /* Apostle: light blue/periwinkle */
  '#A2ECD3', /* Prophet: mint green */
  '#FDE6A9', /* Evangelist: soft yellow */
  '#F3B3BD', /* Shepherd: pink */
  '#2D2D2D', /* Teacher: near-black */
] as const;

const LABELS = ['Apostle', 'Prophet', 'Evangelist', 'Shepherd', 'Teacher'] as const;
const SCORE_KEYS = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'] as const;

/** SVG arc path for a pie slice: center (cx,cy), radius r, from startAngle to endAngle (radians, -π/2 = top). */
function getSlicePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export default function ControlsDistributionChart({ dashboardData }: ControlsDistributionChartProps) {
  const data = useMemo(() => {
    if (!dashboardData?.aggregatedScores) {
      return LABELS.map((label, i) => ({ label, value: 0, color: PIE_COLORS[i] }));
    }
    const scores = dashboardData.aggregatedScores;
    return LABELS.map((label, i) => ({
      label,
      value: scores[SCORE_KEYS[i]] ?? 0,
      color: PIE_COLORS[i],
    }));
  }, [dashboardData]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const cx = 100;
  const cy = 100;
  const r = 60;
  const startAngle = -Math.PI / 2; // top

  let currentAngle = startAngle;
  const slices = data.map((slice) => {
    const percentage = total > 0 ? slice.value / total : 0;
    const angleSize = percentage * 2 * Math.PI;
    const endAngle = currentAngle + angleSize;
    const path = getSlicePath(cx, cy, r, currentAngle, endAngle);
    currentAngle = endAngle;
    return { ...slice, path };
  });

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Controls distribution</h3>
        <p className={styles.subtitle}>Division of Primary Ministries Within the Church</p>
      </header>
      <div className={styles.content}>
        <div className={styles.pieWrap}>
          <svg
            className={styles.pie}
            viewBox="0 0 200 200"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.path}
                fill={slice.color}
              />
            ))}
          </svg>
        </div>
        <div className={styles.legend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
              <span className={styles.legendLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
