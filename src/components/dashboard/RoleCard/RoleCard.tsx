'use client';

import React from 'react';
import styles from './RoleCard.module.scss';

interface RoleCardProps {
  type: 'primary' | 'secondary';
  role: string;
  description: string;
}

const roleDescriptions: Record<string, string> = {
  Apostle: "You have a passion for sharing the good news with others. You're enthusiastic about reaching people with the message of salvation and grace.",
  Apostel: "You have a passion for sharing the good news with others. You're enthusiastic about reaching people with the message of salvation and grace.",
  Prophet: "You have a strong ability to hear God's voice and speak his truth. You bring insights and perspective that challenge people to grow spiritually.",
  Profeet: "You have a strong ability to hear God's voice and speak his truth. You bring insights and perspective that challenge people to grow spiritually.",
  Evangelist: "You are passionate about sharing the gospel and reaching people with the message of salvation. You have a natural gift for inspiring and motivating others to share their faith.",
  Shepherd: "You have a big heart for people and enjoy caring for others. You focus on relationships, emotional well-being, and creating a safe environment.",
  Herder: "You have a big heart for people and enjoy caring for others. You focus on relationships, emotional well-being, and creating a safe environment.",
  Teacher: "You have a gift for explaining and teaching God's word. You help others understand and apply biblical truth in practical ways.",
  Leraar: "You have a gift for explaining and teaching God's word. You help others understand and apply biblical truth in practical ways.",
};

export default function RoleCard({ type, role, description }: RoleCardProps) {
  // Use role-specific description if available, otherwise use provided description
  const displayDescription = roleDescriptions[role] || description;

  return (
    <div className={`${styles.roleCard} ${styles[type]}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.roleTitle}>{role}</h3>
        <span className={`${styles.roleBadge} ${styles[type]}`}>
          {type === 'primary' ? 'Primary' : 'Secondary'}
        </span>
      </div>
      <p className={styles.roleDescription}>{displayDescription}</p>
    </div>
  );
}

