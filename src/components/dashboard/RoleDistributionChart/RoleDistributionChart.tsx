'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TeamResults, ChurchDashboardResponse, TeamMember } from '@/lib/types/dashboard';
import styles from './RoleDistributionChart.module.scss';

interface RoleDistributionChartProps {
  teamResults?: TeamResults | null;
  members?: TeamMember[];
}

const ROLE_COLORS: Record<string, { primary: string, secondary: string }> = {
  'Apostel': { primary: '#3b82f6', secondary: '#93c5fd' },
  'Profeet': { primary: '#10b981', secondary: '#a7f3d0' },
  'Evangelist': { primary: '#ec4899', secondary: '#fbcfe8' },
  'Herder': { primary: '#f59e0b', secondary: '#fde68a' },
  'Leraar': { primary: '#8b5cf6', secondary: '#c4b5fd' },
};

export default function RoleDistributionChart({ teamResults, members }: RoleDistributionChartProps) {
  const chartData = useMemo(() => {
    const scores = teamResults?.aggregatedScores;
    const effectiveMembers = members || teamResults?.members || [];
    
    const roles = [
      { name: 'apostle', label: 'Apostel' },
      { name: 'prophet', label: 'Profeet' },
      { name: 'evangelist', label: 'Evangelist' },
      { name: 'herder', label: 'Herder' },
      { name: 'teacher', label: 'Leraar' },
    ];

    if (effectiveMembers.length > 0) {
      // Calculate actual distribution from members
      const distribution = roles.map(role => {
        let primaryCount = 0;
        let secondaryCount = 0;

        effectiveMembers.forEach((member: TeamMember) => {
          const mScores = member.scores || member.profile;
          if (!mScores) return;

          const sortedRoles = Object.entries(mScores)
            .filter(([key]) => ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'].includes(key))
            .sort(([, a], [, b]) => (b as number) - (a as number));

          if (sortedRoles[0]?.[0] === role.name) primaryCount++;
          if (sortedRoles[1]?.[0] === role.name) secondaryCount++;
        });

        return {
          name: role.label,
          primary: primaryCount,
          secondary: secondaryCount,
          total: primaryCount + secondaryCount
        };
      });
      return distribution;
    }
    
    // Fallback to mock if no members
    return roles.map(role => {
      const score = scores?.[role.name as keyof typeof scores] || 0;
      const primary = Math.floor(score * 0.6);
      const secondary = Math.ceil(score * 0.4);
      return {
        name: role.label,
        primary,
        secondary,
        total: primary + secondary
      };
    });
  }, [teamResults, members]);

  const roleLabelMap: Record<string, string> = {
    'Apostel': 'apostle',
    'Profeet': 'prophet',
    'Leraar': 'teacher',
    'Herder': 'shepherd',
    'Evangelist': 'evangelist',
  };

  const sortedData = useMemo(() => {
    const order = ['Apostel', 'Profeet', 'Leraar', 'Herder', 'Evangelist'];
    return [...chartData].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }, [chartData]);

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <h3 className={styles.title}>Primaire en Secundaire Rolprofiel Verdeling</h3>
        <p className={styles.subtitle}>Aantal teamleden met elk roltype als primair of secundair profielscore</p>
        
        <div className={styles.barChartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="rect" />
              <Bar name="Primair" dataKey="primary" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-primary-${index}`} fill={ROLE_COLORS[entry.name]?.primary || '#3b82f6'} />
                ))}
              </Bar>
              <Bar name="Secundair" dataKey="secondary" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-secondary-${index}`} fill={ROLE_COLORS[entry.name]?.secondary || '#93c5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.listWrapper}>
        <h3 className={styles.title}>Sterktes en zwakten Primaire en secundaire rolprofiel</h3>
        <div className={styles.roleList}>
          {sortedData.map((role) => (
            <div key={role.name} className={styles.roleItem}>
              <div className={styles.roleInfo}>
                <span className={styles.roleLabel}>{roleLabelMap[role.name] || role.name.toLowerCase()}</span>
                <span className={styles.roleValue}>{role.total}</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ 
                    width: `${(role.total / (Math.max(...chartData.map(r => r.total)) || 1)) * 100}%` 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


