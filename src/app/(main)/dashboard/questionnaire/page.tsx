'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function QuestionnairePage() {
  const router = useRouter();

  const handleStartQuestion = () => {
    router.push('/dashboard/questionnaire/start');
  };

  const instructions = [
    'You will always see two statements.',
    'Choose the one that suits you best – even if you sometimes recognize something in both.',
    'You can only choose one, and there are no wrong answers.',
    'Fill in what feels most recognizable and natural to you, not what you would like to be.',
    'Trust that the bigger picture provides valuable insight – a single answer doesn\'t make all the difference.',
  ];

  return (
    <div className={styles.page}>
      <header className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Questionnaire</h1>
          <p className={styles.subtitle}>
            View and manage your current subscription or upgrade to a better plan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartQuestion}
          className={styles.startButton}
        >
          Start question
        </button>
      </header>

      <section className={styles.welcomeBox}>
        <h2 className={styles.welcomeHeading}>
          Welcome to the Control Profile questionnaire
        </h2>
        <p className={styles.welcomeText}>
          It&apos;s wonderful that you&apos;re taking this step! This test will help you discover how God created you and where your strengths and areas of focus lie. We pray that this will be a blessing for you and your church.
        </p>
      </section>

      <ul className={styles.instructionsList}>
        {instructions.map((instruction, index) => (
          <li key={index} className={styles.instructionItem}>
            {instruction}
          </li>
        ))}
      </ul>

      <section className={styles.tipsBox}>
        <div className={styles.tipsIcon}>
          <span className={styles.tipsIconCircle}>!</span>
        </div>
        <div className={styles.tipsContent}>
          <h3 className={styles.tipsHeading}>Tips for completing the form</h3>
          <p className={styles.tipsText}>
            Complete the test calmly and without hesitation. Your first instinct is often the most accurate.
          </p>
        </div>
      </section>
    </div>
  );
}
