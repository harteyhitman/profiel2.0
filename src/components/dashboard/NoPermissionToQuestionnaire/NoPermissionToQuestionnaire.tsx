'use client';

import React from 'react';
import Link from 'next/link';
import styles from './NoPermissionToQuestionnaire.module.scss';

export default function NoPermissionToQuestionnaire() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Geen toegang tot deze vragenlijst</h1>
      <p className={styles.message}>
        Je hebt een geldige uitnodigingslink nodig om de vragenlijst in te vullen.
        Vraag je kerkleider of gemeenteleider om een nieuwe link.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryLink}>
          Naar startpagina
        </Link>
        <a href="mailto:info@bedieningenprofiel.nl" className={styles.contactLink}>
          Neem contact op
        </a>
      </div>
    </div>
  );
}
