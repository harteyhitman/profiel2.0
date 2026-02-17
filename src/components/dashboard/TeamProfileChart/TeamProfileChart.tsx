'use client';

import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import type { TeamResults } from '@/lib/types/dashboard';
import styles from './TeamProfileChart.module.scss';

const ROLE_CONFIG = [
  { name: 'Apostel', key: 'apostle' as const, color: '#3b82f6' }, // Blue
  { name: 'Profeet', key: 'prophet' as const, color: '#10b981' }, // Green
  { name: 'Evangelist', key: 'evangelist' as const, color: '#ec4899' }, // Pink
  { name: 'Herder', key: 'herder' as const, color: '#f59e0b' }, // Orange
  { name: 'Leraar', key: 'teacher' as const, color: '#8b5cf6' }, // Purple
] as const;

interface TeamProfileChartProps {
  teamResults?: TeamResults | null;
}

export default function TeamProfileChart({ teamResults }: TeamProfileChartProps) {
  const chartData = useMemo(() => {
    const scores = teamResults?.aggregatedScores;

    if (!scores) {
      return ROLE_CONFIG.map((r) => ({ 
        name: r.name, 
        value: 0, 
        percentage: 0,
        fullMark: 100,
        color: r.color
      }));
    }

    const total =
      (scores.apostle || 0) +
      (scores.prophet || 0) +
      (scores.evangelist || 0) +
      (scores.herder || 0) +
      (scores.teacher || 0);

    return ROLE_CONFIG.map((r) => ({
      name: r.name,
      value: scores[r.key] || 0,
      percentage: total > 0 ? Math.round(((scores[r.key] || 0) / total) * 100) : 0,
      fullMark: Math.max(...Object.values(scores)) * 1.1 || 100,
      color: r.color
    }));
  }, [teamResults]);

  return (
    <div className={styles.container}>
      <div className={styles.radarWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Radar
              name="Team Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.pieWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="percentage"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="white" 
                    textAnchor="middle" 
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          {chartData.map((role) => (
            <div key={role.name} className={styles.legendItem}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: role.color }} 
              />
              <span className={styles.legendLabel}>{role.name}</span>
              <span className={styles.legendValue}>{role.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
