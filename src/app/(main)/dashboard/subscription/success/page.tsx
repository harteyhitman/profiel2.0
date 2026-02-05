'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubscriptionReceipt } from '@/lib/types/subscription';
import { Button } from '@/components/ui/forms';
import styles from './page.module.scss';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const [receipt, setReceipt] = useState<SubscriptionReceipt | null>(null);

  useEffect(() => {
    // Get payment details from localStorage (stored before checkout)
    const storedReceipt = localStorage.getItem('pending_subscription_receipt');

    if (storedReceipt) {
      try {
        const receiptData: SubscriptionReceipt = JSON.parse(storedReceipt);
        setReceipt(receiptData);

        // Clean up localStorage after a delay
        setTimeout(() => {
          localStorage.removeItem('pending_subscription_receipt');
        }, 5000);
      } catch (error) {
        console.error('Error parsing receipt:', error);
        localStorage.removeItem('pending_subscription_receipt');
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#10B981" />
              <path
                d="M16 24L22 30L32 18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Betaling Succesvol!</h1>
        </div>

        <div className={styles.content}>
          <p className={styles.message}>
            Bedankt voor je abonnement! Je betaling is succesvol verwerkt.
          </p>

          {receipt && (
            <div className={styles.receipt}>
              <h3 className={styles.receiptTitle}>Betalingsdetails</h3>
              <div className={styles.receiptDetails}>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Plan:</span>
                  <span className={styles.receiptValue}>
                    {receipt.planName === 'pro' ? 'Pro' : receipt.planName === 'proplus' ? 'Pro+' : 'Gratis'}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Bedrag:</span>
                  <span className={styles.receiptValue}>
                    €{receipt.amount} {receipt.currency.toUpperCase()}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Periode:</span>
                  <span className={styles.receiptValue}>
                    {receipt.billingPeriod === 'monthly' ? 'Maandelijks' : 'Jaarlijks'}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Datum:</span>
                  <span className={styles.receiptValue}>
                    {new Date(receipt.paymentDate).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            type="button"
            className={styles.backButton}
            onClick={() => router.push('/dashboard/subscription')}
          >
            Terug naar Abonnementen
          </Button>
        </div>
      </div>
    </div>
  );
}

