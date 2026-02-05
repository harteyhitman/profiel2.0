'use client';

import React from 'react';
import { Button } from '@/components/ui/forms';
import styles from './SubscriptionCard.module.scss';

interface SubscriptionCardProps {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline';
  isPopular?: boolean;
  isDark?: boolean;

  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;

}

export default function SubscriptionCard({
  title,
  subtitle,
  price,
  features,
  buttonText,
  buttonVariant = 'primary',
  isPopular = false,
  isDark = false,

  isCurrentPlan = false,
  isLoading = false,
  onClick,
  disabled = false,

}: SubscriptionCardProps) {
  return (
    <div className={`${styles.card} ${isDark ? styles.darkCard : ''}`}>
      {isPopular && (
        <div className={styles.popularBadge}>

          {/* Popular */}
        </div>
      )}
      {isCurrentPlan && (
        <div className={styles.currentBadge}>
          Huidig Plan

        </div>
      )}
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <div className={styles.price}>{price}</div>
        <ul className={styles.features}>
          {features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant={buttonVariant}
          type="button"
          className={styles.actionButton}

          onClick={onClick}
          disabled={disabled || isLoading || isCurrentPlan}
        >
          {isLoading ? 'Verwerken...' : buttonText}

        </Button>
      </div>
    </div>
  );
}

