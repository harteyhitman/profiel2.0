'use client';

import React from 'react';
import styles from './SWOTAnalysis.module.scss';
import { FaArrowRightLong } from 'react-icons/fa6';

interface SWOTCardProps {
  title: string;
  icon: React.ReactNode;
  backgroundColor: string;
  onClick: () => void;
}

const SWOTCard: React.FC<SWOTCardProps> = ({ title, icon, backgroundColor, onClick }) => (
  <button type="button" className={styles.swotCard} style={{ backgroundColor }} onClick={onClick}>
    <div className={styles.cardContent}>
      <div className={styles.iconWrapper}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <span className={styles.arrowButton} aria-hidden>
    <FaArrowRightLong />
    </span>
  </button>
);

interface SWOTAnalysisProps {
  onCardClick?: (category: 'Strengths' | 'Weaknesses' | 'Chances' | 'Threats') => void;
}

export default function SWOTAnalysis({ onCardClick }: SWOTAnalysisProps) {
  return (
    <div className={styles.container}>
      <SWOTCard
        title="Strengths"
        backgroundColor="#EDE9FE"
        onClick={() => onCardClick?.('Strengths')}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <SWOTCard
        title="Weaknesses"
        backgroundColor="#FEE2E2"
        onClick={() => onCardClick?.('Weaknesses')}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v8M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <SWOTCard
        title="Chances"
        backgroundColor="#FCE7F6"
        onClick={() => onCardClick?.('Chances')}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20V14h3v6H4zM10 20v-6h3v6h-3zM16 20V8h3v12h-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l2-2 2 2-2 2V6h-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <SWOTCard
        title="Threats"
        backgroundColor="#DCFCE7"
        onClick={() => onCardClick?.('Threats')}
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v4M12 17h.01M10.29 3.86L2.14 18a2 2 0 001.71 3h16.3a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
    </div>
  );
}
