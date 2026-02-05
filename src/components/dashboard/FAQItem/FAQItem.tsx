'use client';

import React from 'react';
import styles from './FAQItem.module.scss';

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FAQItem({
  question,
  answer,
  isExpanded,
  onToggle,
}: FAQItemProps) {
  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.questionButton}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={styles.toggleIcon}>
          {isExpanded ? (
            <span className={styles.minus} aria-hidden>−</span>
          ) : (
            <span className={styles.plus} aria-hidden>+</span>
          )}
        </span>
      </button>
      {isExpanded && (
        <div className={styles.answer}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

