'use client';


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus, useCreateCheckoutSession, useCurrentPlan } from '@/hooks/use-subscription';
import { SUBSCRIPTION_PLANS, PLAN_LIMITS, PLAN_FEATURES } from '@/lib/constants/subscription';
import { getStripePriceId } from '@/lib/utils/stripe';
import type { SubscriptionPlan, BillingPeriod, SubscriptionReceipt } from '@/lib/types/subscription';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard/SubscriptionCard';
import ToggleSubscriptionPeriod from '@/components/ui/ToggleSubscriptionPeriod/ToggleSubscriptionPeriod';
import styles from './page.module.scss';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { data: subscriptionStatus, isLoading: isLoadingStatus } = useSubscriptionStatus();
  const currentPlan = useCurrentPlan();
  const checkoutMutation = useCreateCheckoutSession();
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  const isDev = process.env.NODE_ENV === 'development';

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === 'free') {
      return; // Free plan doesn't require checkout
    }

    if (!user?.id || !user?.email) {
      console.error('User data missing');
      return;
    }

    try {
      const priceId = getStripePriceId(plan as 'pro' | 'proplus', period, isDev);

      const amount =
        typeof PLAN_LIMITS[plan].price === 'object'
          ? PLAN_LIMITS[plan].price[period]
          : PLAN_LIMITS[plan].price;

      // Store receipt data for success page
      const receiptData: SubscriptionReceipt = {
        customerEmail: user.email,
        customerName: user.name || user.email.split('@')[0],
        planName: plan,
        amount,
        currency: 'eur',
        billingPeriod: period,
        paymentDate: new Date().toISOString(),
      };

      localStorage.setItem('pending_subscription_receipt', JSON.stringify(receiptData));

      checkoutMutation.mutate({
        userId: String(user.id),
        priceId,
        email: user.email,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const getPriceDisplay = (plan: SubscriptionPlan): string => {
    if (plan === 'free') {
      return '€00 / per maand';
    }

    if (plan === 'proplus') {
      // Pro Plus always shows "Totaal Leden" regardless of period
      const price = PLAN_LIMITS[plan].price;
      const amount = typeof price === 'object' ? price.monthly : price;
      return `€${amount} / Totaal Leden`;
    }

    const price = PLAN_LIMITS[plan].price;
    if (typeof price === 'object') {
      const amount = price[period];
      return period === 'monthly' ? `€${amount} / Per maand` : `€${amount} / Per jaar`;
    }
    return `€${price} / per maand`;
  };

  const subscriptionPlans: Array<{
    plan: SubscriptionPlan;
    title: string;
    subtitle: string;
    price: string;
    features: string[];
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
    isPopular: boolean;
    isDark: boolean;
  }> = [
    {
      plan: SUBSCRIPTION_PLANS.FREE,
      title: 'Gratis',
      subtitle: 'Gratis Abonnement',
      price: getPriceDisplay('free'),
      features: PLAN_FEATURES[SUBSCRIPTION_PLANS.FREE],
      buttonText: 'Start nu',
      buttonVariant: 'primary',

      isPopular: false,
      isDark: false,
    },
    {

      plan: SUBSCRIPTION_PLANS.PRO,
      title: 'Pro',
      subtitle: 'Pro Abonnement',
      price: getPriceDisplay('pro'),
      features: PLAN_FEATURES[SUBSCRIPTION_PLANS.PRO],
      buttonText: currentPlan === 'pro' ? 'Huidig Plan' : 'Upgraden',
      buttonVariant: 'secondary',

      isPopular: true,
      isDark: true,
    },
    {

      plan: SUBSCRIPTION_PLANS.PROPLUS,
      title: 'Pro Plus',
      subtitle: 'Pro Plus Abonnement',
      price: getPriceDisplay('proplus'),
      features: PLAN_FEATURES[SUBSCRIPTION_PLANS.PROPLUS],
      buttonText: currentPlan === 'proplus' ? 'Huidig Plan' : 'Nu upgraden',
      buttonVariant: 'primary',

      isPopular: false,
      isDark: false,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <div className={styles.headerText}>

          <h1 className={styles.title}>Jouw Abonnement</h1>
          <p className={styles.subtitle}>
            Bekijk en beheer je huidige abonnement of upgrade naar een beter plan.

          </p>
        </div>
      </div>


      <div className={styles.toggleContainer}>
        <ToggleSubscriptionPeriod period={period} onChange={setPeriod} />
      </div>

      <div className={styles.cardsContainer}>
        {subscriptionPlans.map((plan) => (
          <SubscriptionCard
            key={plan.plan}

            title={plan.title}
            subtitle={plan.subtitle}
            price={plan.price}
            features={plan.features}
            buttonText={plan.buttonText}
            buttonVariant={plan.buttonVariant}
            isPopular={plan.isPopular}
            isDark={plan.isDark}

            isCurrentPlan={currentPlan === plan.plan}
            isLoading={checkoutMutation.isPending}
            onClick={() => handleSelectPlan(plan.plan)}
            disabled={currentPlan === plan.plan}

          />
        ))}
      </div>
    </div>
  );
}
