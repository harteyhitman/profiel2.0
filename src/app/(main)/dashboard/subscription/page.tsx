'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStatus, useCurrentPlan } from '@/hooks/use-subscription';
import { SUBSCRIPTION_PLANS, PLAN_LIMITS, PLAN_FEATURES, STRIPE_PAYMENT_LINKS } from '@/lib/constants/subscription';
import type { SubscriptionPlan, BillingPeriod, SubscriptionReceipt } from '@/lib/types/subscription';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard/SubscriptionCard';
import ToggleSubscriptionPeriod from '@/components/ui/ToggleSubscriptionPeriod/ToggleSubscriptionPeriod';
import { Button } from '@/components/ui/forms';
import styles from './page.module.scss';

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    data: subscriptionStatus,
    isLoading: isLoadingStatus,
    isError: subscriptionError,
    refetch: refetchStatus,
  } = useSubscriptionStatus();
  const currentPlan = useCurrentPlan();
  const [period, setPeriod] = useState<BillingPeriod>('monthly');

  if (authLoading || isLoadingStatus) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} aria-hidden />
          <p className={styles.loadingText}>Laden…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>
          <h2 className={styles.stateTitle}>Niet ingelogd</h2>
          <p className={styles.stateText}>
            Je moet ingelogd zijn om je abonnement te bekijken en beheren.
          </p>
          <Link href="/auth" className={styles.stateLink}>
            Inloggen
          </Link>
        </div>
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <div className={styles.page}>
        <div className={styles.stateCard}>
          <h2 className={styles.stateTitle}>Fout bij het ophalen van abonnement</h2>
          <p className={styles.stateText}>
            Er is een fout opgetreden bij het ophalen van je abonnementsplan.
          </p>
          <Button type="button" onClick={() => refetchStatus()}>
            Opnieuw laden
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (plan === 'free') {
      return;
    }

    const paymentLink = STRIPE_PAYMENT_LINKS[plan]?.[period];
    if (!paymentLink) {
      console.error('No payment link for plan/period:', plan, period);
      return;
    }

    const amount =
      typeof PLAN_LIMITS[plan].price === 'object'
        ? PLAN_LIMITS[plan].price[period]
        : PLAN_LIMITS[plan].price;

    const receiptData: SubscriptionReceipt = {
      customerEmail: user?.email ?? '',
      customerName: user?.name ?? user?.email?.split('@')[0] ?? '',
      planName: plan,
      amount,
      currency: 'eur',
      billingPeriod: period,
      paymentDate: new Date().toISOString(),
    };
    localStorage.setItem('pending_subscription_receipt', JSON.stringify(receiptData));

    window.location.href = paymentLink;
  };

  const getPriceDisplay = (plan: SubscriptionPlan): string => {
    if (plan === 'free') {
      return '€0 / p/maand';
    }
    const price = PLAN_LIMITS[plan].price;
    const amount = typeof price === 'object' ? price[period] : price;
    return period === 'monthly' ? `€${amount} / p/maand` : `€${amount} / p/jaar`;
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
            onClick={() => handleSelectPlan(plan.plan)}
            disabled={currentPlan === plan.plan}

          />
        ))}
      </div>
    </div>
  );
}
