'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent/DashboardContent';
import styles from './page.module.scss';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isTeamLeader = user?.role === 'teamleader';

  useEffect(() => {
    if (user && !isTeamLeader) {
      router.replace('/dashboard/questionnaire');
    }
  }, [user, isTeamLeader, router]);

  if (user && !isTeamLeader) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <DashboardContent />
    </div>
  );
}

