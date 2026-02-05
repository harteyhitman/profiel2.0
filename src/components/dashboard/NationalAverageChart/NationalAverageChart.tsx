'use client';


import React, { useMemo } from 'react';
import type { TeamResults, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './NationalAverageChart.module.scss';

interface NationalAverageChartProps {
  teamResults?: TeamResults | null;
  dashboardData?: ChurchDashboardResponse | null;
}

export default function NationalAverageChart({ teamResults, dashboardData }: NationalAverageChartProps) {
  const roles = ['Apostel', 'Profeet', 'Evangelist', 'Herder', 'Leraar'];
  
  const { dataPoints, maxValue, highlightedIndex, highlightedValue, highlightedPercentage } = useMemo(() => {
    const scores = teamResults?.aggregatedScores || dashboardData?.aggregatedScores;
    
    if (!scores) {
      return {
        dataPoints: [0, 0, 0, 0, 0],
        maxValue: 100,
        highlightedIndex: 0,
        highlightedValue: 0,
        highlightedPercentage: 0,
      };
    }

    const dataPoints = [
      scores.apostle || 0,
      scores.prophet || 0,
      scores.evangelist || 0,
      scores.herder || 0,
      scores.teacher || 0,
    ];
    
    const maxValue = Math.max(...dataPoints, 100);
    const highlightedIndex = 2; // evangelist
    const highlightedValue = dataPoints[highlightedIndex];
    const total = dataPoints.reduce((sum, val) => sum + val, 0);
    const highlightedPercentage = total > 0 ? Math.round((highlightedValue / total) * 100) : 0;

    return { dataPoints, maxValue, highlightedIndex, highlightedValue, highlightedPercentage };
  }, [teamResults, dashboardData]);


  // Convert data points to SVG coordinates
  const points = dataPoints.map((value, index) => {
    const x = 60 + (index * 80);
    const y = 200 - (value / maxValue * 180);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Vergelijking met Landelijk Gemiddelde</h3>
        <p className={styles.chartSubtitle}>
          Het helpt je zien hoe je team zich verhoudt tot anderen in het land.
        </p>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.chartArea}>
          <svg viewBox="0 0 500 250" className={styles.chartSvg}>
            {/* Y-axis labels */}
            {[0, 40, 80, 120, 160].map((value) => (
              <text
                key={value}
                x="30"
                y={230 - (value / 160 * 180)}
                className={styles.axisLabel}
                textAnchor="end"
              >
                {value}
              </text>
            ))}
            
            {/* X-axis labels */}
            {roles.map((role, index) => (
              <text
                key={role}
                x={60 + (index * 80)}
                y="245"
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {role}
              </text>
            ))}

            {/* Grid lines */}
            {[0, 40, 80, 120, 160].map((value) => (
              <line
                key={value}
                x1="40"
                y1={230 - (value / 160 * 180)}
                x2="480"
                y2={230 - (value / 160 * 180)}
                stroke="#E0E0E0"
                strokeWidth="1"
              />
            ))}

            {/* Gradient fill area */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polygon
              points={`40,230 ${points} 480,230`}
              fill="url(#areaGradient)"
            />
            
            {/* Line chart */}
            <polyline
              points={points}
              fill="none"
              stroke="#0F3728"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points */}
            {dataPoints.map((value, index) => {
              const x = 60 + (index * 80);
              const y = 230 - (value / 160 * 180);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#0F3728"
                />
              );
            })}

            {/* Highlighted point for evangelist */}
            {dataPoints.map((value, index) => {
              if (index === highlightedIndex) {
                const x = 60 + (index * 80);
                const y = 230 - (value / maxValue * 180);
                return (
                  <g key={`highlight-${index}`}>
                    <line
                      x1={x}
                      y1={y}
                      x2={x}
                      y2="230"
                      stroke="#0F3728"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <rect
                      x={x + 10}
                      y={y - 40}
                      width="60"
                      height="35"
                      rx="4"
                      fill="#111827"
                    />
                    <text
                      x={x + 40}
                      y={y - 20}
                      className={styles.highlightText}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="16"
                      fontWeight="600"
                    >
                      {highlightedValue}
                    </text>
                    <text
                      x={x + 40}
                      y={y - 5}
                      className={styles.highlightText}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="12"
                    >
                      {highlightedPercentage}%
                    </text>
                  </g>
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

