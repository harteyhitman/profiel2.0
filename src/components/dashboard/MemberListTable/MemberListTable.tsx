'use client';

import React, { useState } from 'react';
import styles from './MemberListTable.module.scss';

interface Member {
  id: string;
  name: string;
  email?: string;
  role?: string;
  primaryControl: string;
  status: 'Voltooid' | 'In afwachting';
}

interface MemberListTableProps {
  members: Member[];
}

export default function MemberListTable({ members }: MemberListTableProps) {
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null);

  const handleActionsClick = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionsMenu(openActionsMenu === memberId ? null : memberId);
  };

  const handleViewScore = (memberId: string) => {
    // Navigate to member score page
    console.log('View score for member:', memberId);
    setOpenActionsMenu(null);
  };

  const handleRemoveMember = (memberId: string) => {
    // Remove member logic
    console.log('Remove member:', memberId);
    setOpenActionsMenu(null);
  };

  const handleAssignToTeam = (memberId: string) => {
    // Assign to team logic
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
            <th className={styles.tableHeader}>Naam</th>
            {members[0]?.email && <th className={styles.tableHeader}>E-mail</th>}
            {members[0]?.role && <th className={styles.tableHeader}>Rol</th>}
            <th className={styles.tableHeader}>Primaire Controle</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Acties</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <span className={styles.memberName}>{member.name}</span>
              </td>
              {member.email && (
                <td className={styles.tableCell}>
                  <span className={styles.email}>{member.email}</span>
                </td>
              )}
              {member.role && (
                <td className={styles.tableCell}>
                  <span className={styles.role}>{member.role}</span>
                </td>
              )}
              <td className={styles.tableCell}>
                <span className={styles.primaryControl}>{member.primaryControl}</span>
              </td>
              <td className={styles.tableCell}>
                <span className={`${styles.statusBadge} ${styles[member.status.toLowerCase()]}`}>
                  {member.status}
                </span>
              </td>
              <td className={styles.tableCell}>
                <div className={styles.actionsCell}>
                  <button
                    type="button"
                    className={styles.actionsButton}
                    onClick={(e) => handleActionsClick(member.id, e)}
                    aria-label="Acties"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
                    </svg>
                  </button>
                  {openActionsMenu === member.id && (
                    <div className={styles.actionsMenu}>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => handleViewScore(member.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 5.5V8L10 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Bekijk score
                      </button>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Lid verwijderen
                      </button>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => handleAssignToTeam(member.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2L12 6H8V2Z" fill="currentColor"/>
                        </svg>
                        Toewijzen aan team
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

