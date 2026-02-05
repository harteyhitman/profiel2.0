import axiosInstance from '../axios';
import type {
  SubscriptionStatus,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from '../types/subscription';

export const subscriptionAPI = {
  createCheckoutSession: async (
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> => {
    const response = await axiosInstance.post('/subscription/create-checkout-session', data);
    return response.data;
  },

  getStatus: async (): Promise<SubscriptionStatus> => {
    const response = await axiosInstance.get('/subscription/status');
    return response.data;
  },
};

