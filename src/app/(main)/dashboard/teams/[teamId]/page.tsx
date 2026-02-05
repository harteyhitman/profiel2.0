'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useTeamMembers, useTeamResults, useAddTeamMember } from '@/hooks/use-dashboard';

import { Button } from '@/components/ui/forms';
import MemberListTable from '@/components/dashboard/MemberListTable/MemberListTable';
import AddMemberModal from '@/components/dashboard/AddMemberModal/AddMemberModal';
import styles from './page.module.scss';



export default function TeamDetailsPage({ params }: { params: Promise<{ teamId: string }> | { teamId: string } }) {
  const router = useRouter();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [teamId, setTeamId] = useState<string | null>(null);
  

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = 'then' in params ? await params : params;
      setTeamId(resolvedParams.teamId);


    };
    getParams();
  }, [params]);


  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers(teamId);
  const { data: teamResults, isLoading: resultsLoading } = useTeamResults(teamId);
  const addMemberMutation = useAddTeamMember(teamId);

  // Transform members data for the table
  const members = React.useMemo(() => {
    if (!teamMembers) return [];
    return teamMembers.map((member: any) => ({
      id: member.id?.toString() || member.userId?.toString(),
      name: member.name || 'Onbekend',
      email: member.email || '',
      role: member.role || 'Lid',
      primaryControl: member.scores ? getDominantRole(member.scores) : 'N.v.t.',
      status: member.status || 'In afwachting',
    }));
  }, [teamMembers]);

  // Get team info from results
  const teamName = teamResults?.members?.[0]?.teamId ? `Team ${teamId}` : 'Team';
  const teamDescription = 'Teamlid details en profielen.';

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

  function getDominantRole(scores: any): string {
    if (!scores) return 'N.v.t.';
    const roles = ['apostle', 'prophet', 'evangelist', 'herder', 'teacher'];
    let maxRole = roles[0];
    let maxScore = scores[roles[0]] || 0;
    roles.forEach(role => {
      if ((scores[role] || 0) > maxScore) {
        maxScore = scores[role];
        maxRole = role;
      }
    });
    return maxRole.charAt(0).toUpperCase() + maxRole.slice(1);
  }


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
        <MemberListTable members={members} />
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

