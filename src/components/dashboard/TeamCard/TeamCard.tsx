'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './TeamCard.module.scss';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  teamType: string;
  status: 'active' | 'low-activity';
}

interface TeamCardProps {
  team: Team;
}

const GroupIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewMembers = () => {
    router.push(`/dashboard/teams/${team.id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <GroupIcon size={24} />
        </div>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopyInvite}
          aria-label={copied ? 'Copied' : 'Copy invite link'}
        >
          <CopyIcon />
          {copied ? 'Copied' : 'Copy invite'}
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.teamName}>{team.name}</h3>
          <span className={`${styles.statusBadge} ${styles[team.status]}`}>
            {team.status === 'active' ? 'Active' : 'Low activity'}
          </span>
        </div>
        <p className={styles.description}>{team.description}</p>
        <div className={styles.pills}>
          <div className={styles.pill}>
            <GroupIcon size={14} />
            <span>{team.memberCount} members</span>
          </div>
          <div className={styles.pill}>
            <GroupIcon size={14} />
            <span>{team.teamType}</span>
          </div>
        </div>
      </div>

      <button type="button" className={styles.viewButton} onClick={handleViewMembers}>
        View team members
      </button>
    </div>
  );
}

