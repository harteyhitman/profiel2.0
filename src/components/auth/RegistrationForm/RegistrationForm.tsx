'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TextInput,
  EmailInput,
  PasswordInput,
  Select,
  Button,
  Checkbox,
} from '@/components/ui/forms';
import {
  RegistrationFormData,
  registrationSectorOptions,
  referralSourceOptions,
  birthYearOptions,
  birthMonthOptions,
  birthDayOptions,
} from '@/data';
import { useAuth } from '@/contexts/AuthContext';
import styles from './RegistrationForm.module.scss';

const MIN_PASSWORD_LENGTH = 6;

function buildBirthDate(year: string, month: string, day: string): string | undefined {
  if (!year || !month || !day) return undefined;
  const y = year.trim();
  const m = month.padStart(2, '0');
  const d = day.padStart(2, '0');
  if (y.length < 4) return undefined;
  return `${y}-${m}-${d}`;
}

export default function RegistrationForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false,
    isTeamLeader: false,
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    currentSector: '',
    preferredSector: '',
    referralSource: '',
    inviteCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const birthDate = useMemo(
    () => buildBirthDate(formData.birthYear ?? '', formData.birthMonth ?? '', formData.birthDay ?? ''),
    [formData.birthYear, formData.birthMonth, formData.birthDay]
  );

  const valid =
    formData.firstName.trim().length >= 2 &&
    formData.lastName.trim().length >= 2 &&
    formData.email.trim() !== '' &&
    formData.password.length >= MIN_PASSWORD_LENGTH &&
    formData.acceptTerms;

  const handleChange = (field: keyof RegistrationFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        isTeamLeader: formData.isTeamLeader,
        ...(birthDate && { birthDate }),
        ...(formData.currentSector && { currentSector: formData.currentSector }),
        ...(formData.preferredSector && { preferredSector: formData.preferredSector }),
        ...(formData.referralSource && { referralSource: formData.referralSource }),
        ...(formData.inviteCode?.trim() && { inviteCode: formData.inviteCode.trim() }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registratie mislukt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <Checkbox
          id="isTeamLeader"
          checked={formData.isTeamLeader}
          onChange={(e) => handleChange('isTeamLeader', e.target.checked)}
          label="Ik ben gemachtigd om dit account aan te maken namens deze kerk of bediening."
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <TextInput
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Voornaam"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <TextInput
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Achternaam"
            required
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <EmailInput
          id="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="E-mailadres"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <PasswordInput
          id="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Wachtwoord (min. 6 tekens)"
          required
        />
      </div>

      <h2 className={styles.sectionTitle}>Persoonlijke gegevens</h2>

      <div className={styles.rowThree}>
        <div className={styles.formGroup}>
          <Select
            id="birthYear"
            value={formData.birthYear ?? ''}
            onChange={(e) => handleChange('birthYear', e.target.value)}
            options={birthYearOptions}
            placeholder="Jaar"
          />
        </div>
        <div className={styles.formGroup}>
          <Select
            id="birthMonth"
            value={formData.birthMonth ?? ''}
            onChange={(e) => handleChange('birthMonth', e.target.value)}
            options={birthMonthOptions}
            placeholder="Maand"
          />
        </div>
        <div className={styles.formGroup}>
          <Select
            id="birthDay"
            value={formData.birthDay ?? ''}
            onChange={(e) => handleChange('birthDay', e.target.value)}
            options={birthDayOptions}
            placeholder="Dag"
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.formGroup}>
          <Select
            id="currentSector"
            value={formData.currentSector ?? ''}
            onChange={(e) => handleChange('currentSector', e.target.value)}
            options={registrationSectorOptions}
            placeholder="Selecteer sector"
          />
        </div>
        <div className={styles.formGroup}>
          <Select
            id="preferredSector"
            value={formData.preferredSector ?? ''}
            onChange={(e) => handleChange('preferredSector', e.target.value)}
            options={registrationSectorOptions}
            placeholder="Selecteer sector"
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <Select
          id="referralSource"
          value={formData.referralSource ?? ''}
          onChange={(e) => handleChange('referralSource', e.target.value)}
          options={referralSourceOptions}
          placeholder="Hoe heb je ons gevonden?"
        />
      </div>
      <div className={styles.formGroup}>
        <TextInput
          id="inviteCode"
          value={formData.inviteCode ?? ''}
          onChange={(e) => handleChange('inviteCode', e.target.value)}
          placeholder="Uitnodigingscode (optioneel)"
        />
      </div>

      <div className={styles.formGroup}>
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onChange={(e) => handleChange('acceptTerms', e.target.checked)}
          label="Ik ga akkoord met de algemene voorwaarden en het privacybeleid."
        />
        <p className={styles.termsHint}>
          <Link href="/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
            Algemene voorwaarden
          </Link>
          {' · '}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
            Privacybeleid
          </Link>
        </p>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <Button type="submit" variant="primary" disabled={!valid || isLoading} fullWidth>
        {isLoading ? 'Bezig met registreren...' : 'Registreren'}
      </Button>
    </form>
  );
}
