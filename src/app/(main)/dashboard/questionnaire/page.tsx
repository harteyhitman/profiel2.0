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
    'Je ziet steeds twee stellingen.',
    'Kies de stelling die het beste bij je past – ook als je je soms in allebei herkent.',
    'Je kunt maar één keuze maken; er zijn geen foute antwoorden.',
    'Vul in wat het meest herkenbaar en natuurlijk voelt, niet wat je graag zou willen zijn.',
    'Vertrouw erop dat het totaalbeeld waardevol inzicht geeft – één antwoord maakt niet alles uit.',
  ];

  return (
    <div className={styles.page}>
      <header className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Vragenlijst</h1>
          <p className={styles.subtitle}>
            Ontdek je bedieningenprofiel door de vragenlijst in te vullen.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartQuestion}
          className={styles.startButton}
        >
          Start vragenlijst
        </button>
      </header>

      <section className={styles.welcomeBox}>
        <h2 className={styles.welcomeHeading}>
          Welkom bij de Bedieningenprofiel vragenlijst
        </h2>
        <p className={styles.welcomeText}>
          Fijn dat je deze stap zet! Deze vragenlijst helpt je ontdekken hoe God je heeft geschapen en waar je sterke punten en aandachtgebieden liggen. We bidden dat dit een zegen mag zijn voor jou en je kerk.
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
          <h3 className={styles.tipsHeading}>Tips voor het invullen</h3>
          <p className={styles.tipsText}>
            Vul de vragenlijst rustig en zonder te lang te twijfelen in. Je eerste gevoel is vaak het meest trefzeker.
          </p>
        </div>
      </section>
    </div>
  );
}
