'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import { useCountUp } from '@/hooks/useCountUp';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import styles from './TeamEngagementChart.module.scss';

const teamEngagementChartConfig = {
  completed: {
    label: 'Voltooide beoordeling',
    color: 'var(--green-primary)',
  },
  incompleted: {
    label: 'Onvoltooide beoordeling',
    color: 'var(--green-light)',
  },
} satisfies ChartConfig;

const AnimatedValue = ({
  value,
  isVisible,
  delay = 0,
  className,
}: {
  value: number;
  isVisible: boolean;
  delay?: number;
  className?: string;
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setShouldAnimate(true), delay);
      return () => clearTimeout(t);
    }
  }, [isVisible, delay]);
  const animatedValue = useCountUp(value, { enabled: shouldAnimate, duration: 1000 });
  return <span className={className}>{animatedValue}</span>;
};

interface TeamEngagementChartProps {
  completed?: number;
  incompleted?: number;
  subtitle?: string;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TeamEngagementChart({
  completed: propCompleted,
  incompleted: propIncompleted,
  subtitle: propSubtitle,
  dashboardData,
}: TeamEngagementChartProps) {
  const { completed, incompleted, subtitle } = useMemo(() => {
    if (propCompleted !== undefined && propIncompleted !== undefined) {
      return {
        completed: propCompleted,
        incompleted: propIncompleted,
        subtitle: propSubtitle || '5 teams hebben hun rolbeoordelingen voltooid.',
      };
    }
    const teams = dashboardData?.teams || [];
    const totalTeams = teams.length || dashboardData?.church?.totalTeams || 8;
    const teamsWithProfiles = teams.filter((t) => (t.memberCount || 0) > 0).length;
    const completedCount =
      teamsWithProfiles > 0 ? teamsWithProfiles : Math.floor(totalTeams * 0.75);
    const incompletedCount = totalTeams - completedCount;
    return {
      completed: completedCount,
      incompleted: incompletedCount,
      subtitle: `${completedCount} teams hebben hun rolbeoordelingen voltooid.`,
    };
  }, [propCompleted, propIncompleted, propSubtitle, dashboardData]);

  const [selectedPeriod, setSelectedPeriod] = useState('Deze maand');
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const periodData: Record<
    string,
    { completed: number; incompleted: number; subtitle: string }
  > = useMemo(
    () => ({
      'Deze maand': {
        completed,
        incompleted,
        subtitle,
      },
      'Vorige maand': {
        completed: Math.max(0, completed - 2),
        incompleted: incompleted + 2,
        subtitle: `${Math.max(0, completed - 2)} teams hebben hun rolbeoordelingen voltooid.`,
      },
      'Dit jaar': {
        completed: completed * 12,
        incompleted: incompleted * 12,
        subtitle: `${completed * 12} teams hebben hun rolbeoordelingen dit jaar voltooid.`,
      },
    }),
    [completed, incompleted, subtitle]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const currentData = periodData[selectedPeriod];
  const pieData = [
    { name: 'completed', value: currentData.completed, fill: teamEngagementChartConfig.completed.color },
    { name: 'incompleted', value: currentData.incompleted, fill: teamEngagementChartConfig.incompleted.color },
  ].filter((d) => d.value > 0);
  const displayData = pieData.length ? pieData : [{ name: 'empty', value: 1, fill: '#f0f0f0' }];

  return (
    <div className={styles.chartCard} ref={chartRef}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Team Betrokkenheid</h3>
          <p className={styles.chartSubtitle}>{currentData.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <select
            className={styles.periodSelect}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="Deze maand">Deze maand</option>
            <option value="Vorige maand">Vorige maand</option>
            <option value="Dit jaar">Dit jaar</option>
          </select>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.progressCircle} style={{ position: 'relative', width: 240, height: 140 }}>
          <ChartContainer
            config={teamEngagementChartConfig}
            className="h-[140px] w-[240px] min-h-0"
          >
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                strokeWidth={0}
              >
                {displayData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ChartContainer>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -70%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            {isVisible && (
              <span className={styles.percentageText} style={{ display: 'block' }}>
                <AnimatedValue value={currentData.completed} isVisible={isVisible} delay={500} />
              </span>
            )}
            <span className={styles.labelText} style={{ display: 'block', marginTop: 4 }}>
              {selectedPeriod}
            </span>
          </div>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBar} ${styles.completed}`} />
            <span className={styles.legendLabel}>Voltooide beoordeling</span>
            <AnimatedValue value={currentData.completed} isVisible={isVisible} delay={500} className={styles.legendValue} />
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBar} ${styles.incompleted}`} />
            <span className={styles.legendLabel}>Onvoltooide beoordeling</span>
            <AnimatedValue value={currentData.incompleted} isVisible={isVisible} delay={600} className={styles.legendValue} />
          </div>
        </div>
      </div>
    </div>
  );
}
