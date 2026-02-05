'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api/dashboard';
import { teamsApi } from '@/lib/api/teams';
import { useAuth } from '@/contexts/AuthContext';
import type {
  UserResults,
  UserTeams,
  TeamsArray,
  UserProfile,
  TeamResults,
  TeamMember,
  ChurchDashboardResponse,
  ChurchMember,
  ChurchSummary,
  ChurchStats,
} from '@/lib/types/dashboard';

// User Dashboard Hooks
export function useUserResults() {
  return useQuery<UserResults>({
    queryKey: ['user', 'results'],
    queryFn: () => dashboardAPI.getUserResults(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useUserTeams() {
  return useQuery<UserTeams | TeamsArray>({
    queryKey: ['user', 'teams'],
    queryFn: () => teamsApi.getCurrentUserTeams(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Get teams for a specific user by userId
 */
export function useUserTeamsById(userId: number | null) {
  return useQuery<TeamsArray>({
    queryKey: ['users', userId, 'teams'],
    queryFn: () => teamsApi.getUserTeams(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get team by invite code
 */
export function useTeamByInviteCode(inviteCode: string | null) {
  return useQuery({
    queryKey: ['teams', 'by-invite', inviteCode],
    queryFn: () => teamsApi.getByInviteCode(inviteCode!),
    enabled: !!inviteCode,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Join a team using invite code
 */
export function useJoinTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteCode: string) => teamsApi.joinByInviteCode(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'teams'] });
    },
  });
}

export function useUserProfile(userId: number | null) {
  return useQuery<UserProfile>({
    queryKey: ['users', userId, 'profile'],
    queryFn: () => dashboardAPI.getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

// Team Dashboard Hooks
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; churchId?: number; plan?: 'free' | 'pro' | 'proplus' }) => teamsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'teams'] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'stats'] });
    },
  });
}

export function useTeamResults(teamId: number | string | null) {
  return useQuery<TeamResults>({
    queryKey: ['teams', teamId, 'results'],
    queryFn: () => teamsApi.getResults(Number(teamId)),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeamMembers(teamId: number | string | null) {
  return useQuery<TeamMember[]>({
    queryKey: ['teams', teamId, 'members'],
    queryFn: () => teamsApi.getMembers(Number(teamId)),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddTeamMember(teamId: number | string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => teamsApi.addMember(Number(teamId), { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['teams', teamId, 'results'] });
    },
  });
}

export function useExportTeamData(teamId: number | string | null) {
  return useMutation({
    mutationFn: async (format: 'csv' | 'json' = 'csv') => {
      const blob = await teamsApi.exportData(Number(teamId), format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team-${teamId}-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return blob;
    },
  });
}

// Church Dashboard Hooks
export function useChurchDashboard(churchId: number | string | null) {
  return useQuery<ChurchDashboardResponse>({
    queryKey: ['churches', churchId, 'dashboard'],
    queryFn: () => dashboardAPI.getChurchDashboard(Number(churchId)),
    enabled: !!churchId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChurchMembers(churchId: number | string | null) {
  return useQuery<ChurchMember[]>({
    queryKey: ['churches', churchId, 'members'],
    queryFn: () => dashboardAPI.getChurchMembers(Number(churchId)),
    enabled: !!churchId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRemoveChurchMember(churchId: number | string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => dashboardAPI.removeChurchMember(Number(churchId), userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches', churchId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['churches', churchId, 'dashboard'] });
    },
  });
}

export function useChurchStats(churchId?: number | null) {
  return useQuery<ChurchStats>({
    queryKey: ['churches', 'stats', churchId],
    queryFn: () => dashboardAPI.getChurchStats(churchId || undefined),
    enabled: !!churchId, // Only fetch when churchId is provided (matches client folder)
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useMyChurches() {
  const { user } = useAuth();
  
  return useQuery<ChurchSummary[]>({
    queryKey: ['churches', 'my-churches'],
    queryFn: () => dashboardAPI.getMyChurches(),
    enabled: !!user && user.role === 'teamleader', // Only fetch for team leaders (matches client folder)
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useMyChurch() {
  const { user } = useAuth();
  
  return useQuery<{ church: ChurchSummary }>({
    queryKey: ['churches', 'my'],
    queryFn: () => dashboardAPI.getMyChurch(),
    enabled: !!user && user.role === 'teamleader', // Only fetch for team leaders (matches client folder)
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; name?: string; role?: string }) => dashboardAPI.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
      queryClient.invalidateQueries({ queryKey: ['churches', 'members'] });
    },
  });
}

export function useAvailableMembers(churchId: number | string | null, teamId?: number | string | null) {
  return useQuery<ChurchMember[]>({
    queryKey: ['churches', churchId, 'available-members', teamId],
    queryFn: () => dashboardAPI.getAvailableMembers(Number(churchId), teamId ? Number(teamId) : undefined),
    enabled: !!churchId,
    staleTime: 2 * 60 * 1000,
  });
}

/** Generate church invite code (docs/API_REFERENCE.md: POST /api/churches/:id/generate-invite-code). */
export function useGenerateChurchInviteCode(churchId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dashboardAPI.generateChurchInviteCode(churchId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['churches', churchId] });
    },
  });
}

