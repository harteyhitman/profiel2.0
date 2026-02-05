'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './NewPasswordForm.module.scss';
import {
  PasswordInput,
  Button,
} from '@/components/ui/forms';
import { NewPasswordFormData } from '@/data';
import { useAuth } from '@/contexts/AuthContext';

export default function NewPasswordForm() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  
  const [formData, setFormData] = useState<NewPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    validateForm(newData);
    setError(null);
  };

  const validateForm = (data: typeof formData) => {
    const valid =
      data.newPassword.trim() !== '' &&
      data.confirmPassword.trim() !== '' &&
      data.newPassword === data.confirmPassword;
    setIsFormValid(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading && token) {
      setIsLoading(true);
      setError(null);
      try {
        await resetPassword(token, formData.newPassword);
        // Navigation handled by AuthContext
      } catch (err: any) {
        setError(err.message || 'Wachtwoord resetten mislukt. Probeer het opnieuw.');
      } finally {
        setIsLoading(false);
      }
    } else if (!token) {
      setError('Ongeldig of ontbrekend reset token. Vraag een nieuwe wachtwoord reset aan.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={(e) => handleInputChange('newPassword', e.target.value)}
          placeholder="Nieuw wachtwoord"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Bevestig wachtwoord"
          required
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        disabled={!isFormValid || isLoading || !token}
        fullWidth
      >
        {isLoading ? 'Wachtwoord resetten...' : 'Nieuw wachtwoord instellen'}
      </Button>
    </form>
  );
}

