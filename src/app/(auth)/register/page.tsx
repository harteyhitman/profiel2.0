'use client';

import Link from 'next/link';
import Image from 'next/image';
import RegistrationForm from '@/components/auth/RegistrationForm/RegistrationForm';
import Logo from '../../../../public/navbar/brand-logo.png';
import styles from './page.module.scss';

export default function RegisterPage() {
  return (
    <div className={styles.registerPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <Image src={Logo} alt="Bedieningenprofiel" priority />
          </div>
        </div>
        <h1 className={styles.title}>Bedieningenprofiel</h1>
        <p className={styles.subtitle}>
          Maak een nieuw account aan
        </p>
        <div className={styles.tabs}>
          <Link href="/login" className={styles.tab}>
            Inloggen
          </Link>
          <span className={`${styles.tab} ${styles.tabActive}`}>Registreren</span>
        </div>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardTopBar}>
              <Link href="/verify-account" className={styles.verifyLink}>
                Account verifiëren?
              </Link>
            </div>
            <RegistrationForm />
            <p className={styles.loginLink}>
              Heb je al een account? <Link href="/login">Log hier in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
