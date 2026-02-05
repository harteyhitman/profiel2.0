'use client';

import { Suspense } from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm/ForgotPasswordForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';

function ForgotPasswordFormFallback() {
  return (
    <div className={styles.card} style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span>Laden...</span>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <Image src={Logo} alt='logo' />
          </div>
        </div>
        <h1 className={styles.title}>Wachtwoord vergeten</h1>
        <p className={styles.subtitle}>Voer je e-mailadres in om een resetcode te ontvangen</p>

        <div className={styles.content}>
          <Suspense fallback={<ForgotPasswordFormFallback />}>
            <div className={styles.card}>
              <ForgotPasswordForm />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

