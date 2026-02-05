'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import { useMyChurch, useGenerateChurchInviteCode } from '@/hooks/use-dashboard';
import type { ChurchSummary } from '@/lib/types/dashboard';
import styles from './InvitationLinkModal.module.scss';

export type InvitationType = 'user' | 'guest';

interface InvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Base URL for invitation links (docs: guest uses POST /api/profile/submit-guest/:inviteCode) */
function getAppBaseUrl(): string {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || 'https://bedieningenprofiel.nl';
}

export default function InvitationLinkModal({ isOpen, onClose }: InvitationLinkModalProps) {
  const { data: churchData } = useMyChurch();
  const church = (churchData as { church: ChurchSummary } | undefined)?.church;
  const churchId = church?.id ?? null;
  const inviteCode = church?.inviteCode ?? '';
  const generateCode = useGenerateChurchInviteCode(churchId);

  const hasTriedGenerate = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      hasTriedGenerate.current = false;
      return;
    }
    if (churchId && !inviteCode && !generateCode.isPending && !hasTriedGenerate.current) {
      hasTriedGenerate.current = true;
      generateCode.mutate();
    }
  }, [isOpen, churchId, inviteCode, generateCode.isPending]);

  const [invitationType, setInvitationType] = useState<InvitationType>('guest');
  const [copied, setCopied] = useState(false);

  const inviteUrl = useMemo(() => {
    const base = getAppBaseUrl();
    if (!inviteCode) {
      return base + (invitationType === 'guest' ? '/questionnaire/guest' : '/join-church');
    }
    if (invitationType === 'guest') {
      return `${base}/questionnaire/guest?inviteCode=${encodeURIComponent(inviteCode)}`;
    }
    return `${base}/join-church/${encodeURIComponent(inviteCode)}`;
  }, [inviteCode, invitationType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tipText =
    invitationType === 'guest'
      ? 'Deel deze link via e-mail, WhatsApp of andere kanalen om mensen uit te nodigen de vragenlijst als gast in te vullen.'
      : 'Deel deze link met bestaande gebruikers om zich bij je kerk aan te sluiten.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      size="medium"
      closeOnOverlayClick={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        {/* Toggle: User invitation | Guest invitation */}
        <div className={styles.toggleWrap}>
          <button
            type="button"
            className={invitationType === 'user' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => setInvitationType('user')}
          >
            Gebruikersuitnodiging
          </button>
          <button
            type="button"
            className={invitationType === 'guest' ? styles.toggleActive : styles.toggleInactive}
            onClick={() => setInvitationType('guest')}
          >
            Gastuitnodiging
          </button>
        </div>

        {/* Title + link section */}
        <div className={styles.section}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon} aria-hidden>
              <LinkIcon />
            </span>
            Uitnodigingslink
          </h2>
          <p className={styles.subtitle}>
            {invitationType === 'guest'
              ? 'Deel deze link om nieuwe leden als gast de vragenlijst te laten invullen.'
              : 'Deel deze link om bestaande gebruikers bij je kerk te laten aansluiten.'}
          </p>

          <div className={styles.linkRow}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className={styles.linkInput}
              aria-label="Uitnodigingslink"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={styles.copyButton}
              aria-label={copied ? 'Gekopieerd' : 'Kopiëren'}
            >
              {copied ? (
                <CheckIcon />
              ) : (
                <CopyIcon />
              )}
              {copied ? 'Gekopieerd' : 'Kopiëren'}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div className={styles.tip}>
          <span className={styles.tipIcon} aria-hidden>
            <InfoIcon />
          </span>
          <p className={styles.tipText}>{tipText}</p>
        </div>
      </div>
    </Modal>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.333 11.667L11.667 8.333M7.5 5L5 7.5C3.622 8.878 3.622 11.122 5 12.5C6.378 13.878 8.622 13.878 10 12.5L12.5 10M12.5 10L15 7.5C16.378 6.122 16.378 3.878 15 2.5C13.622 1.122 11.378 1.122 10 2.5L7.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M3 11V3C3 2.44772 3.44772 2 4 2H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9V13M9 6H9.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
