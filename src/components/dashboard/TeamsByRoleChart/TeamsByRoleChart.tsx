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
} from 'recharts';
import styles from './TeamsByRoleChart.module.scss';

const teamsByRoleChartConfig = {
  value: { label: 'Teams', color: 'var(--chart-leader)' },
  Leider: { label: 'Leider', color: 'var(--chart-leader)' },
  Ondersteuner: { label: 'Ondersteuner', color: 'var(--chart-supporter)' },
  Strategist: { label: 'Strategist', color: 'var(--chart-strategist)' },
  Innovator: { label: 'Innovator', color: 'var(--chart-innovator)' },
} satisfies ChartConfig;

interface TeamsByRoleChartProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function TeamsByRoleChart({ dashboardData }: TeamsByRoleChartProps) {
  const chartData = useMemo(() => {
    if (!dashboardData?.teams || dashboardData.teams.length === 0) {
      const totalTeams = dashboardData?.church?.totalTeams || 8;
      return [
        { label: 'Leider', value: 3, fill: 'var(--chart-leader)' },
        { label: 'Ondersteuner', value: 2, fill: 'var(--chart-supporter)' },
        { label: 'Strategist', value: 2, fill: 'var(--chart-strategist)' },
        { label: 'Innovator', value: 1, fill: 'var(--chart-innovator)' },
      ];
    }

    const roleCounts = {
      Leider: 0,
      Ondersteuner: 0,
      Strategist: 0,
      Innovator: 0,
    };

    dashboardData.teams.forEach((team: { roleDistribution?: Record<string, number> }) => {
      const roleDist = team.roleDistribution;
      if (roleDist) {
        const roles = [
          { name: 'Leider', value: roleDist.apostle || 0 },
          { name: 'Ondersteuner', value: roleDist.herder || 0 },
          { name: 'Strategist', value: roleDist.teacher || 0 },
          { name: 'Innovator', value: roleDist.evangelist || 0 },
        ];
        const dominant = roles.reduce((max, role) => (role.value > max.value ? role : max));
        roleCounts[dominant.name as keyof typeof roleCounts]++;
      }
    });

    return [
      { label: 'Leider', value: roleCounts.Leider, fill: 'var(--chart-leader)' },
      { label: 'Ondersteuner', value: roleCounts.Ondersteuner, fill: 'var(--chart-supporter)' },
      { label: 'Strategist', value: roleCounts.Strategist, fill: 'var(--chart-strategist)' },
      { label: 'Innovator', value: roleCounts.Innovator, fill: 'var(--chart-innovator)' },
    ];
  }, [dashboardData]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Teams op Dominante Rol</h3>
        <p className={styles.chartSubtitle}>
          De meeste teams worden geleid door individuen met sterke leiderschaps- en communicatie-eigenschappen.
        </p>
      </div>
      <div className={styles.chartArea}>
        <ChartContainer
          config={teamsByRoleChartConfig}
          className="h-[240px] w-full"
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
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
