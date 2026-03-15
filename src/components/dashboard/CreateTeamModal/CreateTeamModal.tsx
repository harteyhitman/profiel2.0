'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import styles from './CreateTeamModal.module.scss';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam?: (teamData: { name: string; description: string; url: string }) => void | Promise<void>;
  onSuccess?: () => void;
}

export default function CreateTeamModal({ isOpen, onClose, onCreateTeam, onSuccess }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', description: '', url: '' });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !onCreateTeam) return;
    const fullUrl = `Ministryprofile/team/${formData.url || formData.name.toLowerCase().replace(/\s+/g, '-')}`;
    setIsSubmitting(true);
    try {
      const result = onCreateTeam({
        name: formData.name,
        description: formData.description,
        url: fullUrl,
      });
      await (result instanceof Promise ? result : Promise.resolve());
      onClose();
      onSuccess?.();
    } catch {
      // Error is handled in parent (alert or toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Team aanmaken"
      showCloseButton={true}
      size="medium"
      closeOnOverlayClick={false}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Nieuw bedieningsteam aanmaken</h2>
        <p className={styles.description}>
          Organiseer je kerk in bedieningen of afdelingen. Elk team kan leiders, leden en bedieningsfuncties hebben.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            id="teamName"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Teamnaam"
            className={styles.input}
            required
          />
          <input
            type="text"
            id="teamDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Teamomschrijving (optioneel)"
            className={styles.input}
          />
          <div className={styles.urlRow}>
            <label htmlFor="teamUrl" className={styles.urlLabel}>Team-URL</label>
            <div className={styles.urlInputGroup}>
              <span className={styles.urlPrefix}>Bedieningenprofiel/</span>
              <input
                type="text"
                id="teamUrl"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="team"
                className={styles.urlInput}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={styles.createButton}
          >
            {isSubmitting ? 'Bezig…' : 'Team aanmaken'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

