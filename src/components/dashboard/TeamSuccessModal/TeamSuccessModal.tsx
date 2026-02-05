'use client';

import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/forms';
import styles from './TeamSuccessModal.module.scss';
import Image from 'next/image';
import SuccessImg from '../../../../public/modal/allset-modal.jpg'

interface TeamSuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAddMembers?: () => void;
  onGoToHome?: () => void;
  teamName?: string;
}

export default function TeamSuccessModal({
  isOpen,
  onClose,
  onAddMembers,
  onGoToHome,
  teamName,
}: TeamSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="small"
      closeOnOverlayClick={false}
      className={styles.successModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
      <Image src={SuccessImg} alt='SuccessImg' />
        </div>

        <div className={styles.textContainer}>

          <h2 className={styles.title}>Team succesvol aangemaakt</h2>
          <p className={styles.description}>
            Je kunt nu leden beheren, rollen toewijzen en teamactiviteiten monitoren.

          </p>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            type="button"
            variant="secondary"
            onClick={onAddMembers}
            className={styles.addMembersButton}
          >

            Leden toevoegen

          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onGoToHome}
            className={styles.goToHomeButton}
          >

            Naar home

          </Button>
        </div>
      </div>
    </Modal>
  );
}

