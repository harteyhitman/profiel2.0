'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ROLE_COLORS, ROLE_LABELS, ROLES, RoleKey } from '@/lib/constants/questionnaire';
import { RoleScores } from '@/lib/types/dashboard';
import styles from './RoleChart.module.scss';

interface RoleChartProps {
  results: RoleScores;
  type: 'bar' | 'pie' | 'radar';
  height?: number;
  width?: number | string;
  showLegend?: boolean;
  isTeam?: boolean;
  comparisonData?: RoleScores;
}

export default function RoleChart({
  results,
  type,
  height = 350,
  width = '100%',
  showLegend = false,
  isTeam = false,
  comparisonData
}: RoleChartProps) {

  // Transform data for Recharts
  const data = ROLES.map(role => {
    // Cast role to RoleKey to ensure type safety
    const key = role as RoleKey;
    // Access properties safely knowing RoleScores has these keys
    // We use 'as any' or check if key exists if RoleScores wasn't exact match, 
    // but here RoleScores has exactly these keys.
    const value = results[key] || 0;
    const comparisonValue = comparisonData ? (comparisonData[key] || 0) : 0;
    
    return {
      subject: ROLE_LABELS[key],
      role: key,
      value: value,
      comparisonValue: comparisonValue,
      fullMark: 100 
    };
  });

  // For Pie Chart, filter out zeros if needed, or Recharts handles it?
  // Recharts handles it but looks better if we filter small values or use specific data structure
  const pieData = data.filter(d => d.value > 0);

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
        <Radar
          name={isTeam ? "Team Score" : "Jouw Score"}
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        {comparisonData && (
          <Radar
            name="Vergelijking"
            dataKey="comparisonValue"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
        )}
        {showLegend && <Legend />}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="subject" type="category" width={80} />
        <Tooltip />
        {showLegend && <Legend />}
        <Bar 
            dataKey="value" 
            name={isTeam ? "Team Score" : "Jouw Score"} 
            fill="#8884d8" 
            radius={[0, 4, 4, 0]}
        >
          {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS]} />
          ))}
        </Bar>
        {comparisonData && (
          <Bar 
            dataKey="comparisonValue" 
            name="Vergelijking" 
            fill="#82ca9d" 
            radius={[0, 4, 4, 0]} 
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          nameKey="subject"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS]} />
          ))}
        </Pie>
        <Tooltip />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className={styles.chartContainer} style={{ height, width }}>
      {type === 'radar' && renderRadarChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
    </div>
  );
}
