'use client';

import React from 'react';
import styles from './FAQCategoryCard.module.scss';

interface FAQCategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function FAQCategoryCard({
  title,
  description,
  icon,
  onClick,
}: FAQCategoryCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.iconContainer}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

