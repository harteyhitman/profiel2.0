/**
 * Get Stripe Price ID based on plan, period, and environment
 */
export function getStripePriceId(
  plan: 'pro' | 'proplus',
  period: 'monthly' | 'yearly',
  isDev: boolean = false
): string {
  if (isDev) {
    if (plan === 'pro' && period === 'monthly') return 'price_1S7MKzFm3BS8m2GRs2zrCTwm';
    if (plan === 'pro' && period === 'yearly') return 'price_1S7kMUFm3BS8m2GRNjlRztOx';
    if (plan === 'proplus' && period === 'monthly') return 'price_1S7kSKFm3BS8m2GRqYgCfJ5J';
    if (plan === 'proplus' && period === 'yearly') return 'price_1S7kV0Fm3BS8m2GR17wOjx9s';
  } else {
    if (plan === 'pro' && period === 'monthly') return 'price_1S2tzgFjr42WND8COjcW23Hc';
    if (plan === 'pro' && period === 'yearly') return 'price_1SFYgqFjr42WND8CTf5fpL3s';
    if (plan === 'proplus' && period === 'monthly') return 'price_1S2u08Fjr42WND8CcDBdM5YX';
    if (plan === 'proplus' && period === 'yearly') return 'price_1SFYkWFjr42WND8CV3zJ7YZ6';
  }
  throw new Error(`Invalid plan or period: ${plan}, ${period}`);
}

