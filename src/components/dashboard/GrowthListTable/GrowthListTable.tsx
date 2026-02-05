'use client';

import React, { useState } from 'react';
import styles from './GrowthListTable.module.scss';

export interface GrowthMember {
  id: string;
  name: string;
  team: string;
  currentAreas: string;
  growthArea: string;
  stage: 'Completed' | 'Pending';
}

interface GrowthListTableProps {
  members: GrowthMember[];
}

export default function GrowthListTable({ members }: GrowthListTableProps) {
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null);

  const handleActionsClick = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionsMenu(openActionsMenu === memberId ? null : memberId);
  };

  const handleViewGrowthDetail = (memberId: string) => {
    console.log('View growth detail for member:', memberId);
    setOpenActionsMenu(null);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Remove member:', memberId);
    setOpenActionsMenu(null);
  };

  const handleAssignToTeam = (memberId: string) => {
    console.log('Assign to team for member:', memberId);
    setOpenActionsMenu(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.actionsCell}`)) {
        setOpenActionsMenu(null);
      }
    };

    if (openActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionsMenu]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Lid</th>
            <th className={styles.tableHeader}>Team</th>
            <th className={styles.tableHeader}>Huidige gebieden</th>
            <th className={styles.tableHeader}>Groeigebied</th>
            <th className={styles.tableHeader}>Fase</th>
            <th className={styles.tableHeader}>Acties</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <span className={styles.memberName}>{member.name}</span>
              </td>
              <td className={styles.tableCell}>
                <span className={styles.team}>{member.team}</span>
              </td>
              <td className={styles.tableCell}>
                <span className={styles.currentAreas}>{member.currentAreas}</span>
              </td>
              <td className={styles.tableCell}>
                <span className={styles.growthArea}>{member.growthArea}</span>
              </td>
              <td className={styles.tableCell}>
                <span className={`${styles.stageBadge} ${member.stage === 'Completed' ? styles.completed : styles.pending}`}>
                  {member.stage === 'Completed' ? 'Voltooid' : 'In afwachting'}
                </span>
              </td>
              <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                <button
                  type="button"
                  onClick={(e) => handleActionsClick(member.id, e)}
                  className={styles.actionsButton}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10.8333C10.4603 10.8333 10.8333 10.4603 10.8333 10C10.8333 9.53976 10.4603 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4603 9.53976 10.8333 10 10.8333Z" fill="currentColor"/>
                    <path d="M10 5.83333C10.4603 5.83333 10.8333 5.46024 10.8333 5C10.8333 4.53976 10.4603 4.16667 10 4.16667C9.53976 4.16667 9.16667 4.53976 9.16667 5C9.16667 5.46024 9.53976 5.83333 10 5.83333Z" fill="currentColor"/>
                    <path d="M10 15.8333C10.4603 15.8333 10.8333 15.4603 10.8333 15C10.8333 14.5398 10.4603 14.1667 10 14.1667C9.53976 14.1667 9.16667 14.5398 9.16667 15C9.16667 15.4603 9.53976 15.8333 10 15.8333Z" fill="currentColor"/>
                  </svg>
                </button>
                {openActionsMenu === member.id && (
                  <div className={styles.actionsMenu}>
                    <button
                      type="button"
                      onClick={() => handleViewGrowthDetail(member.id)}
                      className={styles.actionItem}
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 4V8L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      Groei bekijken
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className={styles.actionItem}
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      Lid verwijderen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAssignToTeam(member.id)}
                      className={styles.actionItem}
                    >
                      <span className={styles.actionIcon} aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.6667 13.3333V12.6667C10.6667 11.9594 10.3857 11.2815 9.88561 10.7814C9.38554 10.2813 8.70765 10 8.00004 10H3.33337C2.62608 10 1.94818 10.2813 1.44811 10.7814C0.948037 11.2815 0.666707 11.9594 0.666707 12.6667V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.66671 7.33333C8.50766 7.33333 10.0007 5.84029 10.0007 3.99933C10.0007 2.15838 8.50766 0.666664 6.66671 0.666664C4.82576 0.666664 3.33337 2.15838 3.33337 3.99933C3.33337 5.84029 4.82576 7.33333 6.66671 7.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 5.33333V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.3333 6.66667H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      Toewijzen aan team
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

