'use client';

import LoginForm from '@/components/auth/LoginForm/LoginForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <Image src={Logo} alt="Bedieningenprofiel" />
          </div>
        </div>
        <h1 className={styles.title}>Bedieningenprofiel</h1>
        <p className={styles.subtitle}>Log in op je account</p>
        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.tabActive}`}>Inloggen</span>
          <Link href="/register" className={styles.tab}>
            Registreren
          </Link>
        </div>
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardTopBar}>
              <Link href="/verify-account" className={styles.verifyLink}>
                Account verifiëren?
              </Link>
            </div>
            <LoginForm />
            <div className={styles.signupLink}>
              <span>Nog geen account? </span>
              <Link href="/register">Registreren</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

