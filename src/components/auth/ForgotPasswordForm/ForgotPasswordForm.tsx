'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './ForgotPasswordForm.module.scss';
import {
  EmailInput,
  Button,
} from '@/components/ui/forms';
import { ForgotPasswordFormData } from '@/data';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: searchParams?.get('email') || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() !== '' && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await forgotPassword(formData.email);
        setSuccess(true);
        // Redirect to new password page with token from response
        // Note: API returns token in response, but we'll get it from email link typically
        // For now, redirect to new-password page - token will come from URL query param
        setTimeout(() => {
          router.push(`/new-password?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Verzenden van reset e-mail mislukt. Probeer het opnieuw.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <EmailInput
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="E-mailadres"
          required
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          Reset e-mail verzonden! Doorverwijzen naar wachtwoord reset pagina...
        </div>
      )}

      <div className={styles.buttonGroup}>
        <Button
          type="submit"
          variant="secondary"
          disabled={formData.email.trim() === '' || isLoading || success}
          fullWidth
        >
          {isLoading ? 'Verzenden...' : 'Resetten'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          fullWidth
          disabled={isLoading || success}
        >
          Annuleren
        </Button>
      </div>
    </form>
  );
}

