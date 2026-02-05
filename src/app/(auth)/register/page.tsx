'use client';

import { useState } from 'react';
import TermsVerification from '@/components/auth/TermsVerification/TermsVerification';
import RegistrationForm from '@/components/auth/RegistrationForm/RegistrationForm';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState<'terms' | 'form'>('terms');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsContinue = () => {
    if (termsAccepted) {
      setStep('form');
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}><Image src={Logo} alt='logo' /></div>
        </div>
        
        <h1 className={styles.title}>Laten we je account verifiëren</h1>
        <p className={styles.subtitle}>Een paar dingen om te bekijken</p>
        <div className={styles.content}>
          {step === 'terms' ? (
            <TermsVerification
              onContinue={handleTermsContinue}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
            />
          ) : (
            <>
              <RegistrationForm />
              <div className={styles.loginLink}>
                <span>Heb je al een account? </span>
                <Link href="/login">Inloggen</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

