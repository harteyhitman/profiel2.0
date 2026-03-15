'use client';

import AgreementSlider from '@/components/dashboard/AgreementSlider/AgreementSlider';
import styles from './QuestionCard.module.scss';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  statementA: string;
  statementB: string;
  value: number;
  onChange: (value: number) => void;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  statementA,
  statementB,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.questionHeader}>
        <h2 className={styles.questionTitle}>Vraag {questionNumber}</h2>
        <span className={styles.questionProgress}>
          Vraag {questionNumber} van {totalQuestions}
        </span>
      </div>

      <div className={styles.statementsContainer}>
        <div className={`${styles.statementBox} ${value < 0 ? styles.selected : ''}`}>
          <span className={styles.statementLabel}>Stelling 1</span>
          <p className={styles.statementText}>{statementA}</p>
        </div>
        <div className={styles.statementDivider} aria-hidden />
        <div className={`${styles.statementBox} ${value > 0 ? styles.selected : ''}`}>
          <span className={styles.statementLabel}>Stelling 2</span>
          <p className={styles.statementText}>{statementB}</p>
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <AgreementSlider value={value} onChange={onChange} />
      </div>
    </div>
  );
}
