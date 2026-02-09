'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/forms';
import ProfileField from '@/components/dashboard/ProfileField/ProfileField';
import ChurchLogoUpload from '@/components/dashboard/ChurchLogoUpload/ChurchLogoUpload';
import styles from './page.module.scss';

export default function ChurchProfilePage() {
  const [profileData, setProfileData] = useState({
    churchName: 'Skylaire III',
    country: 'Nederland',
    city: 'Amsterdam',
    denomination: 'Gereformeerd',
  });

  const handleFieldUpdate = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Kerkprofiel</h1>
          <p className={styles.subtitle}>
            Krijg inzicht in de samenstelling en bedieningsprofielen van je kerk.
          </p>
        </div>
      </div>

      <div className={styles.profileSection}>
        <ChurchLogoUpload />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Naam van de kerk"
          value={profileData.churchName}
          onUpdate={(value) => handleFieldUpdate('churchName', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Land"
          value={profileData.country}
          onUpdate={(value) => handleFieldUpdate('country', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Stad"
          value={profileData.city}
          onUpdate={(value) => handleFieldUpdate('city', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Denominatie"
          value={profileData.denomination}
          onUpdate={(value) => handleFieldUpdate('denomination', value)}
        />
      </div>
    </div>
  );
}

