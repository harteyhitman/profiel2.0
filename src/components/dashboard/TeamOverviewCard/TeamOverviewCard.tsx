'use client';

import React from 'react';
import styles from './TeamOverviewCard.module.scss';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  primaryRole: string;
  secondaryRole?: string;
}

interface TeamOverviewCardProps {
  members?: TeamMember[];
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Jan de Vries', initials: 'JD', primaryRole: 'Apostel', secondaryRole: 'Herder' },
  { id: '2', name: 'Maria Jansen', initials: 'MJ', primaryRole: 'Herder', secondaryRole: 'Leraar' },
  { id: '3', name: 'Peter Bakker', initials: 'PB', primaryRole: 'Profeet', secondaryRole: 'Apostel' },
  { id: '4', name: 'Anne de Wit', initials: 'AD', primaryRole: 'Leraar', secondaryRole: 'Herder' },
  { id: '5', name: 'Thomas Smit', initials: 'TS', primaryRole: 'Evangelist', secondaryRole: 'Profeet' },
];

const ROLE_COLORS: Record<string, string> = {
  'Apostel': '#3b82f6', // Blue
  'Profeet': '#10b981', // Green
  'Evangelist': '#ec4899', // Pink
  'Herder': '#f59e0b', // Orange
  'Leraar': '#8b5cf6', // Purple
};

export default function TeamOverviewCard({ members = DEFAULT_MEMBERS }: TeamOverviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Teamoverzicht</h3>
        <p className={styles.subtitle}>Overzicht van leden binnen dit team</p>
      </div>
      
      <div className={styles.memberList}>
        {members.map((member) => (
          <div key={member.id} className={styles.memberItem}>
            <div className={styles.memberInfo}>
              <div className={styles.avatar} style={{ backgroundColor: ROLE_COLORS[member.primaryRole] || '#ccc' }}>
                {member.initials}
              </div>
              <span className={styles.initialsText}>{member.initials}</span>
              <span className={styles.memberName}>{member.name}</span>
            </div>
            
            <div className={styles.badges}>
              <span 
                className={styles.badge} 
                style={{ backgroundColor: `${ROLE_COLORS[member.primaryRole]}15`, color: ROLE_COLORS[member.primaryRole] }}
              >
                {member.primaryRole}
              </span>
              {member.secondaryRole && (
                <span 
                  className={styles.badge} 
                  style={{ backgroundColor: `${ROLE_COLORS[member.secondaryRole]}15`, color: ROLE_COLORS[member.secondaryRole] }}
                >
                  {member.secondaryRole}
                </span>
              )}
              <button className={styles.moreButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <a href="#" className={styles.footerLink}>
        Bekijk alle teamleden →
      </a>
    </div>
  );
}
