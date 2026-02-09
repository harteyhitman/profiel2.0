'use client';

import React from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal/Modal';
import styles from './GuestCompletionModal.module.scss';

interface GuestCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function GuestCompletionModal({ isOpen, onClose, email }: GuestCompletionModalProps) {
  const registerUrl = `/auth?activeTab=register&prefillEmail=${encodeURIComponent(email)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      size="small"
      closeOnOverlayClick={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Vragenlijst voltooid</h2>
        <p className={styles.message}>
          Je antwoorden zijn opgeslagen voor <strong>{email}</strong>.
          Maak een account aan om je resultaten te bekijken en te beheren.
        </p>
        <div className={styles.actions}>
          <Link href={registerUrl} className={styles.primaryButton} onClick={onClose}>
            Account aanmaken &amp; Resultaten bekijken
          </Link>
          <Link href="/" className={styles.secondaryButton} onClick={onClose}>
            Later afmaken
          </Link>
        </div>
      </div>
    </Modal>
  );
}
