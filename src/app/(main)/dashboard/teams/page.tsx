'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useMyChurch, useChurchDashboard, useCreateTeam, useUserTeams, useTeamResults, useTeamMembers } from '@/hooks/use-dashboard';
import type { Team, ChurchSummary, RoleScores } from '@/lib/types/dashboard';
import { generateDummyDashboardData } from '@/lib/utils/dummyData';
import { getPrimaryRoleLabel, calculatePrimaryRole } from '@/lib/utils/roleCalculations';
import { ROLE_LABELS } from '@/lib/constants/questionnaire';

import { Button } from '@/components/ui/forms';
import TeamProfileChart from '@/components/dashboard/TeamProfileChart/TeamProfileChart';
import StrengthsWeaknesses from '@/components/dashboard/StrengthsWeaknesses/StrengthsWeaknesses';
import NationalAverageChart from '@/components/dashboard/NationalAverageChart/NationalAverageChart';
import RoleDistributionChart from '@/components/dashboard/RoleDistributionChart/RoleDistributionChart';
import TeamControlsBalance from '@/components/dashboard/TeamControlsBalance/TeamControlsBalance';
import UnderrepresentedMinistries from '@/components/dashboard/UnderrepresentedMinistries/UnderrepresentedMinistries';
import TeamOverviewCard from '@/components/dashboard/TeamOverviewCard/TeamOverviewCard';
import CreateTeamModal from '@/components/dashboard/CreateTeamModal/CreateTeamModal';
import TeamSuccessModal from '@/components/dashboard/TeamSuccessModal/TeamSuccessModal';
import AddMemberModal from '@/components/dashboard/AddMemberModal/AddMemberModal';
import InvitationLinkModal from '@/components/dashboard/InvitationLinkModal/InvitationLinkModal';

import { downloadJSON } from '@/lib/utils/export';

import styles from './page.module.scss';

export default function TeamsPage() {
  const router = useRouter();

  const { data: userTeamsData } = useUserTeams();
  const teams = useMemo(() => {
    if (!userTeamsData) return [];
    if (Array.isArray(userTeamsData)) return userTeamsData;
    const combined = [
      ...(userTeamsData.leadTeams || []),
      ...(userTeamsData.memberTeams || [])
    ];
    // Filter duplicates by ID
    return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  }, [userTeamsData]);

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  // Auto-select first team if none selected
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const selectedTeam = useMemo(() => 
    teams.find((t: Team) => t.id === selectedTeamId), 
    [teams, selectedTeamId]
  );

  const { data: churchData } = useMyChurch();
  const church = (churchData as { church?: ChurchSummary } | undefined)?.church;
  const churchId = church?.id;

  const { data: teamResults, isLoading: resultsLoading } = useTeamResults(selectedTeamId);
  const { data: teamMembers } = useTeamMembers(selectedTeamId);
  const { data: dashboardData, isLoading: dashboardLoading } = useChurchDashboard(
    !selectedTeamId ? churchId ?? null : null
  );

  const createTeamMutation = useCreateTeam();

  // Use team results if available, otherwise church dashboard, otherwise dummy
  const effectiveDashboardData = useMemo(() => {
    if (selectedTeamId && teamResults) {
      return {
        ...teamResults,
        // Ensure structure matches what components expect
        aggregatedScores: teamResults.aggregatedScores || teamResults.totalScores,
        results: teamResults.results
      } as any;
    }
    
    // Fallback: If teamResults is 404/null but we have members, we could aggregate them here
    if (selectedTeamId && !resultsLoading && teamMembers && teamMembers.length > 0) {
      const aggregated = teamMembers.reduce((acc, member) => {
        const scores = member.scores || member.profile;
        if (scores) {
          acc.apostle += scores.apostle || 0;
          acc.prophet += scores.prophet || 0;
          acc.evangelist += scores.evangelist || 0;
          acc.herder += scores.herder || 0;
          acc.teacher += scores.teacher || 0;
        }
        return acc;
      }, { apostle: 0, prophet: 0, evangelist: 0, herder: 0, teacher: 0 });

      return {
        aggregatedScores: aggregated,
        results: teamMembers.map(m => ({ userId: m.userId, scores: m.scores || m.profile })),
        members: teamMembers
      } as any;
    }

    if (!selectedTeamId && dashboardData) return dashboardData;
    if (dashboardLoading || (selectedTeamId && resultsLoading)) return null;
    return generateDummyDashboardData();
  }, [selectedTeamId, teamResults, teamMembers, dashboardData, dashboardLoading, resultsLoading]);

  // Transform members for TeamOverviewCard
  const mappedMembers = useMemo(() => {
    if (!teamMembers) return undefined;
    return teamMembers.slice(0, 5).map((m: any) => {
      const scores = m.profile || m.scores;
      let primaryRole = 'Lid';
      let secondaryRole = undefined;

      if (scores) {
        const profile = calculatePrimaryRole(scores);
        primaryRole = profile.primaryRole ? (ROLE_LABELS[profile.primaryRole as keyof typeof ROLE_LABELS] || profile.primaryRole) : 'Lid';
        secondaryRole = profile.secondaryRole ? (ROLE_LABELS[profile.secondaryRole as keyof typeof ROLE_LABELS] || profile.secondaryRole) : undefined;
      }

      const name = m.name || 'Onbekend';
      const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
      
      return {
        id: m.id.toString(),
        name,
        initials,
        primaryRole,
        secondaryRole,
      };
    });
  }, [teamMembers]);


  const [copied, setCopied] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isInvitationLinkModalOpen, setIsInvitationLinkModalOpen] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const [createdTeamName, setCreatedTeamName] = useState<string>('');

  const inviteUrl = church?.inviteCode
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://bedieningenprofiel.nl'}/join-church/${church.inviteCode}`
    : '';


  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  const handleCreateTeam = async (teamData: { name: string; description: string; url: string }) => {
    try {
      const response = await createTeamMutation.mutateAsync({
        name: teamData.name.trim(),
        description: teamData.description?.trim() || undefined,
        ...(church?.id != null && { churchId: church.id }),
      });
      setCreatedTeamId(response.id.toString());
      setCreatedTeamName(response.name);
    } catch (error: unknown) {
      console.error('Failed to create team:', error);
      const err = error as { response?: { data?: { message?: string; error?: string; detail?: string } } };
      const backendMessage = err.response?.data?.message ?? err.response?.data?.error ?? err.response?.data?.detail;
      const message = backendMessage
        ? `Mislukt om team aan te maken. ${typeof backendMessage === 'string' ? backendMessage : ''}`
        : 'Mislukt om team aan te maken. Controleer of je bij een kerk hoort of probeer het later opnieuw.';
      alert(message);
      throw error;
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
      church: church,
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
            Visual analysis of your team composition
          </p>
        </div>
        <div className={styles.actionButtons}>
          <Button 
            variant="outline" 
            type="button" 
            className={styles.actionButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Create team
          </Button>
          <Button 
            variant="secondary" 
            type="button" 
            className={`${styles.actionButton} ${styles.exportButton}`}
            onClick={handleExportReport}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export report
          </Button>
        </div>
      </div>

      <div className={styles.teamHeaderSection}>
        <h2 className={styles.teamName}>Team: {selectedTeam?.name || 'Worshipteam'}</h2>
      </div>

      <div className={styles.topControlsSection}>
        <div className={styles.teamSelectWrapper}>
          <select 
            className={styles.teamSelect}
            value={selectedTeamId || ''}
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
          >
            {teams.length === 0 && <option value="">Geen teams gevonden</option>}
            {teams.map((team: Team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.inviteSection}>
          <span className={styles.inviteLabel}>Nodig teamlid uit:</span>
          <div className={styles.urlContainer}>
            <span className={styles.urlText}>{inviteUrl}</span>
            <button
              type="button"
              onClick={handleCopy}
              className={styles.copyButton}
              aria-label={copied ? 'Gekopieerd' : 'Link kopiëren'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {copied ? 'Gekopieerd' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.roleProfileHeader}>
          <h3 className={styles.sectionTitle}>Rolprofiel van het team</h3>
          <p className={styles.sectionSubtitle}>
            Rolscores van alle teamleden bij elkaar opgeteld.<br />
            Deze weergaven laten zien welke rollen relatief sterk of minder sterk vertegenwoordigd zijn.
          </p>
        </div>

        <div className={styles.mainChartsGrid}>
          <div className={styles.profileChartsWrapper}>
            <TeamProfileChart 
              teamResults={effectiveDashboardData} 
            />
          </div>
          <div className={styles.strengthsWrapper}>
            <StrengthsWeaknesses 
              teamResults={effectiveDashboardData} 
            />
          </div>
        </div>

        <div className={styles.distributionWrapper}>
          <RoleDistributionChart 
            teamResults={effectiveDashboardData} 
            members={teamMembers}
          />
        </div>
      </div>

      <div className={styles.teamOverviewSection}>
        <div className={styles.overviewCardWrapper}>
           <TeamOverviewCard members={mappedMembers} />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <TeamControlsBalance 
          teamResults={effectiveDashboardData} 
          members={teamMembers} 
        />
        <div className={styles.underrepresentedGrid}>
          <UnderrepresentedMinistries 
            teamResults={effectiveDashboardData} 
            members={teamMembers} 
          />
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

      <InvitationLinkModal
        isOpen={isInvitationLinkModalOpen}
        onClose={() => setIsInvitationLinkModalOpen(false)}
      />
    </div>
  );
}
