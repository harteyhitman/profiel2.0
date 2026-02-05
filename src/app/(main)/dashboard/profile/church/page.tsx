'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/forms';
import ProfileField from '@/components/dashboard/ProfileField/ProfileField';
import ChurchLogoUpload from '@/components/dashboard/ChurchLogoUpload/ChurchLogoUpload';
import styles from './page.module.scss';

export default function ChurchProfilePage() {
  const [profileData, setProfileData] = useState({
    churchName: 'Skylaire III',
    country: 'Netherland',
    city: 'Amsterdam',
    domination: 'Reformed',
  });

  const handleFieldUpdate = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Church profile</h1>
          <p className={styles.subtitle}>
            Gain insight into the composition and ministry profiles of your church.
          </p>
        </div>
      </div>

      <div className={styles.profileSection}>
        <ChurchLogoUpload />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Church name"
          value={profileData.churchName}
          onUpdate={(value) => handleFieldUpdate('churchName', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Country"
          value={profileData.country}
          onUpdate={(value) => handleFieldUpdate('country', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="City"
          value={profileData.city}
          onUpdate={(value) => handleFieldUpdate('city', value)}
        />
      </div>

      <div className={styles.profileSection}>
        <ProfileField
          label="Domination"
          value={profileData.domination}
          onUpdate={(value) => handleFieldUpdate('domination', value)}
        />
      </div>
    </div>
  );
}

