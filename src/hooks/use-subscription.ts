'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionAPI } from '@/lib/api/subscription';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionPlan, BillingPeriod } from '@/lib/types/subscription';

function normalizePlan(plan: string | undefined): SubscriptionPlan {
  if (!plan) return 'free';
  const p = String(plan).toLowerCase().replace(/[\s_-]/g, '');
  if (p === 'proplus') return 'proplus';
  if (p === 'pro') return 'pro';
  return 'free';
}

export function useSubscriptionStatus() {
  const { user } = useAuth();
  const isTeamLeader = user?.role === 'teamleader';
  return useQuery({
    queryKey: ['subscription', 'status'],
    queryFn: () => subscriptionAPI.getStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!user && isTeamLeader,
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

  const rawPlan =
    subscriptionStatus?.subscription?.plan ?? (user as { plan?: string } | null)?.plan;
  return normalizePlan(rawPlan);
}

