'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useTeamMembers, useTeamResults, useAddTeamMember, useTeam } from '@/hooks/use-dashboard';

import { Button } from '@/components/ui/forms';
import MemberListTable from '@/components/dashboard/MemberListTable/MemberListTable';
import AddMemberModal from '@/components/dashboard/AddMemberModal/AddMemberModal';
import ProfileDistributionChart from '@/components/dashboard/ProfileDistributionChart/ProfileDistributionChart';
import RoleChart from '@/components/dashboard/RoleChart/RoleChart';
import { NATIONAL_AVERAGE_SCORES } from '@/lib/constants/questionnaire';
import styles from './page.module.scss';

const ROLE_LABELS: Record<string, string> = {
  apostle: 'Apostel',
  prophet: 'Profeet',
  evangelist: 'Evangelist',
  herder: 'Herder',
  teacher: 'Leraar',
};

function getDominantRole(scores: Record<string, number> | null | undefined): string {
  if (!scores) return 'N.v.t.';
  const roleKeys = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
  let maxKey = roleKeys[0];
  let maxScore = scores[roleKeys[0]] || 0;
  roleKeys.forEach((key) => {
    if ((scores[key] || 0) > maxScore) {
      maxScore = scores[key];
      maxKey = key;
    }
  });
  return ROLE_LABELS[maxKey] ?? maxKey;
}

export default function TeamDetailsPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const router = useRouter();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [teamId, setTeamId] = useState<string | null>(null);
  

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setTeamId(resolvedParams.teamId);


    };
    getParams();
  }, [params]);


  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers(teamId);
  const { data: teamResults, isLoading: resultsLoading } = useTeamResults(teamId);
  const addMemberMutation = useAddTeamMember(teamId);

  // Transform members data for the table
  const members = React.useMemo(() => {
    if (!teamMembers) return [];
    return teamMembers.map((member: any) => {
      const memberScores = member.profile || member.scores;
      return {
        id: member.id?.toString() || member.userId?.toString(),
        name: member.name || 'Onbekend',
        email: member.email || '',
        role: member.role || 'Lid',
        primaryControl: memberScores ? getDominantRole(memberScores) : 'N.v.t.',
        status: member.status || 'In afwachting',
      };
    });
  }, [teamMembers]);

  // Calculate aggregated scores if not provided
  const aggregatedScores = useMemo(() => {
    if (teamResults?.aggregatedScores) return teamResults.aggregatedScores;
    
    const scores = {
      apostle: 0,
      prophet: 0,
      evangelist: 0,
      herder: 0,
      teacher: 0,
    };
    
    // Fallback calculation from members if teamResults doesn't have it
    const dataToUse = teamResults?.results || teamMembers;

    if (dataToUse) {
      dataToUse.forEach((item: any) => {
        const s = item.scores || item.profile;
        if (s) {
          scores.apostle += s.apostle || 0;
          scores.prophet += s.prophet || 0;
          scores.evangelist += s.evangelist || 0;
          scores.herder += s.herder || 0;
          scores.teacher += s.teacher || 0;
        }
      });
    }
    
    return scores;
  }, [teamResults, teamMembers]);

  // Get team info
  const teamName = team?.name || (teamResults?.members?.[0]?.teamId ? `Team ${teamId}` : 'Team');
  const teamDescription = team?.description || 'Details en profielen van teamleden.';

  const handleAddMembers = async (memberIds: string[]) => {
    try {
      for (const memberId of memberIds) {
        await addMemberMutation.mutateAsync(Number(memberId));
      }
      setIsAddMemberModalOpen(false);
    } catch (error) {
      console.error('Failed to add members:', error);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/teams/list');
  };

  return (
    <div className={styles.page}>
      <button type="button" onClick={handleGoBack} className={styles.goBackButton}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Terug
      </button>

      <div className={styles.headerSection}>
        <div className={styles.headerText}>

          <h1 className={styles.title}>{teamName}</h1>
          <p className={styles.subtitle}>{teamDescription}</p>

        </div>
        <div className={styles.headerActions}>
          <div className={styles.filterContainer}>
            <button
              type="button"
              className={styles.filterButton}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5H17M5 10H15M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Filteren
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showFilterDropdown && (
              <div className={styles.filterDropdown}>
                {/* Filter options will go here */}
                <div className={styles.filterOption}>Alle leden</div>
                <div className={styles.filterOption}>Voltooid</div>
                <div className={styles.filterOption}>In afwachting</div>
              </div>
            )}
          </div>
          <Button
            variant="secondary"
            type="button"
            className={styles.addMemberButton}
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Lid toevoegen
          </Button>
        </div>
      </div>


      {membersLoading ? (
        <div>Leden laden...</div>
      ) : (
        <>
          <div className={styles.chartsGrid}>
             <RoleChart 
               results={aggregatedScores} 
               type="bar" 
               isTeam={true}
               comparisonData={NATIONAL_AVERAGE_SCORES}
               showLegend={true}
             />
             <ProfileDistributionChart members={teamMembers || []} />
          </div>
          <MemberListTable members={members} />
        </>
      )}


      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}

        teamName={teamName}
        teamId={teamId}
        onAddMembers={handleAddMembers}

      />
    </div>
  );
}
