'use client';

import { Suspense } from 'react';
import NewPasswordForm from '@/components/auth/NewPasswordForm/NewPasswordForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';

function NewPasswordFormFallback() {
  return (
    <div className={styles.card} style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span>Laden...</span>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <div className={styles.newPasswordPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <Image src={Logo} alt='logo' />
          </div>
        </div>

        <h1 className={styles.title}>Nieuw wachtwoord</h1>

        <div className={styles.content}>
          <Suspense fallback={<NewPasswordFormFallback />}>
            <div className={styles.card}>
              <NewPasswordForm />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

