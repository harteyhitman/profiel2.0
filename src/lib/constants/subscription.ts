import type { PlanLimits, SubscriptionPlan, BillingPeriod } from '@/lib/types/subscription';

export const SUBSCRIPTION_PLANS = {
  FREE: 'free' as const,
  PRO: 'pro' as const,
  PROPLUS: 'proplus' as const,
} as const;

/** Stripe Payment Links – user is sent to Stripe-hosted payment page */
export const STRIPE_PAYMENT_LINKS: Record<'pro' | 'proplus', Record<BillingPeriod, string>> = {
  pro: {
    monthly: 'https://buy.stripe.com/5kQ28r3Dd4pC5pzeI10Fi02',   // €50 p/maand
    yearly: 'https://buy.stripe.com/eVqdR93Dd09m7xHdDX0Fi04',   // €600 p/jaar
  },
  proplus: {
    monthly: 'https://buy.stripe.com/8x24gzehR2hudW5czT0Fi03',  // €150 p/maand
    yearly: 'https://buy.stripe.com/dRmeVda1BcW89FParL0Fi05',  // €1800 p/jaar
  },
};

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
      yearly: 600,
      monthly: 50,
    },
  },
  [SUBSCRIPTION_PLANS.PROPLUS]: {
    users: 5000,
    teams: 500,
    price: {
      yearly: 1800,
      monthly: 150,
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

