'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api/auth';
import { Button } from '@/components/ui/forms';
import styles from './page.module.scss';
import Image from 'next/image';
import Logo from '../../../../public/navbar/brand-logo.png';

function VerifyAccountContent() {
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const email = searchParams?.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Auto-verify if token is present
    if (token && !success && !isLoading) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleVerify = async () => {
    if (!token) {
      setError('Verification token is missing. Please check your email.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await verifyEmail(token);
      setSuccess(true);
      setMessage('Account verified successfully! Redirecting to dashboard...');
      // Navigation handled by AuthContext
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed. The token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email address is required to resend verification.');
      return;
    }

    setIsResending(true);
    setError(null);
    try {
      await authAPI.resendVerification(email);
      setMessage('Verification email sent. Please check your inbox.');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
      setError(ax.response?.data?.message || ax.response?.data?.error || (ax.message as string) || 'Failed to resend verification email.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.card}>
      {success ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#10B981"/>
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className={styles.successMessage}>{message}</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#EF4444"/>
              <path d="M24 16V24M24 32H24.01" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={styles.errorMessage}>{error}</p>
          {email && (
            <Button
              variant="primary"
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className={styles.resendButton}
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push('/login')}
            className={styles.backButton}
          >
            Back to Login
          </Button>
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingMessage}>Verifying your account...</p>
        </div>
      )}
    </div>
  );
}

function VerifyAccountFallback() {
  return (
    <div className={styles.card}>
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
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
            <Image src={Logo} alt="logo" />
          </div>
        </div>
        <h1 className={styles.title}>Verify Account</h1>
        <p className={styles.subtitle}>
          Please verify your email address to continue
        </p>

        <div className={styles.content}>
          <Suspense fallback={<VerifyAccountFallback />}>
            <VerifyAccountContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

