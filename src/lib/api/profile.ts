import axiosInstance from '../axios';
import type { UserResults, RoleScores } from '../types/dashboard';

/** Per docs/QUESTIONNAIRE_AND_RESULTS_V2.md: each item in POST /api/profile/submit and submit-guest */
export interface QuestionResponse {
  questionId: number;
  value: number; // 0–6 (3 = neutral)
  statement1Role: string;
  statement2Role: string;
}

/** Questionnaire question shape (API may use statementA/statementB; map from statement1/statement2 if needed) */
export interface Question {
  id: number;
  statementA?: string;
  statementB?: string;
  statement1?: string;
  statement2?: string;
  [key: string]: unknown;
}

/** Logged-in submit: POST /api/profile/submit */
export interface SubmitProfileRequest {
  responses: QuestionResponse[];
}

/** Guest submit: POST /api/profile/submit-guest/:inviteCode */
export interface SubmitProfileGuestRequest {
  email: string;
  firstName: string;
  lastName: string;
  responses: QuestionResponse[];
}

export interface SubmitProfileResponse {
  message?: string;
  scores?: RoleScores;
  results?: UserResults;
}

/** Questionnaire flow per docs/API_REFERENCE.md: GET questionnaire, POST start, POST :userAnswerId/answers */
export interface QuestionnaireStartResponse {
  id: number;
  answers?: Array<{ questionId: number; value: number }>;
}

export interface SubmitAnswersRequest {
  answers: Array<{ questionId: number; value: number }>;
  completed: boolean;
}

export const profileAPI = {
  /**
   * Get questions for the questionnaire.
   * GET /api/questionnaire (docs/API_REFERENCE.md)
   */
  getQuestions: async (): Promise<Question[]> => {
    const response = await axiosInstance.get<{ questions?: Question[] } | Question[]>('/questionnaire');
    const data = response.data;
    if (Array.isArray(data)) return data;
    return (data as { questions?: Question[] }).questions ?? [];
  },

  /**
   * Start questionnaire session; returns userAnswerId and optional existing answers.
   * POST /api/questionnaire/start
   */
  startQuestionnaire: async (): Promise<QuestionnaireStartResponse> => {
    const response = await axiosInstance.post<QuestionnaireStartResponse>('/questionnaire/start');
    return response.data;
  },

  /**
   * Submit answers for a questionnaire session. value 0–6 (0–2 favor A, 3 neutral, 4–6 favor B).
   * POST /api/questionnaire/:userAnswerId/answers
   */
  submitQuestionnaireAnswers: async (
    userAnswerId: number,
    payload: SubmitAnswersRequest
  ): Promise<{ message?: string }> => {
    const response = await axiosInstance.post(`/questionnaire/${userAnswerId}/answers`, payload);
    return response.data;
  },

  /**
   * Submit full questionnaire. POST /api/profile/submit (docs/QUESTIONNAIRE_AND_RESULTS_V2.md)
   * Body: { responses: QuestionResponse[] } (0–6 scale, statement1Role/statement2Role per question).
   */
  submitProfile: async (data: SubmitProfileRequest): Promise<SubmitProfileResponse> => {
    const response = await axiosInstance.post<SubmitProfileResponse>('/profile/submit', data);
    return response.data;
  },

  /**
   * Submit guest questionnaire. POST /api/profile/submit-guest/:inviteCode
   * Body: { email, firstName, lastName, responses: QuestionResponse[] }.
   */
  submitProfileGuest: async (
    inviteCode: string,
    data: SubmitProfileGuestRequest
  ): Promise<SubmitProfileResponse> => {
    const response = await axiosInstance.post<SubmitProfileResponse>(
      `/profile/submit-guest/${inviteCode}`,
      data
    );
    return response.data;
  },

  /**
   * Current user's results. GET /api/user/results (docs/API_REFERENCE.md)
   */
  getCurrentUserResults: async (): Promise<UserResults | unknown> => {
    const response = await axiosInstance.get('/user/results');
    return response.data;
  },

  /**
   * Update user profile. PATCH /api/user/profile (docs/API_REFERENCE.md)
   */
  updateProfile: async (data: Record<string, unknown>): Promise<{ message: string }> => {
    const response = await axiosInstance.patch('/user/profile', data);
    return response.data;
  },

  /**
   * Export user data
   * GET /api/users/:userId/export
   */
  exportUserData: async (userId: number): Promise<Blob> => {
    const response = await axiosInstance.get(`/users/${userId}/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get user recommendations. GET /api/users/:userId/recommendations (docs/API_REFERENCE.md)
   */
  getUserRecommendations: async (userId: number): Promise<unknown> => {
    const response = await axiosInstance.get(`/users/${userId}/recommendations`);
    return response.data;
  },

  /**
   * Delete user account. DELETE /api/users/delete-user (docs/API_REFERENCE.md)
   */
  deleteUser: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.delete('/users/delete-user');
    return response.data;
  },
};
