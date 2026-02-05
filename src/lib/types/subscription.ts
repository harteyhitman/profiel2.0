export type SubscriptionPlan = 'free' | 'pro' | 'proplus';

export type BillingPeriod = 'monthly' | 'yearly';

export interface SubscriptionStatus {
  subscription: {
    plan: SubscriptionPlan;
    status?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    // Add other subscription fields as needed
  };
}

export interface CreateCheckoutSessionRequest {
  userId: string;
  priceId: string;
  email: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

export interface PlanLimits {
  users: number;
  teams: number;
  price: number | { monthly: number; yearly: number };
}

export interface SubscriptionReceipt {
  customerEmail: string;
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriod: BillingPeriod;
  paymentDate: string;
}

