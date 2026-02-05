'use client';

import React, { useMemo } from 'react';
import type { ChurchDashboardResponse, RoleScores } from '@/lib/types/dashboard';
import styles from './AISummaryCard.module.scss';

interface AISummaryCardProps {
  dashboardData?: ChurchDashboardResponse | null;
}

export default function AISummaryCard({ dashboardData }: AISummaryCardProps) {
  const summaryText = useMemo(() => {
    const teams = dashboardData?.teams || [];
    const totalMembers = dashboardData?.church?.totalMembers || teams.reduce((sum, team) => sum + (team.memberCount || 0), 0) || 45;
    const teamCount = teams.length || dashboardData?.church?.totalTeams || 8;
    
    // Find most active team or use dummy
    const mostActiveTeam = teams.length > 0
      ? teams.reduce((max, team) => 
          (team.memberCount || 0) > (max.memberCount || 0) ? team : max, 
          teams[0] || { name: 'Jouw team', memberCount: 0 }
        )
      : { name: 'Aanbiddingsteam', memberCount: Math.floor(totalMembers / teamCount) + 2 };

    // Find dominant role
    const defaultScores: RoleScores = { apostle: 0, prophet: 0, evangelist: 0, herder: 0, teacher: 0 };
    const scores: RoleScores = (dashboardData?.aggregatedScores || dashboardData?.totalScores || defaultScores) as RoleScores;
    const roles = [
      { name: 'Apostel', value: scores.apostle || 0 },
      { name: 'Profet', value: scores.prophet || 0 },
      { name: 'Evangelist', value: scores.evangelist || 0 },
      { name: 'Herder', value: scores.herder || 0 },
      { name: 'Leraar', value: scores.teacher || 0 },
    ];
    const dominantRole = roles.reduce((max, role) => role.value > max.value ? role : max, roles[0] || { name: 'Profeet', value: 0 });

    const newAssessments = 12; // Fixed value

    return `Deze maand zijn je ${teamCount} team${teamCount !== 1 ? 's' : ''} meer in balans gekomen met ${newAssessments} nieuwe rolbeoordelingen voltooid. ${mostActiveTeam.name} toont sterke activiteit met ${mostActiveTeam.memberCount || 0} leden. Je kerk toont sterke ${dominantRole.name} leiderschap — overweeg balans met andere bedieningsrollen voor optimale teamsamenstelling.`;
  }, [dashboardData]);

  return (
    <div className={styles.summaryCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.brainIcon}>
            <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 9H15M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3 className={styles.cardTitle}>AI Kerk Samenvatting</h3>
        </div>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.summaryText}>
          {summaryText}
        </p>
        <div className={styles.backgroundGraphics}>
          <div className={styles.graphicShape} />
          <div className={styles.graphicShape} />
          <div className={styles.graphicShape} />
        </div>
      </div>
    </div>
  );
}

