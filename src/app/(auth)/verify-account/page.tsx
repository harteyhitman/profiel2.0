'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api/auth';
import { Button, EmailInput } from '@/components/ui/forms';
import styles from './page.module.scss';
import Logo from '../../../../public/navbar/brand-logo.png';

const VERIFIED_KEY = (token: string) => `verified:${token}`;

function mapVerifyError(err: unknown): string {
  const ax = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
  const msg = ax.response?.data?.message || ax.message;
  if (ax.response?.status === 404 || (msg && /not found|niet gevonden/i.test(String(msg))))
    return 'Gebruiker niet gevonden. Neem contact op met de beheerder.';
  if (msg && /missing|ontbreekt/i.test(String(msg)))
    return 'Verificatietoken ontbreekt. Controleer de link en probeer het opnieuw.';
  if (ax.response?.status === 400 || (msg && /invalid|expired|ongeldig|verlopen/i.test(String(msg))))
    return 'De verificatielink is ongeldig of verlopen. Log in om een nieuwe link aan te vragen.';
  return msg && typeof msg === 'string' ? msg : 'Verificatie mislukt. Probeer het later opnieuw.';
}

function VerifyAccountContent() {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = (searchParams?.get('token') || '').trim();
  const emailFromUrl = (searchParams?.get('email') || '').trim();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendToken, setResendToken] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState(emailFromUrl);
  const verifiedRef = useRef(false);

  const hasToken = token.length > 0;
  const hasEmail = emailFromUrl.length > 0;

  useEffect(() => {
    if (!hasToken || verifiedRef.current) return;
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem(VERIFIED_KEY(token)) : null;
    if (stored === 'true') {
      verifiedRef.current = true;
      router.replace('/login');
      return;
    }
    const doVerify = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await verifyEmail(token);
        try {
          sessionStorage.setItem(VERIFIED_KEY(token), 'true');
        } catch {
          // ignore
        }
        setSuccess(true);
        setTimeout(() => router.replace('/login'), 2000);
      } catch (err: unknown) {
        setError(mapVerifyError(err));
      } finally {
        setIsLoading(false);
      }
    };
    doVerify();
    verifiedRef.current = true;
  }, [hasToken, token, verifyEmail, router]);

  const handleResend = async (emailToUse: string) => {
    const email = emailToUse.trim();
    if (!email) {
      setError('Vul een geldig e-mailadres in.');
      return;
    }
    setIsResending(true);
    setError(null);
    setResendSuccess(null);
    try {
      const res = await authAPI.resendVerification(email);
      setResendSuccess((res as { message?: string })?.message || 'Verificatie-e-mail is verzonden. Controleer je inbox.');
      const code = (res as { code?: string })?.code;
      if (code) setResendToken(code);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } }; message?: string };
      setError(ax.response?.data?.message || ax.message || 'Verificatie-e-mail kon niet worden verzonden.');
    } finally {
      setIsResending(false);
    }
  };

  if (hasToken && success) {
    return (
      <div className={styles.card}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#10B981" />
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={styles.successMessage}>E-mail geverifieerd! Je wordt doorgestuurd naar inloggen.</p>
        </div>
      </div>
    );
  }

  if (hasToken && error) {
    return (
      <div className={styles.card}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#EF4444" />
              <path d="M24 16V24M24 32H24.01" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className={styles.errorMessage}>{error}</p>
          {hasEmail && (
            <Button variant="primary" type="button" onClick={() => handleResend(emailFromUrl)} disabled={isResending} className={styles.resendButton}>
              {isResending ? 'Bezig met verzenden...' : 'Verificatielink opnieuw verzenden'}
            </Button>
          )}
          <Button variant="outline" type="button" onClick={() => router.replace('/login')} className={styles.backButton}>
            Terug naar inloggen
          </Button>
        </div>
      </div>
    );
  }

  if (hasToken) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingMessage}>Account wordt geverifieerd...</p>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className={styles.card}>
        {hasEmail ? (
          <>
            <p className={styles.inboxText}>Controleer je inbox. We hebben een verificatielink gestuurd naar <strong>{emailFromUrl}</strong>.</p>
            {resendSuccess ? (
              <div className={styles.resendSuccess}>
                <p>{resendSuccess}</p>
                {resendToken && (
                  <p className={styles.resendLink}>
                    <Link href={`/verify-account?token=${encodeURIComponent(resendToken)}`}>Klik hier</Link> om je account te verifiëren.
                  </p>
                )}
              </div>
            ) : (
              <Button variant="primary" type="button" onClick={() => handleResend(emailFromUrl)} disabled={isResending} className={styles.resendButton}>
                {isResending ? 'Bezig...' : 'Verificatielink opnieuw verzenden'}
              </Button>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <Link href="/login" className={styles.backLink}>Terug naar inloggen</Link>
          </>
        ) : (
          <>
            <p className={styles.inboxText}>Vul je e-mailadres in om een nieuwe verificatielink aan te vragen.</p>
            <div className={styles.emailForm}>
              <EmailInput
                id="verify-email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="E-mailadres"
              />
              <Button variant="primary" type="button" onClick={() => handleResend(emailInput)} disabled={isResending} fullWidth>
                {isResending ? 'Bezig...' : 'Verificatielink verzenden'}
              </Button>
            </div>
            {resendSuccess && <p className={styles.successMessage}>{resendSuccess}</p>}
            {resendToken && (
              <p className={styles.resendLink}>
                <Link href={`/verify-account?token=${encodeURIComponent(resendToken)}`}>Klik hier</Link> om te verifiëren.
              </p>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <Link href="/login" className={styles.backLink}>Terug naar inloggen</Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingMessage}>Laden...</p>
      </div>
    </div>
  );
}

function VerifyAccountFallback() {
  return (
    <div className={styles.card}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingMessage}>Laden...</p>
      </div>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <div className={styles.verifyPage}>
      <div className={styles.logoHeader}>
        <div className={styles.logo}>
          <div className={styles.logoBox}>
            <Image src={Logo} alt="Bedieningenprofiel" />
          </div>
        </div>
        <h1 className={styles.title}>Bedieningenprofiel</h1>
        <p className={styles.subtitle}>Verifieer je e-mailadres om door te gaan</p>
        <div className={styles.content}>
          <Suspense fallback={<VerifyAccountFallback />}>
            <VerifyAccountContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
