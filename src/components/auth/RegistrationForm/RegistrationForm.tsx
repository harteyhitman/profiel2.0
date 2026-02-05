'use client';

import { useState } from 'react';
import styles from './RegistrationForm.module.scss';
import {
  TextInput,
  EmailInput,
  PasswordInput,
  Select,
  DateInput,
  Button,
} from '@/components/ui/forms';
import { RegistrationFormData, registrationSectorOptions } from '@/data';
import { useAuth } from '@/contexts/AuthContext';

export default function RegistrationForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    sector: '',
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
      data.fullName.trim() !== '' &&
      data.email.trim() !== '' &&
      data.password.trim() !== '' &&
      data.dateOfBirth.trim() !== '' &&
      data.sector.trim() !== '';
    setIsFormValid(valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName.trim(),
          // Include other fields if API accepts them
          ...(formData.dateOfBirth && { dateOfBirth: formData.dateOfBirth }),
          ...(formData.sector && { sector: formData.sector }),
        });
        // Navigation handled by AuthContext
      } catch (err: any) {
        setError(err.message || 'Registratie mislukt. Probeer het opnieuw.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <TextInput
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Volledige naam"
        />
      </div>

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
      </div>

      <div className={styles.formGroup}>
        <DateInput
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          placeholder="Geboortedatum"
          format="DD/MM/YYYY"
        />
      </div>

      <div className={styles.formGroup}>
        <Select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={(e) => handleInputChange('', e.target.value)}
          options={registrationSectorOptions}
          placeholder="Waar ben je werkzaam in de maatschappij?"
        />
      </div>
      <div className={styles.formGroup}>
        <Select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={(e) => handleInputChange('', e.target.value)}
          options={registrationSectorOptions}
          placeholder="Waar zou je werkzaam willen zijn in de maatschappij?"
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
        disabled={!isFormValid || isLoading}
        fullWidth
      >
        {isLoading ? 'Registreren...' : 'Registreren'}
      </Button>
    </form>
  );
}

