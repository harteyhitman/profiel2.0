'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { useUserTeams, useCreateTeam } from '@/hooks/use-dashboard';
import { useMyChurch } from '@/hooks/use-dashboard';

import { Button } from '@/components/ui/forms';
import TeamCard from '@/components/dashboard/TeamCard/TeamCard';
import CreateTeamModal from '@/components/dashboard/CreateTeamModal/CreateTeamModal';
import TeamSuccessModal from '@/components/dashboard/TeamSuccessModal/TeamSuccessModal';
import AddMemberModal from '@/components/dashboard/AddMemberModal/AddMemberModal';

import type { UserTeams, TeamsArray } from '@/lib/types/dashboard';
import styles from './page.module.scss';

export default function TeamListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: teamsData, isLoading: teamsLoading } = useUserTeams();
  const { data: churchData } = useMyChurch();
  const createTeamMutation = useCreateTeam();
  

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [createdTeamName, setCreatedTeamName] = useState<string>('');


  // Transform teams data to match TeamCard props
  const teams = React.useMemo(() => {
    if (!teamsData) return [];
    if (Array.isArray(teamsData)) {
      return (teamsData as TeamsArray).map((team: any) => ({
        id: team.id.toString(),
        name: team.name,
        description: team.description || 'Geen beschrijving',
        memberCount: team.memberCount || 0,
        teamType: team.teamType || 'Team',
        status: team.status || 'active',
      }));
    }
    // If it's UserTeams object with leadTeams/memberTeams
    const userTeams = teamsData as UserTeams;
    const allTeams = [
      ...(userTeams.leadTeams || []),
      ...(userTeams.memberTeams || []),
    ];
    return allTeams.map((team: any) => ({
      id: team.id.toString(),
      name: team.name,
      description: team.description || 'Geen beschrijving',
      memberCount: team.memberCount || 0,
      teamType: team.teamType || 'Team',
      status: team.status || 'active',
    }));
  }, [teamsData]);

  const handleCreateTeam = async (teamData: { name: string; description: string; url: string }) => {
    try {
      if (!churchData?.church?.id) {
        console.error('Cannot create team: church ID is missing');
        alert('Kan team niet aanmaken: kerk ID ontbreekt. Zorg ervoor dat je bij een kerk hoort.');
        return;
      }
      const response = await createTeamMutation.mutateAsync({
        name: teamData.name,
        description: teamData.description,
        churchId: churchData.church.id,
      });
      setCreatedTeamId(response.id.toString());
      setCreatedTeamName(response.name);
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Kan team niet aanmaken. Probeer het opnieuw.');
    }

  };

  const handleShowSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  const handleAddMembers = () => {
    setIsSuccessModalOpen(false);
    setIsAddMemberModalOpen(true);
  };

  const handleGoToHome = () => {
    router.push('/dashboard');
    setIsSuccessModalOpen(false);
  };

  const handleAddMembersSubmit = (memberIds: string[]) => {
    // Handle adding members to team
    console.log('Adding members:', memberIds, 'to team:', createdTeamId);
    // In a real app, you would make an API call here
    // After adding members, you could navigate to the team page
    if (createdTeamId) {
      router.push(`/dashboard/teams/${createdTeamId}`);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.headerSection}>
          <div className={styles.headerText}>

            <h1 className={styles.title}>Jouw Teams</h1>
            <p className={styles.subtitle}>
              Beheer en bekijk de profielen van je teamleden.

            </p>
          </div>
          <Button
            variant="secondary"
            type="button"
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>

            Team aanmaken

          </Button>
        </div>

        <div className={styles.teamsGrid}>

          {teamsLoading ? (
            <div>Teams laden...</div>
          ) : teams.length === 0 ? (
            <div>Geen teams gevonden. Maak je eerste team aan!</div>
          ) : (
            teams.map((team) => (
              <TeamCard
                key={team.id}
                team={{
                  ...team,
                  status: team.status === "active" || team.status === "low-activity"
                    ? team.status
                    : "active"
                }}
              />
            ))
          )}

        </div>
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTeam={handleCreateTeam}
        onSuccess={handleShowSuccess}
      />

      <TeamSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onAddMembers={handleAddMembers}
        onGoToHome={handleGoToHome}
        teamName={createdTeamName}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        teamName={createdTeamName}

        teamId={createdTeamId}

        onAddMembers={handleAddMembersSubmit}
      />
    </>
  );
}

