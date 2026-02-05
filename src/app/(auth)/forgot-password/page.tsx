'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm/ForgotPasswordForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';

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
          <div className={styles.card}>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

