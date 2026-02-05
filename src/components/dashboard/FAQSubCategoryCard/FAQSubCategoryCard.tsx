'use client';

import React from 'react';
import styles from './FAQSubCategoryCard.module.scss';

interface FAQSubCategoryCardProps {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export default function FAQSubCategoryCard({
  title,
  icon,
  onClick,
}: FAQSubCategoryCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      {icon && <div className={styles.iconContainer}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
}

