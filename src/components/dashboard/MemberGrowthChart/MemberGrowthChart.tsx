'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse } from '@/lib/types/dashboard';
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import styles from './MemberGrowthChart.module.scss';

const memberGrowthChartConfig = {
  value: {
    label: 'Leden',
    color: 'var(--teal-accent)',
  },
  month: {
    label: 'Maand',
  },
} satisfies ChartConfig;

interface MemberGrowthChartProps {
  data?: Array<{ month: string; value: number }>;
  subtitle?: string;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function MemberGrowthChart({
  subtitle = '+12 nieuwe leden zijn de afgelopen maand toegetreden.',
  data,
  dashboardData,
}: MemberGrowthChartProps) {
  const chartData = useMemo(() => {
    if (data) return data;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseValue = dashboardData?.church?.totalMembers
      ? Math.floor(dashboardData.church.totalMembers / 12)
      : 3;

    return months.map((month, index) => {
      const growth = index * 0.4;
      const value = Math.max(1, Math.round(baseValue + growth));
      return { month, value };
    });
  }, [data, dashboardData]);

  const calculatedSubtitle = useMemo(() => {
    if (chartData && chartData.length > 0) {
      const lastValue = chartData[chartData.length - 1]?.value || 0;
      const prevValue = chartData[chartData.length - 2]?.value || 0;
      const growth = lastValue - prevValue;
      if (growth > 0) {
        return `+${growth} nieuwe leden zijn de afgelopen maand toegetreden.`;
      }
      if (growth < 0) {
        return `${Math.abs(growth)} leden zijn de afgelopen maand vertrokken.`;
      }
      return 'Geen verandering in lidmaatschap deze maand.';
    }
    return subtitle;
  }, [chartData, subtitle]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Lidgroei in de Tijd</h3>
        <p className={styles.chartSubtitle}>{calculatedSubtitle}</p>
      </div>
      <div className={styles.chartContainer}>
        <ChartContainer
          config={memberGrowthChartConfig}
          className="h-[200px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 24, left: 8 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="var(--border-subtle)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
              tickFormatter={(v) => String(v)}
            />
            <ChartTooltip />
            <Area
              type="monotone"
              dataKey="value"
              fill="var(--teal-accent)"
              fillOpacity={0.12}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-value)', r: 3 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
