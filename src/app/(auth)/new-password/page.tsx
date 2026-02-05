'use client';

import NewPasswordForm from '@/components/auth/NewPasswordForm/NewPasswordForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';

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
          <div className={styles.card}>
            <NewPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

