'use client';

import React from 'react';
import styles from './RoleCard.module.scss';

interface RoleCardProps {
  type: 'primary' | 'secondary';
  role: string;
  description: string;
}

const roleDescriptions: Record<string, string> = {
  Apostel: 'Pionier en grondlegger; ziet mogelijkheden en bouwt nieuwe structuren.',
  Profeet: 'Spreekt Gods waarheid; gevoelig voor Zijn stem en richting.',
  Evangelist: 'Brengt het goede nieuws; trekt mensen tot Christus.',
  Herder: 'Zorgt en begeleidt; bouwt relaties en beschermt de kudde.',
  Leraar: 'Legt de waarheid uit; maakt de Schrift begrijpelijk en toepasbaar.',
};

export default function RoleCard({ type, role, description }: RoleCardProps) {
  // Use role-specific description if available, otherwise use provided description
  const displayDescription = roleDescriptions[role] || description;

  return (
    <div className={`${styles.roleCard} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.roleTitle}>{role}</h3>
        <span className={`${styles.roleBadge} ${styles[type]}`}>
          {type === 'primary' ? 'Primair' : 'Secundair'}
        </span>
      </div>
      <p className={styles.roleDescription}>{displayDescription}</p>
    </div>
  );
}

