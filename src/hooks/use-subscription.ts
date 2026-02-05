'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI } from '@/lib/api/subscription';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionPlan, BillingPeriod } from '@/lib/types/subscription';

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ['subscription', 'status'],
    queryFn: () => subscriptionAPI.getStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionAPI.createCheckoutSession,
    onSuccess: ({ url }) => {
      // Open Stripe checkout in new window
      window.open(url, '_blank');
    },
    onError: (error: any) => {
      console.error('Failed to create checkout session:', error);
      // Error handling can be added here (toast notification, etc.)
    },
  });
}

export function useCurrentPlan(): SubscriptionPlan {
  const { user } = useAuth();
  const { data: subscriptionStatus } = useSubscriptionStatus();

  // Priority: subscription status > user plan > default to free
  return subscriptionStatus?.subscription?.plan || (user?.plan as SubscriptionPlan) || 'free';
}

