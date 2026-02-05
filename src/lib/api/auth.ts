import axiosInstance from '../axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Matches docs/API_REFERENCE.md and V2_MIGRATION_GUIDE.md */
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** Optional: birthDate, country, city, currentSector, preferredSector, referralSource, isTeamLeader, inviteCode, role, denomination, churchName, churchLocation */
  birthDate?: string;
  country?: string;
  city?: string;
  currentSector?: string;
  preferredSector?: string;
  referralSource?: string;
  isTeamLeader?: boolean;
  inviteCode?: string;
  role?: string;
  denomination?: string;
  churchName?: string;
  churchLocation?: string;
  /** Legacy: if provided, used to derive firstName/lastName when backend expects them */
  name?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  token: string;
}

export interface ResetPasswordData {
  newPassword: string;
  token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'teamleader';
  plan?: 'free' | 'pro' | 'proplus';
  // Add other user fields as needed
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  message: string;
  user?: User;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post('/register', data);
      return response.data;
    } catch (error: any) {
      // Log the error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration API Error:', {
          requestData: data,
          errorResponse: error.response?.data,
          errorStatus: error.response?.status,
        });
      }
      throw error;
    }
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
    const response = await axiosInstance.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await axiosInstance.get(`/verify-email?token=${token}`);
    return response.data;
  },

  /** POST /api/resend-verification with body { email } */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/resend-verification', { email });
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get('/user');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null; // Not authenticated
      }
      throw error;
    }
  },
};

