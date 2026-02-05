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
            <Image src={Logo} alt='logo' />
          </div>
        </div>
        
        <h1 className={styles.title}>Inloggen</h1>
        
        <div className={styles.content}>
          <div className={styles.card}>
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

