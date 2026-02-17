import axiosInstance from '../axios';

export interface Church {
  id: number;
  name: string;
  inviteCode?: string;
  denomination?: string;
  location?: string;
  organization?: string;
  country?: string;
  city?: string;
  logoUrl?: string | null;
  createdById: number;
  createdAt?: string;
}

export interface ChurchByInviteResponse {
  church: Church;
  inviteCode: string;
}

export interface JoinChurchResponse {
  message: string;
  church: Church;
}

export const churchesApi = {
  /**
   * Get church by invite code
   * GET /api/churches/by-invite/{inviteCode}
   */
  getByInviteCode: async (inviteCode: string): Promise<ChurchByInviteResponse> => {
    const response = await axiosInstance.get<ChurchByInviteResponse>(`/churches/by-invite/${inviteCode}`);
    return response.data;
  },

  /**
   * Join a church using invite code
   * GET /api/churches/join/{inviteCode}
   * Note: The legacy implementation uses GET for joining churches, unlike POST for teams.
   */
  joinByInviteCode: async (inviteCode: string): Promise<JoinChurchResponse> => {
    const response = await axiosInstance.get<JoinChurchResponse>(`/churches/join/${inviteCode}`);
    return response.data;
  },
};
