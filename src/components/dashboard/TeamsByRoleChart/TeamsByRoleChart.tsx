'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  LabelList,
} from 'recharts';
import styles from './TeamsByRoleChart.module.scss';

const FIVEFOLD_ROLES = [
  { key: 'apostle' as const, label: 'Apostel', fill: 'var(--chart-apostle)' },
  { key: 'prophet' as const, label: 'Profeet', fill: 'var(--chart-prophet)' },
  { key: 'evangelist' as const, label: 'Evangelist', fill: 'var(--chart-evangelist)' },
  { key: 'herder' as const, label: 'Herder', fill: 'var(--chart-shepherd)' },
  { key: 'teacher' as const, label: 'Leraar', fill: 'var(--chart-teacher)' },
] as const;

const teamsByRoleChartConfig = {
  value: { label: 'Aantal teams', color: 'var(--chart-apostle)' },
  ...Object.fromEntries(
    FIVEFOLD_ROLES.map((r) => [r.label, { label: r.label, color: r.fill }])
  ),
} satisfies ChartConfig;

interface TeamsByRoleChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TeamsByRoleChart({ dashboardData }: TeamsByRoleChartProps) {
  const chartData = useMemo(() => {
    const roleCounts: Record<string, number> = {
      Apostel: 0,
      Profeet: 0,
      Evangelist: 0,
      Herder: 0,
      Leraar: 0,
    };

    if (dashboardData?.teams && dashboardData.teams.length > 0) {
      dashboardData.teams.forEach((team) => {
        const dist = team.roleDistribution;
        if (dist && typeof dist === 'object') {
          let maxKey: keyof typeof dist = 'apostle';
          let maxVal = Number((dist as Record<string, number>).apostle) ?? 0;
          (['prophet', 'evangelist', 'herder', 'teacher'] as const).forEach((k) => {
            const v = Number((dist as Record<string, number>)[k]) ?? 0;
            if (v > maxVal) {
              maxVal = v;
              maxKey = k;
            }
          });
          const label = FIVEFOLD_ROLES.find((r) => r.key === maxKey)?.label ?? 'Leraar';
          if (roleCounts[label] !== undefined) roleCounts[label]++;
        }
      });
    } else {
      // Dummy data matching design: Leraar 7, rest 0
      roleCounts.Leraar = dashboardData?.church?.totalTeams ?? 7;
    }

    return FIVEFOLD_ROLES.map((r) => ({
      label: r.label,
      value: roleCounts[r.label] ?? 0,
      fill: r.fill,
    }));
  }, [dashboardData]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Teams per Dominante Rol</h3>
        <p className={styles.chartSubtitle}>
          Verdeling van teams op basis van de dominante rol
        </p>
      </div>
      <div className={styles.chartArea}>
        <ChartContainer
          config={teamsByRoleChartConfig}
          className="h-[260px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 12, bottom: 8, left: 8 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="var(--border-subtle)" horizontal vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 400 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 400 }}
              tickFormatter={(v) => String(v)}
              allowDecimals={false}
              width={24}
            />
            <ChartTooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32} minPointSize={4}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.label}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill="var(--text-secondary)"
                fontSize={13}
                fontWeight={500}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
