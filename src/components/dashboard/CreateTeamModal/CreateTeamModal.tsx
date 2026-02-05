'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import styles from './CreateTeamModal.module.scss';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam?: (teamData: { name: string; description: string; url: string }) => void;
  onSuccess?: () => void;
}

export default function CreateTeamModal({ isOpen, onClose, onCreateTeam, onSuccess }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({ name: '', description: '', url: '' });
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const fullUrl = `Ministryprofile/team/${formData.url || formData.name.toLowerCase().replace(/\s+/g, '-')}`;
      onCreateTeam?.({
        name: formData.name,
        description: formData.description,
        url: fullUrl,
      });
      onClose();
      // Trigger success modal after a brief delay
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    }
  };

  const isFormValid = formData.name.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create team"
      showCloseButton={true}
      size="medium"
      closeOnOverlayClick={false}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>Create a New Ministry Team</h2>
        <p className={styles.description}>
          Organize your church into ministries or departments. Each team can have assigned leaders, members, and ministry functions.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            id="teamName"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Team Name"
            className={styles.input}
            required
          />
          <input
            type="text"
            id="teamDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Team Description (optional)"
            className={styles.input}
          />
          <div className={styles.urlRow}>
            <label htmlFor="teamUrl" className={styles.urlLabel}>Team url</label>
            <div className={styles.urlInputGroup}>
              <span className={styles.urlPrefix}>Ministryprofile/</span>
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
            disabled={!isFormValid}
            className={styles.createButton}
          >
            Create Team
          </button>
        </form>
      </div>
    </Modal>
  );
}

