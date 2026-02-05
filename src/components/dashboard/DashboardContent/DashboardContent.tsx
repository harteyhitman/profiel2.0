'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChurchStats, useMyChurch } from '@/hooks/use-dashboard';
import { useCreateTeam } from '@/hooks/use-dashboard';
import type { ChurchSummary, ChurchStats, ChurchDashboardResponse } from '@/lib/types/dashboard';
import styles from './DashboardContent.module.scss';
import AlertBanner from '../AlertBanner/AlertBanner';
import MetricCard from '../MetricCard/MetricCard';
import MemberGrowthChart from '../MemberGrowthChart/MemberGrowthChart';
import TeamsByRoleChart from '../TeamsByRoleChart/TeamsByRoleChart';
import TeamEngagementChart from '../TeamEngagementChart/TeamEngagementChart';
import AISummaryCard from '../AISummaryCard/AISummaryCard';
import { useChurchDashboard } from '@/hooks/use-dashboard';
import InviteMemberModal from '../InviteMemberModal/InviteMemberModal';
import CreateTeamModal from '../CreateTeamModal/CreateTeamModal';
import TeamSuccessModal from '../TeamSuccessModal/TeamSuccessModal';
import AddMemberModal from '../AddMemberModal/AddMemberModal';
import { Button } from '@/components/ui/forms';
import { downloadCSV, downloadJSON } from '@/lib/utils/export';
import { generateDummyDashboardData, getDummyDominantRole } from '@/lib/utils/dummyData';

export default function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: churchData } = useMyChurch();
  const churchId = (churchData as { church: ChurchSummary } | undefined)?.church?.id ?? null;
  const { data: statsData, isLoading: statsLoading } = useChurchStats(churchId);
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(churchId);
  const createTeamMutation = useCreateTeam();

  // Use dummy data if API doesn't return data or is loading
  const effectiveDashboardData = useMemo<ChurchDashboardResponse | null>(() => {
    if (dashboardData) return dashboardData;
    if (dashboardLoading) return null; // Still loading, wait
    // No data and not loading - use dummy data
    return generateDummyDashboardData();
  }, [dashboardData, dashboardLoading]);
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [createdTeamName, setCreatedTeamName] = useState<string>('');

  const handleCreateTeam = async (teamData: { name: string; description: string; url: string }) => {
    try {
      const church = (churchData as { church: ChurchSummary } | undefined)?.church;
      if (!church?.id) {
        console.error('Cannot create team: church ID is missing');
        alert('Kan team niet aanmaken: kerk ID ontbreekt. Zorg ervoor dat je bij een kerk hoort.');
        return;
      }
      const response = await createTeamMutation.mutateAsync({
        name: teamData.name,
        description: teamData.description,
        churchId: church.id,
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

  const handleExportStatistics = () => {
    const exportData = {
      church: (churchData as { church: ChurchSummary } | undefined)?.church,
      stats: (statsData as ChurchStats | undefined)?.stats,
      dashboard: effectiveDashboardData,
      exportDate: new Date().toISOString(),
    };
    downloadJSON(exportData, `kerk-statistieken-${new Date().toISOString().split('T')[0]}.json`);
  };
  return (
    <div className={styles.dashboardContent}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Je Kerk Dashboard zou in één oogopslag een verhaal moeten vertellen.
          </p>
        </div>
        <div className={styles.actionButtons}>
          <button 
            className={styles.actionButton} 
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Team aanmaken
          </button>
          <Button 
            variant="primary" 
            type="button" 
            className={styles.actionButtonBlack}
            onClick={() => setIsInviteModalOpen(true)}
            
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V14M6 10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Lid uitnodigen
          </Button>
          <Button 
            variant="secondary" 
            type="button" 
            className={styles.actionButtonGreen}
            onClick={handleExportStatistics}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 2L14 6H10V2Z" fill="currentColor"/>
            </svg>
            Statistieken exporteren
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <AlertBanner />

      {/* Metrics Cards */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Totaal Leden"
          value={effectiveDashboardData?.church?.totalMembers || 0}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          title="Totaal Teams"
          value={effectiveDashboardData?.church?.totalTeams || effectiveDashboardData?.teams?.length || 0}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1674 16.5523C21.6304 15.8519 20.8833 15.3516 20.04 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          title="Dominante Rol"
          value={(() => {
            const scores = effectiveDashboardData?.totalScores || effectiveDashboardData?.aggregatedScores;
            if (!scores) return getDummyDominantRole();
            const roles = Object.entries(scores) as [string, number][];
            const dominant = roles.reduce((max, [role, score]) => score > max.score ? { role, score } : max, { role: '', score: 0 });
            return dominant.role ? dominant.role.charAt(0).toUpperCase() + dominant.role.slice(1) : getDummyDominantRole();
          })()}
          animate={false}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <MetricCard
          title="Denominatie"
          value={effectiveDashboardData?.church?.denomination || (churchData as { church: ChurchSummary } | undefined)?.church?.denomination || 'Reformed'}
          animate={false}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>

      {/* Charts Grid — 2x2 for equal row heights */}
      <div className={styles.chartsGrid}>
        <MemberGrowthChart dashboardData={effectiveDashboardData} />
        <TeamEngagementChart dashboardData={effectiveDashboardData} />
        <TeamsByRoleChart dashboardData={effectiveDashboardData} />
        <AISummaryCard dashboardData={effectiveDashboardData} />
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

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
    </div>
  );
}

