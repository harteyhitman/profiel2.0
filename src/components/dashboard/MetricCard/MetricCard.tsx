'use client';

import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './MetricCard.module.scss';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  animate?: boolean;
}

export default function MetricCard({ title, value, icon, animate = true }: MetricCardProps) {
  // Extract numeric value if it's a string with numbers
  const numericValue = typeof value === 'number' 
    ? value 
    : parseInt(value.toString().replace(/\D/g, '')) || 0;
  
  const animatedValue = useCountUp(numericValue, {
    duration: 1500,
    enabled: animate && numericValue > 0,
  });

  // Format the value - preserve string format if it's not a number
  const displayValue = typeof value === 'number'
    ? animatedValue.toString().padStart(2, '0')
    : value.toString().replace(/\d+/, animatedValue.toString().padStart(2, '0'));

  return (
    <div className={styles.metricCard}>
      <div className={styles.iconBox}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
      </div>
      <h3 className={styles.metricTitle}>{title}</h3>
      <p className={styles.metricValue}>{displayValue}</p>
    </div>
  );
}

