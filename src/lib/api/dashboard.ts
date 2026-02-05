import axiosInstance from '../axios';
import type {
  UserResults,
  UserTeams,
  TeamsArray,
  Team,
  UserProfile,
  TeamResults,
  TeamMember,
  ChurchDashboardResponse,
  ChurchMember,
  ChurchSummary,
  ChurchStats,
  RoleScores,
} from '../types/dashboard';

export const dashboardAPI = {
  // User Dashboard Endpoints
  // Note: User results are now part of the profile endpoint
  // GET /api/users/:userId/profile returns profile with scores/results
  getUserResults: async (userId?: number): Promise<UserResults> => {
    // Default empty results structure
    const emptyResults: UserResults = {
      scores: {
        apostle: 0,
        prophet: 0,
        evangelist: 0,
        herder: 0,
        teacher: 0,
      },
      profile: {},
    };

    // Get user ID if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      try {
        const userResponse = await axiosInstance.get('/user');
        targetUserId = userResponse.data?.id;
      } catch (error: any) {
        // If we can't get current user, return empty results
        // This is expected for unauthenticated users or when API is unavailable
        if (process.env.NODE_ENV === 'development') {
          console.warn('Could not get current user for results:', error.message);
        }
        return emptyResults;
      }
    }

    if (!targetUserId) {
      // No user ID available, return empty results
      return emptyResults;
    }

    // Get profile which includes scores/results
    try {
      const profileResponse = await axiosInstance.get(`/users/${targetUserId}/profile`);
      return {
        scores: profileResponse.data.scores || profileResponse.data?.profile?.scores || emptyResults.scores,
        profile: profileResponse.data.profile || profileResponse.data || {},
      };
    } catch (error: any) {
      // If profile fetch fails, return empty results
      // This handles cases where user hasn't completed questionnaire yet
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not get user profile/results:', error.message);
      }
      return emptyResults;
    }
  },

  getUserTeams: async (userId?: number): Promise<UserTeams | TeamsArray> => {
    // Get user ID if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      try {
        const userResponse = await axiosInstance.get('/user');
        targetUserId = userResponse.data?.id;
      } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Could not get current user for teams:', error.message);
        }
        throw error;
      }
    }

    if (!targetUserId) {
      throw new Error('User ID is required');
    }

    // Use the correct endpoint pattern from client folder: /api/users/{userId}/teams
    const response = await axiosInstance.get(`/users/${targetUserId}/teams`);
    return response.data;
  },

  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await axiosInstance.get(`/users/${userId}/profile`);
    return response.data;
  },

  getUserChurches: async (userId: number): Promise<ChurchSummary[]> => {
    const response = await axiosInstance.get(`/users/${userId}/churches`);
    return response.data;
  },

  // Team Dashboard Endpoints
  // Note: Use teamsApi.create() instead for better type safety
  createTeam: async (data: { name: string; description?: string; churchId?: number; plan?: 'free' | 'pro' | 'proplus' }): Promise<Team> => {
    const response = await axiosInstance.post<Team>('/teams', data);
    return response.data;
  },

  getTeamResults: async (teamId: number): Promise<TeamResults> => {
    const response = await axiosInstance.get(`/teams/${teamId}/results`);
    return response.data;
  },

  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    const response = await axiosInstance.get(`/teams/${teamId}/members`);
    return response.data;
  },

  addTeamMember: async (teamId: number, userId: number): Promise<{ message: string }> => {
    const response = await axiosInstance.post(`/teams/${teamId}/add-member`, { userId });
    return response.data;
  },

  exportTeamData: async (teamId: number, format: 'csv' | 'json' = 'json'): Promise<Blob> => {
    const response = await axiosInstance.get(`/teams/${teamId}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Church Dashboard Endpoints (docs/API_REFERENCE.md)
  // GET /api/churches/my, /api/churches/my-churches, /api/churches/by-invite/:code,
  // GET /api/churches/stats?churchId=, /api/churches/:id/dashboard, /api/churches/:id/members,
  // POST /api/churches, PATCH /api/churches/:id, POST /api/churches/join/:inviteCode,
  // POST /api/churches/:id/generate-invite-code, DELETE /api/churches/:id/members/:userId
  getChurchDashboard: async (churchId: number): Promise<ChurchDashboardResponse> => {
    const response = await axiosInstance.get(`/churches/${churchId}/dashboard`);
    return response.data;
  },

  getChurchMembers: async (churchId: number): Promise<ChurchMember[]> => {
    const response = await axiosInstance.get(`/churches/${churchId}/members`);
    return response.data;
  },

  removeChurchMember: async (churchId: number, userId: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/churches/${churchId}/members/${userId}`);
    return response.data;
  },

  getChurchStats: async (churchId?: number): Promise<ChurchStats> => {
    // Match client folder: churches/stats requires churchId query parameter
    const url = churchId 
      ? `/churches/stats?churchId=${churchId}`
      : '/churches/stats';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getMyChurches: async (): Promise<ChurchSummary[]> => {
    const response = await axiosInstance.get('/churches/my-churches');
    return response.data;
  },

  getMyChurch: async (): Promise<{ church: ChurchSummary }> => {
    const response = await axiosInstance.get('/churches/my');
    return response.data;
  },

  // Create church
  // POST /api/churches
  createChurch: async (data: { name: string; location?: string; city?: string; country?: string; denomination: string }): Promise<ChurchSummary> => {
    const response = await axiosInstance.post<ChurchSummary>('/churches', data);
    return response.data;
  },

  // Update church
  // PATCH /api/churches/:churchId
  updateChurch: async (churchId: number, data: { name?: string; location?: string; city?: string; country?: string; denomination?: string }): Promise<ChurchSummary> => {
    const response = await axiosInstance.patch<ChurchSummary>(`/churches/${churchId}`, data);
    return response.data;
  },

  // Get church teams
  // GET /api/churches/:churchId/teams
  getChurchTeams: async (churchId: number): Promise<Team[]> => {
    const response = await axiosInstance.get<Team[]>(`/churches/${churchId}/teams`);
    return response.data;
  },

  // Get church role distribution
  // GET /api/churches/:churchId/role-distribution
  getChurchRoleDistribution: async (churchId: number): Promise<RoleScores> => {
    const response = await axiosInstance.get<RoleScores>(`/churches/${churchId}/role-distribution`);
    return response.data;
  },

  // Member Invitation Endpoints
  inviteMember: async (data: { email: string; name?: string; role?: string }): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/churches/invite-member', data);
    return response.data;
  },

  inviteChurchMember: async (churchId: number, data: { email: string; name?: string; role?: string }): Promise<{ message: string; inviteCode?: string }> => {
    const response = await axiosInstance.post(`/churches/${churchId}/invite`, data);
    return response.data;
  },

  getChurchInvite: async (churchId: number): Promise<{ inviteCode: string }> => {
    const response = await axiosInstance.get(`/churches/${churchId}/invite`);
    return response.data;
  },

  generateChurchInviteCode: async (churchId: number): Promise<{ inviteCode: string }> => {
    const response = await axiosInstance.post(`/churches/${churchId}/generate-invite-code`);
    return response.data;
  },

  getChurchByInvite: async (inviteCode: string): Promise<{ church: ChurchSummary }> => {
    const response = await axiosInstance.get(`/churches/by-invite/${inviteCode}`);
    return response.data;
  },

  /** POST /api/churches/join/:inviteCode (docs/API_REFERENCE.md) */
  joinChurchByInvite: async (inviteCode: string): Promise<{ message: string; church: ChurchSummary }> => {
    const response = await axiosInstance.post(`/churches/join/${inviteCode}`);
    return response.data;
  },

  // Get available members to add to team (church members not in team)
  getAvailableMembers: async (churchId: number, teamId?: number): Promise<ChurchMember[]> => {
    const url = teamId 
      ? `/churches/${churchId}/available-members?teamId=${teamId}`
      : `/churches/${churchId}/available-members`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  addUserToChurch: async (churchId: number, userId: number): Promise<{ message: string }> => {
    const response = await axiosInstance.post(`/churches/${churchId}/add-user`, { userId });
    return response.data;
  },
};

