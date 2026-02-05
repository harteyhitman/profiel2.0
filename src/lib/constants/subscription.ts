import type { PlanLimits, SubscriptionPlan } from '@/lib/types/subscription';

export const SUBSCRIPTION_PLANS = {
  FREE: 'free' as const,
  PRO: 'pro' as const,
  PROPLUS: 'proplus' as const,
} as const;

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SUBSCRIPTION_PLANS.FREE]: {
    users: 40,
    teams: 1,
    price: 0,
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    users: 200,
    teams: 20,
    price: {
      yearly: 120,
      monthly: 10,
    },
  },
  [SUBSCRIPTION_PLANS.PROPLUS]: {
    users: 5000,
    teams: 500,
    price: {
      yearly: 300,
      monthly: 25,
    },
  },
} as const;

export const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  [SUBSCRIPTION_PLANS.FREE]: [
    'Tot 40 gebruikers',
    'Maximaal 1 team',
    'Toegang tot basis vragenlijst',
    'Persoonlijke resultaten en aanbevelingen',
  ],
  [SUBSCRIPTION_PLANS.PRO]: [
    'Tot 200 gebruikers',
    'Maximaal 20 teams',
    'Volledige toegang tot alle vragenlijsten',
    'Uitgebreide teamanalyse en aanbevelingen',
    'Vergelijking met landelijke gemiddelden',
    'Team gap analyse',
  ],
  [SUBSCRIPTION_PLANS.PROPLUS]: [
    'Tot 5000 gebruikers',
    'Maximaal 500 teams',
    'Volledige toegang tot alle functionaliteiten',
    'Kerk dashboard met geaggregeerde gegevens over teams',
    'Denominatie-specifieke vergelijkingen',
    'Prioriteitsondersteuning',
  ],
};

