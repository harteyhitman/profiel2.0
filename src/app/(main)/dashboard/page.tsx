'use client';

import DashboardContent from '@/components/dashboard/DashboardContent/DashboardContent';
import styles from './page.module.scss';

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <DashboardContent />
    </div>
  );
}

