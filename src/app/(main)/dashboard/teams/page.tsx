'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useMyChurch, useChurchDashboard, useCreateTeam } from '@/hooks/use-dashboard';
import { generateDummyDashboardData } from '@/lib/utils/dummyData';

import { Button } from '@/components/ui/forms';
import TeamProfileChart from '@/components/dashboard/TeamProfileChart/TeamProfileChart';
import StrengthsWeaknesses from '@/components/dashboard/StrengthsWeaknesses/StrengthsWeaknesses';
import NationalAverageChart from '@/components/dashboard/NationalAverageChart/NationalAverageChart';
import RoleDistributionChart from '@/components/dashboard/RoleDistributionChart/RoleDistributionChart';
import TeamControlsBalance from '@/components/dashboard/TeamControlsBalance/TeamControlsBalance';
import UnderrepresentedMinistries from '@/components/dashboard/UnderrepresentedMinistries/UnderrepresentedMinistries';
import CreateTeamModal from '@/components/dashboard/CreateTeamModal/CreateTeamModal';
import TeamSuccessModal from '@/components/dashboard/TeamSuccessModal/TeamSuccessModal';
import AddMemberModal from '@/components/dashboard/AddMemberModal/AddMemberModal';
import InvitationLinkModal from '@/components/dashboard/InvitationLinkModal/InvitationLinkModal';

import { downloadJSON } from '@/lib/utils/export';

import styles from './page.module.scss';

export default function TeamsPage() {
  const router = useRouter();

  const { data: churchData } = useMyChurch();
  const churchId = churchData?.church?.id;
  // For team dashboard, we might want to show aggregated data from all teams
  // or a specific team. For now, we'll use church dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(
    churchId ?? null
  );
  const createTeamMutation = useCreateTeam();

  // Use dummy data if API doesn't return data
  const effectiveDashboardData = useMemo(() => {
    if (dashboardData) return dashboardData;
    if (dashboardLoading) return null; // Still loading, wait
    // No data and not loading - use dummy data
    return generateDummyDashboardData();
  }, [dashboardData, dashboardLoading]);


  const [copied, setCopied] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isInvitationLinkModalOpen, setIsInvitationLinkModalOpen] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [createdTeamName, setCreatedTeamName] = useState<string>('');

  const inviteUrl = churchData?.church?.inviteCode
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://bedieningenprofiel.nl'}/join-church/${churchData.church.inviteCode}`
    : '';


  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


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


  const handleExportReport = () => {
    const exportData = {
      church: churchData?.church,
      dashboard: effectiveDashboardData,
      exportDate: new Date().toISOString(),
    };
    downloadJSON(exportData, `team-rapport-${new Date().toISOString().split('T')[0]}.json`);
  };


  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Team Dashboard</h1>
          <p className={styles.subtitle}>
            Visuele analyse van je teamsamenstelling.
          </p>
        </div>
        <div className={styles.actionButtons}>
          <Button 
            variant="outline" 
            type="button" 
            className={styles.actionButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>

            Team aanmaken
          </Button>
          <Button 
            variant="secondary" 
            type="button" 
            className={styles.actionButton}
            onClick={handleExportReport}
          >

            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 2L14 6H10V2Z" fill="currentColor"/>
            </svg>

            Rapport exporteren

          </Button>
        </div>
      </div>

      <div className={styles.inviteSection}>
        <button type="button" className={styles.inviteButton}>
          Team uitnodigen
        </button>
        <div className={styles.urlContainer}>
          <span className={styles.urlText}>{inviteUrl}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={styles.copyButton}
            aria-label={copied ? 'Copied' : 'Copy link'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.topRow}>
          <div className={styles.chartItem}>

            <TeamProfileChart dashboardData={effectiveDashboardData} />
          </div>
          <div className={styles.chartItem}>
            <StrengthsWeaknesses dashboardData={effectiveDashboardData} />
          </div>
 
        </div>
        <div className={styles.bottomRow}>
        <div className={styles.chartItem}>
            <NationalAverageChart dashboardData={effectiveDashboardData} />
          </div>
        <div className={styles.chartItem}>
            <RoleDistributionChart dashboardData={effectiveDashboardData} />

          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>

        <TeamControlsBalance dashboardData={effectiveDashboardData} />
        <UnderrepresentedMinistries dashboardData={effectiveDashboardData} />

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

      <InvitationLinkModal
        isOpen={isInvitationLinkModalOpen}
        onClose={() => setIsInvitationLinkModalOpen(false)}
      />
    </div>
  );
}
