'use client';

import { useState } from 'react';
import styles from './LoginForm.module.scss';
import {
  EmailInput,
  PasswordInput,
  Button,
} from '@/components/ui/forms';
import { LoginFormData } from '@/data';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
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
      data.email.trim() !== '' &&
      data.password.trim() !== '';
    setIsFormValid(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        await login(formData.email, formData.password);
        // Navigation handled by AuthContext
      } catch (err: any) {
        setError(err.message || 'Inloggen mislukt. Controleer je inloggegevens.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <EmailInput
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="E-mailadres"
        />
      </div>

      <div className={styles.formGroup}>
        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Wachtwoord"
        />
        <Link href="/forgot-password" className={styles.forgotPassword}>
          Wachtwoord vergeten?
        </Link>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="secondary"
        disabled={!isFormValid || isLoading}
        fullWidth
      >
        {isLoading ? 'Inloggen...' : 'Inloggen'}
      </Button>
    </form>
  );
}

