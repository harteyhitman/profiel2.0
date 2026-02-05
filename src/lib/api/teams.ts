import axiosInstance from '../axios';
import type { Team, TeamMember, TeamResults, UserTeams, TeamsArray } from '../types/dashboard';

export interface CreateTeamRequest {
  name: string;
  churchId?: number;
  description?: string;
  plan?: 'free' | 'pro' | 'proplus';
}

export interface TeamByInviteResponse {
  team: Team;
}

export interface JoinTeamResponse {
  message: string;
  team: Team;
}

export interface AddMemberRequest {
  userId: number;
}

export interface AddMemberResponse {
  message: string;
}

export const teamsApi = {
  /**
   * Create a new team
   * POST /api/teams
   */
  create: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await axiosInstance.post<Team>('/teams', data);
    return response.data;
  },

  /**
   * Get teams for current authenticated user
   * GET /api/users/{userId}/teams
   * Note: This endpoint requires the user ID, so we first get the current user
   */
  getCurrentUserTeams: async (): Promise<UserTeams | TeamsArray> => {
    // First get the current user to get their ID
    const userResponse = await axiosInstance.get('/user');
    const userId = userResponse.data?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Then get teams using the user ID endpoint (matches client folder pattern)
    const response = await axiosInstance.get<UserTeams | TeamsArray>(`/users/${userId}/teams`);
    return response.data;
  },

  /**
   * Get teams for a specific user
   * GET /api/users/{userId}/teams
   */
  getUserTeams: async (userId: number): Promise<TeamsArray> => {
    const response = await axiosInstance.get<TeamsArray>(`/users/${userId}/teams`);
    return response.data;
  },

  /**
   * Get team by invite code
   * GET /api/teams/by-invite/{inviteCode}
   */
  getByInviteCode: async (inviteCode: string): Promise<TeamByInviteResponse> => {
    const response = await axiosInstance.get<TeamByInviteResponse>(`/teams/by-invite/${inviteCode}`);
    return response.data;
  },

  /**
   * Join a team using invite code. POST /api/teams/join/:inviteCode (docs/API_REFERENCE.md)
   */
  joinByInviteCode: async (inviteCode: string): Promise<JoinTeamResponse> => {
    const response = await axiosInstance.post<JoinTeamResponse>(`/teams/join/${inviteCode}`);
    return response.data;
  },

  /**
   * Get team members. GET /api/teams/:id/members (docs/API_REFERENCE.md)
   */
  getMembers: async (teamId: number): Promise<TeamMember[]> => {
    const response = await axiosInstance.get<TeamMember[]>(`/teams/${teamId}/members`);
    return response.data;
  },

  /**
   * Add a member to team. POST /api/teams/:id/add-member with body { userId } (docs/API_REFERENCE.md)
   */
  addMember: async (teamId: number, data: AddMemberRequest): Promise<AddMemberResponse> => {
    const response = await axiosInstance.post<AddMemberResponse>(`/teams/${teamId}/add-member`, data);
    return response.data;
  },

  /**
   * Leave a team (backend-specific; not in API_REFERENCE.md).
   */
  leaveTeam: async (teamId: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/teams/${teamId}/leave`);
    return response.data;
  },

  /**
   * Update team church (backend-specific; not in API_REFERENCE.md).
   */
  updateTeamChurch: async (teamId: number, churchId: number): Promise<{ message: string }> => {
    const response = await axiosInstance.patch(`/teams/${teamId}/church`, { churchId });
    return response.data;
  },

  /**
   * Get team results/analytics. GET /api/teams/:id/results (docs/API_REFERENCE.md)
   */
  getResults: async (teamId: number): Promise<TeamResults> => {
    const response = await axiosInstance.get<TeamResults>(`/teams/${teamId}/results`);
    return response.data;
  },

  /**
   * Export team data. GET /api/teams/:id/export (docs/API_REFERENCE.md)
   */
  exportData: async (teamId: number, format: 'csv' | 'json' = 'csv'): Promise<Blob> => {
    const response = await axiosInstance.get(`/teams/${teamId}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};


