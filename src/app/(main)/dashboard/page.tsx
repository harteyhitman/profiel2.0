'use client';

import { useState, useEffect } from 'react';
import ChurchSetupWizard from '@/components/onboarding/ChurchSetupWizard/ChurchSetupWizard';
import DashboardContent from '@/components/dashboard/DashboardContent/DashboardContent';
import styles from './page.module.scss';

export default function DashboardPage() {
  // Default to false so main content shows immediately; effect will show wizard only if needed
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      <div className={`${styles.dashboard} ${showOnboarding ? styles.blurred : ''}`}>
        <DashboardContent />
      </div>

      {showOnboarding && (
        <ChurchSetupWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </>
  );
}

