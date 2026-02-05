'use client';


import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './RoleDistributionChart.module.scss';

interface RoleDistributionChartProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function RoleDistributionChart({ teamResults, dashboardData }: RoleDistributionChartProps) {
  const { primaryRole, secondaryRole, totalValue } = useMemo(() => {
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;
    
    if (!scores) {
      return {
        primaryRole: { name: 'Apostel', percentage: 0, color: '#A855F7' },
        secondaryRole: { name: 'Profeet', percentage: 0, color: '#5EEAD4' },
        totalValue: 0,
      };
    }

    const roles = [
      { name: 'Apostel', value: scores.apostle || 0 },
      { name: 'Profeet', value: scores.prophet || 0 },
      { name: 'Evangelist', value: scores.evangelist || 0 },
      { name: 'Herder', value: scores.herder || 0 },
      { name: 'Leraar', value: scores.teacher || 0 },
    ].sort((a, b) => b.value - a.value);

    const total = roles.reduce((sum, r) => sum + r.value, 0);
    const primary = roles[0];
    const secondary = roles[1] || { name: 'Profeet', value: 0 };

    return {
      primaryRole: {
        name: primary.name,
        percentage: total > 0 ? Math.round((primary.value / total) * 100) : 0,
        color: '#A855F7',
      },
      secondaryRole: {
        name: secondary.name,
        percentage: total > 0 ? Math.round((secondary.value / total) * 100) : 0,
        color: '#5EEAD4',
      },
      totalValue: total,
    };
  }, [teamResults, dashboardData]);


  // Calculate angles for donut chart
  const circumference = 2 * Math.PI * 80; // radius = 80
  const primaryDash = (primaryRole.percentage / 100) * circumference;
  const secondaryDash = (secondaryRole.percentage / 100) * circumference;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Primaire en Secundaire Rol Profielverdeling</h3>
        <p className={styles.chartSubtitle}>
          Het helpt je de balans van rollen in je team te begrijpen.
        </p>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.donutContainer}>
          <svg width="200" height="200" viewBox="0 0 200 200" className={styles.donutSvg}>
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#E0E0E0"
              strokeWidth="20"
            />
            {/* Primary role arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={primaryRole.color}
              strokeWidth="20"
              strokeDasharray={`${primaryDash} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
              strokeLinecap="round"
            />
            {/* Percentage label for primary role */}
            <g>
              <rect
                x="85"
                y="50"
                width="30"
                height="20"
                rx="4"
                fill="#111827"
              />
              <text
                x="100"
                y="64"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="600"
              >
                {primaryRole.percentage}%
              </text>
            </g>
            {/* Secondary role arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={secondaryRole.color}
              strokeWidth="20"
              strokeDasharray={`${secondaryDash} ${circumference}`}
              strokeDashoffset={-primaryDash}
              transform="rotate(-90 100 100)"
              strokeLinecap="round"
            />
            {/* Center text */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.centerText}
            >
              {totalValue}
            </text>
          </svg>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: primaryRole.color }} />
            <span className={styles.legendLabel}>{primaryRole.name}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ backgroundColor: secondaryRole.color }} />
            <span className={styles.legendLabel}>{secondaryRole.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

