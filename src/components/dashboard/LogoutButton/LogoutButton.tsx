'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LogoutButton.module.scss';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className={styles.logoutButton}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 10L19 6M19 6L15 2M19 6H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Uitloggen</span>
    </button>
  );
}

